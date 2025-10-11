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

const LifestylePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    const fetchLifestyleNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch paginated posts for the 'lifestyle' category
        const response = await newsApi.getPostsByCategory('lifestyle', {
          page: currentPage,
        });

        console.log("Lifestyle News API Response:", response.data);

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
        console.error('Error fetching lifestyle news:', error);
        setError('Failed to load lifestyle news posts.');
        setPosts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleNews();
  }, [currentPage]);

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

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Typography 
          variant="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: 6, 
            fontWeight: 'bold', 
            color: 'warning.main',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Lifestyle & Culture
        </Typography>

        {!posts || posts.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Lifestyle News
            </Typography>
            <Typography variant="body1" color="text.secondary">
              No lifestyle news posts available yet.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Featured Lifestyle - Magazine Cover Style */}
            {posts[0] && (
              <Box sx={{ mb: 6, position: 'relative' }}>
                <Card sx={{
                  boxShadow: 4,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardMedia
                    component="img"
                    src={getImageUrl(posts[0].featured_image)}
                    alt={posts[0].title}
                    sx={{ 
                      height: 400,
                      width: '100%',
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
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    p: 3
                  }}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                      {posts[0].title}
                    </Typography>
                    <Typography variant="h6" paragraph sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                      {posts[0].excerpt?.substring(0, 200) || 'Discover the latest lifestyle trends and cultural insights'}...
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                        By {posts[0].author?.username || 'Admin'} • {new Date(posts[0].created_at).toLocaleDateString()}
                      </Typography>
                      <Button size="large" variant="contained" color="warning" component={Link} to={`/post/${posts[0].slug}`}>
                        Read Story
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
            )}

            {/* Lifestyle News Grid - Magazine Layout */}
            <Grid container spacing={4}>
              {posts.slice(1).map((post) => (
                <Grid key={post.id} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      src={getImageUrl(post.featured_image)}
                      alt={post.title}
                      sx={{ 
                        height: 250,
                        width: '100%',
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
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {post.excerpt?.substring(0, 120) || 'Explore lifestyle stories and cultural highlights'}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small" component={Link} to={`/post/${post.slug}`} color="warning">
                        Explore
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
              {/* Loading skeletons */}
              {loading && Array.from(new Array(6)).map((_, index) => (
                <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                  <Skeleton variant="rectangular" height={400} />
                </Grid>
              ))}
            </Grid>

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
          </>
        )}
      </Container>
    </>
  );
};

export default LifestylePage;