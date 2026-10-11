
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authClient } from '../lib/auth-client';
import Button from '../components/Button';

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits
  const [timer, setTimer] = useState(179); // 02:59 in seconds
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      // If we don't have an email to verify, redirect to signup
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}.${secs.toString().padStart(2, '0')}`;
  };

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    const char = value.slice(-1);
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-focus next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      setError("Please enter complete code");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: email,
        otp: otpCode
      });

      if (error) {
        setError(error.message || "Verification failed");
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(179);
      try {
        await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "email-verification"
        });
      } catch (e) {
        console.error("Resend failed", e);
      }
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[480px] flex flex-col items-center">

        {/* Back Button */}
        <button
          onClick={() => navigate('/signup')}
          className="self-start mb-8 text-gray-400 hover:text-appleDark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>

        {/* Content */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-[28px] font-bold text-appleDark">Check your email</h1>
          <p className="text-gray-500 text-[15px]">We've sent a code to</p>
          <p className="text-appleDark font-bold text-[16px] tracking-wide mt-2">
            {email}
          </p>
        </div>

        {/* OTP Input Grid */}
        <div className="flex gap-2 mb-8 justify-center w-full">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-white border-[1.5px] border-gray-300 rounded-[12px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
            />
          ))}
        </div>

        {error && <div className="text-red-500 text-sm mb-6 font-medium">{error}</div>}

        {/* Action Button */}
        <Button
          className="py-4.5 text-[17px] font-bold tracking-tight shadow-md"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </Button>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-gray-500 text-[14px]">
            Resend in <span className="font-bold text-appleDark">{formatTime(timer)}s</span>
          </p>
          <div className="flex items-center justify-center gap-1.5 text-[14px]">
            <span className="text-gray-500">Didn't receive code?</span>
            <button
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-bold transition-colors ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:text-blue-700'}`}
            >
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
