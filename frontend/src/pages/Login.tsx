import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  Briefcase,
  ArrowRight
} from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State management
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    if (error) setError(null);
  };

  // Toggle between login and signup modes
  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '' });
    setTouched({ name: false, email: false, password: false });
    setError(null);
    setShowPassword(false);
  };

  // Validate form fields
  const validateForm = (): boolean => {
    if (mode === 'signup' && !formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'signup') {
        console.log('Sign up:', formData);
        await login(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Manage tasks efficiently</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-4 text-sm font-medium transition-all relative ${
                mode === 'login' 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
              {mode === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-4 text-sm font-medium transition-all relative ${
                mode === 'signup' 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
              {mode === 'signup' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field - signup only */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                      touched.name && formData.name 
                        ? 'text-blue-500' 
                        : 'text-gray-400'
                    }`} />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                      placeholder="John Doe"
                      disabled={loading}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white ${
                        touched.name 
                          ? formData.name.trim() 
                            ? 'border-green-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500' 
                            : 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    />
                  </div>
                  {touched.name && !formData.name.trim() && (
                    <p className="text-xs text-red-500 mt-1">Name is required</p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    touched.email && formData.email 
                      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                        ? 'text-blue-500'
                        : 'text-red-400'
                      : 'text-gray-400'
                  }`} />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                    placeholder="you@example.com"
                    disabled={loading}
                    className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white ${
                      touched.email
                        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                          ? 'border-green-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                          : 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                </div>
                {touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && formData.email && (
                  <p className="text-xs text-red-500 mt-1">Valid email required</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    touched.password && formData.password 
                      ? formData.password.length >= 6
                        ? 'text-blue-500'
                        : 'text-red-400'
                      : 'text-gray-400'
                  }`} />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                    disabled={loading}
                    className={`w-full pl-10 pr-12 py-2.5 text-sm border rounded-xl outline-none transition-all bg-white ${
                      touched.password
                        ? formData.password.length >= 6
                          ? 'border-green-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500'
                          : 'border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                    } disabled:bg-gray-50 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {touched.password && formData.password.length < 6 && (
                  <p className="text-xs text-red-500 mt-1">Minimum 6 characters</p>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Alternative toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                {' '}
                <button
                  onClick={toggleMode}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure • Encrypted
        </p>
      </div>
    </div>
  );
};

export default Login;