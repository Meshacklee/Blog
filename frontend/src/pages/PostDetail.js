import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { newsApi } from '../services/api';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await newsApi.get(`/posts/${slug}/`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await newsApi.get(`/posts/${slug}/comments/`);
        setComments(response.data);
      } catch {
        console.error('Failed to load comments');
      }
    };
    fetchComments();
  }, [slug]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await newsApi.post(`/posts/${slug}/comments/`, { text: commentText });
      setCommentText('');
      const response = await newsApi.get(`/posts/${slug}/comments/`);
      setComments(response.data);
    } catch {
      console.error('Failed to post comment');
    }
  };

  if (loading)
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container>
        <Typography color="error" textAlign="center" py={4}>
          {error}
        </Typography>
      </Container>
    );

  if (!post) return null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        By {post.author?.username || 'Unknown'} —{' '}
        {new Date(post.created_at).toLocaleDateString()}
      </Typography>

      {post.image && (
        <Box
          component="img"
          src={post.image}
          alt={post.title}
          sx={{ width: '100%', borderRadius: 2, my: 2 }}
        />
      )}

      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 4 }}>
        {post.content}
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Comments ({comments.length})
      </Typography>

      <Box mb={3}>
        {comments.map((comment) => (
          <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar>{comment.user?.username?.[0]?.toUpperCase() || 'U'}</Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle2">{comment.user?.username || 'Anonymous'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(comment.created_at).toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {comment.text}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCommentSubmit}>
        Post Comment
      </Button>
    </Container>
  );
};

export default PostDetail;