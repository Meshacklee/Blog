import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { newsApi } from '../services/api';
import FeaturedCarousel from '../components/FeaturedCarousel';
import WorldNewsList from '../components/WorldNewsList';
import DefaultGrid from '../components/DefaultGrid';

const Home = () => {
  const [worldPosts, setWorldPosts] = useState([]);
  const [politicsPosts, setPoliticsPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [worldLoading, setWorldLoading] = useState(true);
  const [politicsLoading, setPoliticsLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch World News posts
        const worldResponse = await newsApi.getPostsByCategory('worldnews');
        const worldData = Array.isArray(worldResponse.data) 
          ? worldResponse.data 
          : (worldResponse.data?.results || []);
        setWorldPosts(worldData);

        // Fetch Politics posts
        const politicsResponse = await newsApi.getPostsByCategory('politics');
        const politicsData = Array.isArray(politicsResponse.data) 
          ? politicsResponse.data 
          : (politicsResponse.data?.results || []);
        setPoliticsPosts(politicsData);

        // Fetch featured posts (limit to 10)
        try {
          const featuredResponse = await newsApi.getFeaturedPosts();
          const featuredData = Array.isArray(featuredResponse.data) 
            ? featuredResponse.data 
            : (featuredResponse.data?.results || []);
          // Limit to first 10 featured posts
          setFeaturedPosts(featuredData.slice(0, 10));
        } catch (error) {
          console.error('Error fetching featured posts:', error);
          // fallback to latest posts if featured endpoint fails
          const postsResponse = await newsApi.getPosts({ limit: 10 }); // Get exactly 10 posts
          const fallbackData = Array.isArray(postsResponse.data) 
            ? postsResponse.data 
            : (postsResponse.data?.results || []);
          setFeaturedPosts(fallbackData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setWorldLoading(false);
        setPoliticsLoading(false);
        setFeaturedLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Featured Posts Section - Sliding Carousel (limited to 10 posts) */}
      <FeaturedCarousel posts={featuredPosts} loading={featuredLoading} />
      
      {/* World News Section - Unique List-Card Layout */}
      <WorldNewsList posts={worldPosts} loading={worldLoading} title="World News" />
      
      {/* Politics Section - Default Grid Layout */}
      <DefaultGrid posts={politicsPosts} loading={politicsLoading} title="Politics" categorySlug="politics" />
    </Container>
  );
};

export default Home;