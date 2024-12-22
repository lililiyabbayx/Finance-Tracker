import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { transactionApi, Transaction } from '../../services/api';

interface ChartData {
    name: string;
    expenses: number;
    income: number;
}

interface CategoryData {
    name: string;
    amount: number;
}

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
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ReportPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary>({
        totalIncome: 0,
        totalExpense: 0,
        categoryBreakdown: [],
        monthlyTrend: [],
        weeklyTrend: [],
    });
    const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'error' as 'error' | 'success',
    });
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
    const [categoryData, setCategoryData] = useState<{ category: string; amount: number }[]>([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [transactionsResponse, statsResponse] = await Promise.all([
                    transactionApi.getAll(),
                    transactionApi.getStats()
                ]);

                if (transactionsResponse.success && transactionsResponse.data) {
                    setTransactions(transactionsResponse.data);
                }

                if (statsResponse.success && statsResponse.data) {
                    setSummary(statsResponse.data);
                    // Update category data for pie chart
                    if (statsResponse.data.categoryBreakdown) {
                        setCategoryData(statsResponse.data.categoryBreakdown);
                    }
                    setTotalIncome(statsResponse.data.totalIncome || 0);
                    setTotalExpenses(statsResponse.data.totalExpense || 0);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setSnackbar({
                    open: true,
                    message: 'Error fetching data',
                    severity: 'error',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterTransactionsByDate = (transactions: Transaction[]) => {
        const now = new Date();
        const interval = {
            start: timeRange === 'week' ? startOfWeek(now) : startOfMonth(now),
            end: timeRange === 'week' ? endOfWeek(now) : endOfMonth(now),
        };

        return transactions.filter(transaction => 
            isWithinInterval(new Date(transaction.date), interval)
        );
    };

    const prepareChartData = (filteredTransactions: Transaction[]): ChartData[] => {
        const dailyData = new Map<string, { expenses: number; income: number }>();

        filteredTransactions.forEach(transaction => {
            const date = format(new Date(transaction.date), 'MMM dd');
            const current = dailyData.get(date) || { expenses: 0, income: 0 };

            if (transaction.type === 'expense') {
                current.expenses += transaction.amount;
            } else {
                current.income += transaction.amount;
            }

            dailyData.set(date, current);
        });

        return Array.from(dailyData.entries()).map(([date, data]) => ({
            name: date,
            ...data,
        }));
    };

    const prepareCategoryData = (filteredTransactions: Transaction[]): CategoryData[] => {
        const categoryData = new Map<string, number>();

        filteredTransactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                const categoryName = transaction.category.name;
                categoryData.set(
                    categoryName,
                    (categoryData.get(categoryName) || 0) + transaction.amount
                );
            });

        return Array.from(categoryData.entries())
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount);
    };

    const calculateTotals = (filteredTransactions: Transaction[]) => {
        return filteredTransactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'expense') {
                    acc.totalExpenses += transaction.amount;
                } else {
                    acc.totalIncome += transaction.amount;
                }
                return acc;
            },
            { totalExpenses: 0, totalIncome: 0 }
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    const filteredTransactions = filterTransactionsByDate(transactions);
    const chartData = prepareChartData(filteredTransactions);
    const { totalExpenses: totalExpensesCalculated, totalIncome: totalIncomeCalculated } = calculateTotals(filteredTransactions);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Financial Report
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <ToggleButtonGroup
                        value={timeRange}
                        exclusive
                        onChange={(_, value) => value && setTimeRange(value)}
                        aria-label="time range"
                    >
                        <ToggleButton value="week" aria-label="weekly">
                            Weekly
                        </ToggleButton>
                        <ToggleButton value="month" aria-label="monthly">
                            Monthly
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item>
                        <ToggleButtonGroup
                            value={timeframe}
                            exclusive
                            onChange={(e, newValue) => newValue && setTimeframe(newValue)}
                            aria-label="timeframe"
                        >
                            <ToggleButton value="weekly" aria-label="weekly">
                                Weekly
                            </ToggleButton>
                            <ToggleButton value="monthly" aria-label="monthly">
                                Monthly
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>

                <Paper sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        {timeframe === 'weekly' ? 'Weekly' : 'Monthly'} Income vs Expenses
                    </Typography>
                    {((timeframe === 'weekly' ? summary.weeklyTrend : summary.monthlyTrend) || []).length > 0 ? (
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={timeframe === 'weekly' ? summary.weeklyTrend : summary.monthlyTrend}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey={timeframe === 'weekly' ? 'week' : 'month'}
                                        tickFormatter={(value) => {
                                            const date = new Date(value + (timeframe === 'weekly' ? '' : '-01'));
                                            return timeframe === 'weekly'
                                                ? `Week of ${date.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`
                                                : date.toLocaleDateString('default', { month: 'short' });
                                        }}
                                    />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) =>
                                            `$${value.toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`
                                        }
                                        labelFormatter={(label) => {
                                            const date = new Date(label + (timeframe === 'weekly' ? '' : '-01'));
                                            return timeframe === 'weekly'
                                                ? `Week of ${date.toLocaleDateString('default', {
                                                      month: 'long',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                  })}`
                                                : date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#00C49F" />
                                    <Bar dataKey="expenses" name="Expenses" fill="#FF8042" />
                                    <Bar dataKey="net" name="Net" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
                            No data available
                        </Typography>
                    )}
                </Paper>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Income
                                </Typography>
                                <Typography variant="h4" color="primary">
                                    {formatCurrency(totalIncome)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Expenses
                                </Typography>
                                <Typography variant="h4" color="error">
                                    {formatCurrency(totalExpenses)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Income vs Expenses
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                        <Legend />
                                        <Bar dataKey="income" fill="#4caf50" name="Income" />
                                        <Bar dataKey="expenses" fill="#f44336" name="Expenses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Category Analysis
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ height: 400 }}>
                                        {loading ? (
                                            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                                <CircularProgress />
                                            </Box>
                                        ) : categoryData.length > 0 ? (
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie
                                                        data={categoryData}
                                                        dataKey="amount"
                                                        nameKey="category"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={150}
                                                        label={({ category, percent }) => 
                                                            `${category}: ${(percent * 100).toFixed(1)}%`
                                                        }
                                                    >
                                                        {categoryData.map((entry, index) => (
                                                            <Cell 
                                                                key={`cell-${index}`} 
                                                                fill={COLORS[index % COLORS.length]} 
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip 
                                                        formatter={(value: number) => 
                                                            formatCurrency(value)
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

                                <Grid item xs={12} md={6}>
                                    {loading ? (
                                        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                                            <CircularProgress />
                                        </Box>
                                    ) : categoryData.length > 0 ? (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Category</TableCell>
                                                        <TableCell align="right">Amount</TableCell>
                                                        <TableCell align="right">% of Total</TableCell>
                                                        <TableCell align="right">Transactions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {categoryData
                                                        .sort((a, b) => b.amount - a.amount)
                                                        .map((category) => {
                                                            const count = transactions.filter(t => 
                                                                t.category.name === category.category
                                                            ).length;
                                                            return (
                                                                <TableRow key={category.category}>
                                                                    <TableCell>{category.category}</TableCell>
                                                                    <TableCell align="right">
                                                                        {formatCurrency(category.amount)}
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        {((category.amount / totalExpenses) * 100).toFixed(1)}%
                                                                    </TableCell>
                                                                    <TableCell align="right">{count}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                            {formatCurrency(totalExpenses)}
                                                        </TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>100%</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                                            {transactions.filter(t => t.type === 'expense').length}
                                                        </TableCell>
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
                </Grid>
            </Box>

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
        </Container>
    );
};

export default ReportPage;