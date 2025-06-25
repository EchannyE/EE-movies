import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../Components/Button';
import { Link } from 'react-router-dom';
import { login } from '../Api/auth'; // Corrected import to 'login'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Effect to redirect if the user is already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      // Redirect to the 'from' path, or to the user's profile if 'from' is just '/'
      const redirectPath = from === '/' ? `/profile/${JSON.parse(localStorage.getItem("currentUser"))?.id}` : from;
      navigate(redirectPath, { replace: true });
    }
  }, [from, navigate]); // Depend on 'from' and 'navigate'

  // If user is already logged in, return null to prevent rendering the form
  if (localStorage.getItem("token")) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const res = await login(email, password); // Used the corrected 'login' function
      localStorage.setItem("token", res.token);
      localStorage.setItem("currentUser", JSON.stringify(res.user));

      // Redirect to the 'from' path, or to the user's profile if 'from' is just '/'
      const redirectPath = from === '/' ? `/profile/${res.user.id}` : from;
      navigate(redirectPath, { replace: true });

    } catch (err) {
      console.error("Login error:", err); // Log the full error for debugging
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-gray-900 h-screen flex items-center justify-center">
      <div className='max-w-md w-full p-8 bg-gray-950 rounded-lg shadow-2xl'>
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
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

          <Button title="Log In" loading={loading} />

          {error && (
            <div className="mt-4 text-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="mt-4 text-center">
            {/* Corrected to be a Link component for interactivity and accessibility */}
            <Link to="/forgot-password" className="text-sm text-gray-400 hover:underline cursor-pointer">
              Forgot Password?
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-6 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-400 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;