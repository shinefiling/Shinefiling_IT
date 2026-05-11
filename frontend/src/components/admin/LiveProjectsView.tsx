import React from 'react';
import { Search, Filter, Briefcase, Edit2, Trash2 } from 'lucide-react';

const LiveProjectsView = ({ projects }: any) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Global Project Pipeline</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Review and manage all active marketplace engagements</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Filter projects..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-64 transition-all font-poppins" />
                </div>
            </div>
        </div>

        <div className="shine-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Project Identity</th>
                            <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Category</th>
                            <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Budget</th>
                            <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Execution Status</th>
                            <th className="px-8 py-5 text-right text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Operational Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {projects.map((p: any) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner shrink-0 transition-transform group-hover:scale-110">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight mb-1 font-poppins">{p.title}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">PID: #{p.id.toString().padStart(5, '0')}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-[9px] px-2.5 py-1 rounded-lg font-black uppercase border border-blue-100 dark:border-blue-500/20 tracking-widest">{p.category}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-slate-800 dark:text-white font-poppins">₹{p.budget?.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-60">Locked Escrow</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                        <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">{p.status || 'Active'}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                        <button className="p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-400 hover:text-orange-500 transition-all shadow-sm"><Edit2 size={14} /></button>
                                        <button className="p-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-200 dark:text-slate-800">
                                            <Briefcase size={32} />
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium">No projects found in the global pipeline...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default LiveProjectsView;
