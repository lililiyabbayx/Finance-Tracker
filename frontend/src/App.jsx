import  { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes for validation

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Redirect user to the appropriate dashboard based on their role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'personal') {
        navigate('/personal/dashboard');
      } else if (user.role === 'business') {
        navigate('/business/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Welcome to Finance Tracker</h1>
      {user && <p>Your role is: {user.role}</p>}
    </div>
  );
};

// Prop validation
Dashboard.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,  // Ensure role is a string and required
  }).isRequired,  // Ensure user object is passed and not null or undefined
};

export default Dashboard;
