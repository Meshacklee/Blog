// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api'; // Make sure this matches your Django backend URL

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
  getPostsByCategory: (categorySlug, params = {}) => api.get(`/posts/category/${categorySlug}/`, { params }),
  
  // Categories
  getCategories: () => api.get('/categories/'),
  
  // Ads
  getAds: (params = {}) => api.get('/ads/', { params }),
  getAdsByCategory: (categorySlug) => api.get('/ads/', { params: { category: categorySlug } }),
  
  // Comments
  createComment: (postData) => api.post('/comments/create/', postData),
  
  // ***** NEWSLETTER *****
  subscribeNewsletter: (emailData) => {
    console.log("Calling subscribeNewsletter with data:", emailData); // Debug log
    return api.post('/newsletter/subscribe/', emailData);
  },
  // ***** END NEWSLETTER *****
};

export default api;