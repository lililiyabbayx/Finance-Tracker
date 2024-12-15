import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import PersonalDashboard from './pages/PersonalDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/personal-dashboard" element={<PersonalDashboard />} />
      <Route path="/business-dashboard" element={<BusinessDashboard />} />
    </Routes>
  );
};

export default App;
