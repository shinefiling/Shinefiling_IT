import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Github, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    
    const [signupData, setSignupData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userRole: '', // 'FREELANCER' or 'CLIENT'
        agreeTerms: false
    });

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (signupData.password !== signupData.confirmPassword) {
                setError('Passwords do not match.');
                setIsLoading(false);
                return;
            }

            if (!signupData.userRole) {
                setError('Please select your role (Freelancer or Client).');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    fullName: signupData.fullName,
                    username: signupData.username,
                    email: signupData.email,
                    password: signupData.password,
                    userRole: signupData.userRole
                })
            });

            if (response.ok) {
                setStep('otp');
            } else {
                const data = await response.json();
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please check if the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    email: signupData.email,
                    otp: otp
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user || {
                    fullName: signupData.fullName,
                    username: signupData.username,
                    email: signupData.email,
                    userRole: signupData.userRole
                }));
                navigate('/profile');
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/resend-otp', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ email: signupData.email })
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
                            Begin Your <span className="text-[#b5242c]">Journey</span>
                        </h1>
                        <p className="text-[#888] text-[13px] mt-2 leading-snug max-w-[280px]">
                            {step === 'details' 
                                 ? "Create your professional account to browse premium projects."
                                 : `Security code sent to ${signupData.email}.`
                            }
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                            {error}
                        </div>
                    )}

                    {step === 'details' ? (
                        <form onSubmit={handleSignup} className="space-y-2.5">
                            {/* Role Selection */}
                            <div className="space-y-2 mb-4">
                                <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1">I want to register as a:</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSignupData({...signupData, userRole: 'FREELANCER'})}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                            signupData.userRole === 'FREELANCER' 
                                            ? 'border-[#b5242c] bg-[#b5242c]/5 text-[#b5242c]' 
                                            : 'border-[#eee] hover:border-[#b5242c]/30 text-gray-500'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${signupData.userRole === 'FREELANCER' ? 'bg-[#b5242c] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <User size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold">Freelancer</span>
                                        <span className="text-[10px] opacity-60">I'm here to work</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSignupData({...signupData, userRole: 'CLIENT'})}
                                        className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                            signupData.userRole === 'CLIENT' 
                                            ? 'border-[#b5242c] bg-[#b5242c]/5 text-[#b5242c]' 
                                            : 'border-[#eee] hover:border-[#b5242c]/30 text-gray-500'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${signupData.userRole === 'CLIENT' ? 'bg-[#b5242c] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <ShieldCheck size={16} />
                                        </div>
                                        <span className="text-[13px] font-bold">Client</span>
                                        <span className="text-[10px] opacity-60">I'm here to hire</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                            <User size={16} />
                                        </div>
                                        <input 
                                            required
                                            type="text" 
                                            value={signupData.fullName}
                                            onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                                            placeholder="John Doe" 
                                            className="block w-full pl-11 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                            <User size={16} />
                                        </div>
                                        <input 
                                            required
                                            type="text" 
                                            value={signupData.username}
                                            onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                                            placeholder="johndoe" 
                                            className="block w-full pl-11 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Mail size={16} />
                                    </div>
                                    <input 
                                        required
                                        type="email" 
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                                        placeholder="your@email.com" 
                                        className="block w-full pl-11 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"} 
                                        value={signupData.password}
                                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                                        placeholder="••••••••" 
                                        className="block w-full pl-11 pr-12 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#ccc] hover:text-[#888] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-[#242424] uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Lock size={16} />
                                    </div>
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"} 
                                        value={signupData.confirmPassword}
                                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                                        placeholder="••••••••" 
                                        className="block w-full pl-11 pr-12 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="py-2">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        required
                                        checked={signupData.agreeTerms}
                                        onChange={(e) => setSignupData({...signupData, agreeTerms: e.target.checked})}
                                    />
                                    <div className={`mt-0.5 w-5 h-5 border border-[#eee] rounded-md flex items-center justify-center transition-all shrink-0 ${signupData.agreeTerms ? 'bg-[#b5242c] border-[#b5242c]' : 'group-hover:border-[#b5242c]'}`}>
                                        <div className={`w-2 h-2 bg-white rounded-sm transition-all ${signupData.agreeTerms ? 'scale-100' : 'scale-0'}`}></div>
                                    </div>
                                    <span className="text-[13px] text-[#666] leading-snug select-none">
                                        I agree to the <a href="#" className="text-[#242424] font-bold hover:text-[#b5242c] underline">Terms of Service</a> and <a href="#" className="text-[#242424] font-bold hover:text-[#b5242c] underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            <button 
                                disabled={isLoading}
                                className={`w-full bg-[#b5242c] text-white py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b5242c]/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a11f27] hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        Create Account <ArrowRight size={18} />
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
                                        Verify Email <ArrowRight size={18} />
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
                                    onClick={() => setStep('details')}
                                    className="mt-4 text-xs text-[#bbb] hover:text-[#888] underline transition-colors"
                                >
                                    Change email address
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'details' && (
                        <>
                            <div className="mt-4">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-[#eee]"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
                                        <span className="bg-white px-4 text-[#bbb]">Or register with</span>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#eee] rounded-md hover:bg-[#f9fafb] transition-all font-medium text-sm text-[#444]">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                        Sign up with Google
                                    </button>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-sm text-[#888]">
                                Already have an account? <a href="/login" className="text-[#b5242c] font-bold hover:underline">Sign In</a>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Left Side - Branding/Visual */}
            <div className="w-full lg:w-1/2 relative overflow-hidden order-1 lg:order-1 min-h-[500px] bg-[#242424]">
                {/* Image as background */}
                <img 
                    src={`${import.meta.env.BASE_URL}signup.jpeg`} 
                    alt="Registration Visual" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Lighter Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                {/* Content at the bottom for a modern magazine feel */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 h-full flex flex-col justify-end p-10 text-white"
                >
                    <div className="max-w-xs">
                        <h2 className="text-3xl font-bold mb-4 leading-tight">Join the Marketplace</h2>
                        <p className="text-white/70 text-sm leading-relaxed font-light">
                            Access premium IT projects and start your journey as a top freelancer today. Build your portfolio and work with global brands.
                        </p>
                        <div className="w-12 h-1 bg-[#b5242c] mt-6 rounded-full"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
