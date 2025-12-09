// frontend/src/components/TechSidebar.js
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';

// Social Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Category Icons
import ComputerIcon from '@mui/icons-material/Computer';
import GavelIcon from '@mui/icons-material/Gavel';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StyleIcon from '@mui/icons-material/Style';

// Newsletter
import NewsletterSignup from './NewsletterSignup'; // ✅ Make sure this exists

// Helper for backend image paths
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://127.0.0.1:8000${path.startsWith('/') ? path : `/${path}`}`;
};

const categories = [
  { name: 'Technology', slug: 'technology', icon: <ComputerIcon /> },
  { name: 'Politics', slug: 'politics', icon: <GavelIcon /> },
  { name: 'World News', slug: 'world-news', icon: <PublicIcon /> },
  { name: 'Finance', slug: 'finance', icon: <AttachMoneyIcon /> },
  { name: 'Education', slug: 'education', icon: <SchoolIcon /> },
  { name: 'Trends', slug: 'trends', icon: <TrendingUpIcon /> },
  { name: 'Lifestyle', slug: 'lifestyle', icon: <StyleIcon /> },
];

const TechSidebar = ({ ads = [] }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* === Ad Banner 1 === */}
      {ads.length > 0 && ads[0] && (
        <Paper
          component="a"
          href={ads[0]?.target_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          elevation={4}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            height: 200,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src={getImageUrl(ads[0].image_url)}
            alt={ads[0].title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.7)',
              transition: '0.3s ease',
              '&:hover': { filter: 'brightness(0.9)' },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              color: 'white',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {ads[0]?.title || 'Sponsored Ad'}
            </Typography>
            <Button variant="contained" size="small" sx={{ mt: 1 }}>
              {ads[0]?.cta || 'Learn More'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* === Social & Discovery === */}
      <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: 'primary.main', fontWeight: 'bold' }}
        >
          <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Social & Discovery
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
          {[
            { icon: <FacebookIcon />, link: 'https://facebook.com' },
            { icon: <TwitterIcon />, link: 'https://twitter.com' },
            { icon: <LinkedInIcon />, link: 'https://linkedin.com' },
          ].map((social, i) => (
            <IconButton
              key={i}
              component="a"
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                border: '1px solid',
                borderColor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" align="center">
          Follow us for the latest updates!
        </Typography>
      </Paper>

      {/* === Categories List === */}
      <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: 'secondary.main', fontWeight: 'bold' }}
        >
          Categories
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {categories.map((category) => (
          <Box
            key={category.slug}
            component={Link}
            to={`/category/${category.slug}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              borderRadius: 1,
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Box sx={{ color: 'secondary.main' }}>{category.icon}</Box>
            <Typography variant="body2" fontWeight="medium">
              {category.name}
            </Typography>
          </Box>
        ))}
      </Paper>

      {/* === Newsletter Signup === */}
      <NewsletterSignup />

      {/* === Ad Banner 2 === */}
      {ads.length > 1 && ads[1] && (
        <Paper
          component="a"
          href={ads[1]?.target_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          elevation={4}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            height: 200,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <Box
            component="img"
            src={getImageUrl(ads[1].image_url)}
            alt={ads[1].title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.7)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              color: 'white',
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {ads[1]?.title || 'Promoted'}
            </Typography>
            <Button variant="contained" size="small" sx={{ mt: 1 }}>
              {ads[1]?.cta || 'Shop Now'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TechSidebar;
