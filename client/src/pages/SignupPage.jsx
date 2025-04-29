// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-hot-toast';
// import React from 'react';

// const SignupPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear error when user types
//     if (errors[e.target.name]) {
//       setErrors(prev => ({ ...prev, [e.target.name]: '' }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("handle submit after login ")
//     if (!validateForm()) return;
    
//     setLoading(true);
//     setErrors({});

//     try {
//       const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       console.log("data after signup is ", data, response)
//       if (!response.ok) {
//         // Handle specific error cases
//         if (data.message.includes('email')) {
//           throw new Error('This email is already registered');
//         }
//         throw new Error(data.message || 'Signup failed. Please try again.');
//       }

//       // Show success message
//       toast.success('Account created successfully!');
      
//       // Automatically log in the user after signup
//       if (data.token && data.user) {
//         login(data.user, data.token);
//         console.log("login hua hain ")
//         navigate('/notes');
//       } else {
//         navigate('/login');
//       }
//     } catch (err) {
//       toast.error(err.message);
//       console.error('Signup error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
//       <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="p-6">
//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
          
//           <form onSubmit={handleSubmit} noValidate>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                 Full Name
//               </label>
//               <input
//                 className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                   errors.name ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 id="name"
//                 name="name"
//                 type="text"
//                 placeholder="John Doe"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
//               )}
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                 Email
//               </label>
//               <input
//                 className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
//               )}
//             </div>
            
//             <div className="mb-6">
//               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                 Password
//               </label>
//               <input
//                 className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="********"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 minLength="6"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
//               )}
//             </div>
            
//             <div className="flex items-center justify-between">
//               <button
//                 className={`bg-blue-600 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
//                   loading ? 'opacity-75 cursor-not-allowed' : ''
//                 }`}
//                 type="submit"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating Account...
//                   </>
//                 ) : 'Sign Up'}
//               </button>
//             </div>
//           </form>
          
//           <div className="text-center mt-4">
//             <p className="text-sm text-gray-600">
//               Already have an account?{' '}
//               <Link to="/login" className="text-blue-600 hover:underline">
//                 Login
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;



import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

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
    } else if (stepNumber === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (stepNumber === 3 && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (stepNumber === 3 && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!validateStep(2)) return;
    
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
          navigate('/notes');
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
    <div className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
          
          <div className="flex mb-6">
            <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {step >= 1 ? '✓' : '1'}
              </div>
              <p className="text-xs mt-1">Name</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {step >= 2 ? (step > 2 ? '✓' : '2') : '2'}
              </div>
              <p className="text-xs mt-1">Email</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`h-1 w-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                3
              </div>
              <p className="text-xs mt-1">Password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.name}</p>
                )}
              </div>
            )}

            {step === 2 && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                  )}
                </div>

                {otpSent && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                      Enter OTP
                    </label>
                    <input
                      className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      We've sent a verification code to {formData.email}
                    </p>
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
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
                {errors.password && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  Back
                </button>
              )}
              
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                } ${step === 1 ? 'w-full' : 'flex-1 ml-2'}`}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {step === 1 ? 'Continue' : 
                     step === 2 ? (otpSent ? 'Verify OTP' : 'Send OTP') : 
                     'Sign Up'}
                  </>
                ) : (
                  step === 1 ? 'Continue' : 
                  step === 2 ? (otpSent ? 'Verify OTP' : 'Send OTP') : 
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
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