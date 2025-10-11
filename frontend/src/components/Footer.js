// frontend/src/components/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useTheme } from '@mui/material/styles';
import NewsletterSignup from './NewsletterSignup'; // Import the new component

const Footer = () => {
  const theme = useTheme();

  // Footer navigation data
  const footerNav = [
    {
      title: 'Categories',
      items: [
        { name: 'World News', link: '/world' },
        { name: 'Politics', link: '/politics' },
        { name: 'Finance', link: '/finance' },
        { name: 'Technology', link: '/technology' },
        { name: 'Education', link: '/education' },
        { name: 'Lifestyle', link: '/lifestyle' },
      ],
    },
    {
      title: 'Company',
      items: [
        { name: 'About Us', link: '/about' },
        { name: 'Contact', link: '/contact' },
        { name: 'Careers', link: '/careers' },
        { name: 'Privacy Policy', link: '/privacy' },
        { name: 'Terms of Service', link: '/terms' },
      ],
    },
    {
      title: 'Connect',
      items: [
        { name: 'Facebook', link: 'https://facebook.com', icon: <FacebookIcon /> },
        { name: 'Twitter', link: 'https://twitter.com', icon: <TwitterIcon /> },
        { name: 'Instagram', link: 'https://instagram.com', icon: <InstagramIcon /> },
        { name: 'LinkedIn', link: 'https://linkedin.com', icon: <LinkedInIcon /> },
        { name: 'YouTube', link: 'https://youtube.com', icon: <YouTubeIcon /> },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        color: theme.palette.mode === 'light' ? 'text.primary' : 'grey.300',
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand/Description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              AFRIPEN NEWS
            </Typography>
            <Typography variant="body2" paragraph>
              Your trusted source for African and global news. Stay informed with the latest updates on politics, economics, technology, and more.
            </Typography>
            <Typography variant="body2">
              &copy; {new Date().getFullYear()} Afripen News. All rights reserved.
            </Typography>
          </Grid>

          {/* Navigation Links */}
          {footerNav.map((section) => (
            <Grid key={section.title} size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {section.title}
              </Typography>
              {section.items.map((item) => (
                <Typography key={item.name} variant="body2" sx={{ mb: 1 }}>
                  {item.icon ? (
                    <IconButton
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      sx={{ color: 'inherit', p: 0.5 }}
                    >
                      {item.icon}
                    </IconButton>
                  ) : (
                    <Link
                      href={item.link}
                      underline="hover"
                      color="inherit"
                      sx={{ display: 'block', py: 0.5 }}
                    >
                      {item.name}
                    </Link>
                  )}
                </Typography>
              ))}
            </Grid>
          ))}

          {/* Newsletter Signup */}
          <Grid size={{ xs: 12, md: 4 }}>
            <NewsletterSignup />
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Built with React & Django. Designed for a better reading experience.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

