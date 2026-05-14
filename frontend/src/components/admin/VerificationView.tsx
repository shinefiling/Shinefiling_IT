import React from 'react';
import { Shield, CheckCircle, XCircle, FileText, Clock, ExternalLink } from 'lucide-react';

const VerificationView = () => {
    const pendingRequests = [
        { id: 1, name: 'Sofia Bennett', type: 'IDENTITY', document: 'Passport', submitted: '2 hours ago' },
        { id: 2, name: 'Nicholas Frost', type: 'CERTIFICATION', document: 'AWS Solutions Architect', submitted: '5 hours ago' },
        { id: 3, name: 'David Miller', type: 'TAX_FORM', document: 'W-9 Form', submitted: '1 day ago' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Identity & Trust Verification</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Review and approve verification documents from freelancers and clients</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="shine-card p-6">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-poppins">
                        <Clock size={20} className="text-orange-500" /> Pending Review
                    </h3>
                    <div className="space-y-4">
                        {pendingRequests.map((req) => (
                            <div key={req.id} className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-orange-200 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white font-poppins">{req.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{req.type}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{req.submitted}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                        <FileText size={14} className="text-orange-500" />
                                        <span className="font-medium">{req.document}</span>
                                        <ExternalLink size={12} className="text-blue-500 cursor-pointer" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">Approve</button>
                                        <button className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded-lg hover:bg-red-600 transition-all shadow-lg shadow-red-500/10">Reject</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                    <Shield size={40} className="mb-6 opacity-60" />
                    <h3 className="text-xl font-bold mb-4 font-poppins">Verification Health</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Approved Talent</p>
                                <p className="text-3xl font-extrabold font-poppins">429</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Pass Rate</p>
                                <p className="text-3xl font-extrabold font-poppins">94.2%</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs italic opacity-70 leading-relaxed">"Trust is the currency of our marketplace. Ensure all documents are reviewed with high precision."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationView;
