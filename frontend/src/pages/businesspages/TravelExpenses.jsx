import React, { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3300"; // Add your backend URL
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const TravelExpenses = () => {
  const [expenses, setExpenses] = useState([]);  // Initialize as empty array
  const [openDialog, setOpenDialog] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const categories = {
    Transportation: ["Flight", "Train", "Taxi", "Fuel", "Other"],
    Accommodation: ["Hotel", "Airbnb", "Other"],
    Meals: ["Breakfast", "Lunch", "Dinner", "Refreshments"],
    Miscellaneous: ["Souvenirs", "Tips", "Parking", "Other"],
  };

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

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar("Please log in to view expenses", "error");
        return;
      }

      const response = await axios.get("/api/v1/travel-expenses", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const expenseData = Array.isArray(response.data) ? response.data : [];
      setExpenses(expenseData);
      calculateTotals(expenseData);
    } catch (error) {
      console.error("Failed to fetch travel expenses", error);
      setExpenses([]);
      showSnackbar(error.response?.data?.message || "Failed to fetch expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense = null) => {
    setCurrentExpense(expense || {
      name: "",
      amount: "",
      date: "",
      type: "Personal",
      category: "",
      subCategory: "",
      description: "",
      location: "",
      budget: "",
      status: "Pending",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentExpense(null);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("receipt", file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post("/api/v1/upload", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setCurrentExpense({
        ...currentExpense,
        receiptImage: response.data.url,
      });
      showSnackbar("Receipt uploaded successfully");
    } catch (error) {
      console.error("Failed to upload receipt", error);
      showSnackbar(error.response?.data?.message || "Failed to upload receipt", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateExpense = (expense) => {
    if (!expense.name?.trim()) {
      showSnackbar("Please enter a name for the expense", "error");
      return false;
    }
    if (!expense.amount || isNaN(expense.amount) || expense.amount <= 0) {
      showSnackbar("Please enter a valid amount", "error");
      return false;
    }
    if (!expense.budget || isNaN(expense.budget) || expense.budget <= 0) {
      showSnackbar("Please enter a valid budget", "error");
      return false;
    }
    if (!expense.type) {
      showSnackbar("Please select an expense type", "error");
      return false;
    }
    if (!expense.category) {
      showSnackbar("Please select a category", "error");
      return false;
    }
    if (!expense.date) {
      showSnackbar("Please select a date", "error");
      return false;
    }
    return true;
  };

  const handleSaveExpense = async () => {
    if (!validateExpense(currentExpense)) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar("Please log in to save expenses", "error");
        return;
      }

      // Prepare the expense data
      const formData = {
        ...currentExpense,
        amount: parseFloat(currentExpense.amount) || 0,
        budget: parseFloat(currentExpense.budget) || 0,
        date: new Date(currentExpense.date).toISOString(),
        type: currentExpense.type || "Personal",
        category: currentExpense.category || "Transportation",
        subCategory: currentExpense.subCategory || "Other",
        status: currentExpense.status || "Pending"
      };

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      let response;
      if (currentExpense._id) {
        response = await axios.put(
          `/api/v1/travel-expenses/${currentExpense._id}`,
          formData,
          config
        );
        showSnackbar("Expense updated successfully");
      } else {
        response = await axios.post(
          "/api/v1/travel-expenses",
          formData,
          config
        );
        showSnackbar("Expense added successfully");
      }

      handleCloseDialog();
      await fetchExpenses(); // Refresh the list after saving
    } catch (error) {
      console.error("Failed to save expense", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to save expense. Please try again.";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/travel-expenses/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      showSnackbar("Expense deleted successfully");
      fetchExpenses(); // Refresh the list after deleting
    } catch (error) {
      console.error("Failed to delete expense", error);
      showSnackbar(error.response?.data?.message || "Failed to delete expense", "error");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {loading && <LinearProgress />}
      
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          color: 'black',
          fontWeight: 'bold',
          fontSize: '2rem',
          mb: 3 
        }}
      >
        Travel Expenses
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontSize: '1.2rem' }}>Budget Overview</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Total Budget</Typography>
                <Typography variant="h4" sx={{ color: 'primary.main', fontSize: '1.4rem' }}>
                  ${totalBudget.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Total Spent</Typography>
                <Typography variant="h4" sx={{ color: 'error.main', fontSize: '1.4rem' }}>
                  ${totalSpent.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Remaining</Typography>
                <Typography variant="h4" sx={{ color: 'success.main', fontSize: '1.4rem' }}>
                  ${(totalBudget - totalSpent).toFixed(2)}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(totalSpent / totalBudget) * 100} 
                  sx={{ mt: 1 }}
                  color={totalSpent > totalBudget * 0.9 ? "error" : "primary"}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
        sx={{ fontSize: '1.1rem', mb: 3 }}
      >
        Add Expense
      </Button>

      <Grid container spacing={3}>
        {Array.isArray(expenses) && expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <Grid item xs={12} sm={6} md={4} key={expense._id || index}>
              <Card sx={{ height: '100%' }}>
                {expense.receiptImage && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={expense.receiptImage}
                    alt="Receipt"
                  />
                )}
                <CardContent>
                  <Typography variant="h5" sx={{ fontSize: '1.2rem', fontWeight: 'bold', mb: 2 }}>
                    {expense.name}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      <strong>Type:</strong> {expense.type}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      <strong>Category:</strong> {expense.category}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      <strong>Amount:</strong> ${expense.amount}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      <strong>Budget:</strong> ${expense.budget}
                    </Typography>
                    {expense.location && (
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        <strong>Location:</strong> {expense.location}
                      </Typography>
                    )}
                    <Typography sx={{ fontSize: '0.9rem' }}>
                      <strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}
                    </Typography>
                    {expense.description && (
                      <Typography sx={{ fontSize: '0.9rem' }}>
                        <strong>Description:</strong> {expense.description}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <IconButton 
                      onClick={() => handleOpenDialog(expense)}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.4rem' } }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteExpense(expense._id)}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.4rem' } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
              {loading ? 'Loading expenses...' : 'No expenses found. Add your first expense!'}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            '& .MuiDialogTitle-root': {
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }
          }
        }}
      >
        <DialogTitle>
          {currentExpense?._id ? "Edit Travel Expense" : "Add Travel Expense"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={currentExpense?.name || ""}
                  onChange={(e) =>
                    setCurrentExpense({
                      ...currentExpense,
                      name: e.target.value,
                    })
                  }
                  required
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontSize: '0.9rem' }}>Type</InputLabel>
                  <Select
                    value={currentExpense?.type || ""}
                    onChange={(e) =>
                      setCurrentExpense({
                        ...currentExpense,
                        type: e.target.value,
                      })
                    }
                    sx={{ fontSize: '0.9rem' }}
                  >
                    <MenuItem value="Personal" sx={{ fontSize: '0.9rem' }}>Personal</MenuItem>
                    <MenuItem value="Business" sx={{ fontSize: '0.9rem' }}>Business</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel sx={{ fontSize: '0.9rem' }}>Category</InputLabel>
                  <Select
                    value={currentExpense?.category || ""}
                    onChange={(e) => {
                      setCurrentExpense({
                        ...currentExpense,
                        category: e.target.value,
                        subCategory: "",
                      });
                    }}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {Object.keys(categories).map((category) => (
                      <MenuItem key={category} value={category} sx={{ fontSize: '0.9rem' }}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {currentExpense?.category && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ fontSize: '0.9rem' }}>Sub Category</InputLabel>
                    <Select
                      value={currentExpense?.subCategory || ""}
                      onChange={(e) =>
                        setCurrentExpense({
                          ...currentExpense,
                          subCategory: e.target.value,
                        })
                      }
                      sx={{ fontSize: '0.9rem' }}
                    >
                      {categories[currentExpense.category]?.map((subCategory) => (
                        <MenuItem key={subCategory} value={subCategory} sx={{ fontSize: '0.9rem' }}>
                          {subCategory}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={currentExpense?.amount || ""}
                  onChange={(e) =>
                    setCurrentExpense({
                      ...currentExpense,
                      amount: e.target.value,
                    })
                  }
                  required
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget"
                  type="number"
                  value={currentExpense?.budget || ""}
                  onChange={(e) =>
                    setCurrentExpense({
                      ...currentExpense,
                      budget: e.target.value,
                    })
                  }
                  required
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={currentExpense?.location || ""}
                  onChange={(e) =>
                    setCurrentExpense({
                      ...currentExpense,
                      location: e.target.value,
                    })
                  }
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={currentExpense?.date?.split("T")[0] || ""}
                  onChange={(e) =>
                    setCurrentExpense({
                      ...currentExpense,
                      date: e.target.value,
                    })
                  }
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={currentExpense?.description || ""}
                  onChange={(e) =>
                    setCurrentExpense({
                      ...currentExpense,
                      description: e.target.value,
                    })
                  }
                  sx={{ 
                    '& .MuiInputBase-input': { fontSize: '0.9rem' },
                    '& .MuiInputLabel-root': { fontSize: '0.9rem' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ fontSize: '0.9rem' }}
                >
                  Upload Receipt
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </Button>
                {currentExpense?.receiptImage && (
                  <Typography sx={{ mt: 1, fontSize: '0.9rem' }}>
                    Receipt uploaded successfully
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ fontSize: '0.9rem' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveExpense}
            variant="contained"
            disabled={loading}
            sx={{ fontSize: '0.9rem' }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ 
            width: "100%",
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TravelExpenses;