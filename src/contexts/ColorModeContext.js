// frontend/src/contexts/ColorModeContext.js
import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create the context
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Provider component
export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light'); // Default to light mode

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Create the theme instance based on the current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode palette
                primary: {
                  main: '#1976d2', // Default blue
                },
                secondary: {
                  main: '#e53935', // Default red
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
              }
            : {
                // Dark mode palette
                primary: {
                  main: '#90caf9', // Lighter blue for dark mode
                },
                secondary: {
                  main: '#f48fb1', // Lighter red/pink for dark mode
                },
                background: {
                  default: '#121212', // Very dark background
                  paper: '#1e1e1e',   // Slightly lighter for cards/paper
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#aaaaaa',
                },
              }),
        },
        // You can add other theme customizations here
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontSize: '2.5rem', fontWeight: 600 },
          h2: { fontSize: '2rem', fontWeight: 600 },
          h3: { fontSize: '1.75rem', fontWeight: 500 },
          h4: { fontSize: '1.5rem', fontWeight: 500 },
          h5: { fontSize: '1.25rem', fontWeight: 500 },
          h6: { fontSize: '1.1rem', fontWeight: 500 },
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                // AppBar background adjusts based on mode
                ...(mode === 'light' ? { backgroundColor: '#1976d2' } : { backgroundColor: '#1e1e1e' }),
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        {/* CssBaseline is typically in App.js, but can be here if preferred */}
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};