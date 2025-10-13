import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { newsApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PostDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await newsApi.getPostDetail(slug);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h5" color="text.secondary">
          Post not found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ py: 6 }}>
        {post.featured_image && (
          <Paper sx={{ mb: 3 }}>
            <img
              src={
                post.featured_image.startsWith('http')
                  ? post.featured_image
                  : `http://localhost:8000${post.featured_image}`
              }
              alt={post.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </Paper>
        )}

        <Typography variant="h3" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {new Date(post.created_at).toLocaleDateString()}
        </Typography>

        <Typography
          variant="body1"
          sx={{ mt: 3 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Box sx={{ mt: 4 }}>
          <Link to="/">← Back to Home</Link>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default PostDetail;
