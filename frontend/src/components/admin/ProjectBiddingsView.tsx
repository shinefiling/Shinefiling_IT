import React from 'react';
import { Search, IndianRupee, Clock, CheckCircle2, XCircle, MoreVertical, ExternalLink } from 'lucide-react';

const ProjectBiddingsView = () => {
    // Mock data for biddings (proposals)
    const biddings = [
        { id: 1, freelancer: 'Sofia Bennett', project: 'Modern Real Estate Platform', bid: 150000, date: '2 hours ago', status: 'PENDING' },
        { id: 2, freelancer: 'Alexi Chen', project: 'Healthcare Mobile App', bid: 85000, date: '5 hours ago', status: 'ACCEPTED' },
        { id: 3, freelancer: 'Nicholas Frost', project: 'Crypto Wallet Integration', bid: 120000, date: '1 day ago', status: 'PENDING' },
        { id: 4, freelancer: 'Sarah Williams', project: 'E-commerce Redesign', bid: 45000, date: '1 day ago', status: 'REJECTED' },
        { id: 5, freelancer: 'David Miller', project: 'AI Content Generator', bid: 200000, date: '2 days ago', status: 'PENDING' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Global Project Biddings</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Monitor and moderate all active proposals across the marketplace</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search biddings..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm outline-none w-64 font-poppins" />
                    </div>
                </div>
            </div>

            <div className="shine-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <tr className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Freelancer / Talent</th>
                                <th className="px-8 py-5">Target Project</th>
                                <th className="px-8 py-5">Bid Structure</th>
                                <th className="px-8 py-5">Engagement Status</th>
                                <th className="px-8 py-5 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {biddings.map((bid) => (
                                <tr key={bid.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center font-black text-sm text-orange-500 border border-orange-100 dark:border-orange-500/20">
                                                {bid.freelancer.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 dark:text-white font-poppins">{bid.freelancer}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 group/link cursor-pointer">
                                            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium font-inter group-hover/link:text-orange-500 transition-colors">{bid.project}</span>
                                            <ExternalLink size={12} className="text-slate-400 group-hover/link:text-orange-500 transition-colors" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1 text-slate-800 dark:text-white font-black font-poppins">
                                            <IndianRupee size={14} className="text-emerald-500" />
                                            <span>{bid.bid.toLocaleString()}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                            <Clock size={10} className="text-orange-500" /> {bid.date}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                            bid.status === 'ACCEPTED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20' :
                                            bid.status === 'REJECTED' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-100 dark:border-red-500/20' :
                                            'bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-100 dark:border-orange-500/20'
                                        }`}>
                                            {bid.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                            <button className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"><CheckCircle2 size={16} /></button>
                                            <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><XCircle size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectBiddingsView;
