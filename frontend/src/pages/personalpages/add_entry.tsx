import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, MenuItem } from '@mui/material';
import axios from 'axios';
import PersonalNavbar from "@/personal_scenes/navbar/index"; // Make sure this is the correct path

const AddIncomeExpense = () => {
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); // For custom category input
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState<string[]>([]); // Store available categories from backend

  // Fetch categories from backend (if any)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Modify this endpoint if needed
        setCategories(response.data); // Assuming the API returns a list of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use customCategory if it's provided, else fallback to selected category
    const entryData = {
      transactionType,
      amount: parseFloat(amount), // Ensure amount is a number
      category: customCategory || category, // Use the custom category if available
      date,
      notes,
    };

    try {
      const response = await axios.post('/api/entries', entryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage('Entry added successfully!');
      console.log('Response from server:', response.data);

      // Clear form after successful submission
      setTransactionType('');
      setAmount('');
      setCategory('');
      setCustomCategory('');
      setDate('');
      setNotes('');
    } catch (error) {
      setMessage('Failed to add entry.');
      console.error('Error adding entry:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Personal Navbar */}
      <PersonalNavbar />

      {/* Main Content */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        sx={{
          background: 'linear-gradient(135deg, rgba(0, 150, 136, 0.1), rgba(0, 0, 255, 0.1))',
          padding: '2rem',
        }}
      >
        <Card
          sx={{
            width: 450,
            padding: '1.5rem',
            borderRadius: '15px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
            },
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom align="center" sx={{ color: '#00796b' }}>
              Add Income/Expense
            </Typography>
            {message && (
              <Typography
                variant="body2"
                align="center"
                color={message.includes('success') ? 'green' : 'red'}
                sx={{ marginBottom: '1rem' }}
              >
                {message}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Transaction Type"
                select
                fullWidth
                margin="normal"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                required
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </TextField>

              <TextField
                label="Amount"
                type="number"
                fullWidth
                margin="normal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              {/* Category Selection */}
              <TextField
                label="Category"
                select
                fullWidth
                margin="normal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat, index) => (
                  <MenuItem key={index} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

              {/* Custom Category Input */}
              <TextField
                label="Custom Category"
                fullWidth
                margin="normal"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Add your custom category"
              />

              <TextField
                label="Date"
                type="date"
                fullWidth
                margin="normal"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Notes"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Entry
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddIncomeExpense;

