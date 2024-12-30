import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  FormHelperText,
  CardMedia,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { 
  useGetTravelExpensesQuery,
  useAddTravelExpenseMutation,
  useUpdateTravelExpenseMutation,
  useDeleteTravelExpenseMutation
} from "../../states/travelExpensesApi";

const TravelExpenses = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentExpense, setCurrentExpense] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    type: "Personal",
    category: "Transportation",
    subCategory: "",
    description: "",
    budget: "",
    status: "Pending"
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // RTK Query hooks
  const { data: expenses = [], isLoading } = useGetTravelExpensesQuery();
  const [addTravelExpense] = useAddTravelExpenseMutation();
  const [updateTravelExpense] = useUpdateTravelExpenseMutation();
  const [deleteTravelExpense] = useDeleteTravelExpenseMutation();

  const categories = {
    Transportation: ["Flight", "Train", "Taxi", "Fuel", "Other"],
    Accommodation: ["Hotel", "Airbnb", "Other"],
    Meals: ["Breakfast", "Lunch", "Dinner", "Refreshments"],
    Miscellaneous: ["Souvenirs", "Tips", "Parking", "Other"],
  };

  useEffect(() => {
    if (expenses) {
      calculateTotals(expenses);
    }
  }, [expenses]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const calculateTotals = (expenseData) => {
    if (!Array.isArray(expenseData)) {
      console.error('Expected array for expenses, got:', typeof expenseData);
      return;
    }
    const totals = expenseData.reduce(
      (acc, expense) => ({
        budget: acc.budget + (Number(expense.budget) || 0),
        spent: acc.spent + (Number(expense.amount) || 0),
      }),
      { budget: 0, spent: 0 }
    );
    setTotalBudget(totals.budget);
    setTotalSpent(totals.spent);
  };

  const handleSubmit = async () => {
    try {
      const expenseData = {
        ...currentExpense,
        amount: parseFloat(currentExpense.amount),
        budget: parseFloat(currentExpense.budget)
      };

      if (currentExpense._id) {
        await updateTravelExpense({
          id: currentExpense._id,
          ...expenseData
        }).unwrap();
        setSnackbarMessage("Expense updated successfully");
      } else {
        await addTravelExpense(expenseData).unwrap();
        setSnackbarMessage("Expense added successfully");
      }
      
      setSnackbarSeverity("success");
      setOpenDialog(false);
      setCurrentExpense({
        name: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        type: "Personal",
        category: "Transportation",
        subCategory: "",
        description: "",
        budget: "",
        status: "Pending"
      });
    } catch (error) {
      console.error("Failed to save expense:", error);
      setSnackbarMessage(error.data?.message || "Failed to save expense");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteTravelExpense(id).unwrap();
      showSnackbar("Expense deleted successfully");
    } catch (error) {
      console.error("Failed to delete expense:", error);
      showSnackbar(error.data?.message || "Failed to delete expense", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setOpenDialog(true);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentExpense({
      name: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      type: "Personal",
      category: "Transportation",
      subCategory: "",
      description: "",
      budget: "",
      status: "Pending"
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        borderRadius: 2,
        padding: '20px',
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)'
      }}>
        <FlightTakeoffIcon sx={{ fontSize: 40, marginRight: 2 }} />
        <Typography 
          variant="h2" 
          sx={{ 
            fontSize: '2.5rem', 
            fontWeight: 700,
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Travel Expenses
        </Typography>
      </Box>

      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)',
            }
          }}
        >
          Add New Expense
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Budget</Typography>
              <Typography variant="h4">${totalBudget.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Spent</Typography>
              <Typography variant="h4">${totalSpent.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {isLoading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {expenses.map((expense) => (
            <Grid item xs={12} sm={6} md={4} key={expense._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main, mb: 2 }}>
                    {expense.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Amount: ${expense.amount}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.secondary.main }}>
                    Category: {expense.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(expense.date).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      onClick={() => handleEditExpense(expense)}
                      sx={{ 
                        color: theme.palette.primary.main,
                        '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteExpense(expense._id)}
                      sx={{ 
                        color: theme.palette.error.main,
                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentExpense._id ? "Edit Expense" : "Add New Expense"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={currentExpense.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={currentExpense.amount}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Budget"
                name="budget"
                type="number"
                value={currentExpense.budget}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={currentExpense.date}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={currentExpense.type}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="Personal">Personal</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={currentExpense.category}
                  onChange={handleInputChange}
                  required
                >
                  {Object.keys(categories).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sub Category</InputLabel>
                <Select
                  name="subCategory"
                  value={currentExpense.subCategory}
                  onChange={handleInputChange}
                  required
                >
                  {currentExpense.category &&
                    categories[currentExpense.category].map((subCategory) => (
                      <MenuItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={currentExpense.description}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TravelExpenses;