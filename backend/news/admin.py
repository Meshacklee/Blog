# backend/news/admin.py
from django.contrib import admin
from .models import Category, Post, Comment, Ad


# --- Category Admin ---
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


# --- Post Admin ---
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'created_at', 'views_count', 'is_featured']
    list_filter = ['status', 'category', 'is_featured', 'created_at']
    search_fields = ['title', 'content', 'tags']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_at'
    ordering = ['-created_at']


# --- Comment Admin ---
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'created_at', 'approved']
    list_filter = ['approved', 'created_at']
    search_fields = ['content', 'author__username']
    actions = ['approve_comments']

    def approve_comments(self, request, queryset):
        queryset.update(approved=True)
        self.message_user(request, f"{queryset.count()} comment(s) approved ✅")


# --- Ad Admin ---
@admin.register(Ad)
class AdAdmin(admin.ModelAdmin):
    list_display = ['title', 'size', 'category', 'is_active', 'display_order', 'created_at']
    list_filter = ['size', 'category', 'is_active']
    search_fields = ['title']
    ordering = ['display_order', '-created_at']
    fields = ['title', 'image_url', 'target_url', 'size', 'category', 'is_active', 'display_order']


# --- Site Branding ---
admin.site.site_header = "Afripen News Administration"
admin.site.site_title = "Afripen News Admin"
admin.site.index_title = "Welcome to Afripen News Admin Panel"
