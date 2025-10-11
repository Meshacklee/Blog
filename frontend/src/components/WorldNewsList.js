import React from 'react';
import { Grid, Typography, Box, CircularProgress, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const WorldNewsList = ({ posts, loading, title }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', mb: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
          No posts available in this category yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        {title} ({posts.length} posts)
      </Typography>
      
      <Grid container spacing={3}>
        {posts.map((post) => {
          const hasImage = post.featured_image && 
                          typeof post.featured_image === 'string' &&
                          post.featured_image.trim() !== '' && 
                          !post.featured_image.includes('null');
          
          return (
            <Grid key={post.id} xs={12} sx={{ display: 'flex' }}>
              <Card 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  height: 'auto',
                  width: '100%',
                  '&:hover': { 
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {hasImage && (
                  <CardMedia
                    component="img"
                    sx={{ 
                      width: { xs: '100%', md: 300 },
                      height: { xs: 200, md: '100%' },
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    image={post.featured_image}
                    alt={post.title}
                    onError={(e) => {
                      console.log('World News image failed to load:', post.featured_image);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                {!hasImage && (
                  <Box 
                    sx={{ 
                      width: { xs: '100%', md: 300 },
                      height: { xs: 200, md: '100%' },
                      bgcolor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px dashed #ccc'
                    }}
                  >
                    <Typography color="text.secondary" align="center">No Image</Typography>
                  </Box>
                )}
                
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden',
                      mb: 2
                    }}>
                      {post.excerpt}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      By {post.author?.username} • {new Date(post.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Button size="small" component={Link} to={`/post/${post.slug}`}>
                      Read More
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WorldNewsList;