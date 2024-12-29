export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3300';
export const API_ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/api/v1/auth/login`,
        signup: `${API_BASE_URL}/api/v1/auth/signup`,
    },
    transactions: `${API_BASE_URL}/api/v1/transactions`,
    analytics: `${API_BASE_URL}/api/v1/analytics`,
    kpi: `${API_BASE_URL}/api/v1/kpi`,
    financialInsights: `${API_BASE_URL}/api/v1/financial-insights`,
    recurrentEntries: `${API_BASE_URL}/api/v1/recurrent-entries`,
    financialWidgets: `${API_BASE_URL}/api/v1/financial-widgets`,
    travelExpenses: `${API_BASE_URL}/api/v1/travel-expenses`,
    chatbot: `${API_BASE_URL}/api/v1/chatbot`,
};
