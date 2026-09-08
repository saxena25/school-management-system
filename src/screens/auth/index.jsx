import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Shield, Sparkles } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { softHover } from '../../utils/motion';

export async function authLoader() {
  return {};
}

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
  }, [formData.email, formData.password]);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await dispatch(
        loginUser({ email: formData.email, password: formData.password })
      ).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Login failed. Please try again.');
    }
  };

  const fillDemo = (email) => {
    setFormData({ email, password: 'demo123' });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4">
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 flex justify-center"
          >
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-600/30">
              <Shield className="h-8 w-8" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">EduMS</h2>
          <p className="mt-1 text-sm text-gray-600">
            Dynamic school management — sign in to continue
          </p>
        </div>

        <AnimatePresence>
          {(error || authError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <p className="text-sm font-medium text-red-700">
                {error || authError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 size-5 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-black outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 size-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              placeholder="Password"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-12 text-black outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              disabled={loading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3">
            <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-blue-900">
              <Sparkles className="h-3.5 w-3.5" />
              Demo accounts (password: demo123)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'student@school.com',
                'teacher@school.com',
                'principal@school.com',
                'admin@school.com',
              ].map((email) => (
                <motion.button
                  key={email}
                  type="button"
                  {...softHover}
                  onClick={() => fillDemo(email)}
                  className="rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-left text-[11px] font-medium text-blue-800 hover:bg-blue-100"
                >
                  {email.split('@')[0]}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default Auth;
