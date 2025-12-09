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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Pagination,
  Skeleton,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Helper to build full image URL with fallback
const getImageUrl = (path) => {
  if (!path) return '/default-thumbnail.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? path : '/' + path}`;
};

const PoliticsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ***** PAGINATION STATE *****
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const postsPerPage = 15; // Increased to accommodate the split layout
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
    const fetchPoliticsNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch paginated posts for the 'politics' category
        const response = await newsApi.getPostsByCategory('politics', {
          page: currentPage,
        });

        console.log("Fetched Politics Posts:", response.data);

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
        console.error('Error fetching politics news:', error);
        setError('Failed to load politics news posts.');
        setPosts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPoliticsNews();
  }, [currentPage]); // Re-fetch posts when currentPage changes

  // ***** HANDLE PAGE CHANGE *****
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setSearchParams({ page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // ***** END HANDLE PAGE CHANGE *****

  if (loading) {
    return (
      <>
        <Header />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
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

  // Split posts: top 9 as larger cards, rest as list with thumbnails
  const topPosts = posts.slice(0, 9);
  const bottomPosts = posts.slice(9);

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4, mt: 4, mb: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{ 
            mb: 2,
            fontWeight: 'bold', 
            color: 'secondary.main', 
            fontSize: { xs: '1.5rem', sm: '1.75rem' } 
          }}
        >
          Politics News
        </Typography>

        {!posts || posts.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Politics News
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No politics news posts available yet.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Larger Tiles in Top Section */}
            <Grid container spacing={1} sx={{ mb: 2, mt: 2 }}>
              {topPosts.map((post) => (
                <Grid key={post.id} size={{ xs: 12, sm: 12, md: 4 }} sx={{ mb: 1 }}>
                  <Card
                    component={Link}
                    to={`/post/${post.slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: 210,
                      boxShadow: 1,
                      border: '3px solid',
                      borderColor: 'divider',
                      textDecoration: 'none',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      sx={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-thumbnail.jpg';
                      }}
                    />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1 }}>
                      <CardContent sx={{ p: 0, flexGrow: 1, '&:last-child': { pb: 0 } }}>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.9rem',
                            lineHeight: 1.2,
                            textDecoration: 'none',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography
                            variant="caption"
                            color="primary.main"
                            sx={{ 
                              fontSize: '0.75rem',
                              fontFamily: 'monospace',
                              backgroundColor: 'primary.50',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              border: '1px solid',
                              borderColor: 'primary.100',
                              fontWeight: 'bold'
                            }}
                          >
                            {post.slug}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 0, pt: 0.5 }}>
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.75rem',
                            minWidth: 'auto',
                            px: 1.5,
                            py: 0.25
                          }}
                        >
                          Read More
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              ))}
              {/* Loading skeletons for top section */}
              {loading && Array.from(new Array(9)).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 12, md: 4 }} sx={{ mb: 1 }}>
                  <Skeleton variant="rectangular" height={210} />
                </Grid>
              ))}
            </Grid>

            {/* Bottom Section - List with Thumbnails */}
            {bottomPosts.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1.5, 
                    color: 'text.primary',
                    fontSize: '1.1rem'
                  }}
                >
                  More Headlines
                </Typography>
                <List sx={{ py: 0 }}>
                  {bottomPosts.map((post, index) => (
                    <React.Fragment key={post.id}>
                      <ListItem
                        component={Link}
                        to={`/post/${post.slug}`}
                        sx={{ 
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            borderRadius: 1
                          }, 
                          py: 1,
                          px: 1.5,
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            variant="square"
                            src={getImageUrl(post.featured_image)}
                            alt={post.title}
                            sx={{
                              width: 80,
                              height: 60,
                              borderRadius: 1,
                              mr: 2,
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-thumbnail.jpg';
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              sx={{
                                color: 'text.primary',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                '&:hover': {
                                  color: 'primary.main',
                                },
                              }}
                            >
                              {post.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                              <Typography
                                variant="caption"
                                color="primary.main"
                                sx={{ 
                                  fontSize: '0.75rem',
                                  fontFamily: 'monospace',
                                  backgroundColor: 'primary.50',
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 0.5,
                                  fontWeight: 'medium'
                                }}
                              >
                                {post.slug}
                              </Typography>
                            </Box>
                          }
                          sx={{ my: 0 }}
                        />
                      </ListItem>
                      {index < bottomPosts.length - 1 && (
                        <Divider sx={{ my: 0.5 }} />
                      )}
                    </React.Fragment>
                  ))}
                  {/* Loading skeletons for list section */}
                  {loading && Array.from(new Array(6)).map((_, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 1, px: 1.5 }}>
                        <Skeleton variant="rectangular" width={80} height={60} sx={{ mr: 2 }} />
                        <Skeleton variant="text" width="80%" height={20} />
                      </ListItem>
                      {index < 5 && <Divider sx={{ my: 0.5 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}

            {/* ***** PAGINATION CONTROLS ***** */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
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
          </>
        )}
      </Container>
    </>
  );
};

export default PoliticsPage;