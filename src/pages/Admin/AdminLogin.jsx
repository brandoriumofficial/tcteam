import React, { useState } from 'react';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log('Logging in with:', formData);
      setIsLoading(false);
      alert('Login Successful! Redirecting to Dashboard...');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-green-50/50 p-4 font-sans">
      {/* Main Card Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Visual Branding */}
        <div className="w-full md:w-1/2 bg-green-800 relative hidden md:flex flex-col justify-between p-12 text-white overflow-hidden">
          {/* Background Pattern/Image Overlay */}
          <div className="absolute inset-0 bg-green-900/20 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1544367563-12123d8966cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
            alt="Traditional Herbs" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          
          {/* Content over image */}
          <div className="relative z-20">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Leaf className="w-6 h-6 text-green-100" />
              </div>
              <span className="text-lg font-semibold tracking-wide">HERBAL & CO.</span>
            </div>
            <h1 className="text-4xl font-serif font-bold leading-tight mb-4">
              Preserving Tradition, <br/> Managing Care.
            </h1>
            <p className="text-green-100 text-lg font-light opacity-90">
              Welcome to the administrative portal. Access patient records, inventory, and scheduling securely.
            </p>
          </div>

          <div className="relative z-20 text-sm text-green-200/80">
            © 2024 Traditional Care Systems. Secure Server.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex md:hidden items-center gap-2 mb-8 text-green-800 justify-center">
            <Leaf className="w-8 h-8" />
            <span className="text-xl font-bold">HERBAL & CO.</span>
          </div>

          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-serif text-green-900 font-bold mb-2">Admin Login</h2>
              <p className="text-gray-500">Please enter your credentials to access the dashboard.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-800 placeholder-gray-400"
                    placeholder="admin@traditionalcare.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 block">Password</label>
                  <a href="#" className="text-sm text-green-700 hover:text-green-800 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none text-gray-800 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-700 focus:ring-green-500 border-gray-300 rounded cursor-pointer accent-green-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                  Keep me logged in
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform ${isLoading ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5'}`}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Don't have an admin account?{' '}
                <a href="#" className="font-medium text-green-700 hover:text-green-800 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;