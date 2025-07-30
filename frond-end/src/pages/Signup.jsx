import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authApi';
import useAuth from '../hooks/useAuth';


function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirect to home page if admin is already authenticated
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    navigate('/country/list');
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Admin Signup</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;