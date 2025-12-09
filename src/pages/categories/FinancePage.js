import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Pagination,
  Skeleton,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { newsApi } from "../../services/api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Helper to build full image URL with fallback
const getImageUrl = (path) => {
  if (!path) return '/default-thumbnail.webp';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? path : '/' + path}`;
};

const FinancePage = () => {
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
    const pageParam = searchParams.get("page");
    const pageNumber = parseInt(pageParam, 10) || 1;
    setCurrentPage(pageNumber);
  }, [searchParams]);

  useEffect(() => {
    const fetchFinanceNews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch paginated posts for the 'finance' category
        const response = await newsApi.getPostsByCategory("finance", {
          page: currentPage,
        });

        console.log("Finance News API Response:", response.data);

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
            : response.data?.results || [];
          setPosts(data);
          setTotalCount(data.length);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching finance news:", error);
        setError("Failed to load finance news posts.");
        setPosts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceNews();
  }, [currentPage]);

  // ***** HANDLE PAGE CHANGE *****
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    setSearchParams({ page: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ***** END HANDLE PAGE CHANGE *****

  if (loading) {
    return (
      <>
        <Header />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
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

  // Calculate posts for different sections based on current page data
  const topPosts = posts.slice(0, 4);
  const bottomPosts = posts.slice(4);

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
            fontWeight: "bold",
            color: "success.main",
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
            textShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          Finance & Markets
        </Typography>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 12 }}>
            {!posts || posts.length === 0 ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  Finance News
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No finance news posts available yet.
                </Typography>
              </Box>
            ) : (
              <>
                {/* Top Section: 4 Moderately Sized Cards in a Row */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {topPosts.map((post) => (
                    <Grid key={post.id} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Card
                        component={Link}
                        to={`/post/${post.slug}`}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          height: 200,
                          borderRadius: 2,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          background: "linear-gradient(135deg, #ffffff, #e8f5e9)",
                          textDecoration: "none",
                          "&:hover": {
                            boxShadow: "0 6px 16px rgba(0,255,0,0.2)",
                            transform: "scale(1.03)",
                            transition: "all 0.3s ease",
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          sx={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            objectPosition: "center",
                            m: 1,
                            aspectRatio: '1/1',
                          }}
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-thumbnail.webp';
                          }}
                        />
                        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", py: 1, px: 2 }}>
                          <CardContent sx={{ p: 0, flexGrow: 1 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: "bold",
                                color: "success.main",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontSize: "1.1rem",
                              }}
                            >
                              {post.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontSize: "0.85rem",
                              }}
                            >
                              {post.excerpt?.substring(0, 50) || "Discover the latest finance trends"}...
                            </Typography>
                          </CardContent>
                          <CardActions sx={{ p: 0, pt: 0.5 }}>
                            <Button
                              size="small"
                              color="success"
                              sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                            >
                              Read
                            </Button>
                          </CardActions>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                  {/* Loading skeletons for top section */}
                  {loading && Array.from(new Array(4)).map((_, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Skeleton variant="rectangular" height={200} />
                    </Grid>
                  ))}
                </Grid>

                {/* Bottom Section: Tiny Cards, 4 in a Row */}
                {bottomPosts.length > 0 && (
                  <Box sx={{ py: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        mb: 3,
                        fontWeight: "bold",
                        color: "success.dark",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      More Finance Updates
                    </Typography>
                    <Grid container spacing={2}>
                      {bottomPosts.map((post) => (
                        <Grid key={post.id} size={{ xs: 12, sm: 6, md: 3 }}>
                          <Card
                            component={Link}
                            to={`/post/${post.slug}`}
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              height: 100,
                              borderRadius: 2,
                              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                              background: "linear-gradient(135deg, #ffffff, #f0f4f8)",
                              textDecoration: "none",
                              "&:hover": {
                                boxShadow: "0 5px 12px rgba(0,255,0,0.15)",
                                transform: "translateY(-2px)",
                                transition: "all 0.3s ease",
                              },
                            }}
                          >
                            <CardMedia
                              component="img"
                              src={getImageUrl(post.featured_image)}
                              alt={post.title}
                              sx={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                objectPosition: "center",
                                m: 1,
                                aspectRatio: '1/1',
                              }}
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-thumbnail.webp';
                              }}
                            />
                            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", py: 1, px: 2 }}>
                              <CardContent sx={{ p: 0, flexGrow: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: "bold",
                                    color: "success.main",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  {post.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    mt: 0.5,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {post.excerpt?.substring(0, 50) || "Explore more finance insights"}...
                                </Typography>
                              </CardContent>
                              <CardActions sx={{ p: 0, pt: 0.5 }}>
                                <Button
                                  size="small"
                                  color="success"
                                  sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
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
                          <Skeleton variant="rectangular" height={100} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* ***** PAGINATION CONTROLS ***** */}
                {totalPages > 1 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
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
                        "& .MuiPagination-ul": {
                          flexWrap: "nowrap",
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2, alignSelf: "center" }}>
                      Page {currentPage} of {totalPages} (Total: {totalCount} posts)
                    </Typography>
                  </Box>
                )}
                {/* ***** END PAGINATION CONTROLS ***** */}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default FinancePage;