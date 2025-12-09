// frontend/src/pages/SearchPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Card, CardContent, CardMedia, CardActions, Button, Grid, TextField, InputAdornment } from '@mui/material';
import { useSearchParams, Link } from 'react-router-dom';
import { newsApi } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchIcon from '@mui/icons-material/Search';

// Helper to build full image URL
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path}`;
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(query); // Local state for the input

  useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          setError(null);
          console.log("Searching for:", query);
          const response = await newsApi.searchPosts(query);
          console.log("Search results:", response.data);
          const data = Array.isArray(response.data)
            ? response.data
            : (response.data?.results || []);
          setPosts(data);
        } catch (error) {
          console.error('Error fetching search results:', error);
          setError('Failed to load search results.');
          setPosts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      setLoading(false);
      setPosts([]);
    }
  }, [query]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // This will trigger a navigation via the SearchBar component or you can use navigate here
    // For simplicity, we'll assume the search term is passed via URL params
    // In a real app, you might use `useNavigate` from `react-router-dom` to push the new URL
    window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Search Results
        </Typography>

        {/* Search Input Bar */}
        <Box sx={{ mb: 4 }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for news, topics, keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
            />
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button type="submit" variant="contained" size="large">
                Search
              </Button>
            </Box>
          </form>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please try again later.
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
              {posts.length > 0
                ? `Found ${posts.length} result${posts.length > 1 ? 's' : ''} for "${query}"`
                : `No results found for "${query}".`}
            </Typography>

            {posts.length > 0 ? (
              <Grid container spacing={4}>
                {posts.map((post) => (
                  <Grid key={post.id} size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {post.featured_image ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={getImageUrl(post.featured_image)}
                          alt={post.title}
                          sx={{ objectFit: 'cover' }}
                          onError={(e) => {
                            console.error("Search result image failed to load:", post.featured_image);
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <Box sx={{ height: 200, bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" color="text.secondary">No Image</Typography>
                        </Box>
                      )}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {post.excerpt?.substring(0, 150)}...
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          In {post.category?.name || 'Uncategorized'} • {new Date(post.created_at).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" component={Link} to={`/post/${post.slug}`}>
                          Read More
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search terms.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default SearchPage;