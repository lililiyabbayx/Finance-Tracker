import React, { useState } from "react";
import {
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useFetchTransactionsQuery,
} from "../../states/transactionApi";
import { Transaction } from "../../states/types";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";

const TransactionPage = () => {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number | string>(""); // Allow string/number
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [date, setDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null); // Track the transaction being edited
  const [sortField, setSortField] = useState<string>("date"); // Track the sort field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Track the sort order
  const [loading, setLoading] = useState<boolean>(false); // Loading state for CSV upload

  const { data: transactions = [], refetch } = useFetchTransactionsQuery();
  const [addTransaction] = useAddTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const handleCreateOrUpdateTransaction = async () => {
    if (!description || !amount || !category || !date) {
      alert("All fields are required.");
      return;
    }

    const transactionData: Transaction = {
      id: editingTransactionId || uuidv4(), // Use the id if editing, otherwise generate a new one
      description,
      amount: Number(amount),
      category,
      type,
      date,
    };

    try {
      if (editingTransactionId) {
        // If we're editing, update the transaction
        await updateTransaction({
          transactionId: editingTransactionId,
          data: transactionData,
        }).unwrap();
      } else {
        // Otherwise, create a new transaction
        await addTransaction(transactionData).unwrap();
      }
      refetch(); // Refetch the transactions after creating or updating
      resetForm(); // Reset the form
    } catch (error) {
      alert("Failed to create/update transaction.");
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!transactionId) {
      alert("Transaction ID is undefined. Cannot delete.");
      return;
    }

    try {
      await deleteTransaction(transactionId).unwrap();
      refetch();
    } catch (error) {
      alert("Failed to delete transaction.");
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory("");
    setType("income");
    setDate("");
    setEditingTransactionId(null); // Clear the editing state
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransactionId(transaction.id); // Set the transaction to be edited
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setType(transaction.type);
    setDate(transaction.date.split("T")[0]); // Format date as yyyy-MM-dd
  };

  // Sorting logic
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortField === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    } else if (sortField === "date") {
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      // Default sort by description
      return sortOrder === "asc"
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description);
    }
  });

  const filteredTransactions = sortedTransactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle CSV Upload with Batch Processing
  const handleFileUpload = (file: File) => {
    setLoading(true); // Set loading to true when processing begins

    Papa.parse(file, {
      complete: async (result: { data: any[] }) => {
        const transactionsFromCSV = result.data
          .map((row: any) => {
            console.log("Processing row:", row);
            if (
              !row.Description ||
              !row.Amount ||
              isNaN(parseFloat(row.Amount)) ||
              !row.Date
            ) {
              return null;
            }

            const formattedDate = formatDate(row.Date);
            const validType =
              row.Type &&
              (row.Type.toLowerCase() === "income" ||
                row.Type.toLowerCase() === "expense")
                ? row.Type.toLowerCase()
                : "expense";

            return {
              id: uuidv4(),
              description: row.Description,
              amount: parseFloat(row.Amount),
              category: row.Category || "",
              type: validType,
              date: formattedDate,
            };
          })
          .filter(Boolean);

        console.log("Transactions to be added:", transactionsFromCSV);

        try {
          // Instead of adding one transaction at a time, send them in a batch (adjust the API if needed)
          await Promise.all(
            transactionsFromCSV.map(async (transaction) => {
              if (transaction) {
                await addTransaction(transaction).unwrap();
              }
            })
          );
          refetch(); // Refresh the transactions list after the batch process
        } catch (error) {
          console.error("Failed to add transactions from CSV", error);
        }

        setLoading(false); // Set loading to false once processing is complete
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Return empty string for invalid dates
    }
    return date.toISOString().split("T")[0]; // Return the date in yyyy-MM-dd format
  };

  // Handle CSV Download
  const handleCSVDownload = () => {
    const csvData = transactions.map((transaction) => ({
      Description: transaction.description,
      Amount: transaction.amount,
      Category: transaction.category,
      Type: transaction.type,
      Date: transaction.date,
    }));

    const csv = Papa.unparse(csvData); // Convert the data to CSV format
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv"; // Set the file name for the download
    link.click(); // Trigger the download
  };

  return (
    <Box maxWidth={1000} margin="auto" sx={{ padding: 6 }}>
      <Typography
        variant="h4"
        textAlign="center"
        textTransform="uppercase"
        gutterBottom
      >
        Manage Transactions
      </Typography>

      {/* Add Transaction Form */}
      <Paper sx={{ padding: 3, marginBottom: 4 }}>
        <Typography variant="h2" textAlign="center" gutterBottom>
          {editingTransactionId
            ? "Update Transaction"
            : "Add a New Transaction"}
        </Typography>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Description"
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "income" || value === "expense") {
                    setType(value);
                  }
                }}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrUpdateTransaction}
          >
            {editingTransactionId ? "Update Transaction" : "Add Transaction"}
          </Button>
        </Box>
      </Paper>

      {/* Search and Sort */}
      <Typography variant="h6" gutterBottom textAlign="center">
        Transactions
      </Typography>
      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search Transactions"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <MenuItem value="description">Description</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Transaction List */}
      {filteredTransactions.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" textAlign="center">
          No transactions found.
        </Typography>
      )}

      {/* CSV Upload and Download */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Button
              variant="outlined"
              color="primary"
              component="label"
              sx={{ marginRight: 2 }}
            >
              Upload CSV
              <input
                type="file"
                hidden
                accept=".csv"
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files[0])
                }
              />
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCSVDownload}
            >
              Download Transactions as CSV
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TransactionPage;
