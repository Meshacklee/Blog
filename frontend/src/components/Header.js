// frontend/src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  styled,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
  Switch,
  FormGroup,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
  Autocomplete, // Add Autocomplete import
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ColorModeContext } from '../contexts/ColorModeContext';
import { newsApi } from '../services/api'; // Import newsApi

// --- Styled Components ---
const LogoLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(2),
  flexGrow: { xs: 1, md: 0 },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

const NavLinksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const NavLink = styled(Button)(({ theme }) => ({
  color: 'inherit',
  my: 1,
  mx: 1.5,
  '&:hover': {
    color: theme.palette.secondary.main,
    backgroundColor: 'transparent',
  },
}));

const RightSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
  flexShrink: 0,
}));

const ModeSwitchContainer = styled(FormGroup)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  mr: 1,
}));

const StyledMenuIcon = styled(MenuIcon)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  maxWidth: 400,
  mx: 2,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));
// --- End Styled Components ---

const Header = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);

  // Fetch search suggestions with debouncing
  useEffect(() => {
    const fetchSuggestions = async (query) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoadingSuggestions(true);
      try {
        const response = await newsApi.searchPosts(query, { limit: 5 });
        const data = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.results || []);
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const handler = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleSearchChange = (event, newValue) => {
    if (typeof newValue === 'string') {
      setSearchQuery(newValue);
    } else if (newValue && newValue.title) {
      // When a suggestion is selected, navigate directly to the post
      navigate(`/post/${newValue.slug}`);
      setSearchQuery('');
      setSuggestions([]);
      setMobileSearchOpen(false);
    } else {
      setSearchQuery(newValue || '');
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSuggestions([]);
      setMobileSearchOpen(false);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'World News', path: '/world' },
    { name: 'Politics', path: '/politics' },
    { name: 'Finance', path: '/finance' },
    { name: 'Technology', path: '/technology' },
    { name: 'Education', path: '/education' },
    { name: 'Lifestyle', path: '/lifestyle' },
  ];

  // Custom filter for Autocomplete - search in title and excerpt
  const filterOptions = (options, { inputValue }) => {
    return options.filter(option =>
      option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      (option.excerpt && option.excerpt.toLowerCase().includes(inputValue.toLowerCase()))
    );
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="primary"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      >
        <Toolbar sx={{ display: 'flex', alignItems: 'center', pr: { xs: 1, sm: 2 } }}>
          {/* Logo / Site Title */}
          <LogoLink to="/">
            <LogoText variant="h6" component="div">
              AFRIPEN NEWS
            </LogoText>
          </LogoLink>

          {/* Desktop Navigation Links */}
          <NavLinksContainer>
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                component={Link}
                to={item.path}
                onClick={handleMobileMenuClose}
              >
                {item.name}
              </NavLink>
            ))}
          </NavLinksContainer>

          {/* Desktop Search Bar with Autocomplete */}
          <SearchBarContainer>
            <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
              <Autocomplete
                freeSolo
                disableClearable
                options={suggestions}
                getOptionLabel={(option) => 
                  typeof option === 'string' ? option : option.title
                }
                filterOptions={filterOptions}
                inputValue={searchQuery}
                onInputChange={handleSearchChange}
                onChange={(event, newValue) => {
                  handleSearchChange(event, newValue);
                }}
                loading={loadingSuggestions}
                renderOption={(props, option) => (
                  <Box 
                    component="li" 
                    {...props}
                    sx={{ 
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {option.title}
                      </Typography>
                      {option.excerpt && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {option.excerpt.substring(0, 60)}...
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search news..."
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      },
                    }}
                    sx={{
                      '& .MuiInputBase-root': { color: 'white' },
                      '& .MuiSvgIcon-root': { color: 'white' },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  />
                )}
                sx={{
                  '& .MuiAutocomplete-popper': {
                    backgroundColor: 'red !important',
                  },
                }}
              />
            </form>
          </SearchBarContainer>

          {/* Right Section */}
          <RightSection>
            {/* Mobile Search Button */}
            <IconButton
              color="inherit"
              aria-label="Search"
              onClick={() => setMobileSearchOpen(true)}
              sx={{ mr: 1, display: { xs: 'inline-flex', md: 'none' } }}
            >
              <SearchIcon />
            </IconButton>

            {/* Theme Switch */}
            <ModeSwitchContainer>
              {theme.palette.mode === 'dark' ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" />
              )}
              <Switch
                checked={theme.palette.mode === 'dark'}
                onChange={colorMode.toggleColorMode}
                color="default"
                inputProps={{ 'aria-label': 'Toggle light/dark mode' }}
                size="small"
              />
            </ModeSwitchContainer>

            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              sx={{ ml: 1 }}
            >
              <StyledMenuIcon />
            </IconButton>
          </RightSection>
        </Toolbar>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id="mobile-menu"
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.name}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={{ minWidth: 200 }}
            >
              {item.name}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem>
            <ModeSwitchContainer>
              {theme.palette.mode === 'dark' ? (
                <DarkModeIcon fontSize="small" sx={{ mr: 1 }} />
              ) : (
                <LightModeIcon fontSize="small" sx={{ mr: 1 }} />
              )}
              <Switch
                checked={theme.palette.mode === 'dark'}
                onChange={colorMode.toggleColorMode}
                color="default"
                inputProps={{ 'aria-label': 'Toggle light/dark mode' }}
                size="small"
              />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {theme.palette.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            </ModeSwitchContainer>
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Mobile Search Dialog with Autocomplete */}
      <Dialog
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        fullScreen
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Search
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent sx={{ pt: 2 }}>
          <form onSubmit={handleSearchSubmit}>
            <Autocomplete
              freeSolo
              disableClearable
              options={suggestions}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : option.title
              }
              filterOptions={filterOptions}
              inputValue={searchQuery}
              onInputChange={handleSearchChange}
              onChange={(event, newValue) => {
                handleSearchChange(event, newValue);
              }}
              loading={loadingSuggestions}
              renderOption={(props, option) => (
                <Box 
                  component="li" 
                  {...props}
                  sx={{ 
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {option.title}
                    </Typography>
                    {option.excerpt && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {option.excerpt.substring(0, 60)}...
                      </Typography>
                    )}
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  margin="dense"
                  label="Search news..."
                  type="text"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMobileSearchOpen(false)}>Cancel</Button>
          <Button onClick={handleSearchSubmit} variant="contained">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;