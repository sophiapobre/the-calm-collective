import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API_URL from '../../config';
import './Signup.css';
import PasswordRequirements, { getPasswordRequirements } from '../passwordrequirements/PasswordRequirements';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRequirements = getPasswordRequirements(password);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/';

  // Password requirement validation
  const isPasswordValid = Object.values(passwordRequirements).every(req => req === true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in.',
          from: from 
        }
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setError(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Sign Up</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="12"
              disabled={loading}
              aria-invalid={!isPasswordValid}
            />
          </div>

          <PasswordRequirements requirements={passwordRequirements} />

          <button
            className="login-button-submit"
            type="submit"
            disabled={loading || !isPasswordValid} // Disable when password requirements not met
            title={!isPasswordValid ? 'Password does not meet requirements' : ''}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <div className="signup-prompt">
            Already have an account? Login <a className="signup-link" href="/login">here</a>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;