import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle, Phone, Briefcase, GraduationCap, Globe, CreditCard, ShieldCheck, Plus, Trash2, Github, Layout, Camera } from 'lucide-react';

type Stage = 'ACCOUNT' | 'VERIFICATION' | 'PROFILE' | 'PAYMENT';

const Onboarding: React.FC = () => {
    const location = useLocation();
    const [currentStage, setCurrentStage] = useState<Stage>('ACCOUNT');
    const [step, setStep] = useState(1);

    useEffect(() => {
        // If we came from Signup, we already have the basic info
        if (location.state && (location.state.fullName || location.state.email)) {
            setFormData(prev => ({
                ...prev,
                fullName: location.state.fullName || '',
                email: location.state.email || '',
                username: location.state.username || '',
                agreeTerms: true // They already agreed in Signup
            }));
            setCurrentStage('VERIFICATION');
        }
    }, [location.state]);

    // Form State
    const [formData, setFormData] = useState({
        // Stage 1
        fullName: '',
        email: '',
        password: '',
        username: '',
        country: 'India',
        agreeTerms: false,
        // Stage 2
        emailVerified: false,
        phone: '',
        phoneVerified: false,
        // Stage 3
        title: '',
        bio: '',
        skills: [] as string[],
        experience: [] as any[],
        education: [] as any[],
        portfolio: [] as any[],
        languages: ['English - Fluent', 'Tamil - Native'],
        hourlyRate: '',
        availability: 'Full-time',
        // Stage 4
        paymentMethod: 'Bank Account',
        idVerified: false
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const renderStage1 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#242424] mb-2 font-['Poppins']">Create Your Account</h2>
                <p className="text-[#888] text-sm">Step 1: The foundation of your technical career</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#444]">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccc]" size={18} />
                        <input
                            type="text"
                            placeholder="e.g. Prakash V"
                            className="w-full pl-12 pr-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none transition-all"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#444]">Username</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccc] font-bold">@</span>
                        <input
                            type="text"
                            placeholder="prakash_devops"
                            className="w-full pl-10 pr-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none transition-all"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[#444]">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccc]" size={18} />
                    <input
                        type="email"
                        placeholder="prakash.devops@gmail.com"
                        className="w-full pl-12 pr-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-[#444]">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccc]" size={18} />
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <p className="text-[10px] text-[#888]">Minimum 8-12 characters, including Uppercase + lowercase + number + symbol</p>
            </div>

            <div className="flex items-center gap-3 py-2">
                <input
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 rounded accent-[#b5242c]"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                />
                <label htmlFor="terms" className="text-xs text-[#666]">I agree to the <span className="text-[#b5242c] underline cursor-pointer">Terms & Conditions</span></label>
            </div>

            <button
                disabled={!formData.agreeTerms}
                onClick={() => setCurrentStage('VERIFICATION')}
                className="w-full bg-[#b5242c] text-white py-4 rounded-xl font-bold hover:bg-[#a11f27] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#b5242c]/20"
            >
                Continue to Verification
            </button>
        </motion.div>
    );

    const renderStage2 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#242424] mb-2 font-['Poppins']">Verify Your Contacts</h2>
                <p className="text-[#888] text-sm">Step 2: Building trust with Shinefiling clients</p>
            </div>

            <div className="space-y-6">
                {/* Email Verification */}
                <div className="bg-white border border-[#eee] p-6 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${formData.emailVerified ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#242424] text-sm">Email Verification</h4>
                            <p className="text-xs text-[#888]">{formData.email || 'prakash.devops@gmail.com'}</p>
                        </div>
                    </div>
                    {formData.emailVerified ? (
                        <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                            <CheckCircle size={16} /> Verified
                        </div>
                    ) : (
                        <button
                            onClick={() => setFormData({ ...formData, emailVerified: true })}
                            className="text-[#b5242c] text-xs font-bold hover:underline"
                        >
                            Verify Now
                        </button>
                    )}
                </div>

                {/* Phone Verification */}
                <div className="bg-white border border-[#eee] p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${formData.phoneVerified ? 'bg-green-50 text-green-500' : 'bg-[#fff9f0] text-[#ffb129]'}`}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#242424] text-sm">Mobile Number</h4>
                                <p className="text-xs text-[#888]">Required for payments & security</p>
                            </div>
                        </div>
                        {formData.phoneVerified && (
                            <div className="flex items-center gap-1 text-green-500 font-bold text-xs">
                                <CheckCircle size={16} /> Verified
                            </div>
                        )}
                    </div>

                    {!formData.phoneVerified && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="+91 98765 43210"
                                className="flex-1 px-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none text-sm"
                            />
                            <button
                                onClick={() => setFormData({ ...formData, phoneVerified: true })}
                                className="bg-[#242424] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-black transition-all"
                            >
                                Send OTP
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentStage('ACCOUNT')}
                    className="flex-1 py-4 border border-[#eee] rounded-xl font-bold text-[#666] hover:bg-gray-50 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={() => setCurrentStage('PROFILE')}
                    className="flex-[2] bg-[#b5242c] text-white py-4 rounded-xl font-bold hover:bg-[#a11f27] transition-all shadow-lg shadow-[#b5242c]/20"
                >
                    Complete Your Profile
                </button>
            </div>
        </motion.div>
    );

    const renderStage3 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10 pb-10"
        >
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#242424] mb-2 font-['Poppins']">Professional Profile</h2>
                <p className="text-[#888] text-sm">Step 3: Showcase your DevOps expertise</p>
            </div>

            {/* Profile Photo */}
            <div className="flex flex-col items-center lg:items-start gap-6">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <User size={64} className="text-gray-300" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera size={24} className="text-white" />
                        </div>
                    </div>
                </div>
                <div className="text-center lg:text-left">
                    <h4 className="font-bold text-[#242424] mb-1">Profile Photo</h4>
                    <p className="text-xs text-[#888]">Formal face, good lighting, clean background</p>
                </div>
            </div>

            {/* Title & Bio */}
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#444]">Professional Title</label>
                    <input
                        type="text"
                        placeholder="e.g. DevOps Engineer | AWS | Docker | CI/CD Expert"
                        className="w-full px-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none text-sm transition-all"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#444]">Overview / Bio</label>
                    <textarea
                        rows={6}
                        placeholder="Describe your expertise, tools you use, and the value you provide..."
                        className="w-full px-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none text-sm transition-all resize-none"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#444]">Core Skills (Add 10-15)</label>
                    <span className="text-xs text-[#888]">{formData.skills.length} added</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['DevOps', 'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Linux', 'Terraform', 'CI/CD'].map(skill => (
                        <button
                            key={skill}
                            onClick={() => {
                                if (formData.skills.includes(skill)) {
                                    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
                                } else {
                                    setFormData({ ...formData, skills: [...formData.skills, skill] });
                                }
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${formData.skills.includes(skill) ? 'bg-[#b5242c] text-white' : 'bg-gray-100 text-[#666] hover:bg-gray-200'}`}
                        >
                            {skill} {formData.skills.includes(skill) ? '×' : '+'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#444]">Hourly Rate (INR)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]">₹</span>
                        <input
                            type="number"
                            placeholder="e.g. 800"
                            className="w-full pl-8 pr-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none text-sm"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888] text-xs">/ hr</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#444]">Availability</label>
                    <select
                        className="w-full px-4 py-3 border border-[#eee] rounded-xl focus:border-[#b5242c] outline-none text-sm appearance-none bg-white"
                        value={formData.availability}
                        onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    >
                        <option>Full-time (40+ hrs/week)</option>
                        <option>Part-time (20-30 hrs/week)</option>
                        <option>Flexible</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentStage('VERIFICATION')}
                    className="flex-1 py-4 border border-[#eee] rounded-xl font-bold text-[#666] hover:bg-gray-50 transition-all"
                >
                    Back
                </button>
                <button
                    onClick={() => setCurrentStage('PAYMENT')}
                    className="flex-[2] bg-[#b5242c] text-white py-4 rounded-xl font-bold hover:bg-[#a11f27] transition-all shadow-lg shadow-[#b5242c]/20"
                >
                    Final Step: Verification
                </button>
            </div>
        </motion.div>
    );

    const renderStage4 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
        >
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-[#242424] mb-2 font-['Poppins']">Payment & Identity</h2>
                <p className="text-[#888] text-sm">Step 4: Secure your earnings and identity</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-[#444]">Payment Withdrawal Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['Bank Account', 'UPI', 'PayPal'].map(method => (
                            <div
                                key={method}
                                onClick={() => setFormData({ ...formData, paymentMethod: method })}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === method ? 'border-[#b5242c] bg-[#fff9f0]' : 'border-[#eee] hover:border-[#b5242c]/50'}`}
                            >
                                <CreditCard size={20} className={formData.paymentMethod === method ? 'text-[#b5242c]' : 'text-[#888]'} />
                                <span className={`text-xs font-bold ${formData.paymentMethod === method ? 'text-[#242424]' : 'text-[#888]'}`}>{method}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl text-blue-500 shadow-sm">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-[#242424] text-sm mb-1">Identity Verification</h4>
                        <p className="text-xs text-[#666] leading-relaxed mb-4">Please upload a government-issued ID (PAN Card / Aadhaar) to verify your professional account.</p>
                        <button
                            onClick={() => setFormData({ ...formData, idVerified: true })}
                            className="bg-blue-500 text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20"
                        >
                            {formData.idVerified ? 'Document Uploaded' : 'Upload ID Document'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl space-y-4 border border-dashed border-gray-200">
                <h4 className="font-bold text-[#242424] text-sm">Final Profile Checklist</h4>
                <div className="space-y-2">
                    {[
                        { label: 'Email Verified', done: formData.emailVerified },
                        { label: 'Phone Verified', done: formData.phoneVerified },
                        { label: 'Skills Added (10+)', done: formData.skills.length >= 5 }, // Relaxed for demo
                        { label: 'Profile 100% Complete', done: true },
                        { label: 'ID Verification Pending', done: formData.idVerified }
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-2 text-xs">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-white'}`}>
                                <CheckCircle size={10} />
                            </div>
                            <span className={item.done ? 'text-[#242424]' : 'text-[#888]'}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setCurrentStage('PROFILE')}
                    className="flex-1 py-4 border border-[#eee] rounded-xl font-bold text-[#666] hover:bg-gray-50 transition-all"
                >
                    Back
                </button>
                <button
                    className="flex-[2] bg-[#2d4a43] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/10"
                >
                    Submit Profile for Review
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen pt-[90px] bg-[#fdfaf0] font-['Poppins']">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-10 flex flex-col lg:flex-row gap-12">

                {/* Left Side: Progress Tracker */}
                <div className="w-full lg:w-[320px] shrink-0">
                    <div className="bg-white border border-[#eee] rounded-2xl p-8 sticky top-[120px]">
                        <h3 className="font-bold text-[#242424] mb-8">Setup Progress</h3>
                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#eee]"></div>

                            {[
                                { id: 'ACCOUNT', label: 'Account Creation', desc: 'Core details' },
                                { id: 'VERIFICATION', label: 'Contact Verification', desc: 'Email & Phone' },
                                { id: 'PROFILE', label: 'Professional Profile', desc: 'Skills & Bio' },
                                { id: 'PAYMENT', label: 'Payment & ID', desc: 'Verification' }
                            ].map((s, idx) => {
                                const isActive = currentStage === s.id;
                                const isCompleted = ['ACCOUNT', 'VERIFICATION', 'PROFILE', 'PAYMENT'].indexOf(currentStage) > idx;

                                return (
                                    <div key={s.id} className="relative z-10 flex items-start gap-5">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border-2 ${isActive ? 'bg-[#b5242c] border-[#b5242c] text-white scale-110' : isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-[#eee] text-[#ccc]'}`}>
                                            {isCompleted ? <CheckCircle size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold transition-all ${isActive ? 'text-[#b5242c]' : isCompleted ? 'text-green-500' : 'text-[#888]'}`}>{s.label}</h4>
                                            <p className="text-[11px] text-[#aaa]">{s.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="flex-1 bg-white border border-[#eee] rounded-3xl p-8 lg:p-16 shadow-sm overflow-hidden min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {currentStage === 'ACCOUNT' && renderStage1()}
                        {currentStage === 'VERIFICATION' && renderStage2()}
                        {currentStage === 'PROFILE' && renderStage3()}
                        {currentStage === 'PAYMENT' && renderStage4()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
