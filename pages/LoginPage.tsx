
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import Input from '../components/Input';
import Button from '../components/Button';
import SocialButton from '../components/SocialButton';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password
      });

      if (error) {
        setError(error.message || 'Login failed. Please check your credentials.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/dashboard' // Redirect to dashboard after success
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-appleGray">
      <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-black/5 p-8 md:p-12 border border-white/40">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 overflow-hidden">
            <img
              src="https://img.icons8.com/fluency-systems-filled/96/ffffff/rocket.png"
              alt="SocialBoost Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-appleDark mb-2">SocialBoost</h1>
          <p className="text-gray-400 text-[15px]">Sign in to elevate your social presence</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              isPassword
            />
          </div>

          {error && <p className="text-[12px] text-red-500 font-medium px-2">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Continue'}
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-medium tracking-wider">or continue with</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SocialButton provider="google" onClick={() => handleSocialLogin('google')} />
          <SocialButton provider="facebook" onClick={() => handleSocialLogin('facebook')} />
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-[14px] text-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>

      {/* Policy Links */}
      <div className="mt-12 flex gap-6 text-[12px] text-gray-400 font-medium">
        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
};

export default LoginPage;
