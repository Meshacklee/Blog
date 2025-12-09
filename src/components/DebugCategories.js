import React, { useState, useEffect } from 'react';
import { newsApi } from '../services/api';

const DebugCategories = () => {
  const [categories, setCategories] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all categories
        const categoriesResponse = await newsApi.getCategories();
        setCategories(categoriesResponse.data || []);
        
        // Get all posts to see what categories they're assigned to
        const postsResponse = await newsApi.getPosts({ limit: 20 });
        setAllPosts(postsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', backgroundColor: '#f0f8ff', margin: '10px' }}>Loading debug info...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', backgroundColor: '#ffe6e6', margin: '10px' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff', margin: '10px', border: '1px solid #ccc' }}>
      <h3>Debug Information:</h3>
      
      <h4>Categories in Database:</h4>
      {categories && categories.length > 0 ? (
        categories.map(category => (
          <div key={category.id} style={{ margin: '5px 0' }}>
            Name: <strong>{category.name}</strong> | Slug: <code>{category.slug}</code>
          </div>
        ))
      ) : (
        <p>No categories found in the database</p>
      )}
      
      <h4>Sample Posts and their Categories:</h4>
      {allPosts && allPosts.length > 0 ? (
        allPosts.slice(0, 5).map(post => (
          <div key={post.id} style={{ margin: '5px 0', padding: '5px', border: '1px solid #eee' }}>
            Post: <strong>{post.title}</strong> | Category: <code>{post.category?.name}</code> | Slug: <code>{post.category?.slug}</code> | Status: <code>{post.status}</code>
          </div>
        ))
      ) : (
        <p>No posts found in the database</p>
      )}
    </div>
  );
};

export default DebugCategories;