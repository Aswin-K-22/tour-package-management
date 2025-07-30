import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/authApi';
import useAuth from '../hooks/useAuth';


function Login() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     //const data =  await loginApi(email, password);
     //Login(data);
      navigate('/country/list');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
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
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;