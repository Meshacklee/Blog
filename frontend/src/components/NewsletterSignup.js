import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { newsApi } from '../services/api';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await newsApi.subscribeNewsletter({ email });
      if (response.data.message) {
        setSuccess(true);
        setEmail('');
      } else {
        setSuccess(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Subscribe to Newsletter
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Get the latest news and updates delivered directly to your inbox.
        </Typography>

        {success ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Thank you for subscribing!
          </Alert>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Your Email Address"
              type="email"
              variant="outlined"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              required
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1 }}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', p: 2 }}>
        <Typography variant="caption" color="text.secondary" align="center">
          We respect your privacy. Unsubscribe at any time.
        </Typography>
      </CardActions>
    </Card>
  );
};

export default NewsletterSignup;