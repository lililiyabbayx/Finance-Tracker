import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    MenuItem,
    Typography,
    Paper,
    Grid,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { transactionApi } from '../../services/api';

interface Category {
    _id: string;
    name: string;
}

interface FormData {
    type: 'expense' | 'income';
    category: string;
    amount: string;
    date: Date;
    description: string;
}

const AddEntry: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        type: 'expense' as const,
        category: '',
        amount: '',
        date: new Date(),
        description: ''
    });
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ 
        open: false, 
        message: '', 
        severity: 'success' as 'success' | 'error' 
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await transactionApi.getCategories();
            if (response.success && Array.isArray(response.data)) {
                setCategories(response.data);
                if (response.data.length > 0) {
                    setFormData(prev => ({ ...prev, category: response.data[0]._id }));
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to load categories',
                severity: 'error'
            });
        }
    };

    const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, category: value }));
        if (value === 'new') {
            setNewCategory('');
        }
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prev => ({ ...prev, date }));
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        
        try {
            const response = await transactionApi.createCategory({ name: newCategory.trim() });
            if (response.success && response.data) {
                const newCat = response.data;
                setCategories(prev => [...prev, newCat]);
                setFormData(prev => ({ ...prev, category: newCat._id }));
                setNewCategory('');
                setSnackbar({
                    open: true,
                    message: 'Category added successfully!',
                    severity: 'success'
                });
            } else {
                throw new Error(response.error || 'Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to add category',
                severity: 'error'
            });
        }
    };

    const refreshExpenseSummary = async () => {
        try {
            await transactionApi.getStats();
            const budgetResponse = await transactionApi.getCurrentBudget();
            if (budgetResponse.success && budgetResponse.data) {
                const { remaining, spent, totalAmount } = budgetResponse.data;
                if (remaining < 0) {
                    setSnackbar({
                        open: true,
                        message: `Warning: You've exceeded your monthly budget of ${totalAmount} by ${Math.abs(remaining)}!`,
                        severity: 'error'
                    });
                }
            }
        } catch (error) {
            console.error('Error refreshing expense summary:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.category === 'new' && !newCategory.trim()) {
            setSnackbar({
                open: true,
                message: 'Please enter a category name',
                severity: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            let categoryId = formData.category;
            if (formData.category === 'new') {
                if (!newCategory?.trim()) {
                    setSnackbar({
                        open: true,
                        message: 'Please enter a category name',
                        severity: 'error',
                    });
                    return;
                }

                const categoryResponse = await transactionApi.createCategory({ name: newCategory.trim() });
                if (!categoryResponse.success) {
                    setSnackbar({
                        open: true,
                        message: categoryResponse.error || 'Failed to create category',
                        severity: 'error',
                    });
                    return;
                }
                categoryId = categoryResponse.data._id;
                await fetchCategories();
            }

            const response = await transactionApi.create({
                type: formData.type,
                category: categoryId,
                amount: parseFloat(formData.amount),
                date: formData.date.toISOString(),
                description: formData.description
            });

            if (response.success) {
                setSnackbar({
                    open: true,
                    message: 'Transaction added successfully!',
                    severity: 'success'
                });

                await refreshExpenseSummary();

                const defaultCategory = categories.length > 0 ? categories[0]._id : '';
                setFormData({
                    type: 'expense' as const,
                    category: defaultCategory,
                    amount: '',
                    date: new Date(),
                    description: ''
                });
                setNewCategory('');
            } else {
                throw new Error(response.error || 'Failed to add transaction');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to add transaction',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Add New Transaction
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Type"
                                    value={formData.type}
                                    onChange={handleChange('type')}
                                    required
                                >
                                    <MenuItem value="expense">Expense</MenuItem>
                                    <MenuItem value="income">Income</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={formData.category === 'new' ? 8 : 12}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Category"
                                            value={formData.category}
                                            onChange={handleCategoryChange}
                                            required
                                            error={!formData.category}
                                            helperText={!formData.category ? "Please select a category" : ""}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem key={category._id} value={category._id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                            <MenuItem value="new">
                                                <em>Add New Category</em>
                                            </MenuItem>
                                        </TextField>
                                    </Grid>
                                    {formData.category === 'new' && (
                                        <Grid item xs={4}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={handleAddCategory}
                                                disabled={!newCategory.trim()}
                                                sx={{ height: '56px' }}
                                            >
                                                Add
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid>

                            {formData.category === 'new' && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="New Category Name"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        required
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={handleChange('amount')}
                                    required
                                    inputProps={{ min: "0", step: "0.01" }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <DatePicker
                                    label="Date"
                                    value={formData.date}
                                    onChange={handleDateChange}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    value={formData.description}
                                    onChange={handleChange('description')}
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={loading || !formData.category || !formData.amount}
                                    sx={{ mt: 2 }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Add Transaction'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default AddEntry;