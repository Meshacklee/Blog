import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, IconButton, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { newsApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TechnologyPage from './categories/TechnologyPage';
import FinancePage from './categories/FinancePage';
import WorldNewsPage from './categories/WorldNewsPage';
import LifestylePage from './categories/LifestylePage';
import EducationPage from './categories/EducationPage';
import PoliticsPage from './categories/PoliticsPage';

const Home = () => {
  const [worldPosts, setWorldPosts] = useState([]);
  const [politicsPosts, setPoliticsPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [carouselPosts, setCarouselPosts] = useState([]);
  const [worldLoading, setWorldLoading] = useState(true);
  const [politicsLoading, setPoliticsLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [carouselLoading, setCarouselLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch World News posts
        setWorldLoading(true);
        const worldResponse = await newsApi.getPostsByCategory('worldnews');
        setWorldPosts(Array.isArray(worldResponse.data) ? worldResponse.data : (worldResponse.data?.results || []));

        // Fetch Politics posts
        setPoliticsLoading(true);
        const politicsResponse = await newsApi.getPostsByCategory('politics');
        setPoliticsPosts(Array.isArray(politicsResponse.data) ? politicsResponse.data : (politicsResponse.data?.results || []));

        // Fetch Featured posts
        setFeaturedLoading(true);
        const featuredResponse = await newsApi.getFeaturedPosts();
        const featuredData = Array.isArray(featuredResponse.data) ? featuredResponse.data : (featuredResponse.data?.results || []);
        setFeaturedPosts(featuredData.slice(0, 10));

        // Fetch Carousel posts
        setCarouselLoading(true);
        const carouselResponse = await newsApi.getPostsByCategory('slidingcarousel');
        setCarouselPosts(Array.isArray(carouselResponse.data) ? carouselResponse.data : (carouselResponse.data?.results || []));
      } catch (error) {
        console.error('Error fetching posts:', error);
        setWorldPosts([]);
        setPoliticsPosts([]);
        setFeaturedPosts([]);
        setCarouselPosts([]);
      } finally {
        setWorldLoading(false);
        setPoliticsLoading(false);
        setFeaturedLoading(false);
        setCarouselLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (carouselPosts.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex === carouselPosts.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselPosts.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === carouselPosts.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex === 0 ? carouselPosts.length - 1 : prevIndex - 1));
  };

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

        <Box sx={{ position: 'relative', mb: 3 }}>
          {/* Main featured post */}
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {currentPost?.featured_image && (
              <img
                src={currentPost.featured_image.startsWith('http') ? currentPost.featured_image : `http://localhost:8000${currentPost.featured_image}`}
                alt={currentPost.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '4px',
                }}
                onError={(e) => {
                  console.error('Carousel main image failed to load:', currentPost.featured_image);
                  e.target.src = '/placeholder.jpg'; // Fallback image
                }}
              />
            )}
            <Box sx={{ p: 2 }}>
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
            </Box>
          </Paper>

          {/* Navigation dots */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 2,
              position: 'absolute',
              bottom: -30,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {posts.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentSlideIndex ? 'primary.main' : 'grey.300',
                  margin: '0 4px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: index === currentSlideIndex ? 'primary.dark' : 'grey.400',
                  },
                }}
                onClick={() => setCurrentSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </Box>
        </Box>

        {/* Smaller featured posts */}
        <Grid container spacing={2}>
          {nextPosts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { boxShadow: 6 },
                  width: '100%',
                }}
              >
                {post.featured_image && (
                  <Box sx={{ mb: 1 }}>
                    <img
                      src={post.featured_image.startsWith('http') ? post.featured_image : `http://localhost:8000${post.featured_image}`}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        objectPosition: 'center',
                      }}
                      onError={(e) => {
                        console.error('Carousel thumbnail image failed to load:', post.featured_image);
                        e.target.src = '/placeholder.jpg'; // Fallback image
                      }}
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
                    '&:hover': { color: 'primary.main', textDecoration: 'underline' },
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