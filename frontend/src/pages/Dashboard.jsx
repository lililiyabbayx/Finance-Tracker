import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

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
      <h1>Welcome to your Dashboard</h1>
      {user && <p>Your role is: {user.role}</p>}
      {/* You can conditionally render different components or content for each role */}
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,  // Validate that 'role' exists and is a string
  }).isRequired,  // Validate that the user object is required
};

export default Dashboard;
