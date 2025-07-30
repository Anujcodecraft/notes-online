import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import GoogleAuthButton from '../components/GoogleButton';
import { REGEX_EMAIL_TYPE } from '../lib';

const SignupPage = () => {
  const [step, setStep] = useState(1); // 1: Name, 2: Email & OTP, 3: Password
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1 && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (stepNumber === 2 && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (stepNumber === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ) {
      newErrors.email = 'Do enter the valid email id';
    }
    
    if (stepNumber === 3 && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (stepNumber === 3 && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if(stepNumber===4 && !REGEX_EMAIL_TYPE.test(formData.email)){
      newErrors.email = 'Email should be of manit campus';
      toast('⚠️ Do enter the valid email id of campus')
    } 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!validateStep(2)) return;
    if(!validateStep(4)) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.message);
      console.error('OTP sending error:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          otp
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      toast.success('Email verified successfully!');
      setStep(3); // Move to password step
    } catch (err) {
      toast.error(err.message);
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep(1)) setStep(2);
      return;
    }
    
    if (step === 2) {
      if (!otpSent) {
        await sendOTP();
      } else {
        await verifyOTP();
      }
      return;
    }
    
    if (step === 3) {
      if (!validateStep(3)) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        if (!response.ok) {
          if (data.message.includes('email')) {
            throw new Error('This email is already registered');
          }
          throw new Error(data.message || 'Signup failed. Please try again.');
        }

        toast.success('Account created successfully!');
        
        if (data.token && data.user) {
          login(data.user, data.token);
          navigate('/');
        } else {
          navigate('/login');
        }
      } catch (err) {
        toast.error(err.message);
        console.error('Signup error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create Account
        </h2>

        {/* Progress Stepper */}
        <div className="flex mb-6">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`flex-1 text-center ${step >= stepNum ? 'text-blue-600 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-blue-100 dark:bg-blue-500/20' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {step > stepNum ? '✓' : stepNum}
                </div>
                <p className="text-xs mt-1">
                  {stepNum === 1 ? 'Name' : stepNum === 2 ? 'Email' : 'Password'}
                </p>
              </div>
              {stepNum < 3 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-1 w-full ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {step === 1 && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium mb-1 sm:mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium mb-1 sm:mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>

              {otpSent && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium mb-1 sm:mb-2" htmlFor="otp">
                    Enter OTP
                  </label>
                  <input
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    We've sent a verification code to {formData.email}
                  </p>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <div>
              <label className="block text-gray-700 dark:text-gray-200 text-sm sm:text-base font-medium mb-1 sm:mb-2" htmlFor="password">
                Password
              </label>
              <input
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
              {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                disabled={loading}
              >
                Back
              </button>
            )}

            <button
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              } ${step === 1 ? 'w-full' : 'flex-1 ml-2'}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {step === 1
                    ? 'Continue'
                    : step === 2
                    ? otpSent
                      ? 'Verify OTP'
                      : 'Send OTP'
                    : 'Sign Up'}
                </>
              ) : step === 1 ? (
                'Continue'
              ) : step === 2 ? (
                otpSent ? 'Verify OTP' : 'Send OTP'
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        {/* Social Login Divider */}
        {step === 1 && (
          <>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleAuthButton className="w-full" />
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-4">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);

};

export default SignupPage;