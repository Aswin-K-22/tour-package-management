import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MapPin, Plane, User, Mail, Lock } from "lucide-react";
import { signup, login } from "../services/authApi"; 
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const AdminAuthPage = () => {
  const { user, isLoggedIn, login: loginContext } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isLoggedIn && user) {
      navigate("/admin/dashboard");
    }
  }, [isLoggedIn, user, navigate]);

  const dummyData = {
    login: {
      email: "admin@example.com",
      password: "password123",
    },
    signup: {
      name: "Admin User",
      email: "newadmin@example.com",
      password: "password123",
    },
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (isLogin) {
      if (!email.trim()) {
        newErrors.email = "Email cannot be empty or whitespace.";
        isValid = false;
      }
      if (!password.trim()) {
        newErrors.password = "Password cannot be empty or whitespace.";
        isValid = false;
      }
    } else {
      if (!name.trim()) {
        newErrors.name = "Name cannot be empty or whitespace.";
        isValid = false;
      }
      if (!email.trim()) {
        newErrors.email = "Email cannot be empty or whitespace.";
        isValid = false;
      }
      if (!password.trim()) {
        newErrors.password = "Password cannot be empty or whitespace.";
        isValid = false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (password.trim() && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isLogin) {
        const userData = await login(formData.email, formData.password); // Use actual login API
        loginContext(userData); // Update context with user data
        console.log("Login Data:", {
          email: formData.email,
          password: formData.password,
        });
        console.log("Expected Login Data:", dummyData.login);
       toast.success('Login successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      } else {
        const userData = await signup(formData.name, formData.email, formData.password);
        loginContext(userData); // Update context with user data
        console.log("Signup Response:", userData);
        console.log("Signup Data:", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        console.log("Expected Signup Data:", dummyData.signup);
         toast.success("Signup successful! Redirecting to dashboard...", {
        position: 'top-right',
        autoClose: 3000,
      });
      }
    } catch (error) {
      console.error("Error during submission:", error);
     toast.error(`Error during ${isLogin ? "login" : "signup"}: ${error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
    setErrors({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Plane className="absolute top-20 left-20 w-6 h-6 text-white opacity-10 transform rotate-45" />
        <MapPin className="absolute top-40 right-32 w-5 h-5 text-white opacity-10" />
        <Plane className="absolute bottom-32 right-20 w-4 h-4 text-white opacity-10 transform -rotate-12" />
        <MapPin className="absolute bottom-20 left-32 w-6 h-6 text-white opacity-10" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Tour Admin Panel
            </h1>
            <p className="text-blue-100 text-sm">
              Manage your travel packages with ease
            </p>
          </div>

          <div className="px-8 mb-6">
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                }`}
                aria-label="Switch to login form"
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-blue-100 hover:text-white hover:bg-white/5"
                }`}
                aria-label="Switch to signup form"
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="px-8 pb-8">
            <div className="space-y-5">
              <div
                className={`transform transition-all duration-300 ${
                  isLogin
                    ? "opacity-0 max-h-0 overflow-hidden"
                    : "opacity-100 max-h-20"
                }`}
              >
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required={!isLogin}
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                        errors.name ? "border-red-500" : "border-white/20"
                      } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                      aria-label="Full Name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                    errors.email ? "border-red-500" : "border-white/20"
                  } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                  aria-label="Email Address"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${
                    errors.password ? "border-red-500" : "border-white/20"
                  } rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/10`}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-white transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label={isLogin ? "Log in to admin panel" : "Create admin account"}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-blue-200 hover:text-white text-sm transition-colors duration-200 underline hover:no-underline"
                aria-label={
                  isLogin
                    ? "Switch to create new account"
                    : "Switch to login with existing account"
                }
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-blue-200 text-center mb-2 font-medium">
                Demo Credentials:
              </p>
              <p className="text-xs text-blue-100 text-center">
                Email: admin@example.com
              </p>
              <p className="text-xs text-blue-100 text-center">
                Password: password123
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-blue-200 text-xs">
            © 2024 Tour Package Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;