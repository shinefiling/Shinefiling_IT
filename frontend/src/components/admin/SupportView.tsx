import React from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock, Search, Filter } from 'lucide-react';

const SupportView = () => {
    const tickets = [
        { id: 'TKT-102', user: 'Sofia Bennett', subject: 'Payment Delay Inquiry', priority: 'HIGH', status: 'OPEN', date: '2 hours ago' },
        { id: 'TKT-101', user: 'Alexi Chen', subject: 'Profile Verification Help', priority: 'MEDIUM', status: 'IN_PROGRESS', date: '5 hours ago' },
        { id: 'TKT-100', user: 'Nicholas Frost', subject: 'Bug in Proposal Submission', priority: 'LOW', status: 'RESOLVED', date: '1 day ago' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Marketplace Support Desk</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage user inquiries, disputes, and technical support tickets</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search tickets..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm outline-none w-64 font-poppins" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    {tickets.map((t) => (
                        <div key={t.id} className="shine-card p-6 group cursor-pointer hover:border-orange-200">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${t.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : t.priority === 'MEDIUM' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">{t.id}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.date}</span>
                            </div>
                            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-1 group-hover:text-orange-500 transition-colors font-poppins">{t.subject}</h4>
                            <p className="text-xs text-slate-500 mb-6 font-medium">Submitted by: <span className="font-bold text-slate-700 dark:text-slate-300">{t.user}</span></p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-4">
                                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase ${
                                        t.status === 'OPEN' ? 'bg-red-50 dark:bg-red-500/10 text-red-600' :
                                        t.status === 'IN_PROGRESS' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' :
                                        'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                                    }`}>{t.status}</span>
                                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">{t.priority} PRIORITY</span>
                                </div>
                                <button className="text-[10px] font-extrabold text-[#003d4d] dark:text-orange-400 uppercase tracking-[0.2em] hover:underline">Reply to Ticket</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="shine-card p-6">
                        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">Support Pulse</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500"><AlertCircle size={20}/></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white font-poppins">Active Disputes</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Immediate action</p>
                                    </div>
                                </div>
                                <span className="text-lg font-extrabold text-red-500 font-poppins">04</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500"><Clock size={20}/></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white font-poppins">Avg. Response</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Speed</p>
                                    </div>
                                </div>
                                <span className="text-lg font-extrabold text-orange-500 font-poppins">1.2h</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                        <MessageSquare className="mb-6 opacity-60" size={32} />
                        <h3 className="text-xl font-bold mb-2 font-poppins">Automated Assistant</h3>
                        <p className="text-xs opacity-60 mb-6 leading-relaxed">AI is currently handling 74% of initial support inquiries.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all border border-white/10">Configure AI Bot</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportView;
