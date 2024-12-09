const BASE_URL = 'http://localhost:5000/api';

export const fetchUserProfile = async (id) => {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  return response.json();
};

export const updateUserProfile = async (id, data) => {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const fetchTransactions = async (userId) => {
  const response = await fetch(`${BASE_URL}/transactions?userId=${userId}`);
  return response.json();
};

export const addTransaction = async (data) => {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};
