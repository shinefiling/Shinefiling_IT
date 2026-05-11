import React, { useState } from 'react';
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ email })
            });
            if (response.ok) {
                setStep('otp');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ email, otp })
            });
            if (response.ok) {
                setStep('reset');
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid or expired OTP.');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ email, otp, password: newPassword })
            });
            if (response.ok) {
                alert('Password reset successful! Please login.');
                navigate('/login');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row font-['Poppins'] bg-[#fdfaf0]">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white order-2 lg:order-2 relative"
            >
                <Link 
                    to="/login" 
                    className="absolute top-8 left-8 flex items-center gap-2 text-[13px] font-bold text-gray-400 hover:text-[#b5242c] transition-all group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="max-w-[420px] w-full">
                    <div className="mb-8">
                        <h1 className="text-[28px] font-bold text-[#242424] leading-tight">
                            {step === 'email' && "Forgot Your Password?"}
                            {step === 'otp' && "Verify Your Identity"}
                            {step === 'reset' && "Set New Password"}
                        </h1>
                        <p className="text-[#888] text-[13px] mt-2 leading-snug">
                            {step === 'email' && "Enter your email address and we'll send you a code to reset your password."}
                            {step === 'otp' && `Enter the 6-digit code sent to ${email}.`}
                            {step === 'reset' && "Create a new strong password for your account."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                            {error}
                        </div>
                    )}

                    {step === 'email' && (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-[#242424] uppercase tracking-tight ml-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        required
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your registered email" 
                                        className="block w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] focus:ring-4 focus:ring-[#b5242c]/5 transition-all"
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={isLoading}
                                className={`w-full bg-[#b5242c] text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b5242c]/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a11f27] hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Send Reset Code <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}

                    {step === 'otp' && (
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
                                        className="block w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#eee] rounded-md text-2xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full bg-[#b5242c] text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b5242c]/10 ${(isLoading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a11f27] hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Verify Code <ArrowRight size={18} /></>}
                            </button>
                            <div className="text-center">
                                <p className="text-sm text-[#888]">
                                    Didn't receive the code?{' '}
                                    <button type="button" onClick={handleRequestOtp} className="text-[#b5242c] font-bold hover:underline">Resend</button>
                                </p>
                            </div>
                        </form>
                    )}

                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-[#242424] uppercase tracking-tight ml-1">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        required
                                        type={showPassword ? "text" : "password"} 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min. 8 characters" 
                                        className="block w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#ccc]"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[12px] font-bold text-[#242424] uppercase tracking-tight ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                        <Lock size={18} />
                                    </div>
                                    <input 
                                        required
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password" 
                                        className="block w-full pl-12 pr-4 py-3 bg-[#f9fafb] border border-[#eee] rounded-md text-sm focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                </div>
                            </div>
                            <button 
                                disabled={isLoading}
                                className={`w-full bg-[#b5242c] text-white py-3 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b5242c]/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#a11f27] hover:-translate-y-0.5 active:translate-y-0'}`}
                            >
                                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Update Password <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>

            <div className="w-full lg:w-1/2 relative overflow-hidden order-1 lg:order-1 min-h-[500px]">
                <img 
                    src="/loginimage.png" 
                    alt="Reset Password Visual" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default ForgotPassword;
