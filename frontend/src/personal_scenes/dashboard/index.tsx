import { Box, Typography, Button, Card, CardContent, Grid, IconButton, Tooltip } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';

const dataExpenses = [
  { name: 'Food', value: 400, color: '#2196F3' },
  { name: 'Rent', value: 600, color: '#4CAF50' },
  { name: 'Entertainment', value: 200, color: '#FFC107' },
  { name: 'Transport', value: 300, color: '#F44336' },
];

const dataMonthly = [
  { name: 'Jan', Budget: 1000, Expense: 1200 },
  { name: 'Feb', Budget: 1100, Expense: 1050 },
  { name: 'Mar', Budget: 1200, Expense: 1300 },
  { name: 'Apr', Budget: 1150, Expense: 900 },
];

const dataTrends = [
  { month: 'Jan', Savings: 200 },
  { month: 'Feb', Savings: 50 },
  { month: 'Mar', Savings: -100 },
  { month: 'Apr', Savings: 250 },
];

const PersonalDashboard = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      
      <Box sx={{ padding: '2rem' }}>
        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Typography variant="h6">Total Balance</Typography>
                <Typography variant="h4">$2,450.00</Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon /> +15% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Typography variant="h6">Monthly Income</Typography>
                <Typography variant="h4">$3,200.00</Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon /> Regular salary
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #F44336 30%, #E57373 90%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Typography variant="h6">Monthly Expenses</Typography>
                <Typography variant="h4">$1,850.00</Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDownIcon /> -5% from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #FFC107 30%, #FFD54F 90%)' }}>
              <CardContent sx={{ color: 'white' }}>
                <Typography variant="h6">Savings Goal</Typography>
                <Typography variant="h4">75%</Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon /> On track
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Expense Distribution</Typography>
                  <Tooltip title="Add new expense">
                    <IconButton color="primary" onClick={() => navigate('/personal-dashboard/add-entry')}>
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dataExpenses}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {dataExpenses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Budget vs Expenses</Typography>
                  <Tooltip title="Set budget">
                    <IconButton color="primary">
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataMonthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Budget" fill="#4CAF50" />
                    <Bar dataKey="Expense" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Savings Trend</Typography>
                  <Tooltip title="View detailed report">
                    <IconButton color="primary">
                      <NotificationsActiveIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="Savings" stroke="#2196F3" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PersonalDashboard;
