import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndividualDashboard from './pages/IndividualDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminDashboard from './pages/adminDashboard.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/individual" element={<IndividualDashboard />} />
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
