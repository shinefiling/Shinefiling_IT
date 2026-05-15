import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useGoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<'login' | 'otp'>('login');
    const [otp, setOtp] = useState('');
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                localStorage.setItem('user', JSON.stringify(data));
                
                // Redirect based on role
                if (data.userRole === 'ADMIN') {
                    navigate('/admin-dashboard');
                } else if (data.userRole === 'CLIENT') {
                    navigate('/client-profile');
                } else {
                    navigate('/profile');
                }
            } else if (response.status === 403) {
                // Email not verified
                setError('Please verify your email to continue.');
                setStep('otp');
            } else {
                setError(data.message || 'Invalid email or password.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse: any) => {
            setIsLoading(true);
            setError('');
            try {
                // 1. Fetch User Info using Access Token
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await userInfoRes.json();
                const { email, name, sub: googleId, picture: profileImage } = userInfo;

                // 2. Send to Backend
                const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ 
                        email, 
                        name, 
                        googleId, 
                        profileImage,
                        userRole: 'FREELANCER', // Default role for login if not exist
                        isSignup: false
                    })
                });
                
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user || data));
                    if (data.userRole === 'ADMIN') navigate('/admin-dashboard');
                    else if (data.userRole === 'CLIENT') navigate('/client-profile');
                    else navigate('/profile');
                } else {
                    setError(data.message || 'Google login failed.');
                }
            } catch (err) {
                console.error("Google Login Error:", err);
                setError('Google login failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error: any) => {
            console.error('Google Login Failed:', error);
            setError('Google login was cancelled or failed.');
        }
    });

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otp
                })
            });

            if (response.ok) {
                const data = await response.json();
                const user = data.user || data;
                localStorage.setItem('user', JSON.stringify(user));
                
                if (user.userRole === 'CLIENT') {
                    navigate('/client-profile');
                } else {
                    navigate('/profile');
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid OTP.');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ email: formData.email })
            });
            if (response.ok) {
                alert('OTP resent successfully!');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to resend OTP.');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {/* Left Side - Form Section */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white order-2 lg:order-2 relative"
            >
                <div className="max-w-[420px] lg:max-w-[540px] w-full">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-[17px] sm:text-[13px] font-bold text-gray-400 hover:text-[#0F2E4B] transition-all group mb-8"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="mb-6">
                        <h1 className="text-[30px] sm:text-[28px] font-bold text-[#0F2E4B] leading-tight uppercase tracking-tighter">
                            Welcome Back to <span className="text-[#317CD7]">Shinefiling</span>
                        </h1>
                        <p 
                            className="mt-2 leading-snug max-w-[400px]"
                            style={{ 
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '15px',
                                fontWeight: 500,
                                lineHeight: '26px',
                                color: 'rgb(33, 33, 33)'
                            }}
                        >
                            {step === 'login' 
                                ? "Sign in to access your professional dashboard and projects."
                                : `Verification code sent to ${formData.email}.`
                            }
                        </p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 border-l-4 text-sm rounded-r-lg ${step === 'otp' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                            {error}
                        </div>
                    )}

                    {step === 'login' ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="space-y-1">
                                <label className="form-label">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        required
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="Enter your email" 
                                        className="form-input-field pl-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="form-label">Password</label>
                                    <Link to="/forgot-password" title="Forgot Password" className="text-[12px] font-bold text-[#317CD7] hover:underline mb-2">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"} 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="Enter your password" 
                                        className="form-input-field pl-12"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#ccc] hover:text-[#888] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={formData.rememberMe}
                                        onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                                    />
                                    <div className={`w-5 h-5 border border-[#eee] rounded-md flex items-center justify-center transition-all ${formData.rememberMe ? 'bg-[#0F2E4B] border-[#0F2E4B]' : 'group-hover:border-[#0F2E4B]'}`}>
                                        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${formData.rememberMe ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className="text-[#666] select-none text-[16px] sm:text-sm">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-[#0F2E4B] font-medium hover:underline text-[16px] sm:text-sm">Forgot Password?</Link>
                            </div>

                            <button 
                                disabled={isLoading}
                                className={`w-full bg-[#317CD7] text-white py-4 sm:py-2.5 rounded-md font-extrabold uppercase tracking-widest text-[16px] sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#317CD7]/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2563b5] hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Sign In <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1 text-center block">Verification Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <input 
                                        required
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000000" 
                                        className="block w-full pl-12 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-2xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-[#317CD7] transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full bg-[#0F2E4B] text-white py-3.5 sm:py-2.5 rounded-md font-extrabold uppercase tracking-widest text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0F2E4B]/10 ${(isLoading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#317CD7] hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Verify & Login <ArrowRight size={18} />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-[#888]">
                                    Didn't receive the code?{' '}
                                    <button 
                                        type="button" 
                                        onClick={handleResendOtp}
                                        className="text-[#0F2E4B] font-bold hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                </p>
                                <button 
                                    type="button" 
                                    onClick={() => setStep('login')}
                                    className="mt-4 text-xs text-[#bbb] hover:text-[#888] underline transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'login' && (
                        <div className="mt-4">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#eee]"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-[#888] font-medium">Or continue with</span>
                                </div>
                            </div>

                            <div className="flex justify-center w-full">
                                <button 
                                    type="button"
                                    onClick={() => handleGoogleLogin()}
                                    className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#eee] rounded-md hover:bg-gray-50 transition-all font-medium text-[#444] text-sm"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                    Sign in with Google
                                </button>
                            </div>
                        </div>
                    )}

                        <p 
                            className="mt-4 text-center"
                            style={{ 
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: 'rgb(33, 33, 33)'
                            }}
                        >
                            Don't have an account? <Link to="/signup" className="text-[#317CD7] font-bold hover:underline">Register Now</Link>
                        </p>
                </div>
            </motion.div>

            {/* Left Side - Branding/Visual */}
            <div className="hidden lg:block w-full lg:w-1/2 relative overflow-hidden order-1 lg:order-1 min-h-[500px]">
                {/* Image as background */}
                <img 
                    src="loginimage.png" 
                    alt="Login Visual" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default Login;
