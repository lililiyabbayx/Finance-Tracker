import axios, { AxiosError } from 'axios';

// For development, hardcode the API URL
const API_URL = 'http://localhost:3300/api';

// Temporary user ID for development
const TEMP_USER_ID = '67603cd7ec53be790703d3f6'; // This should match the ID in your backend

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 15000,
});

// Add request interceptor for debugging and auth
api.interceptors.request.use((config) => {
    // Add temporary user authentication
    if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${TEMP_USER_ID}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('[API Response]', response.data);
        return response;
    },
    (error: AxiosError<{ error?: string }>) => {
        const errorMessage = error.response?.data?.error || error.message;
        console.error('[API Error]', errorMessage);
        
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout. Please try again.');
        }
        
        if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        }
        
        throw error;
    }
);

export interface TransactionData {
    type: 'expense' | 'income';
    category: Category;
    amount: number;
    date: string;
    description?: string;
}

export interface Transaction extends TransactionData {
    _id: string;
    userId: string;
    category: Category;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    _id: string;
    name: string;
    userId: string;
}

export interface Budget {
    _id: string;
    userId: string;
    totalAmount: number;
    month: number;
    spent?: number;
    remaining?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string | string[];
}

export const transactionApi = {
    // Create a new transaction
    async create(transactionData: TransactionData): Promise<ApiResponse<Transaction>> {
        try {
            const response = await api.post('/entries', transactionData);
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Get all transactions
    async getAll(): Promise<ApiResponse<Transaction[]>> {
        try {
            const response = await api.get('/entries');
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Get transaction statistics
    async getStats(): Promise<ApiResponse<any>> {
        try {
            const response = await api.get('/entries/stats');
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Get all categories
    async getCategories(): Promise<ApiResponse<Category[]>> {
        try {
            const response = await api.get('/entries/categories');
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Create a new category
    async createCategory(categoryData: { name: string }): Promise<ApiResponse<Category>> {
        try {
            const response = await api.post('/entries/categories', categoryData);
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Get current month's budget
    async getCurrentBudget(): Promise<ApiResponse<Budget>> {
        try {
            const response = await api.get('/budget/current');
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Set budget for current month
    async setBudget(amount: number): Promise<ApiResponse<Budget>> {
        try {
            const response = await api.post('/budget', { totalAmount: amount });
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },

    // Check current budget status
    async checkBudget(): Promise<ApiResponse<{ budget: number; spent: number; remaining: number }>> {
        try {
            const response = await api.get('/budget/check');
            return { success: true, data: response.data };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    success: false,
                    error: error.response?.data?.error || error.message,
                    details: error.response?.data?.details,
                };
            }
            return { success: false, error: 'An unexpected error occurred' };
        }
    },
};

export default api;
