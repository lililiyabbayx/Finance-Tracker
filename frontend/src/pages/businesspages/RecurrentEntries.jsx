import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Chip,
  FormHelperText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";

const RecurrentEntries = () => {
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrequency, setFilterFrequency] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3300";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/recurrent-entries`,
        getAuthHeaders()
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch recurrent entries", error);
      showSnackbar(
        "Failed to fetch recurrent entries. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (transaction = null) => {
    setCurrentTransaction(
      transaction || {
        name: "",
        category: "",
        amount: "",
        frequency: "",
        startDate: "",
        endDate: "",
        description: "",
        type: "",
        status: "Pending"
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTransaction(null);
  };

  const validateTransaction = (transaction) => {
    if (
      !transaction.name ||
      !transaction.amount ||
      !transaction.category ||
      !transaction.startDate ||
      !transaction.type
    ) {
      showSnackbar("Please fill in all required fields", "error");
      return false;
    }
    return true;
  };

  const handleSaveTransaction = async () => {
    if (!validateTransaction(currentTransaction)) return;

    setLoading(true);
    try {
      const formattedTransaction = {
        ...currentTransaction,
        status: currentTransaction.status || "Pending", // Default status
        startDate: new Date(currentTransaction.startDate).toISOString(),
        endDate: currentTransaction.endDate ? new Date(currentTransaction.endDate).toISOString() : undefined
      };

      if (currentTransaction._id) {
        // Edit existing transaction
        const response = await axios.put(
          `${API_URL}/api/v1/recurrent-entries/${currentTransaction._id}`,
          formattedTransaction,
          getAuthHeaders()
        );
        setTransactions((prev) =>
          prev.map((t) => (t._id === currentTransaction._id ? response.data : t))
        );
        showSnackbar("Transaction updated successfully");
      } else {
        // Add new transaction
        const response = await axios.post(
          `${API_URL}/api/v1/recurrent-entries`,
          formattedTransaction,
          getAuthHeaders()
        );
        setTransactions((prev) => [...prev, response.data]);
        showSnackbar("Transaction added successfully");
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save transaction", error);
      showSnackbar(
        error.response?.data?.message || "Failed to save transaction. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/v1/recurrent-entries/${id}`,
        getAuthHeaders()
      );
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      showSnackbar("Transaction deleted successfully");
    } catch (error) {
      console.error("Failed to delete transaction", error);
      showSnackbar(
        "Failed to delete transaction. Please try again.",
        "error"
      );
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory ? transaction.category === filterCategory : true) &&
      (filterFrequency ? transaction.frequency === filterFrequency : true)
    );
  });

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress />}
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            color: 'black',
            fontWeight: 'bold',
            fontSize: '2.8rem'
          }}
        >
          Recurrent Entries
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ fontSize: '1.1rem', py: 1, px: 2 }}
        >
          Add New Entry
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SearchIcon sx={{ fontSize: '1.5rem' }} />
          <TextField
            variant="outlined"
            size="medium"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              ml: 1,
              '& .MuiInputBase-input': {
                fontSize: '1.1rem',
              }
            }}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: '1.1rem' }}>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            sx={{ fontSize: '1.1rem' }}
          >
            <MenuItem value="" sx={{ fontSize: '1.1rem' }}>
              <em>None</em>
            </MenuItem>
            <MenuItem value="Income" sx={{ fontSize: '1.1rem' }}>Income</MenuItem>
            <MenuItem value="Expense" sx={{ fontSize: '1.1rem' }}>Expense</MenuItem>
            <MenuItem value="Subscription" sx={{ fontSize: '1.1rem' }}>Subscription</MenuItem>
            <MenuItem value="Bill" sx={{ fontSize: '1.1rem' }}>Bill</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={{ fontSize: '1.1rem' }}>Frequency</InputLabel>
          <Select
            value={filterFrequency}
            onChange={(e) => setFilterFrequency(e.target.value)}
            sx={{ fontSize: '1.1rem' }}
          >
            <MenuItem value="" sx={{ fontSize: '1.1rem' }}>
              <em>None</em>
            </MenuItem>
            <MenuItem value="Weekly" sx={{ fontSize: '1.1rem' }}>Weekly</MenuItem>
            <MenuItem value="Bi-Weekly" sx={{ fontSize: '1.1rem' }}>Bi-Weekly</MenuItem>
            <MenuItem value="Monthly" sx={{ fontSize: '1.1rem' }}>Monthly</MenuItem>
            <MenuItem value="Yearly" sx={{ fontSize: '1.1rem' }}>Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredTransactions.map((transaction, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontSize: '1.4rem', fontWeight: 'bold', mb: 2 }}>
                  {transaction.name}
                </Typography>
                <Typography color="textSecondary" sx={{ fontSize: '1.1rem', mb: 1 }}>
                  {transaction.category}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', mb: 1 }}>
                  Amount: ${transaction.amount}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 1 }}>
                  Frequency: {transaction.frequency}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 1 }}>
                  Start Date: {new Date(transaction.startDate).toLocaleDateString()}
                </Typography>
                {transaction.endDate && (
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 1 }}>
                    End Date: {new Date(transaction.endDate).toLocaleDateString()}
                  </Typography>
                )}
                <Chip
                  label={transaction.status}
                  color={
                    transaction.status === "Done"
                      ? "success"
                      : transaction.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                  sx={{ 
                    mt: 1, 
                    fontSize: '1rem',
                    '& .MuiChip-label': {
                      fontSize: '1rem'
                    }
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <IconButton 
                    onClick={() => handleOpenDialog(transaction)}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: '1.4rem' } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    sx={{ '& .MuiSvgIcon-root': { fontSize: '1.4rem' } }}
                  >
                    <PauseIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteTransaction(transaction._id)}
                    sx={{ '& .MuiSvgIcon-root': { fontSize: '1.4rem' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
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
          {currentTransaction?._id ? "Edit Entry" : "Add New Entry"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={currentTransaction?.name || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  name: e.target.value,
                })
              }
              margin="normal"
              required
              error={!currentTransaction?.name}
              helperText={!currentTransaction?.name ? "Title is required" : ""}
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '1.1rem' },
                '& .MuiInputLabel-root': { fontSize: '1.1rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.9rem' }
              }}
            />
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={currentTransaction?.amount || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  amount: parseFloat(e.target.value),
                })
              }
              margin="normal"
              required
              error={!currentTransaction?.amount}
              helperText={!currentTransaction?.amount ? "Amount is required" : ""}
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '1.1rem' },
                '& .MuiInputLabel-root': { fontSize: '1.1rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.9rem' }
              }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Type</InputLabel>
              <Select
                value={currentTransaction?.type || ""}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    type: e.target.value,
                  })
                }
                label="Type"
                sx={{ fontSize: '1.1rem' }}
              >
                <MenuItem value="Income" sx={{ fontSize: '1.1rem' }}>Income</MenuItem>
                <MenuItem value="Expense" sx={{ fontSize: '1.1rem' }}>Expense</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required error={!currentTransaction?.category}>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Category</InputLabel>
              <Select
                value={currentTransaction?.category || ""}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    category: e.target.value,
                  })
                }
                label="Category"
                sx={{ fontSize: '1.1rem' }}
              >
                <MenuItem value="Subscription" sx={{ fontSize: '1.1rem' }}>Subscription</MenuItem>
                <MenuItem value="Bill" sx={{ fontSize: '1.1rem' }}>Bill</MenuItem>
                <MenuItem value="Salary" sx={{ fontSize: '1.1rem' }}>Salary</MenuItem>
                <MenuItem value="Investment" sx={{ fontSize: '1.1rem' }}>Investment</MenuItem>
                <MenuItem value="Other" sx={{ fontSize: '1.1rem' }}>Other</MenuItem>
              </Select>
              {!currentTransaction?.category && (
                <FormHelperText sx={{ fontSize: '0.9rem' }}>Category is required</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Frequency</InputLabel>
              <Select
                value={currentTransaction?.frequency || ""}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    frequency: e.target.value,
                  })
                }
                label="Frequency"
                sx={{ fontSize: '1.1rem' }}
              >
                <MenuItem value="Weekly" sx={{ fontSize: '1.1rem' }}>Weekly</MenuItem>
                <MenuItem value="Bi-Weekly" sx={{ fontSize: '1.1rem' }}>Bi-Weekly</MenuItem>
                <MenuItem value="Monthly" sx={{ fontSize: '1.1rem' }}>Monthly</MenuItem>
                <MenuItem value="Yearly" sx={{ fontSize: '1.1rem' }}>Yearly</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel sx={{ fontSize: '1.1rem' }}>Status</InputLabel>
              <Select
                value={currentTransaction?.status || "Pending"}
                onChange={(e) =>
                  setCurrentTransaction({
                    ...currentTransaction,
                    status: e.target.value,
                  })
                }
                label="Status"
                sx={{ fontSize: '1.1rem' }}
              >
                <MenuItem value="Pending" sx={{ fontSize: '1.1rem' }}>Pending</MenuItem>
                <MenuItem value="Overdue" sx={{ fontSize: '1.1rem' }}>Overdue</MenuItem>
                <MenuItem value="Done" sx={{ fontSize: '1.1rem' }}>Done</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={currentTransaction?.startDate?.split("T")[0] || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  startDate: e.target.value,
                })
              }
              margin="normal"
              required
              error={!currentTransaction?.startDate}
              helperText={!currentTransaction?.startDate ? "Start date is required" : ""}
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '1.1rem' },
                '& .MuiInputLabel-root': { fontSize: '1.1rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.9rem' }
              }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="End Date (Optional)"
              type="date"
              value={currentTransaction?.endDate?.split("T")[0] || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  endDate: e.target.value,
                })
              }
              margin="normal"
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '1.1rem' },
                '& .MuiInputLabel-root': { fontSize: '1.1rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.9rem' }
              }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={currentTransaction?.description || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  description: e.target.value,
                })
              }
              margin="normal"
              sx={{ 
                '& .MuiInputBase-input': { fontSize: '1.1rem' },
                '& .MuiInputLabel-root': { fontSize: '1.1rem' },
                '& .MuiFormHelperText-root': { fontSize: '0.9rem' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            sx={{ fontSize: '1.1rem' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveTransaction}
            variant="contained"
            disabled={loading || !currentTransaction?.name || !currentTransaction?.amount || !currentTransaction?.category || !currentTransaction?.startDate || !currentTransaction?.type}
            sx={{ fontSize: '1.1rem' }}
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
              fontSize: '1.1rem'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RecurrentEntries;