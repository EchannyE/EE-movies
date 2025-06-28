import React, { useState } from 'react';
import { register } from '../Api/auth'; 
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import { Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      await register(username, email, password); 
      localStorage.setItem('registrationSuccess', 'true'); // A more specific flag
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      console.error("Registration error:", err); 
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-yellow-500 h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-4 bg-gray-950 rounded-lg shadow-2xl ">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Sign Up</h2> 
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2 rounded bg-gray-700 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 rounded bg-gray-700 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 rounded bg-gray-700 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button title="Sign Up" loading={loading} />
          {error && (
            <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
          )}
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;