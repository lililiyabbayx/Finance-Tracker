import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, role }),
      });
  
      const data = await response.json();
      console.log('API Response:', data);
  
      // Assuming the backend does not return success directly, we check if the user data is present
      if (data && data.username && data.email && data.id && data.role) {
        alert('Signup successful! Please log in.');
        setTimeout(() => {
          navigate('/login'); // Navigate after the alert finishes
        }, 1000); // Delay to allow the alert to show
      } else {
        alert(data.message || 'Signup failed. Please try again.');  // Show message if available
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  
  
  

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="personal">Personal</option>
          <option value="business">Business</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
