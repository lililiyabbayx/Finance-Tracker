import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    // Add logic for user registration (e.g., store credentials in backend)
    alert('Account created successfully');
    navigate('/dashboard'); // Redirect to dashboard after successful signup
  };

  return (
    <div>
      <h2>Signup</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default SignupPage;
