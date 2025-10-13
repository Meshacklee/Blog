// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, Card, 
  CardContent, CardMedia, Paper, IconButton, Grid 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { newsApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TechnologyPage from './categories/TechnologyPage';
import FinancePage from './categories/FinancePage';
import WorldNewsPage from './categories/WorldNewsPage';
import LifestylePage from './categories/LifestylePage';
import EducationPage from './categories/EducationPage';
import PoliticsPage from './categories/PoliticsPage';

const Home = () => {
  // ❌ Removed unused states that caused build errors
  const [carouselPosts, setCarouselPosts] = useState([]);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // ✅ Only fetching carousel posts now
  useEffect(() => {
    const fetchCarouselPosts = async () => {
      try {
        setCarouselLoading(true);
        const response = await newsApi.getPostsByCategory('slidingcarousel');
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.results || []);
        setCarouselPosts(data);
      } catch (error) {
        console.error('Error fetching sliding carousel posts:', error);
        setCarouselPosts([]);
      } finally {
        setCarouselLoading(false);
      }
    };

    fetchCarouselPosts();
  }, []);

  // ✅ Auto-slide logic
  useEffect(() => {
    if (carouselPosts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) =>
          prevIndex === carouselPosts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselPosts.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === carouselPosts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? carouselPosts.length - 1 : prevIndex - 1
    );
  };

  // ✅ Carousel Section
  const FeaturedCarousel = ({ posts, loading }) => {
    if (loading) {
      return (
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!posts || posts.length === 0) {
      return (
        <Box sx={{ mb: 6, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Featured Stories
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No featured posts available. Please ensure posts exist in the 'slidingcarousel' category.
          </Typography>
        </Box>
      );
    }

    const currentPost = posts[currentSlideIndex];
    const nextPosts = posts
      .slice(currentSlideIndex + 1, currentSlideIndex + 4)
      .concat(posts.slice(0, Math.max(0, currentSlideIndex + 4 - posts.length)));

    return (
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Featured Stories ({posts.length} posts)
          </Typography>
          <Box>
            <IconButton onClick={prevSlide} size="small" aria-label="Previous slide">
              <ArrowBackIcon />
            </IconButton>
            <IconButton onClick={nextSlide} size="small" aria-label="Next slide">
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Main featured post */}
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {currentPost?.featured_image && (
            <CardMedia
              component="img"
              height="400"
              image={
                currentPost.featured_image.startsWith('http')
                  ? currentPost.featured_image
                  : `${process.env.REACT_APP_API_BASE_URL}${currentPost.featured_image}`
              }
              alt={currentPost.title}
              sx={{ objectFit: 'cover', objectPosition: 'center' }}
              onError={(e) => (e.target.style.display = 'none')}
            />
          )}
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              component={Link}
              to={`/post/${currentPost?.slug}`}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { color: 'primary.main', textDecoration: 'underline' },
              }}
            >
              {currentPost?.title}
            </Typography>
          </CardContent>
        </Card>

        {/* Thumbnails */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {nextPosts.map((post) => (
            <Grid item xs={12} md={4} key={post.id}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                {post.featured_image && (
                  <Box sx={{ mb: 1 }}>
                    <img
                      src={
                        post.featured_image.startsWith('http')
                          ? post.featured_image
                          : `${process.env.REACT_APP_API_BASE_URL}${post.featured_image}`
                      }
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        objectPosition: 'center',
                      }}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </Box>
                )}
                <Typography
                  variant="h6"
                  gutterBottom
                  noWrap
                  component={Link}
                  to={`/post/${post.slug}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {post.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <FeaturedCarousel posts={carouselPosts} loading={carouselLoading} />
      </Container>

      {/* Category Sections */}
      <TechnologyPage />
      <FinancePage />
      <WorldNewsPage />
      <LifestylePage />
      <EducationPage />
      <PoliticsPage />

      <Footer />
    </>
  );
};

export default Home;
