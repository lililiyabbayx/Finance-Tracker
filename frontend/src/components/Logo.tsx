import React from 'react';
import { Box, Typography } from '@mui/material';
import { MonetizationOn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

interface LogoProps {
  variant?: 'default' | 'small';
}

const Logo: React.FC<LogoProps> = ({ variant = 'default' }) => {
  const theme = useTheme();
  const isSmall = variant === 'small';

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={0.8}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          '& .logo-icon': {
            color: theme.palette.primary.main,
            transform: 'scale(1.1)',
          },
          '& .logo-text': {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <MonetizationOn
        className="logo-icon"
        sx={{
          fontSize: isSmall ? '2rem' : '2.5rem',
          color: theme.palette.text.primary,
          transition: 'all 0.2s ease-in-out',
        }}
      />
      <Typography
        className="logo-text"
        variant={isSmall ? 'h4' : 'h3'}
        component="span"
        sx={{
          fontWeight: 700,
          color: theme.palette.text.primary,
          transition: 'color 0.2s ease-in-out',
          fontSize: isSmall ? '1.8rem' : '2.2rem',
          letterSpacing: '0.5px',
          fontFamily: theme.typography.fontFamily,
          textTransform: 'none',
          marginLeft: '4px',
          lineHeight: 1,
        }}
      >
        FinTrack
      </Typography>
    </Box>
  );
};

export default Logo;
