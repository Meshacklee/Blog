# backend/news/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Category, Comment, Ad, NewsletterSubscription


# --- Author Serializer ---
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


# --- Category Serializer ---
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


# --- Comment Serializer ---
class CommentSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()  # ✅ Nested replies

    class Meta:
        model = Comment
        fields = [
            'id',
            'post',
            'author',
            'name',
            'display_name',
            'content',
            'created_at',
            'replies',
        ]

    def get_display_name(self, obj):
        """Return safe name or masked email."""
        if obj.name:
            return obj.name
        elif obj.email:
            return obj.masked_email()
        elif obj.author:
            return obj.author.username
        return "Anonymous"

    def get_replies(self, obj):
        """Fetch only direct children replies."""
        qs = obj.replies.filter(approved=True).order_by("created_at")
        return CommentSerializer(qs, many=True).data


# --- Post List Serializer ---
class PostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    # Add image spec fields for list view (thumbnails)
    featured_image_thumbnail = serializers.ImageField(read_only=True)
    featured_image_medium = serializers.ImageField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'author',
            'category',
            'excerpt',
            'featured_image',
            'featured_image_thumbnail',
            'featured_image_medium',
            'created_at',
            'views_count',
            'is_featured',
        ]


# --- Post Detail Serializer ---
class PostDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    comments = serializers.SerializerMethodField()  # ✅ with nested replies
    # Add all image spec fields for detail view
    featured_image_thumbnail = serializers.ImageField(read_only=True)
    featured_image_medium = serializers.ImageField(read_only=True)
    featured_image_large = serializers.ImageField(read_only=True)

    class Meta:
        model = Post
        fields = [
            'id',
            'title',
            'slug',
            'author',
            'category',
            'content',
            'excerpt',
            'featured_image',
            'featured_image_thumbnail',
            'featured_image_medium',
            'featured_image_large',
            'tags',
            'created_at',
            'updated_at',
            'views_count',
            'is_featured',
            'comments',
        ]

    def get_comments(self, obj):
        """Return top-level comments (no parent) with replies."""
        top_level = obj.comments.filter(parent__isnull=True, approved=True).order_by('-created_at')
        return CommentSerializer(top_level, many=True).data


# --- Ad Serializer ---
class AdSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Ad
        fields = [
            'id',
            'title',
            'image_url',
            'target_url',
            'size',
            'category',
            'category_name',
            'is_active',
            'display_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'subscribed_at', 'is_active']
        read_only_fields = ['id', 'subscribed_at', 'is_active']