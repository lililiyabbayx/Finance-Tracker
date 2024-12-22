import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ background: '#1a237e' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceWalletIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Personal Finance
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/personal-dashboard')}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/personal-dashboard/add-entry')}
          >
            Add Entry
          </Button>
          <Button
            color="inherit"
            startIcon={<AssessmentIcon />}
            onClick={() => navigate('/personal-dashboard/reports')}
          >
            Reports
          </Button>
          <Button
            color="inherit"
            startIcon={<NotificationsIcon />}
            onClick={() => navigate('/personal-dashboard/alerts')}
          >
            Alerts
          </Button>
        </Box>

        <Avatar sx={{ bgcolor: '#303f9f' }}>U</Avatar>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
