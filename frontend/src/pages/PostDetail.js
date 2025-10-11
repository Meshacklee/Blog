import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Divider,
  Chip,
  Button,
  TextField,
  Avatar,
  Fab,
  Tooltip,
  Skeleton,
  IconButton as MuiIconButton,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import social icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const API_BASE = 'http://127.0.0.1:8000';

// --- Helper Functions ---
// In PostDetail.js, replace the existing getImageUrl function with this:
const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with /media/, prepend the base URL
  if (path.startsWith('/media/')) {
    return `http://127.0.0.1:8000${path}`;
  }
  
  // If it's a relative path, prepend /media/ and the base URL
  if (!path.startsWith('/')) {
    return `http://127.0.0.1:8000/media/${path}`;
  }
  
  // Fallback: prepend the base URL
  return `http://127.0.0.1:8000${path}`;
};

const formatContent = (text = '') => {
  return String(text).split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
};

// CSRF token helper function
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};
// --- End Helper Functions ---

// ***** LAZY IMAGE COMPONENTS *****
// In PostDetail.js, replace the existing LazyImage component with this:
const LazyImage = ({ src, alt, sx, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  const imageUrl = getImageUrl(src);

  if (!imageUrl) {
    return (
      <Box sx={{ ...sx, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">No Image</Typography>
      </Box>
    );
  }

  return (
    <>
      {!imageLoaded && !imageError && (
        <Skeleton variant="rectangular" sx={sx} />
      )}
      <Box
        component="img"
        src={imageUrl}
        alt={alt}
        sx={{
          ...sx,
          display: imageLoaded && !imageError ? 'block' : 'none',
          objectFit: 'cover',
        }}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          console.error('Image failed to load:', imageUrl);
          setImageError(true);
          setImageLoaded(false);
        }}
        loading="lazy"
        {...props}
      />
      {imageError && (
        <Box sx={{ ...sx, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">Image Unavailable</Typography>
        </Box>
      )}
    </>
  );
};

const LazyCardMedia = ({ src, alt, sx, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImageLoaded(false);
    setImageError(false);
  }, [src]);


  const imageUrl = getImageUrl(src);

  if (!imageUrl) {
    return (
      <Box sx={{ ...sx, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">No Image</Typography>
      </Box>
    );
  }

  return (
    <>
      {!imageLoaded && !imageError && (
        <Skeleton variant="rectangular" sx={sx} />
      )}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={alt}
        sx={{
          ...sx,
          display: imageLoaded && !imageError ? 'block' : 'none',
          objectFit: 'cover',
        }}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          console.error('CardMedia image failed to load:', imageUrl);
          setImageError(true);
          setImageLoaded(false);
        }}
        loading="lazy"
        {...props}
      />
      {imageError && (
        <Box sx={{ ...sx, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">Image Unavailable</Typography>
        </Box>
      )}
    </>
  );
};

// In PostDetail.js, replace the existing LazyAvatar component with this:
const LazyAvatar = ({ src, alt, sx, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setImageLoaded(false);
    setImageError(false);
  }, [src]);

  const imageUrl = getImageUrl(src);

  if (!imageUrl || imageError) {
    // Fallback to a colored avatar with initials
    const initials = (alt || 'A').charAt(0).toUpperCase();
    return (
      <Avatar sx={{ ...sx, bgcolor: 'primary.main' }}>
        <Typography variant="caption" color="primary.contrastText">
          {initials}
        </Typography>
      </Avatar>
    );
  }

  return (
    <>
      {!imageLoaded && !imageError && (
        <Skeleton variant="circular" sx={sx} />
      )}
      <Avatar
        src={imageUrl}
        alt={alt}
        sx={{
          ...sx,
          display: imageLoaded && !imageError ? 'block' : 'none',
        }}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          console.error('Avatar image failed to load:', imageUrl);
          setImageError(true);
          setImageLoaded(false);
        }}
        {...props}
      />
    </>
  );
};
// ***** END LAZY IMAGE COMPONENTS *****

// ***** EXTRACTED: Social Sharing Component *****
const SocialShareBar = ({ post, handleShare }) => (
  <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      Share this article
    </Typography>
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      <Tooltip title="Share on Facebook">
        <MuiIconButton
          onClick={() => handleShare('facebook')}
          sx={{ bgcolor: '#4267B2', color: 'white', '&:hover': { bgcolor: '#365899' } }}
        >
          <FacebookIcon />
        </MuiIconButton>
      </Tooltip>
      <Tooltip title="Share on Twitter">
        <MuiIconButton
          onClick={() => handleShare('twitter')}
          sx={{ bgcolor: '#1DA1F2', color: 'white', '&:hover': { bgcolor: '#0d8bd9' } }}
        >
          <TwitterIcon />
        </MuiIconButton>
      </Tooltip>
      <Tooltip title="Share on LinkedIn">
        <MuiIconButton
          onClick={() => handleShare('linkedin')}
          sx={{ bgcolor: '#0077B5', color: 'white', '&:hover': { bgcolor: '#005885' } }}
        >
          <LinkedInIcon />
        </MuiIconButton>
      </Tooltip>
      <Tooltip title="Share on WhatsApp">
        <MuiIconButton
          onClick={() => handleShare('whatsapp')}
          sx={{ bgcolor: '#25D366', color: 'white', '&:hover': { bgcolor: '#1da851' } }}
        >
          <WhatsAppIcon />
        </MuiIconButton>
      </Tooltip>
      <Tooltip title="Share via Email">
        <MuiIconButton
          onClick={() => handleShare('email')}
          sx={{ bgcolor: '#EA4335', color: 'white', '&:hover': { bgcolor: '#d33b2c' } }}
        >
          <EmailIcon />
        </MuiIconButton>
      </Tooltip>
      <Tooltip title="Copy Link">
        <MuiIconButton
          onClick={() => handleShare('copy')}
          sx={{ bgcolor: 'grey.700', color: 'white', '&:hover': { bgcolor: 'grey.800' } }}
        >
          <ShareIcon />
        </MuiIconButton>
      </Tooltip>
    </Box>
  </Box>
);
// ***** END EXTRACTED: Social Sharing Component *****

/**
 * CommentItem - recursive component to render a comment and its replies
 * Props passed from parent:
 *  - comment: comment object
 *  - replyForms: state object holding reply form state per comment id
 *  - toggleReplyForm(parentId)
 *  - handleReplyChange(parentId, e)
 *  - submitReply(parentId)
 */
const CommentItem = ({ comment, replyForms, toggleReplyForm, handleReplyChange, submitReply }) => {
  const form = replyForms[comment.id] || { visible: false, name: '', email: '', content: '', submitting: false };

  return (
    <Card key={comment.id} sx={{ mb: 2, ml: comment.parent ? { xs: 2, sm: 4 } : 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LazyAvatar
            sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
          >
            {(comment.display_name || comment.name || 'A').charAt(0).toUpperCase()}
          </LazyAvatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {comment.display_name || comment.name || 'Anonymous'}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {new Date(comment.created_at).toLocaleString()}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Typography>

        {/* Reply button */}
        <Box sx={{ mt: 1 }}>
          <Button size="small" onClick={() => toggleReplyForm(comment.id)}>
            Reply
          </Button>
        </Box>

        {/* Inline reply form */}
        {form.visible && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); submitReply(comment.id); }} sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="name"
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  value={form.name}
                  onChange={(e) => handleReplyChange(comment.id, e)}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  name="email"
                  label="Your Email"
                  variant="outlined"
                  fullWidth
                  value={form.email}
                  onChange={(e) => handleReplyChange(comment.id, e)}
                  required
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  name="content"
                  label="Your Reply"
                  multiline
                  rows={3}
                  variant="outlined"
                  fullWidth
                  value={form.content}
                  onChange={(e) => handleReplyChange(comment.id, e)}
                  required
                  size="small"
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" disabled={form.submitting} sx={{ mt: 1 }}>
              {form.submitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </Box>
        )}

        {/* Nested replies (recursive) */}
        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2, pl: 2, borderLeft: '2px solid', borderColor: 'divider' }}>
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replyForms={replyForms}
                toggleReplyForm={toggleReplyForm}
                handleReplyChange={handleReplyChange}
                submitReply={submitReply}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [ads, setAds] = useState([]);
  // ***** NEW: State for adjacent posts *****
  const [adjacentPosts, setAdjacentPosts] = useState({ previous: null, next: null });
  const [loadingAdjacent, setLoadingAdjacent] = useState(true); // Assume loading initially
  // *************************************

  // comments pagination state
  const [comments, setComments] = useState([]); // top-level comments for current pages loaded
  const [nextCommentsPage, setNextCommentsPage] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(null);

  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  // reply forms state: { [parentId]: { visible, name, email, content, submitting } }
  const [replyForms, setReplyForms] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the main post
        const postRes = await axios.get(`${API_BASE}/api/posts/${slug}/`);
        setPost(postRes.data);

        // Fetch related posts
        const relatedRes = await axios.get(`${API_BASE}/api/posts/${slug}/related/`);
        setRelatedPosts(relatedRes.data);

        // Fetch paginated comments for the post (page 1)
        if (postRes.data?.id) {
          await fetchCommentsForPost(postRes.data.id, `${API_BASE}/api/posts/${postRes.data.id}/comments/?page=1`);
        }

        // Ads
        let adsUrl = `${API_BASE}/api/ads/`;
        if (postRes.data?.category?.slug) {
          adsUrl = `${API_BASE}/api/ads/?category=${postRes.data.category.slug}`;
        }
        const adsRes = await axios.get(adsUrl);
        const activeAds = adsRes.data.filter((ad) => ad.is_active);
        setAds(activeAds);

        // ***** FETCH ADJACENT POSTS *****
        try {
          setLoadingAdjacent(true);
          // Fetch adjacent posts from the new API endpoint
          const adjRes = await axios.get(`${API_BASE}/api/posts/${postRes.data.slug}/adjacent/`);
          console.log("Adjacent posts API response:", adjRes.data);
          setAdjacentPosts(adjRes.data); // Expected: { previous: {...}, next: {...} }
        } catch (adjError) {
          console.error("Error fetching adjacent posts:", adjError);
          // Gracefully handle if endpoint doesn't exist or fails
          setAdjacentPosts({ previous: null, next: null });
        } finally {
          setLoadingAdjacent(false);
        }
        // ***** END FETCH ADJACENT POSTS *****

      } catch (err) {
        console.error("Error fetching post page data:", err);
        if (axios.isAxiosError(err)) {
          if (err.response) {
            setError(`Backend Error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
          } else if (err.request) {
            setError('Network Error: Could not reach the server.');
          } else {
            setError('Request Setup Error.');
          }
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Fetch comments helper (accepts full URL for pagination)
  const fetchCommentsForPost = async (postId, url) => {
    try {
      setLoadingComments(true);
      setCommentsError(null);
      const res = await axios.get(url);
      // DRF paginated response: { count, next, previous, results }
      const results = res.data.results || res.data; // fallback if non-paginated
      setComments((prev) => [...prev, ...results]);
      setNextCommentsPage(res.data.next);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setCommentsError('Failed to load comments.');
    } finally {
      setLoadingComments(false);
    }
  };

  // Load more comments (pagination)
  const loadMoreComments = async () => {
    if (!nextCommentsPage) return;
    await fetchCommentsForPost(post.id, nextCommentsPage);
  };

  // Add reply into nested comments tree
  const addReplyToComments = (items, parentId, reply) => {
    return items.map((item) => {
      if (item.id === parentId) {
        const existingReplies = Array.isArray(item.replies) ? item.replies : [];
        return { ...item, replies: [reply, ...existingReplies] };
      }
      if (item.replies && item.replies.length > 0) {
        return { ...item, replies: addReplyToComments(item.replies, parentId, reply) };
      }
      return item;
    });
  };

  // Toggle reply form visibility for a parent comment
  const toggleReplyForm = (parentId) => {
    setReplyForms((prev) => {
      const cur = prev[parentId] || { visible: false, name: '', email: '', content: '', submitting: false };
      return { ...prev, [parentId]: { ...cur, visible: !cur.visible } };
    });
  };

  // Handle reply form field change
  const handleReplyChange = (parentId, e) => {
    const { name, value } = e.target;
    setReplyForms((prev) => {
      const cur = prev[parentId] || { visible: true, name: '', email: '', content: '', submitting: false };
      return { ...prev, [parentId]: { ...cur, [name]: value } };
    });
  };

  // Submit reply
  const submitReply = async (parentId) => {
    const form = replyForms[parentId] || {};
    if (!form.content || !form.name || !form.email) {
      setCommentError('Please fill all reply fields.');
      return;
    }

    try {
      // mark submitting true
      setReplyForms((prev) => ({ ...prev, [parentId]: { ...prev[parentId], submitting: true } }));

      const payload = {
        post: post.id,
        parent: parentId,
        name: form.name,
        email: form.email,
        content: form.content,
      };

      const res = await axios.post(`${API_BASE}/api/comments/create/`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const newReply = res.data;

      // Insert reply in the nested comments tree
      setComments((prev) => addReplyToComments(prev, parentId, newReply));

      // hide & reset form
      setReplyForms((prev) => ({ ...prev, [parentId]: { visible: false, name: '', email: '', content: '', submitting: false } }));
      setCommentError(null);
    } catch (err) {
      console.error("Failed to submit reply:", err);
      setCommentError('Failed to submit reply. Please try again.');
      setReplyForms((prev) => ({ ...prev, [parentId]: { ...prev[parentId], submitting: false } }));
    }
  };

  // Top-level comment handlers (posting new comment)
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setNewComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.content.trim() || !newComment.name.trim() || !newComment.email.trim()) {
      setCommentError('Please fill in all fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newComment.email)) {
      setCommentError('Please enter a valid email address.');
      return;
    }

    setSubmittingComment(true);
    setCommentError(null);

    try {
      const payload = {
        post: post.id,
        name: newComment.name,
        email: newComment.email,
        content: newComment.content,
      };

      const res = await axios.post(`${API_BASE}/api/comments/create/`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Prepend new top-level comment
      setComments((prev) => [res.data, ...prev]);
      setNewComment({ name: '', email: '', content: '' });
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setCommentError('Failed to submit comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // ***** NEW: Social Sharing Function *****
  const handleShare = async (platform) => {
    if (!post) return;

    const title = encodeURIComponent(post.title);
    const url = encodeURIComponent(window.location.href);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title} ${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=Check out this article: ${url}`;
        break;
      default:
        // Copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link: ', err);
          // Fallback: prompt user to copy
          prompt('Copy this link:', window.location.href);
        }
        return; // Don't open a new window for copy
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    }
  };
  // ***** END NEW: Social Sharing Function *****

  const carouselPosts = relatedPosts.slice(0, 3);
  const listPosts = relatedPosts.slice(3);

  if (loading) {
    return (
      <>
        <Header />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Alert severity="info">Post not found.</Alert>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Grid container spacing={{ xs: 2, sm: 4 }}>
          {/* MAIN CONTENT */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ width: '100%' }}>
              {post.featured_image && (
                <Box sx={{ mb: { xs: 2, sm: 3 }, textAlign: 'center' }}>
                  <LazyImage
                    src={getImageUrl(post.featured_image)}
                    alt={post.title}
                    sx={{
                      width: '100%',
                      maxHeight: { xs: 250, sm: 400, md: 500 },
                      objectFit: 'cover',
                      borderRadius: 1,
                      boxShadow: 2,
                    }}
                  />
                </Box>
              )}

              {/* Social Sharing Bar */}
              <SocialShareBar post={post} handleShare={handleShare} />

              <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }, lineHeight: 1.2, mb: 2, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {post.title}
              </Typography>

              {/* Meta */}
              <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                  By <b>{post.author?.username}</b> • {new Date(post.created_at).toLocaleDateString()} • {post.views_count || 0} views
                </Typography>
                {post.tags && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {post.tags.split(',').map((tag, index) => (
                      <Chip key={index} label={tag.trim()} size="small" variant="outlined" sx={{ fontSize: '0.75rem', maxWidth: '100%', '& .MuiChip-label': { whiteSpace: 'normal', wordBreak: 'break-all' } }} />
                    ))}
                  </Box>
                )}
              </Box>

              {/* Content */}
              <Box sx={{ wordWrap: 'break-word', overflowWrap: 'break-word', hyphens: 'auto', '& p': { mb: 2, fontSize: { xs: '1rem', sm: '1.1rem' }, lineHeight: 1.7, textAlign: 'justify', wordWrap: 'break-word', overflowWrap: 'break-word' }, '& h2': { mt: 4, mb: 2, fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.5rem', sm: '1.75rem' } }, '& h3': { mt: 3, mb: 1.5, fontWeight: 'bold', color: 'secondary.main', fontSize: { xs: '1.25rem', sm: '1.5rem' } }, '& ul, & ol': { pl: 3, mb: 2, fontSize: { xs: '1rem', sm: '1.1rem' } }, '& li': { mb: 0.5 }, '& blockquote': { borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, my: 2, fontStyle: 'italic', bgcolor: 'grey.50' }, '& a': { color: 'primary.main', textDecoration: 'underline', '&:hover': { textDecoration: 'none' } }, '& pre': { p: 2, bgcolor: 'grey.100', border: '1px solid', borderColor: 'grey.300', borderRadius: 1, overflowX: 'auto', my: 2, fontSize: '0.9rem' }, '& code': { p: 0.5, bgcolor: 'grey.100', border: '1px solid', borderColor: 'grey.300', borderRadius: 0.5, fontSize: '0.9rem' } }}>
                <Typography variant="body1" component="div">
                  {formatContent(post.content)}
                </Typography>
              </Box>

              {/* Divider before related posts section */}
              <Divider sx={{ my: 4 }} />

              {/* ***** ENHANCEMENT 1: Adjacent Post Navigation ***** */}
              <Box sx={{ mb: 4, py: 2 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 2 }}
                >
                  Continue Reading
                </Typography>

                {loadingAdjacent ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width={100} height={40} />
                    <Skeleton variant="rectangular" width={100} height={40} />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {adjacentPosts.previous ? (
                      <Button
                        component={Link}
                        to={`/post/${adjacentPosts.previous.slug}`}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Previous Post
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {adjacentPosts.previous.title}
                          </Typography>
                        </Box>
                      </Button>
                    ) : (
                      <Box sx={{ width: 100 }} /> // Spacer
                    )}

                    {adjacentPosts.next ? (
                      <Button
                        component={Link}
                        to={`/post/${adjacentPosts.next.slug}`}
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Next Post
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {adjacentPosts.next.title}
                          </Typography>
                        </Box>
                      </Button>
                    ) : (
                      <Box sx={{ width: 100 }} /> // Spacer
                    )}
                  </Box>
                )}
              </Box>
              {/* ***** END ENHANCEMENT 1 ***** */}

              {/* Related */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  Related Posts
                </Typography>

                {carouselPosts.length > 0 ? (
                  <Box sx={{ mb: 4 }}>
                    <Swiper modules={[Navigation, Pagination]} spaceBetween={20} slidesPerView={1} navigation pagination={{ clickable: true }} breakpoints={{ 600: { slidesPerView: 2 }, 900: { slidesPerView: 3 } }}>
                      {carouselPosts.map((relatedPost) => (
                        <SwiperSlide key={`carousel-${relatedPost.id}`}>
                          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {relatedPost.featured_image && (
                              <LazyCardMedia
                                src={getImageUrl(relatedPost.featured_image)}
                                alt={relatedPost.title}
                                sx={{ 
                                  height: 140, 
                                  objectFit: 'cover' 
                                }}
                              />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {relatedPost.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                {new Date(relatedPost.created_at).toLocaleDateString()}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" component={Link} to={`/post/${relatedPost.slug}`}>
                                Read More
                              </Button>
                            </CardActions>
                          </Card>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>
                ) : (
                  <Typography variant="body2" align="center" color="text.secondary" sx={{ py: 4, fontStyle: 'italic' }}>
                    No related posts found.
                  </Typography>
                )}
              </Box>

              {/* Divider before comments */}
              <Divider sx={{ my: 4 }} />

              {/* Comments Section */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  Comments ({comments.length})
                </Typography>

                {/* Top-level comment form */}
                <Card sx={{ mb: 3, p: 2 }}>
                  <CardContent>
                    <form onSubmit={handleCommentSubmit}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            name="name"
                            label="Your Name"
                            variant="outlined"
                            fullWidth
                            value={newComment.name}
                            onChange={handleCommentChange}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            name="email"
                            label="Your Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={newComment.email}
                            onChange={handleCommentChange}
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            name="content"
                            label="Leave a comment"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={newComment.content}
                            onChange={handleCommentChange}
                            required
                          />
                        </Grid>
                      </Grid>
                      {commentError && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{commentError}</Alert>}
                      <Button type="submit" variant="contained" disabled={submittingComment} sx={{ mt: 2 }}>
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Comments list (recursive) */}
                {comments.length > 0 ? (
                  <>
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        replyForms={replyForms}
                        toggleReplyForm={toggleReplyForm}
                        handleReplyChange={handleReplyChange}
                        submitReply={submitReply}
                      />
                    ))}

                    {/* Load more */}
                    {nextCommentsPage && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button variant="outlined" onClick={loadMoreComments} disabled={loadingComments}>
                          {loadingComments ? 'Loading...' : 'Load more comments'}
                        </Button>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4, fontStyle: 'italic' }}>
                    No comments yet. Be the first!
                  </Typography>
                )}

                {commentsError && <Alert severity="error" sx={{ mt: 2 }}>{commentsError}</Alert>}
              </Box>
            </Box>
          </Grid>

          {/* SIDEBAR */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ position: { lg: 'sticky' }, top: { lg: 20 }, mt: { xs: 4, lg: 0 } }}>
              <Typography variant="h6" gutterBottom>Sponsored</Typography>
              <Divider sx={{ mb: 2 }} />
              {ads.length > 0 ? (
                ads.map((ad) => (
                  <Card key={ad.id} sx={{ mb: 3 }}>
                    {ad.image_url && (
                      <LazyCardMedia
                        src={getImageUrl(ad.image_url)}
                        alt={ad.title}
                        sx={{ 
                          height: 200, 
                          objectFit: 'cover' 
                        }}
                      />
                    )}
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{ad.title}</Typography>
                      <Button variant="contained" fullWidth href={ad.target_url} target="_blank" sx={{ mt: 1 }}>{ad.cta || 'Learn More'}</Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2, fontStyle: 'italic' }}>
                  No ads available.
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default PostDetail;