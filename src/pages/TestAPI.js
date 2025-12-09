import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';

const TestAPI = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (url, name) => {
    try {
      setLoading(true);
      console.log(`Testing: ${url}`);
      const response = await fetch(url);
      const result = await response.json();
      setData(prev => ({
        ...prev,
        [name]: { success: true, data: result, status: response.status }
      }));
      console.log(`${name} response:`, result);
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      setData(prev => ({
        ...prev,
        [name]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>API Test Page</Typography>
      
      <Button 
        variant="contained" 
        onClick={() => testEndpoint('http://localhost:8000/api/categories/', 'categories')}
        sx={{ mr: 1, mb: 1 }}
      >
        Test Categories
      </Button>
      
      <Button 
        variant="contained" 
        onClick={() => testEndpoint('http://localhost:8000/api/posts/', 'posts')}
        sx={{ mr: 1, mb: 1 }}
      >
        Test Posts
      </Button>
      
      <Button 
        variant="contained" 
        onClick={() => testEndpoint('http://localhost:8000/api/posts/category/worldnews/', 'worldnews')}
        sx={{ mr: 1, mb: 1 }}
      >
        Test World News
      </Button>
      
      <Button 
        variant="contained" 
        onClick={() => testEndpoint('http://localhost:8000/api/posts/category/politics/', 'politics')}
        sx={{ mr: 1, mb: 1 }}
      >
        Test Politics
      </Button>

      <div style={{ marginTop: '20px' }}>
        <h3>Results:</h3>
        {Object.keys(data).map(key => (
          <div key={key} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <h4>{key}:</h4>
            <pre>{JSON.stringify(data[key], null, 2)}</pre>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TestAPI;