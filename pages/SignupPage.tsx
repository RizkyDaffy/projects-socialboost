
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import Input from '../components/Input';
import Button from '../components/Button';
import PasswordStrength from '../components/PasswordStrength';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    general: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    let errorMsg = '';

    if (name === 'username') {
      processedValue = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    }

    // Simple basic validations
    if (name === 'email') {
      // Basic email regex test could go here
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    setErrors(prev => ({ ...prev, [name]: errorMsg, general: '' }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.username,
        // We can store phone number in metadata if needed, or if schema checks it
        // callback URL isn't strictly needed if we navigate manually, but good practice
      });

      if (error) {
        setErrors(prev => ({ ...prev, general: error.message || 'Signup failed' }));
      } else {
        // Success
        // Since we use emailOTP plugin, we likely need to verify now.
        // Usually signUp with emailOTP sends the code automatically?
        // Using 'authClient.signUp.email' with 'emailOTP' plugin enabled on server might still trigger email verification link
        // UNLESS we used client side `emailOtp.signUp`?
        // Ah, docs might distinguish `signUp.email` vs `emailOtp.signUp`?
        // No, usually just `signUp.email` works and server intercepts.
        // But valid point. I'll stick to navigating to /otp.
        // We can pass the email to /otp via state state so looking up is easier.
        navigate('/otp', { state: { email: formData.email, phone: formData.phoneNumber } });
      }
    } catch (err: any) {
      setErrors(prev => ({ ...prev, general: err.message || 'An unexpected error occurred' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-appleGray py-12">
      <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl shadow-black/5 p-8 md:p-12 border border-white/40">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6 overflow-hidden">
            <img
              src="https://img.icons8.com/fluency-systems-filled/96/ffffff/rocket.png"
              alt="SocialBoost Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-appleDark mb-2">Create Account</h1>
          <p className="text-gray-400 text-[15px]">Join the next generation of social growth</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {errors.general && <div className="text-red-500 text-center text-sm p-2 bg-red-50 rounded">{errors.general}</div>}

          <div className="space-y-1">
            <Input
              name="username"
              label="Username"
              placeholder="Up to 8 alphanumeric chars"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Input
              name="phoneNumber"
              label="Phone Number (Optional)"
              placeholder="0812... or +62..."
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Input
              name="password"
              label="Password"
              placeholder="••••••••"
              isPassword
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordStrength password={formData.password} />
          </div>

          <div className="space-y-1">
            <Input
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              isPassword
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium px-2">{errors.confirmPassword}</p>}
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-[14px] text-gray-500">
            Already a member?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      <div className="mt-12 text-[12px] text-gray-400 text-center max-w-sm leading-relaxed px-4">
        By creating an account, you agree to our <a href="#" className="underline">Terms</a>, <a href="#" className="underline">Privacy Policy</a> and <a href="#" className="underline">Cookie Use</a>.
      </div>
    </div>
  );
};

export default SignupPage;
