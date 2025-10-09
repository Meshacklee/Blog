# backend/news/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from ckeditor.fields import RichTextField
# from ckeditor_uploader.fields import RichTextUploadingField  # optional if you want upload support


# --- Category Model ---
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# --- Post Model ---
class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='posts')

    # Use CKEditor for rich text content
    content = RichTextField()
    # content = RichTextUploadingField()  # alternative if you want uploads

    excerpt = models.TextField(max_length=300, blank=True)
    featured_image = models.ImageField(upload_to='posts/', blank=True, null=True)
    tags = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.excerpt:
            plain_content = str(self.content)
            self.excerpt = plain_content[:297] + '...' if len(plain_content) > 300 else plain_content
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


# --- Comment Model (with replies + email masking) ---
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    content = models.TextField()
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies"  # ✅ allows nested replies
    )
    created_at = models.DateTimeField(auto_now_add=True)
    approved = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']  # newest comments first

    def masked_email(self):
        """Return a masked version of the email for display."""
        if not self.email:
            return None
        try:
            username, domain = self.email.split('@')
            return username[:2] + '***@' + domain
        except ValueError:
            return self.email

    def __str__(self):
        if self.name:
            display_name = self.name
        elif self.email:
            display_name = self.masked_email()
        elif self.author:
            display_name = self.author.username
        else:
            display_name = "Anonymous"

        if self.parent:
            return f"Reply by {display_name} on {self.post.title}"
        return f"Comment by {display_name} on {self.post.title}"


# --- Ad Model ---
class Ad(models.Model):
    SIZE_CHOICES = [
        ('300x250', 'Medium Rectangle (300x250)'),
        ('160x600', 'Wide Skyscraper (160x600)'),
        ('728x90', 'Leaderboard (728x90)'),
        ('320x50', 'Mobile Banner (320x50)'),
        ('custom', 'Custom Size'),
    ]

    title = models.CharField(max_length=200)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    target_url = models.URLField(max_length=500, help_text="URL the ad links to")
    size = models.CharField(max_length=20, choices=SIZE_CHOICES, default='300x250')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text="Show ad only on this category page (optional)"
    )
    is_active = models.BooleanField(default=True, help_text="Toggle if the ad is currently active")
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in which ads are displayed (lower numbers first)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"Ad: {self.title} ({self.size})"


# --- Newsletter Subscription Model ---
class NewsletterSubscription(models.Model):
    email = models.EmailField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return f"Newsletter Subscription: {self.email}"


