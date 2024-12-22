import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Switch,
    FormControlLabel,
    TextField,
    Button,
    Alert,
    Snackbar,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
} from '@mui/material';

interface AlertSettings {
    budgetAlerts: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
    largeTransactions: boolean;
    largeTransactionThreshold: number;
    email: string;
}

const EmailAlert: React.FC = () => {
    const [settings, setSettings] = useState<AlertSettings>({
        budgetAlerts: true,
        weeklyReport: false,
        monthlyReport: true,
        largeTransactions: true,
        largeTransactionThreshold: 1000,
        email: '',
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const handleChange = (name: keyof AlertSettings) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSettings({
            ...settings,
            [name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // TODO: Implement API call to save settings
            setSnackbar({
                open: true,
                message: 'Alert settings saved successfully!',
                severity: 'success',
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to save alert settings',
                severity: 'error',
            });
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Email Alert Settings
            </Typography>

            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            value={settings.email}
                            onChange={handleChange('email')}
                            type="email"
                            required
                            sx={{ mb: 3 }}
                        />

                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Notification Preferences
                        </Typography>

                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Budget Alerts"
                                    secondary="Get notified when you're approaching your budget limits"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={settings.budgetAlerts}
                                        onChange={handleChange('budgetAlerts')}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />

                            <ListItem>
                                <ListItemText
                                    primary="Weekly Summary"
                                    secondary="Receive a weekly summary of your transactions"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={settings.weeklyReport}
                                        onChange={handleChange('weeklyReport')}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />

                            <ListItem>
                                <ListItemText
                                    primary="Monthly Report"
                                    secondary="Get detailed monthly financial reports"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={settings.monthlyReport}
                                        onChange={handleChange('monthlyReport')}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />

                            <ListItem>
                                <ListItemText
                                    primary="Large Transaction Alerts"
                                    secondary="Get notified about large transactions"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        edge="end"
                                        checked={settings.largeTransactions}
                                        onChange={handleChange('largeTransactions')}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>

                        {settings.largeTransactions && (
                            <Box sx={{ mt: 2, ml: 2 }}>
                                <TextField
                                    label="Large Transaction Threshold ($)"
                                    type="number"
                                    value={settings.largeTransactionThreshold}
                                    onChange={handleChange('largeTransactionThreshold')}
                                    InputProps={{
                                        inputProps: { min: 0 },
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                        >
                            Save Settings
                        </Button>
                    </Box>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default EmailAlert;