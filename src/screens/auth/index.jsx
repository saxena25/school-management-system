import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export async function authLoader(){
    return {}
}

function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Determine role from email
    let role;
    const emailPrefix = formData.email.split('@')[0];
    if (emailPrefix === 'student') {
      role = 'student';
    } else if (emailPrefix === 'teacher') {
      role = 'teacher';
    } else if (emailPrefix === 'principal') {
      role = 'principal';
    } else if (emailPrefix === 'admin') {
      role = 'admin';
    } else {
      setError('Invalid email. Use format: role@school.com');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      try {
        login(formData.email, formData.password, role);
        navigate('/dashboard');
      } catch (err) {
        setError('Login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">EduMS</h2>
          <p className="text-gray-600 text-sm mt-1">School Management System</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 size-5" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-black"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400 size-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Password"
              className="w-full text-black pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            {/* Eye Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Demo Credentials Hint */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 text-xs font-medium mb-2">Demo Credentials:</p>
            <p className="text-blue-800 text-xs">
              Student: student@school.com<br />
              Teacher: teacher@school.com<br />
              Principal: principal@school.com<br />
              Admin: admin@school.com<br />
              Password: demo123
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>Use the demo credentials above to login</p>
          <p className="mt-2">The role is determined by the email prefix</p>
        </div>
      </div>
    </div>
  );
}

export default Auth
