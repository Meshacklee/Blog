// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardContent, CardMedia, Paper, IconButton, Grid } from '@mui/material';
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
    // Fetch World News posts
    const fetchWorldNews = async () => {
      try {
        setWorldLoading(true);
        const response = await newsApi.getPostsByCategory('worldnews');
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.results || []);
        setWorldPosts(data);
      } catch (error) {
        console.error('Error fetching world news:', error);
        setWorldPosts([]);
      } finally {
        setWorldLoading(false);
      }
    };

    // Fetch Politics posts
    const fetchPoliticsNews = async () => {
      try {
        setPoliticsLoading(true);
        const response = await newsApi.getPostsByCategory('politics');
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.results || []);
        setPoliticsPosts(data);
      } catch (error) {
        console.error('Error fetching politics news:', error);
        setPoliticsPosts([]);
      } finally {
        setPoliticsLoading(false);
      }
    };

    // Fetch featured posts
    const fetchFeaturedPosts = async () => {
      try {
        setFeaturedLoading(true);
        const response = await newsApi.getFeaturedPosts();
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.results || []);
        setFeaturedPosts(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching featured posts:', error);
        try {
          const postsResponse = await newsApi.getPosts({ limit: 10 });
          const fallbackData = Array.isArray(postsResponse.data)
            ? postsResponse.data
            : (postsResponse.data?.results || []);
          setFeaturedPosts(fallbackData);
        } catch (fallbackError) {
          console.error('Error in featured posts fallback:', fallbackError);
          setFeaturedPosts([]);
        }
      } finally {
        setFeaturedLoading(false);
      }
    };

    // Fetch sliding carousel posts
    const fetchCarouselPosts = async () => {
      try {
        setCarouselLoading(true);
        console.log("Fetching posts for 'slidingcarousel' category...");
        const response = await newsApi.getPostsByCategory('slidingcarousel');
        console.log("'slidingcarousel' API Response:", response.data);
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.results || []);
        setCarouselPosts(data);
        console.log("Set carousel posts state:", data);
      } catch (error) {
        console.error('Error fetching sliding carousel posts:', error);
        setCarouselPosts([]);
      } finally {
        setCarouselLoading(false);
        console.log("Finished fetching carousel posts.");
      }
    };

    fetchWorldNews();
    fetchPoliticsNews();
    fetchFeaturedPosts();
    fetchCarouselPosts();
  }, []);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    if (carouselPosts.length > 0) {
      console.log("Setting up auto-advance for carousel with", carouselPosts.length, "posts");
      const interval = setInterval(() => {
        setCurrentSlideIndex((prevIndex) =>
          prevIndex === carouselPosts.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
      return () => {
        console.log("Clearing carousel auto-advance interval");
        clearInterval(interval);
      };
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

  const FeaturedCarousel = ({ posts, loading }) => {
    console.log("Rendering FeaturedCarousel with posts:", posts, "loading:", loading);
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

    // Get current slide data
    const currentPost = posts[currentSlideIndex];
    console.log("Current carousel post index:", currentSlideIndex, "post:", currentPost);
    // Get next 3 posts for the smaller section (with wrap-around)
    const nextPosts = posts.slice(currentSlideIndex + 1, currentSlideIndex + 4)
      .concat(posts.slice(0, Math.max(0, (currentSlideIndex + 4 - posts.length))));

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
          {/* Main featured post - Only title and thumbnail */}
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {currentPost?.featured_image && (
              <CardMedia
                component="img"
                height="400"
                image={currentPost.featured_image.startsWith('http') ? currentPost.featured_image : `http://localhost:8000${currentPost.featured_image}`}
                alt={currentPost.title}
                sx={{ objectFit: 'cover', objectPosition: 'center' }}
                onError={(e) => {
                  console.error('Carousel main image failed to load:', currentPost.featured_image);
                  e.target.style.display = 'none';
                }}
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
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
              >
                {currentPost?.title}
              </Typography>
            </CardContent>
          </Card>

          {/* Navigation dots */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            position: 'absolute',
            bottom: -30,
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
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
                    backgroundColor: index === currentSlideIndex ? 'primary.dark' : 'grey.400'
                  }
                }}
                onClick={() => setCurrentSlideIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </Box>
        </Box>

        {/* Smaller featured posts - Only title and thumbnail */}
        <Grid container spacing={2}>
          {nextPosts.map((post, index) => (
            <Grid key={post.id} size={{ xs: 12, md: 4 }} sx={{ display: 'flex' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { boxShadow: 6 },
                  width: '100%'
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
                        objectPosition: 'center'
                      }}
                      onError={(e) => {
                        console.error('Carousel thumbnail image failed to load:', post.featured_image);
                        e.target.style.display = 'none';
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
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
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