# backend/news/views.py
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import logging
from .models import Post, Category, Comment, Ad, NewsletterSubscription
from .serializers import PostListSerializer, PostDetailSerializer, CategorySerializer, AdSerializer, CommentSerializer, NewsletterSubscriptionSerializer
from rest_framework.pagination import PageNumberPagination

logger = logging.getLogger(__name__)

# -----------------------------
# Post Views
# -----------------------------

class PostListView(generics.ListAPIView):
    serializer_class = PostListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__name", "category__slug", "is_featured"]
    search_fields = ["title", "content", "tags"]
    ordering_fields = ["created_at", "views_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return Post.objects.filter(status="published").select_related(
            "author", "category"
        )


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(status="published")
    serializer_class = PostDetailSerializer
    lookup_field = "slug"

# -----------------------------
# Category Views
# -----------------------------

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


@api_view(["GET"])
def posts_by_category(request, category_slug):
    try:
        posts = (
            Post.objects.filter(category__slug=category_slug, status="published")
            .select_related("author", "category")
            .order_by("-created_at")
        )
        serializer = PostListSerializer(posts, many=True)
        logger.info(f"Fetched {len(posts)} posts for category: {category_slug}")
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in posts_by_category view for {category_slug}: {e}", exc_info=True)
        return Response(
            {"error": "An error occurred while fetching posts by category."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# -----------------------------
# Featured / Trending Posts
# -----------------------------

@api_view(["GET"])
def featured_posts(request):
    try:
        posts = (
            Post.objects.filter(is_featured=True, status="published")
            .select_related("author", "category")[:6]
        )
        serializer = PostListSerializer(posts, many=True)
        logger.info(f"Fetched {len(posts)} featured posts")
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in featured_posts view: {e}", exc_info=True)
        return Response(
            {"error": "An error occurred while fetching featured posts."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
def trending_posts(request):
    """
    Get the 6 most recently published posts.
    Serves as the 'Trending' section.
    """
    try:
        posts = Post.objects.filter(status="published").order_by("-created_at")[:6]
        serializer = PostListSerializer(posts, many=True)
        logger.info(f"Fetched {len(posts)} trending posts")
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in trending_posts view: {e}", exc_info=True)
        return Response(
            {"error": "Internal server error occurred while fetching trending posts."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# -----------------------------
# Related Posts
# -----------------------------

@api_view(["GET"])
def related_posts(request, slug):
    """
    Get posts related to the post with the given slug.
    Related by category first, then by tags.
    Limits to 4 posts.
    """
    try:
        original_post = Post.objects.get(slug=slug, status="published")
        logger.info(f"Fetched original post: {original_post.title} (slug: {slug})")
    except Post.DoesNotExist:
        logger.warning(f"Post not found for slug: {slug}")
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    # 1. Related by category
    related_by_category = Post.objects.filter(
        category=original_post.category, status="published"
    ).exclude(id=original_post.id).order_by("-created_at")[:3]

    related_posts_list = list(related_by_category)
    logger.info(f"Found {len(related_by_category)} related posts by category")

    # 2. Related by tags
    if len(related_posts_list) < 4 and original_post.tags:
        needed_more = 4 - len(related_posts_list)
        original_tags = [tag.strip().lower() for tag in original_post.tags.split(",") if tag]

        if original_tags:
            tag_conditions = Q()
            for tag in original_tags:
                tag_conditions |= Q(tags__icontains=tag)

            ids_to_exclude = [original_post.id] + [p.id for p in related_by_category]
            related_by_tags = Post.objects.filter(
                tag_conditions, status="published"
            ).exclude(id__in=ids_to_exclude).order_by("-created_at")[:needed_more]

            related_posts_list.extend(list(related_by_tags))
            logger.info(f"Found {len(related_by_tags)} additional related posts by tags")

    # 3. Fill with latest if still not enough
    if len(related_posts_list) < 4:
        needed_final = 4 - len(related_posts_list)
        ids_to_exclude_final = [original_post.id] + [p.id for p in related_posts_list]
        latest_posts = Post.objects.filter(status="published").exclude(
            id__in=ids_to_exclude_final
        ).order_by("-created_at")[:needed_final]
        related_posts_list.extend(list(latest_posts))
        logger.info(f"Added {len(latest_posts)} latest posts to reach limit of 4")

    serializer = PostListSerializer(related_posts_list[:4], many=True)
    logger.info(f"Returning {len(related_posts_list[:4])} related posts for slug: {slug}")
    return Response(serializer.data)

# -----------------------------
# Ads Views
# -----------------------------

@api_view(["GET"])
def active_ads(request):
    """
    Get all active ads, optionally filtered by category (?category=slug).
    """
    category_slug = request.query_params.get("category", None)
    ads = Ad.objects.filter(is_active=True)

    if category_slug:
        ads = ads.filter(category__slug=category_slug)

    serializer = AdSerializer(ads, many=True)
    return Response(serializer.data)

# -----------------------------
# Comment Views
# -----------------------------

@api_view(['POST'])
def create_comment(request):
    """
    Create a new comment or reply.
    - If 'parent' is provided, it becomes a reply.
    - Supports both authenticated users and anonymous (with name/email).
    """
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        post_id = request.data.get("post")
        parent_id = request.data.get("parent")

        post = get_object_or_404(Post, pk=post_id)
        parent = Comment.objects.filter(id=parent_id).first() if parent_id else None

        comment = Comment.objects.create(
            post=post,
            parent=parent,
            name=serializer.validated_data.get("name", ""),
            email=serializer.validated_data.get("email", ""),
            content=serializer.validated_data["content"],
            author=request.user if request.user.is_authenticated else None,
        )
        return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentPagination(PageNumberPagination):
    page_size = 10  # default comments per page
    page_size_query_param = "page_size"


@api_view(['GET'])
def list_comments(request, post_id):
    """
    List paginated top-level comments for a post.
    Each comment includes its nested replies.
    """
    post = get_object_or_404(Post, pk=post_id)
    comments = Comment.objects.filter(
        post=post,
        parent__isnull=True,
        approved=True
    ).order_by('-created_at')

    paginator = CommentPagination()
    result_page = paginator.paginate_queryset(comments, request)
    serializer = CommentSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def adjacent_posts(request, slug):
    """
    Get the previous and next published posts relative to the post with the given slug.
    Returns JSON: { "previous": {...}, "next": {...} }
    """
    try:
        # Get the current post
        current_post = get_object_or_404(Post, slug=slug, status='published')
        
        # Get the previous post (most recent published post before current)
        previous_post = Post.objects.filter(
            status='published',
            created_at__lt=current_post.created_at
        ).order_by('-created_at').first()
        
        # Get the next post (oldest published post after current)
        next_post = Post.objects.filter(
            status='published',
            created_at__gt=current_post.created_at
        ).order_by('created_at').first()
        
        # Serialize the posts
        previous_serializer = PostListSerializer(previous_post) if previous_post else None
        next_serializer = PostListSerializer(next_post) if next_post else None
        
        return Response({
            "previous": previous_serializer.data if previous_serializer else None,
            "next": next_serializer.data if next_serializer else None
        })
        
    except Post.DoesNotExist:
        return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in adjacent_posts view: {e}")
        return Response(
            {"error": "An error occurred while fetching adjacent posts."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ***** UPDATED NEWSLETTER SUBSCRIPTION VIEW *****
@api_view(['POST'])
def subscribe_newsletter(request):
    """
    API endpoint to subscribe an email to the newsletter.
    Expects JSON: { "email": "user@example.com" }
    """
    # Validate request data
    serializer = NewsletterSubscriptionSerializer(data=request.data)
    if not serializer.is_valid():
        print(f"Invalid newsletter subscription data: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data.get('email')
    
    # Additional email validation (belt and braces)
    try:
        validate_email(email)
    except ValidationError:
        return Response({"email": ["Enter a valid email address."]}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if email already exists
        existing_subscription = NewsletterSubscription.objects.filter(email__iexact=email).first()
        if existing_subscription:
            if existing_subscription.is_active:
                return Response(
                    {"message": "You are already subscribed to our newsletter!"},
                    status=status.HTTP_200_OK
                )
            else:
                # Re-activate subscription
                existing_subscription.is_active = True
                existing_subscription.save()
                return Response(
                    {"message": "Your subscription has been reactivated!"},
                    status=status.HTTP_200_OK
                )
        
        # Create new subscription
        subscription = NewsletterSubscription.objects.create(email=email)
        return Response(
            NewsletterSubscriptionSerializer(subscription).data,
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        import logging
        logging.error(f"Error in subscribe_newsletter view: {e}", exc_info=True)
        return Response(
            {"error": "An internal server error occurred while subscribing. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
# ***** END UPDATED NEWSLETTER SUBSCRIPTION VIEW *****