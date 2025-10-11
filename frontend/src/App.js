// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeProvider } from './contexts/ColorModeContext';
import { Box } from '@mui/material'; // Import Box here
import Home from './pages/Home';
import WorldNewsPage from './pages/categories/WorldNewsPage';
import PoliticsPage from './pages/categories/PoliticsPage';
import FinancePage from './pages/categories/FinancePage';
import TechnologyPage from './pages/categories/TechnologyPage';
import EducationPage from './pages/categories/EducationPage';
import LifestylePage from './pages/categories/LifestylePage';
import PostDetail from './pages/PostDetail';
import SearchPage from './pages/SearchPage';

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ColorModeProvider>
      <CssBaseline />
      {/* Add a wrapper div to help with footer positioning */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/world" element={<WorldNewsPage />} />
            <Route path="/politics" element={<PoliticsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/lifestyle" element={<LifestylePage />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Router>
      </Box>
    </ColorModeProvider>
  );
}

export default App;