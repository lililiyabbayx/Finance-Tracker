import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Card,
    CardContent,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import { transactionApi } from '../../services/api';

interface TransactionSummary {
    totalIncome: number;
    totalExpense: number;
    categoryBreakdown: {
        category: string;
        amount: number;
    }[];
    monthlyTrend: {
        month: string;
        income: number;
        expenses: number;
        net: number;
    }[];
    weeklyTrend: {
        week: string;
        income: number;
        expenses: number;
        net: number;
    }[];
    dailyTrend: {
        day: string;
        income: number;
        expenses: number;
        net: number;
    }[];
}

const ExpenseSum: React.FC = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<TransactionSummary>({
        totalIncome: 0,
        totalExpense: 0,
        categoryBreakdown: [],
        monthlyTrend: [],
        weeklyTrend: [],
        dailyTrend: [],
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await transactionApi.getStats();
                if (response.success && response.data) {
                    const { totalIncome = 0, totalExpenses = 0, byCategory = {}, monthlyTrend = [], weeklyTrend = [], dailyTrend = [] } = response.data;
                    
                    // Transform category data
                    const categoryBreakdown = Object.entries(byCategory).map(([category, data]: [string, any]) => ({
                        category,
                        amount: data?.total || 0,
                    }));

                    setSummary({
                        totalIncome,
                        totalExpense: totalExpenses,
                        categoryBreakdown,
                        monthlyTrend,
                        weeklyTrend,
                        dailyTrend,
                    });
                } else {
                    console.error('Error fetching summary:', response.error);
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    const calculateProfitMargin = () => {
        return summary.totalIncome - summary.totalExpense;
    };

    const calculateDailyProfitMargin = () => {
        return summary.dailyTrend.map(day => ({
            ...day,
            net: day.income - day.expenses
        }));
    };

    const calculateWeeklyProfitMargin = () => {
        return summary.weeklyTrend.map(week => ({
            ...week,
            net: week.income - week.expenses
        }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Expense Summary
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Income
                            </Typography>
                            <Typography variant="h5">
                                ${(summary.totalIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Expenses
                            </Typography>
                            <Typography variant="h5">
                                ${(summary.totalExpense || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Net Balance
                            </Typography>
                            <Typography variant="h5">
                                ${((summary.totalIncome || 0) - (summary.totalExpense || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Profit Margin
                            </Typography>
                            <Typography variant="h5">
                                ${calculateProfitMargin().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Category Breakdown */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Expense by Category
                    </Typography>
                    <Grid container spacing={3}>
                        {/* Pie Chart */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ height: 400 }}>
                                {summary.categoryBreakdown?.length > 0 ? (
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={summary.categoryBreakdown}
                                                dataKey="amount"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={150}
                                                label={({ category, percent }) => 
                                                    `${category}: ${(percent * 100).toFixed(1)}%`
                                                }
                                            >
                                                {summary.categoryBreakdown.map((entry, index) => (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={COLORS[index % COLORS.length]} 
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value: number) => 
                                                    `$${value.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}`
                                                }
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                        <Typography color="textSecondary">
                                            No expense data available
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* Category Details Table */}
                        <Grid item xs={12} md={6}>
                            {summary.categoryBreakdown?.length > 0 ? (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Category</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                                <TableCell align="right">% of Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {summary.categoryBreakdown
                                                .sort((a, b) => b.amount - a.amount)
                                                .map((category) => (
                                                    <TableRow key={category.category}>
                                                        <TableCell>{category.category}</TableCell>
                                                        <TableCell align="right">
                                                            ${category.amount.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {((category.amount / summary.totalExpense) * 100).toFixed(1)}%
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                    ${summary.totalExpense.toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                                    <Typography color="textSecondary">
                                        No expense data available
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Monthly Trend Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Monthly Income vs Expenses
                        </Typography>
                        {summary.monthlyTrend?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={summary.monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="month" 
                                        tickFormatter={(value) => {
                                            const date = new Date(value + '-01');
                                            return date.toLocaleDateString('default', { month: 'short' });
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => 
                                            `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        }
                                        labelFormatter={(label) => {
                                            const date = new Date(label + '-01');
                                            return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#00C49F" />
                                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                                    <Bar dataKey="net" name="Net" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                <Typography variant="body2" color="textSecondary">
                                    No trend data available
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Weekly Trend Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Weekly Income vs Expenses
                        </Typography>
                        {summary.weeklyTrend?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={calculateWeeklyProfitMargin()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="week" 
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => 
                                            `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        }
                                        labelFormatter={(label) => {
                                            const date = new Date(label);
                                            return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#00C49F" />
                                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                                    <Bar dataKey="net" name="Net" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                <Typography variant="body2" color="textSecondary">
                                    No trend data available
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Daily Trend Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            Daily Income vs Expenses
                        </Typography>
                        {summary.dailyTrend?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={calculateDailyProfitMargin()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="day" 
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => 
                                            `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        }
                                        labelFormatter={(label) => {
                                            const date = new Date(label);
                                            return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#00C49F" />
                                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                                    <Bar dataKey="net" name="Net" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                <Typography variant="body2" color="textSecondary">
                                    No trend data available
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ExpenseSum;