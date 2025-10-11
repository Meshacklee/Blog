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
  Button,
  Grid,
  Chip,
  Avatar,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Pagination,
  Skeleton,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TechSidebar from '../../components/TechSidebar';

// Helper to build full image URL with fallback
const getImageUrl = (path) => {
  if (!path) return '/default-thumbnail.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? path : '/' + path}`;
};

const TechnologyPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);
  const [error, setError] = useState(null);

  // ***** PAGINATION STATE *****
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const postsPerPage = 12; // 6 cards + 6 list items
  // ***** END PAGINATION STATE *****

  // Access URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Read page from URL on component mount or URL change
    const pageParam = searchParams.get('page');
    const pageNumber = parseInt(pageParam, 10) || 1;
    setCurrentPage(pageNumber);
  }, [searchParams]);

  useEffect(() => {
    const fetchTechnologyNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch paginated posts for the 'technology' category
        const response = await newsApi.getPostsByCategory('technology', {
          page: currentPage,
        });

        console.log("Fetched Technology Posts:", response.data);

        // Handle paginated response
        if (response.data && response.data.results !== undefined) {
          setPosts(response.data.results);
          setTotalCount(response.data.count);
          const calculatedTotalPages = Math.ceil(response.data.count / postsPerPage);
          setTotalPages(calculatedTotalPages);
        } else {
          // Fallback if response is not paginated
          const data = Array.isArray(response.data)
            ? response.data
            : (response.data?.results || []);
          setPosts(data);
          setTotalCount(data.length);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching technology news:', error);
        setError('Failed to load technology news posts.');
        setPosts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await newsApi.getCategories();
        setCategories(response.data);
        console.log("Fetched Categories:", response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    const fetchAds = async () => {
      try {
        const response = await newsApi.getAdsByCategory('technology');
        console.log("Fetched Technology Ads:", response.data);
        setAds(response.data);
      } catch (error) {
        console.error('Error fetching technology ads:', error);
        setAds([]);
      } finally {
        setLoadingAds(false);
      }
    };

    fetchTechnologyNews();
    fetchCategories();
    fetchAds();
  }, [currentPage]); // Re-fetch posts when currentPage changes

  // ***** HANDLE PAGE CHANGE *****
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setSearchParams({ page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // ***** END HANDLE PAGE CHANGE *****

  const overallLoading = loading || loadingCategories || loadingAds;

  if (overallLoading) {
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

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4, mt: 4, mb: 6 }}>
        <Typography variant="h2" gutterBottom align="center" sx={{ mb: 6, fontWeight: 'bold', color: 'info.main' }}>
          Technology & Innovation
        </Typography>

        {!posts || posts.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Technology News
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No technology news posts available yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Main Content Column */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {/* Smaller Cards Grid */}
              <Grid container spacing={3}>
                {posts.slice(0, 6).map((post, index) => (
                  <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 3,
                      borderRadius: 2,
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'scale(1.02)',
                        transition: 'all 0.3s ease-in-out',
                        '& .card-overlay': { opacity: 0.1 }
                      }
                    }}>
                      <Box className="card-overlay" sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(33,150,243,0.2) 0%, rgba(76,175,80,0.2) 100%)',
                        zIndex: 1,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }} />
                      <CardMedia
                        component="img"
                        src={getImageUrl(post.featured_image)}
                        alt={post.title}
                        sx={{ 
                          height: 180, 
                          objectFit: 'cover', 
                          zIndex: 2 
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-thumbnail.jpg';
                        }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 2, zIndex: 2 }}>
                        <Chip
                          label="Tech"
                          size="small"
                          sx={{ mb: 1, bgcolor: 'info.light', color: 'info.main', fontWeight: 'medium' }}
                        />
                        <Typography variant="h6" gutterBottom sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'info.main' }}>
                          {post.title.substring(0, 50) + (post.title.length > 50 ? '...' : '')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', mb: 1 }}>
                          {post.excerpt?.substring(0, 100) + (post.excerpt?.length > 100 ? '...' : '')}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ bgcolor: 'info.main', width: 24, height: 24, fontSize: '0.75rem' }}>
                            {post.author?.username?.charAt(0).toUpperCase() || 'A'}
                          </Avatar>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(post.created_at).toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ p: 2, justifyContent: 'flex-end', zIndex: 2 }}>
                        <Button 
                          size="small" 
                          component={Link} 
                          to={`/post/${post.slug}`} 
                          color="info" 
                          variant="outlined"
                        >
                          Read More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
                {/* Loading skeletons for cards */}
                {loading && Array.from(new Array(6)).map((_, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Skeleton variant="rectangular" height={350} />
                  </Grid>
                ))}
              </Grid>

              {/* List Style Section */}
              {posts.length > 6 && (
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'info.main', mb: 3 }}>
                    More Technology News
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
                    {posts.slice(6).map((post, index) => (
                      <ListItem
                        key={post.id}
                        component={Link}
                        to={`/post/${post.slug}`}
                        sx={{
                          borderBottom: index < posts.slice(6).length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transform: 'translateX(4px)',
                            transition: 'all 0.2s ease'
                          },
                          py: 2,
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={getImageUrl(post.featured_image)}
                            alt={post.title}
                            sx={{ 
                              width: 60, 
                              height: 60, 
                              mr: 2
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-thumbnail.jpg';
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'medium', color: 'info.main' }}>
                              {post.title.substring(0, 70) + (post.title.length > 70 ? '...' : '')}
                            </Typography>
                          }
                          secondary={
                            <Stack direction="column" spacing={0.5}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                {post.excerpt?.substring(0, 120) + (post.excerpt?.length > 120 ? '...' : '')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                By {post.author?.username || 'Admin'} • {new Date(post.created_at).toLocaleDateString()}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                    {/* Loading skeletons for list */}
                    {loading && Array.from(new Array(6)).map((_, index) => (
                      <ListItem key={index} sx={{ py: 2 }}>
                        <Skeleton variant="rectangular" width={60} height={60} sx={{ mr: 2 }} />
                        <ListItemText
                          primary={<Skeleton variant="text" width="80%" height={20} />}
                          secondary={<Skeleton variant="text" width="60%" height={16} />}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* ***** PAGINATION CONTROLS ***** */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{
                      '& .MuiPagination-ul': {
                        flexWrap: 'nowrap',
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2, alignSelf: 'center' }}>
                    Page {currentPage} of {totalPages} (Total: {totalCount} posts)
                  </Typography>
                </Box>
              )}
              {/* ***** END PAGINATION CONTROLS ***** */}
            </Grid>

            {/* Tech Sidebar */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <TechSidebar ads={ads} categories={categories} />
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default TechnologyPage;