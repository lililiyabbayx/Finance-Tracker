'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  Grid,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Analytics as AnalyticsIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'

// Custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052CC',
    },
    secondary: {
      main: '#172B4D',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F4F5F7',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#172B4D',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#172B4D',
    },
    body1: {
      fontSize: '1rem',
      color: '#172B4D',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
  },
})

const Dashboard = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: 'For Businesses',
      description: 'Stay on top of expenses, track revenues, and make informed decisions with real-time analytics',
    },
    {
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      title: 'For Individuals',
      description: 'Manage your personal budget, set savings goals, and achieve financial freedom',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Insights',
      description: 'AI-powered recommendations to optimize spending and savings',
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Tracking',
      description: 'Monitor your finances with instant updates and comprehensive reporting',
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* Navigation */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Fin-Track
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" href="#features">
                  Features
                </Button>
                <Button color="inherit" href="#resources">
                  Resources
                </Button>
                <Button color="inherit" href="#docs">
                  Documentation
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            Take Control of Your Finances
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Easily organize tracking in-depth analytics and reporting, achieve clarity and confidence in every financial decision.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/signup')}
            >
              Try For Free
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        </Container>

        {/* Features Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
          <Container maxWidth="lg">
            <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
              Key Features
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: 2,
                    }}
                  >
                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: 'secondary.main', color: 'white', py: 4, mt: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Contributed by: Team Fin-Track
                </Typography>
                <Typography variant="body2">
                  Together, we're redefining how you manage your finances.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact Us:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[1, 2, 3, 4].map((num) => (
                    <Link
                      key={num}
                      href="#"
                      color="inherit"
                      underline="hover"
                      sx={{ opacity: 0.8 }}
                    >
                      link {num}
                    </Link>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default Dashboard

