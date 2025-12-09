import React from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemText, Divider } from '@mui/material';

const Sidebar = ({ title = "Sidebar", ads = [], news = [], newsletter = true, onAdClick, onSubscribe }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Ad Banner 1 */}
      {ads.length > 0 && ads[0] && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            height: 250, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'grey.100',
            border: '2px dashed #ccc',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'grey.200',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease'
            }
          }}
          onClick={() => onAdClick && onAdClick(ads[0])}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Advertisement
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ads[0]?.title || 'Your Ad Here'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
            >
              {ads[0]?.cta || 'Learn More'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Featured News */}
      {news.length > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Featured News
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {news.slice(0, 3).map((item, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  py: 1,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemText 
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'medium',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Ad Banner 2 */}
      {ads.length > 1 && ads[1] && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'primary.light',
            border: '2px dashed #ccc',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'primary.lighter',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease'
            }
          }}
          onClick={() => onAdClick && onAdClick(ads[1])}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="primary.contrastText" gutterBottom>
              {ads[1]?.title || 'Premium Solutions'}
            </Typography>
            <Typography variant="body2" color="primary.contrastText">
              {ads[1]?.subtitle || 'Upgrade Your Experience'}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ mt: 2, bgcolor: 'white', color: 'primary.main' }}
            >
              {ads[1]?.cta || 'Get Started'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Newsletter Subscription */}
      {newsletter && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'secondary.light',
            border: '2px dashed #ccc'
          }}
        >
          <Typography variant="h6" color="secondary.contrastText" gutterBottom>
            Newsletter
          </Typography>
          <Typography variant="body2" color="secondary.contrastText" align="center" sx={{ mb: 2 }}>
            Get the latest updates delivered to your inbox
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ bgcolor: 'white', color: 'secondary.main' }}
            onClick={onSubscribe}
          >
            Subscribe
          </Button>
        </Paper>
      )}

      {/* Ad Banner 3 */}
      {ads.length > 2 && ads[2] && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            height: 200, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            bgcolor: 'success.light',
            border: '2px dashed #ccc',
            cursor: 'pointer',
            '&:hover': {
              bgcolor: 'success.lighter',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease'
            }
          }}
          onClick={() => onAdClick && onAdClick(ads[2])}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="success.contrastText" gutterBottom>
              {ads[2]?.title || 'Special Deals'}
            </Typography>
            <Typography variant="body2" color="success.contrastText">
              {ads[2]?.subtitle || 'Limited Time Offers'}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Sidebar;