from django.urls import path
from . import views


urlpatterns = [
    # Public API
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('posts/category/<str:category_slug>/', views.posts_by_category, name='posts-by-category'),
    path('posts/featured/', views.featured_posts, name='featured-posts'),
    # This should still point to the function we just updated
    path('posts/trending/', views.trending_posts, name='trending-posts'), # Keep this line
    path("posts/<slug:slug>/related/", views.related_posts, name="related-posts"),
        path('comments/create/', views.create_comment, name='create-comment'),
   path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/related/', views.related_posts, name='related-posts'),
    # ***** NEW URL FOR ADJACENT POSTS *****
    path('posts/<slug:slug>/adjacent/', views.adjacent_posts, name='adjacent-posts'),
    # ***** END NEW URL *****
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),
    path('newsletter/subscribe/', views.subscribe_newsletter, name='newsletter-subscribe'),

    # ... any other

    # Ads
    path("ads/", views.active_ads, name="active-ads"),
]
