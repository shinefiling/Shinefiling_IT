import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    Check, ShieldCheck, Calendar, Clock, 
    ArrowLeft, Wallet, CreditCard, Lock,
    Briefcase, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';

const HireMe: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const freelancerId = searchParams.get('id');
    const [freelancer, setFreelancer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [clientJobs, setClientJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    
    const [orderData, setOrderData] = useState({
        duration: '1 Month',
        paymentMethod: 'Escrow Milestone',
        notes: ''
    });

    useEffect(() => {
        if (freelancerId) {
            fetchFreelancer();
            fetchClientJobs();
        }
    }, [freelancerId]);

    const fetchFreelancer = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles/id/${freelancerId}`);
            if (response.ok) setFreelancer(await response.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientJobs = async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.email) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/jobs/client/${user.email}`);
                if (res.ok) setClientJobs(await res.json());
            } catch (e) { console.error(e); }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
            <div className="w-10 h-10 border-4 border-[#b5242c]/20 border-t-[#b5242c] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-[100px] pb-20 font-['Poppins']">
            <div className="max-w-[1000px] mx-auto px-6">
                
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#b5242c] font-bold text-sm mb-8 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Search
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                    
                    <div className="space-y-6">
                        {/* Freelancer Header */}
                        <div className="bg-white border border-[#eee] p-8 rounded-sm shadow-sm flex items-center gap-6">
                            <img 
                                src={freelancer?.profilePicture || `https://ui-avatars.com/api/?name=${freelancer?.fullName}&background=random`} 
                                className="w-20 h-20 rounded-full border border-[#eee]"
                            />
                            <div>
                                <h1 className="text-2xl font-black text-[#261817]">Hiring {freelancer?.fullName}</h1>
                                <p className="text-[#b5242c] font-bold">{freelancer?.professionalHeadline || 'Elite Freelancer'}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Clock size={12}/> {freelancer?.location}</span>
                                    <span className="flex items-center gap-1"><ShieldCheck size={12}/> Verified Identity</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Selection */}
                        <div className="bg-white border border-[#eee] p-8 rounded-sm shadow-sm">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Briefcase size={16} className="text-[#b5242c]"/> 1. Select Project
                            </h2>
                            <div className="space-y-3">
                                {clientJobs.length === 0 ? (
                                    <div className="p-10 text-center border-2 border-dashed border-[#eee] rounded-sm">
                                        <p className="text-slate-400 text-sm italic">You don't have any active job posts.</p>
                                        <button onClick={() => navigate('/post-job')} className="text-[#b5242c] font-bold mt-2 hover:underline">Create a Project First</button>
                                    </div>
                                ) : (
                                    clientJobs.map(job => (
                                        <div 
                                            key={job.id}
                                            onClick={() => setSelectedJob(job)}
                                            className={`p-4 border cursor-pointer transition-all flex justify-between items-center ${selectedJob?.id === job.id ? 'border-[#b5242c] bg-[#fff0ef]/30' : 'border-[#eee] hover:border-[#b5242c]'}`}
                                        >
                                            <div>
                                                <p className="font-bold text-slate-800">{job.title}</p>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Budget: ₹{job.salary}</p>
                                            </div>
                                            {selectedJob?.id === job.id && <Check size={18} className="text-[#b5242c]" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="bg-white border border-[#eee] p-8 rounded-sm shadow-sm">
                            <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Calendar size={16} className="text-[#b5242c]"/> 2. Contract Terms
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Duration</label>
                                    <select 
                                        className="w-full p-3 bg-slate-50 border border-[#eee] rounded-sm outline-none focus:border-[#b5242c] font-bold text-sm"
                                        value={orderData.duration}
                                        onChange={(e) => setOrderData({...orderData, duration: e.target.value})}
                                    >
                                        <option>1 Month</option>
                                        <option>3 Months</option>
                                        <option>6 Months</option>
                                        <option>Project Based</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Payment Method</label>
                                    <div className="p-3 bg-slate-50 border border-[#eee] rounded-sm font-bold text-sm flex items-center gap-2">
                                        <Lock size={14} className="text-green-500" /> Secure Milestone
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="space-y-6">
                        <div className="bg-[#261817] p-8 text-white rounded-sm shadow-xl sticky top-[120px]">
                            <h3 className="text-center font-black uppercase tracking-[3px] text-xs mb-8 border-b border-white/10 pb-4">Hiring Summary</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 text-[10px] font-bold uppercase">Rate</span>
                                    <span className="font-bold">₹{freelancer?.hourlyRate}/hr</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-white/40 text-[10px] font-bold uppercase">Duration</span>
                                    <span className="font-bold">{orderData.duration}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-sm mb-8">
                                <p className="text-[10px] font-bold text-white/30 uppercase mb-2">Estimated Total</p>
                                <p className="text-3xl font-black">₹{(selectedJob?.salary || 0).toLocaleString()}</p>
                            </div>

                            <button 
                                disabled={!selectedJob}
                                className={`w-full py-4 rounded-sm font-black uppercase tracking-widest text-xs shadow-lg transition-all ${selectedJob ? 'bg-[#b5242c] hover:bg-[#920218] text-white shadow-[#b5242c]/20' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                            >
                                Confirm & Hire
                            </button>

                            <p className="text-[9px] text-white/30 mt-6 text-center leading-relaxed">
                                By clicking Confirm, you agree to Shinefiling's Terms of Service and create a legally binding contract.
                            </p>
                        </div>

                        <div className="bg-white border border-[#eee] p-6 rounded-sm text-center">
                            <ShieldCheck className="mx-auto text-green-500 mb-2" size={24} />
                            <h4 className="text-[11px] font-black uppercase tracking-widest">Escrow Protected</h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Payment is held securely and only released when you approve the work.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default HireMe;
