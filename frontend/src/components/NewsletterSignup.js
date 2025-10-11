// frontend/src/components/NewsletterSignup.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { newsApi } from '../services/api'; // Make sure this import is correct

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

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
      console.log("Attempting to subscribe email:", email); // Debug log
      const response = await newsApi.subscribeNewsletter({ email });
      console.log("Newsletter subscription response:", response.data); // Debug log
      // Handle success message from backend
      if (response.data.message) {
        setSuccess(true);
        setEmail(''); // Clear the input field
      } else {
        // Handle successful creation
        setSuccess(true);
        setEmail(''); // Clear the input field
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error); // Debug log
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.error("Backend Error Status:", error.response.status); // Debug log
        console.error("Backend Error Data:", error.response.data); // Debug log
        if (error.response.status === 400) {
          // Validation error
          const errorData = error.response.data;
          if (errorData.email) {
            setError(errorData.email[0]); // Show first email error
          } else {
            setError('Invalid input. Please check your email address.');
          }
        } else if (error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          // Other server errors
          setError(`Server error (${error.response.status}). Please try again.`);
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("Network Error - No response:", error.request); // Debug log
        setError('Network error. Please check your connection.');
      } else {
        // Something else happened
        console.error("Request Setup Error:", error.message); // Debug log
        setError('An unexpected error occurred. Please try again.');
      }
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
            Thank you for subscribing! You'll receive our next newsletter.
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1 }}
            >
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