// frontend/src/services/api.js
import axios from 'axios';

// Use VERCEL env var in production, fallback to localhost for development
// Vercel will inject the actual backend URL during build/runtime
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

console.log("API Base URL being used:", API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const newsApi = {
  // Posts
  getPosts: (params = {}) => api.get('/posts/', { params }),
  getPost: (slug) => api.get(`/posts/${slug}/`),
  getFeaturedPosts: () => api.get('/posts/featured/'),
  getTrendingPosts: () => api.get('/posts/trending/'),
  getPostsByCategory: (categorySlug) => api.get(`/posts/category/${categorySlug}/`),

  // Ads
  getAds: (params = {}) => api.get('/ads/', { params }),
  getAdsByCategory: (categorySlug) => api.get('/ads/', { params: { category: categorySlug } }),

  // Categories
  getCategories: () => api.get('/categories/'),

  // Commentss
  createComment: (postData) => api.post('/comments/create/', postData),
};

export default api;

