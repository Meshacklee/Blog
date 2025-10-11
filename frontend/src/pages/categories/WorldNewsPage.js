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
  Pagination,
  Skeleton,
  Divider,
  Avatar,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { newsApi } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Helper to build full image URL with fallback
const getImageUrl = (path) => {
  if (!path) return '/default-thumbnail.webp';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? path : '/' + path}`;
};

const WorldNewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [error, setError] = useState(null);

  // ***** PAGINATION STATE *****
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const postsPerPage = 10;
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
    const fetchWorldNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch paginated posts for the 'worldnews' category
        const response = await newsApi.getPostsByCategory('worldnews', {
          page: currentPage,
        });

        console.log("World News API Response:", response.data);

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
        console.error('Error fetching world news:', error);
        setError('Failed to load world news posts.');
        setPosts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    const fetchAds = async () => {
      try {
        setLoadingAds(true);
        const response = await newsApi.getAdsByCategory('worldnews');
        setAds(response.data);
      } catch (error) {
        console.error('Error fetching ads:', error);
        setAds([]);
      } finally {
        setLoadingAds(false);
      }
    };

    const fetchTrending = async () => {
      try {
        setLoadingTrending(true);
        const response = await newsApi.getTrendingPosts({ limit: 6 });
        setTrendingPosts(response.data);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setTrendingPosts([]);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchWorldNews();
    fetchAds();
    fetchTrending();
  }, [currentPage]);

  // ***** HANDLE PAGE CHANGE *****
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setSearchParams({ page: value });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // ***** END HANDLE PAGE CHANGE *****

  const overallLoading = loading || loadingAds || loadingTrending;

  if (overallLoading) {
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

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Typography
          variant="h5"
          gutterBottom
          align="center"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '1.5rem', sm: '1.75rem' },
            textShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          World News
        </Typography>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Top Section: 6 Moderately Sized Cards (2 Rows of 3) */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {posts.slice(0, 6).map((post) => (
                <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    component={Link}
                    to={`/post/${post.slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: 300,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
                      textDecoration: 'none',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,150,0.2)',
                        transform: 'scale(1.03)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      sx={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                        objectPosition: 'center',
                        aspectRatio: '16/9',
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-thumbnail.webp';
                      }}
                    />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 1, px: 2 }}>
                      <CardContent sx={{ p: 0, flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '1.1rem',
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.85rem',
                          }}
                        >
                          {post.excerpt?.substring(0, 50) || 'Explore global news insights'}...
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ p: 0, pt: 0.5 }}>
                        <Button
                          size="small"
                          color="primary"
                          sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}
                        >
                          Read
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                </Grid>
              ))}
              {/* Loading skeletons for top section */}
              {loading && Array.from(new Array(6)).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rectangular" height={300} />
                </Grid>
              ))}
            </Grid>

            {/* Bottom Section: Tiny Cards, 4 in a Row */}
            {posts.slice(6).length > 0 && (
              <Box sx={{ py: 3 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'primary.dark',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  More World News
                </Typography>
                <Grid container spacing={2}>
                  {posts.slice(6).map((post) => (
                    <Grid key={post.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        component={Link}
                        to={`/post/${post.slug}`}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          height: 180,
                          borderRadius: 2,
                          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                          background: 'linear-gradient(135deg, #302626ff, #f0f4f8)',
                          textDecoration: 'none',
                          '&:hover': {
                            boxShadow: '0 5px 12px rgba(0,0,150,0.15)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease',
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          sx={{
                            width: '100%',
                            height: 80,
                            objectFit: 'cover',
                            objectPosition: 'center',
                            aspectRatio: '16/9',
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-thumbnail.webp';
                          }}
                        />
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 1, px: 2 }}>
                          <CardContent sx={{ p: 0, flexGrow: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontSize: '0.9rem',
                              }}
                            >
                              {post.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontSize: '0.75rem',
                              }}
                            >
                              {post.excerpt?.substring(0, 50) || 'Discover more world events'}...
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ p: 0, pt: 0.5 }}>
                            <Button
                              size="small"
                              color="primary"
                              sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}
                            >
                              Read
                            </Button>
                          </CardActions>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                  {/* Loading skeletons for bottom section */}
                  {loading && Array.from(new Array(4)).map((_, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Skeleton variant="rectangular" height={180} />
                    </Grid>
                  ))}
                </Grid>
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
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* Ads Section */}
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Sponsored
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {ads.length > 0 ? (
                  ads.map((ad) => (
                    <Box
                      key={ad.id}
                      component="a"
                      href={ad.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'block',
                        mb: 2,
                        textDecoration: 'none',
                        position: 'relative',
                        '&:hover': { opacity: 0.8 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        src={getImageUrl(ad.image_url)}
                        alt={ad.title}
                        sx={{
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain',
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          aspectRatio: '16/9',
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-thumbnail.webp';
                        }}
                      />
                      {ad.title && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            maxWidth: '80%',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textAlign: 'center',
                          }}
                        >
                          {ad.title}
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ py: 2, fontStyle: 'italic' }}
                  >
                    No ads available at the moment.
                  </Typography>
                )}
              </Box>

              {/* Trending Section */}
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'secondary.main' }}
                >
                  Trending Posts
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {trendingPosts.length > 0 ? (
                  trendingPosts.map((post) => (
                    <Card key={post.id} sx={{ mb: 1, boxShadow: 1, display: 'flex', alignItems: 'center', p: 1 }}>
                      <Avatar
                        variant="rounded"
                        src={getImageUrl(post.featured_image)}
                        alt={post.title}
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          aspectRatio: '1/1',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-thumbnail.webp';
                        }}
                      />
                      <CardContent sx={{ p: 0, flexGrow: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'medium',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          <Link to={`/post/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {post.title}
                          </Link>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.created_at).toLocaleDateString()} | {post.views_count || 0} views
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ py: 2, fontStyle: 'italic' }}
                  >
                    No trending posts at the moment.
                  </Typography>
                )}
                {/* Loading skeletons for trending section */}
                {loadingTrending && Array.from(new Array(6)).map((_, index) => (
                  <Card key={index} sx={{ mb: 1, boxShadow: 1, display: 'flex', alignItems: 'center', p: 1 }}>
                    <Skeleton variant="rectangular" width={60} height={60} sx={{ mr: 2 }} />
                    <CardContent sx={{ p: 0, flexGrow: 1 }}>
                      <Skeleton variant="text" width="80%" height={20} />
                      <Skeleton variant="text" width="60%" height={16} />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default WorldNewsPage;