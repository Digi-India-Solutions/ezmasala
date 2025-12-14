'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserCredentials } from '@/store/slices/authSlice';
import api from '@/lib/api';

type View = 'login' | 'signup' | 'signupOtp' | 'forgotPassword' | 'forgotOtp' | 'resetPassword';

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [view, setView] = useState<View>('login');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Signup form data
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Forgot password data
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (user) {
      router.push(`/${user.firstName.toLowerCase()}`);
    }
  }, [user, router]);

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input if digit entered
    if (digit && index < 5) {
      setTimeout(() => {
        otpRefs.current[index + 1]?.focus();
        otpRefs.current[index + 1]?.select();
      }, 0);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        // Clear current field
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous field and clear it
        newOtp[index - 1] = '';
        setOtp(newOtp);
        setTimeout(() => {
          otpRefs.current[index - 1]?.focus();
        }, 0);
      }
      return;
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      otpRefs.current[index - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      otpRefs.current[index + 1]?.focus();
      return;
    }

    // Allow only digits
    if (!/^\d$/.test(e.key) && !['Tab', 'Delete', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = ['', '', '', '', '', ''];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus the next empty field or the last field
    const nextEmptyIndex = newOtp.findIndex(d => !d);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    setTimeout(() => {
      otpRefs.current[focusIndex]?.focus();
    }, 0);
  };

  const handleOtpFocus = (index: number) => {
    // Select the content when focused
    otpRefs.current[index]?.select();
  };

  const resetOtp = () => setOtp(['', '', '', '', '', '']);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post('/auth/user/login', loginData);
      dispatch(setUserCredentials({ user: data.user, token: data.token }));
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Signup - Send OTP
  const handleSignupSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/user/send-otp', {
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
      });
      toast.success('OTP sent to your email!');
      setView('signupOtp');
      setCountdown(60);
      resetOtp();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Signup - Verify OTP
  const handleSignupVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const data = await api.post('/auth/user/verify-otp', {
        email: signupData.email,
        otp: otpString,
      });
      dispatch(setUserCredentials({ user: data.user, token: data.token }));
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Signup - Resend OTP
  const handleSignupResendOtp = async () => {
    if (countdown > 0) return;
    setResendLoading(true);

    try {
      await api.post('/auth/user/resend-otp', { email: signupData.email });
      toast.success('OTP resent successfully!');
      resetOtp();
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // Forgot Password - Send OTP
  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/user/forgot-password', { email: forgotEmail });
      toast.success('OTP sent to your email!');
      setView('forgotOtp');
      setCountdown(60);
      resetOtp();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Verify OTP
  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/user/verify-reset-otp', {
        email: forgotEmail,
        otp: otpString,
      });
      toast.success('OTP verified! Set your new password.');
      setView('resetPassword');
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password - Resend OTP
  const handleForgotResendOtp = async () => {
    if (countdown > 0) return;
    setResendLoading(true);

    try {
      await api.post('/auth/user/resend-reset-otp', { email: forgotEmail });
      toast.success('OTP resent successfully!');
      resetOtp();
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/user/reset-password', {
        email: forgotEmail,
        otp: otp.join(''),
        newPassword,
      });
      toast.success('Password reset successfully! Please login.');
      setView('login');
      setLoginData({ email: forgotEmail, password: '' });
      setForgotEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
      resetOtp();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Password toggle icon
  const EyeIcon = ({ show }: { show: boolean }) => (
    show ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  );

  // OTP Input render helper
  const renderOtpInputs = () => (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { otpRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(index, e.target.value)}
          onKeyDown={(e) => handleOtpKeyDown(index, e)}
          onFocus={() => handleOtpFocus(index)}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/20 outline-none text-black transition-all"
        />
      ))}
    </div>
  );

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-black">Redirecting...</p>
      </div>
    );
  }

  // Render based on current view
  const renderContent = () => {
    switch (view) {
      // SIGNUP OTP VERIFICATION
      case 'signupOtp':
        return (
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-4">Verify Email</h2>
            <p className="text-base text-gray-600 text-center mb-8">
              We've sent a 6-digit OTP to<br />
              <span className="font-semibold text-black">{signupData.email}</span>
            </p>

            <form onSubmit={handleSignupVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-3 text-center">Enter OTP</label>
                {renderOtpInputs()}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Didn't receive the code?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-400">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignupResendOtp}
                    disabled={resendLoading}
                    className="font-semibold text-black hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </p>

              <button
                type="button"
                onClick={() => { setView('signup'); resetOtp(); }}
                className="w-full text-sm text-gray-600 hover:text-black hover:underline"
              >
                ← Back to signup
              </button>
            </form>
          </div>
        );

      // FORGOT PASSWORD - EMAIL
      case 'forgotPassword':
        return (
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-4">Forgot Password?</h2>
            <p className="text-base text-gray-600 text-center mb-8">
              Enter your email and we'll send you an OTP to reset your password.
            </p>

            <form onSubmit={handleForgotSendOtp} className="space-y-6">
              <div>
                <label className="block text-base font-semibold mb-3 text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <button
                type="button"
                onClick={() => setView('login')}
                className="w-full text-sm text-gray-600 hover:text-black hover:underline"
              >
                ← Back to login
              </button>
            </form>
          </div>
        );

      // FORGOT PASSWORD - OTP
      case 'forgotOtp':
        return (
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-4">Verify OTP</h2>
            <p className="text-base text-gray-600 text-center mb-8">
              We've sent a 6-digit OTP to<br />
              <span className="font-semibold text-black">{forgotEmail}</span>
            </p>

            <form onSubmit={handleForgotVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-3 text-center">Enter OTP</label>
                {renderOtpInputs()}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Didn't receive the code?{' '}
                {countdown > 0 ? (
                  <span className="text-gray-400">Resend in {countdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleForgotResendOtp}
                    disabled={resendLoading}
                    className="font-semibold text-black hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </p>

              <button
                type="button"
                onClick={() => { setView('forgotPassword'); resetOtp(); }}
                className="w-full text-sm text-gray-600 hover:text-black hover:underline"
              >
                ← Change email
              </button>
            </form>
          </div>
        );

      // RESET PASSWORD
      case 'resetPassword':
        return (
          <div className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-black mb-4">Set New Password</h2>
            <p className="text-base text-gray-600 text-center mb-8">
              Create a strong password for your account
            </p>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-base font-semibold mb-3 text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                  >
                    <EyeIcon show={showPassword} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-base font-semibold mb-3 text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                  >
                    <EyeIcon show={showConfirmPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        );

      // LOGIN
      case 'login':
        return (
          <>
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setView('login')}
                className="flex-1 py-4 font-semibold text-sm text-black border-b-2 border-black bg-gray-50"
              >
                Login
              </button>
              <button
                onClick={() => setView('signup')}
                className="flex-1 py-4 font-semibold text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Sign Up
              </button>
            </div>

            <div className="p-8 md:p-12">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-base font-semibold mb-3 text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-base font-semibold text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => setView('forgotPassword')}
                      className="text-sm text-gray-600 hover:text-black hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
            </div>
          </>
        );

      // SIGNUP
      case 'signup':
        return (
          <>
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setView('login')}
                className="flex-1 py-4 font-semibold text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                Login
              </button>
              <button
                onClick={() => setView('signup')}
                className="flex-1 py-4 font-semibold text-sm text-black border-b-2 border-black bg-gray-50"
              >
                Sign Up
              </button>
            </div>

            <div className="p-8 md:p-12">
              <form onSubmit={handleSignupSendOtp} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold mb-3 text-gray-700">First Name</label>
                    <input
                      type="text"
                      required
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold mb-3 text-gray-700">Last Name</label>
                    <input
                      type="text"
                      required
                      value={signupData.lastName}
                      onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                      className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold mb-3 text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold mb-3 text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      <EyeIcon show={showPassword} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold mb-3 text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3.5 md:py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-black pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
                    >
                      <EyeIcon show={showConfirmPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3.5 md:py-4 rounded-xl font-semibold text-base md:text-lg hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Continue'}
                </button>
              </form>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-4 md:py-8 bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
