import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

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
                localStorage.setItem('user', JSON.stringify(data.user || data));
                navigate('/profile');
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
        <div className="min-h-screen flex flex-col lg:flex-row font-['Poppins'] bg-[#fdfaf0]">
            {/* Left Side - Form Section */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white order-2 lg:order-2 relative"
            >
                <Link 
                    to="/" 
                    className="absolute top-8 left-8 flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#b5242c] transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="max-w-[420px] w-full">
                    <div className="mb-6">
                        <h1 className="text-[28px] font-bold text-[#242424] leading-tight">
                            Welcome Back to <span className="text-[#b5242c]">Shinefiling</span>
                        </h1>
                        <p className="text-[#888] text-[13px] mt-2 leading-snug max-w-[280px]">
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
                                <label className="text-[12px] font-bold text-[#242424] uppercase tracking-tight ml-1">Email Address</label>
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
                                        className="block w-full pl-12 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] focus:ring-4 focus:ring-[#b5242c]/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-[#242424] uppercase tracking-tight ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"} 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••" 
                                        className="block w-full pl-12 pr-12 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] focus:ring-4 focus:ring-[#b5242c]/5 transition-all"
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
                                    <div className={`w-5 h-5 border border-[#eee] rounded-md flex items-center justify-center transition-all ${formData.rememberMe ? 'bg-[#b5242c] border-[#b5242c]' : 'group-hover:border-[#b5242c]'}`}>
                                        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${formData.rememberMe ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className="text-[#666] select-none">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-[#b5242c] font-medium hover:underline">Forgot Password?</Link>
                            </div>

                            <button 
                                disabled={isLoading}
                                className={`w-full bg-[#b5242c] text-white py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b5242c]/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a11f27] hover:-translate-y-0.5 active:translate-y-0'}`}
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
                                        className="block w-full pl-12 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-2xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full bg-[#b5242c] text-white py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b5242c]/10 ${(isLoading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a11f27] hover:-translate-y-0.5 active:translate-y-0'}`}
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
                                        className="text-[#b5242c] font-bold hover:underline"
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

                            <div className="flex justify-center">
                                <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#eee] rounded-md hover:bg-[#f9fafb] transition-all font-medium text-sm text-[#444]">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                    Sign in with Google
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'login' && (
                        <p className="mt-4 text-center text-sm text-[#888]">
                            Don't have an account? <Link to="/signup" className="text-[#b5242c] font-bold hover:underline">Register Now</Link>
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Left Side - Branding/Visual */}
            <div className="w-full lg:w-1/2 relative overflow-hidden order-1 lg:order-1 min-h-[500px]">
                {/* Image as background */}
                <img 
                    src={`${import.meta.env.BASE_URL}loginimage.png`} 
                    alt="Login Visual" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default Login;
