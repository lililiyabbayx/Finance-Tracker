import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    CircularProgress,
    LinearProgress,
    Alert,
    AlertTitle,
    Snackbar,
    Grid,
    Card,
    CardContent,
} from '@mui/material';
import { transactionApi } from '../../services/api';

interface BudgetData {
    totalAmount: number;
    spent: number;
    remaining: number;
}

const BudgetPage: React.FC = () => {
    const [budget, setBudget] = useState<BudgetData | null>(null);
    const [newBudget, setNewBudget] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning',
    });

    useEffect(() => {
        fetchBudget();
    }, []);

    const fetchBudget = async () => {
        try {
            setLoading(true);
            const response = await transactionApi.getCurrentBudget();
            if (response.success && response.data) {
                const { totalAmount, spent = 0, remaining = totalAmount } = response.data;
                setBudget({
                    totalAmount,
                    spent,
                    remaining,
                });
            }
        } catch (error) {
            console.error('Error fetching budget:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to fetch budget',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSetBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newBudget || isNaN(parseFloat(newBudget)) || parseFloat(newBudget) <= 0) {
            setSnackbar({
                open: true,
                message: 'Please enter a valid budget amount',
                severity: 'error',
            });
            return;
        }

        try {
            setSaving(true);
            const amount = parseFloat(newBudget);
            const response = await transactionApi.setBudget(amount);
            
            if (response.success && response.data) {
                const { totalAmount, spent = 0, remaining = totalAmount } = response.data;
                setBudget({
                    totalAmount,
                    spent,
                    remaining,
                });
                setNewBudget('');
                setSnackbar({
                    open: true,
                    message: 'Budget updated successfully!',
                    severity: 'success',
                });
            } else {
                throw new Error(response.error || 'Failed to update budget');
            }
        } catch (error) {
            console.error('Error setting budget:', error);
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to set budget',
                severity: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const calculateProgress = () => {
        if (!budget || budget.totalAmount === 0) return 0;
        const progress = (budget.spent / budget.totalAmount) * 100;
        return Math.min(progress, 100);
    };

    const getProgressColor = () => {
        const progress = calculateProgress();
        if (progress >= 100) return 'error';
        if (progress >= 80) return 'warning';
        return 'primary';
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Budget Management
                </Typography>

                {budget && (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Monthly Budget
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(budget.totalAmount)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Spent
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(budget.spent)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Remaining
                                    </Typography>
                                    <Typography 
                                        variant="h5"
                                        color={budget.remaining < 0 ? 'error' : 'inherit'}
                                    >
                                        {formatCurrency(budget.remaining)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Budget Progress
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={calculateProgress()}
                            color={getProgressColor()}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            {calculateProgress().toFixed(1)}% of budget used
                        </Typography>
                    </Box>

                    {budget && budget.remaining < 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <AlertTitle>Budget Exceeded</AlertTitle>
                            You have exceeded your monthly budget by {formatCurrency(Math.abs(budget.remaining))}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSetBudget}>
                        <Typography variant="h6" gutterBottom>
                            Set Monthly Budget
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Budget Amount"
                                type="number"
                                value={newBudget}
                                onChange={(e) => setNewBudget(e.target.value)}
                                inputProps={{ min: "0", step: "0.01" }}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving || !newBudget}
                                sx={{ minWidth: 120 }}
                            >
                                {saving ? <CircularProgress size={24} /> : 'Set Budget'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {budget && budget.remaining < budget.totalAmount * 0.2 && budget.remaining > 0 && (
                    <Alert severity="warning">
                        <AlertTitle>Low Budget Warning</AlertTitle>
                        You have less than 20% of your budget remaining. Consider reviewing your expenses.
                    </Alert>
                )}
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default BudgetPage;