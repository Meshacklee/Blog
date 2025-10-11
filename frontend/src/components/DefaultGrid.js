import React from 'react';
import { Grid, Typography, Box, CircularProgress, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const DefaultGrid = ({ posts, loading, title, categorySlug }) => {
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
            <Grid key={post.id} xs={12} md={6} lg={4} sx={{ display: 'flex' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
                {hasImage && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.featured_image}
                    alt={post.title}
                    sx={{ objectFit: 'cover', objectPosition: 'center' }}
                    onError={(e) => {
                      console.log('Image failed to load:', post.featured_image);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                {!hasImage && (
                  <Box 
                    sx={{ 
                      height: 200, 
                      bgcolor: '#f5f5f5', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px dashed #ccc'
                    }}
                  >
                    <Typography color="text.secondary">No Image</Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {post.excerpt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    By {post.author?.username} • {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/post/${post.slug}`}>
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DefaultGrid;


