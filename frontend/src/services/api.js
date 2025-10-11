import axios from 'axios';

// ✅ Use the Railway API in production, and localhost when developing locally
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

console.log("✅ API Base URL being used:", API_BASE_URL); // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Handle API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// ✅ API endpoints
export const newsApi = {
  // Posts
  getPosts: (params = {}) => api.get('/posts/', { params }),
  getPost: (slug) => api.get(`/posts/${slug}/`),
  getFeaturedPosts: () => api.get('/posts/featured/'),
  getTrendingPosts: () => api.get('/posts/trending/'),
  getPostsByCategory: (categorySlug) =>
    api.get(`/posts/category/${categorySlug}/`),

  // Ads
  getAds: (params = {}) => api.get('/ads/', { params }),
  getAdsByCategory: (categorySlug) =>
    api.get('/ads/', { params: { category: categorySlug } }),

  // Categories
  getCategories: () => api.get('/categories/'),

  // Comments
  createComment: (postData) => api.post('/comments/create/', postData),
};

export default api;
