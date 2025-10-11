import React from 'react';
import { Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const CategoryNavigation = () => {
  const categories = [
    { name: 'World', path: '/world' },
    { name: 'Politics', path: '/politics' },
    { name: 'Economy', path: '/economy' },
    { name: 'Business', path: '/business' },
    { name: 'Technology', path: '/technology' },
    { name: 'Sports', path: '/sports' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        py: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        mb: 3
      }}>
        {categories.map((category) => (
          <Button
            key={category.path}
            component={Link}
            to={category.path}
            variant="outlined"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          >
            {category.name}
          </Button>
        ))}
      </Box>
    </Container>
  );
};

export default CategoryNavigation;