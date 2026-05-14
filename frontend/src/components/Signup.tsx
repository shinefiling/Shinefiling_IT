import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Github, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { useGoogleLogin } from '@react-oauth/google';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'role' | 'details' | 'otp'>('role');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    
    const [signupData, setSignupData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        userRole: '', // 'FREELANCER' or 'CLIENT'
        companyName: '',
        industry: '',
        website: '',
        clientType: 'Individual', // Individual or Company
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

            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
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
                    userRole: signupData.userRole,
                    companyName: signupData.companyName,
                    industry: signupData.industry,
                    website: signupData.website,
                    clientType: signupData.clientType
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
            const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
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
                const user = data.user || {
                    fullName: signupData.fullName,
                    username: signupData.username,
                    email: signupData.email,
                    userRole: signupData.userRole
                };
                localStorage.setItem('user', JSON.stringify(user));
                
                if (user.userRole === 'CLIENT') {
                    navigate('/client-profile');
                } else {
                    navigate('/profile');
                }
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
            const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
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

    const handleGoogleSignup = useGoogleLogin({
        onSuccess: async (tokenResponse: any) => {
            if (!signupData.userRole) {
                setError('Please select your role (Freelancer or Client) first.');
                return;
            }
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
                        userRole: signupData.userRole,
                        isSignup: true
                    })
                });
                
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(data.user || data));
                    if (data.userRole === 'CLIENT') navigate('/client-profile');
                    else navigate('/profile');
                } else {
                    setError(data.message || 'Google registration failed.');
                }
            } catch (err) {
                console.error("Google Signup Error:", err);
                setError('Google registration failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error: any) => {
            console.error('Google Signup Failed:', error);
            setError('Google login was cancelled or failed.');
        }
    });

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
                        className="inline-flex items-center gap-2 text-[15px] sm:text-[13px] font-bold text-gray-400 hover:text-[#0F2E4B] transition-all group mb-8"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="mb-6">
                        <h1 className="text-[28px] sm:text-[28px] font-bold text-[#0F2E4B] leading-tight uppercase tracking-tighter">
                            {step === 'role' ? "How would you like to join?" : "Begin Your "}
                            <span className="text-[#317CD7]">{step === 'role' ? "Shinefiling" : "Journey"}</span>
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
                            {step === 'role' 
                                ? "Choose your role to get started with the right platform experience."
                                : step === 'details'
                                ? `Complete your ${signupData.userRole?.toLowerCase()} profile to access premium features.`
                                : `Security code sent to ${signupData.email}.`
                            }
                        </p>
                    </div>

                    {step === 'role' ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSignupData({...signupData, userRole: 'FREELANCER'})}
                                    className={`flex items-center gap-6 p-6 rounded-xl border-2 transition-all text-left group ${
                                        signupData.userRole === 'FREELANCER' 
                                        ? 'border-[#0F2E4B] bg-[#0F2E4B]/5' 
                                        : 'border-[#eee] hover:border-[#0F2E4B]/30'
                                    }`}
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${signupData.userRole === 'FREELANCER' ? 'bg-[#0F2E4B] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#0F2E4B]/10 group-hover:text-[#0F2E4B]'}`}>
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h3 className={`text-[18px] sm:text-[17px] font-bold ${signupData.userRole === 'FREELANCER' ? 'text-[#0F2E4B]' : 'text-[#242424]'}`}>I'm a Freelancer</h3>
                                        <p className="text-[14px] sm:text-[13px] text-gray-500 mt-0.5">I want to browse projects and earn by providing my skills.</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSignupData({...signupData, userRole: 'CLIENT'})}
                                    className={`flex items-center gap-6 p-6 rounded-xl border-2 transition-all text-left group ${
                                        signupData.userRole === 'CLIENT' 
                                        ? 'border-[#0F2E4B] bg-[#0F2E4B]/5' 
                                        : 'border-[#eee] hover:border-[#0F2E4B]/30'
                                    }`}
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${signupData.userRole === 'CLIENT' ? 'bg-[#0F2E4B] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-[#0F2E4B]/10 group-hover:text-[#0F2E4B]'}`}>
                                        <ShieldCheck size={28} />
                                    </div>
                                    <div>
                                        <h3 className={`text-[18px] sm:text-[17px] font-bold ${signupData.userRole === 'CLIENT' ? 'text-[#0F2E4B]' : 'text-[#242424]'}`}>I'm a Client</h3>
                                        <p className="text-[14px] sm:text-[13px] text-gray-500 mt-0.5">I want to post projects and hire the best technical talent.</p>
                                    </div>
                                </button>
                            </div>

                            <button 
                                onClick={() => signupData.userRole && setStep('details')}
                                disabled={!signupData.userRole}
                                className={`w-full mt-6 bg-[#317CD7] text-white py-4.5 sm:py-3.5 rounded-md font-extrabold uppercase tracking-widest text-[14px] sm:text-[13px] flex items-center justify-center gap-2 transition-all ${!signupData.userRole ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2563b5] hover:-translate-y-0.5 shadow-lg shadow-[#317CD7]/20'}`}
                            >
                                Continue to Signup <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : null}

                    {step === 'details' && (
                        <div className="mb-4">
                            <button 
                                onClick={() => setStep('role')}
                                className="text-[13px] sm:text-[11px] font-bold text-[#0F2E4B] uppercase tracking-wider flex items-center gap-1 hover:underline mb-4"
                            >
                                <ArrowLeft size={12} /> Change Role ({signupData.userRole})
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                            {error}
                        </div>
                    )}

                    {step === 'details' && (
                        <form onSubmit={handleSignup} className="space-y-2.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label 
                                        className="uppercase tracking-wider ml-1"
                                        style={{ 
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            lineHeight: '26px',
                                            color: 'rgb(33, 33, 33)'
                                        }}
                                    >
                                        Full Name
                                    </label>
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
                                            className="block w-full pl-11 pr-4 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all"
                                            style={{ 
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '16px',
                                                fontWeight: 400,
                                                lineHeight: '22.4px',
                                                color: 'rgb(15, 46, 75)'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label 
                                        className="uppercase tracking-wider ml-1"
                                        style={{ 
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            lineHeight: '26px',
                                            color: 'rgb(33, 33, 33)'
                                        }}
                                    >
                                        Username
                                    </label>
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
                                            className="block w-full pl-11 pr-4 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all"
                                            style={{ 
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '16px',
                                                fontWeight: 400,
                                                lineHeight: '22.4px',
                                                color: 'rgb(15, 46, 75)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {signupData.userRole === 'CLIENT' && (
                                <div className="space-y-4 pt-2 border-t border-gray-100 mt-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[14px] sm:text-[12px] font-extrabold text-[#0F2E4B] uppercase tracking-widest">Client Type</h3>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                            <button 
                                                type="button"
                                                onClick={() => setSignupData({...signupData, clientType: 'Individual'})}
                                                className={`px-4 py-2 sm:py-1 text-[12px] sm:text-[11px] font-bold rounded-md transition-all ${signupData.clientType === 'Individual' ? 'bg-white text-[#0F2E4B] shadow-sm' : 'text-gray-400'}`}
                                            >
                                                Individual
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setSignupData({...signupData, clientType: 'Company'})}
                                                className={`px-4 py-2 sm:py-1 text-[12px] sm:text-[11px] font-bold rounded-md transition-all ${signupData.clientType === 'Company' ? 'bg-white text-[#0F2E4B] shadow-sm' : 'text-gray-400'}`}
                                            >
                                                Company
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <label 
                                            className="uppercase tracking-wider ml-1"
                                            style={{ 
                                                fontFamily: 'Poppins, sans-serif',
                                                fontSize: '15px',
                                                fontWeight: 500,
                                                lineHeight: '26px',
                                                color: 'rgb(33, 33, 33)'
                                            }}
                                        >
                                            {signupData.clientType === 'Individual' ? 'Display Name / Alias (Optional)' : 'Company / Organization Name'}
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ccc]">
                                                <ShieldCheck size={16} />
                                            </div>
                                            <input 
                                                required={signupData.clientType === 'Company'}
                                                type="text" 
                                                value={signupData.companyName}
                                                onChange={(e) => setSignupData({...signupData, companyName: e.target.value})}
                                                placeholder={signupData.clientType === 'Individual' ? 'e.g. Creative Studio' : 'Acme Corporation'} 
                                                className="block w-full pl-11 pr-4 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all"
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    lineHeight: '22.4px',
                                                    color: 'rgb(15, 46, 75)'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label 
                                                className="uppercase tracking-wider ml-1"
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '26px',
                                                    color: 'rgb(33, 33, 33)'
                                                }}
                                            >
                                                Primary Category
                                            </label>
                                            <select 
                                                required={signupData.clientType === 'Company'}
                                                value={signupData.industry}
                                                onChange={(e) => setSignupData({...signupData, industry: e.target.value})}
                                                className="block w-full px-4 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all appearance-none cursor-pointer"
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    lineHeight: '22.4px',
                                                    color: 'rgb(15, 46, 75)'
                                                }}
                                            >
                                                <option value="">{signupData.clientType === 'Individual' ? 'Select Category' : 'Select Industry'}</option>
                                                <option value="Personal Projects">Personal Projects</option>
                                                <option value="IT & Technology">IT & Technology</option>
                                                <option value="Creative & Design">Creative & Design</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Business Services">Business Services</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label 
                                                className="uppercase tracking-wider ml-1"
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '26px',
                                                    color: 'rgb(33, 33, 33)'
                                                }}
                                            >
                                                Website / Portfolio (Optional)
                                            </label>
                                            <input 
                                                type="url" 
                                                value={signupData.website}
                                                onChange={(e) => setSignupData({...signupData, website: e.target.value})}
                                                placeholder="https://example.com" 
                                                className="block w-full px-4 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all"
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '16px',
                                                    fontWeight: 400,
                                                    lineHeight: '22.4px',
                                                    color: 'rgb(15, 46, 75)'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label 
                                    className="uppercase tracking-wider ml-1"
                                    style={{ 
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        lineHeight: '26px',
                                        color: 'rgb(33, 33, 33)'
                                    }}
                                >
                                    Email Address
                                </label>
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
                                        className="block w-full pl-11 pr-4 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all"
                                        style={{ 
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 400,
                                            lineHeight: '22.4px',
                                            color: 'rgb(15, 46, 75)'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label 
                                    className="uppercase tracking-wider ml-1"
                                    style={{ 
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        lineHeight: '26px',
                                        color: 'rgb(33, 33, 33)'
                                    }}
                                >
                                    Password
                                </label>
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
                                        className="block w-full pl-11 pr-12 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md focus:outline-none focus:border-[#0F2E4B] transition-all"
                                        style={{ 
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '16px',
                                            fontWeight: 400,
                                            lineHeight: '22.4px',
                                            color: 'rgb(15, 46, 75)'
                                        }}
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
                                        className="block w-full pl-11 pr-12 py-3.5 sm:py-2.5 bg-white border border-[#eee] rounded-md text-[15px] sm:text-sm focus:outline-none focus:border-[#0F2E4B] transition-all"
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
                                    <span className="text-[15px] sm:text-[13px] text-[#666] leading-snug select-none">
                                        I agree to the <a href="#" className="text-[#242424] font-bold hover:text-[#b5242c] underline">Terms of Service</a> and <a href="#" className="text-[#242424] font-bold hover:text-[#b5242c] underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            <button 
                                disabled={isLoading}
                                className={`w-full bg-[#317CD7] text-white py-4.5 sm:py-2.5 rounded-md font-extrabold uppercase tracking-widest text-[16px] sm:text-[13px] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#317CD7]/10 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2563b5] hover:-translate-y-0.5 active:translate-y-0'}`}
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
                                        className="block w-full pl-12 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-2xl tracking-[0.5em] font-mono text-center focus:outline-none focus:border-[#b5242c] transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={isLoading || otp.length !== 6}
                                className={`w-full bg-[#317CD7] text-white py-2.5 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#317CD7]/10 ${(isLoading || otp.length !== 6) ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#2563b5] hover:-translate-y-0.5 active:translate-y-0'}`}
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

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
                                </div>
                            </div>

                            <button 
                                type="button"
                                onClick={() => handleGoogleSignup()}
                                className="w-full flex items-center justify-center gap-3 py-3 sm:py-2.5 border border-[#eee] rounded-md hover:bg-gray-50 transition-all font-bold text-[#444] text-sm"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                Sign up with Google
                            </button>

                            <p 
                                className="mt-4 text-center"
                                style={{ 
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    color: 'rgb(33, 33, 33)'
                                }}
                            >
                                Already have an account? <Link to="/login" className="text-[#317CD7] font-bold hover:underline">Sign In</Link>
                            </p>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Left Side - Branding/Visual */}
            <div className="hidden lg:block w-full lg:w-1/2 relative overflow-hidden order-1 lg:order-1 min-h-[500px] bg-[#242424]">
                {/* Image as background */}
                <img 
                    src="signup.jpeg" 
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
                        <p className="text-white/70 text-[15px] sm:text-sm leading-relaxed font-light">
                            Access premium IT projects and start your journey as a top freelancer today. Build your portfolio and work with global brands.
                        </p>
                        <div className="w-12 h-1 bg-[#317CD7] mt-6 rounded-full"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Signup;
