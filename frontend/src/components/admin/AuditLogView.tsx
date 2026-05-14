import React from 'react';
import { Database, Shield, Lock, FileText, Search, Filter, Download } from 'lucide-react';

const AuditLogView = () => {
    const logs = [
        { id: 'LOG-4421', admin: 'Master Admin', action: 'Approved Freelancer KYC', target: 'Sofia Bennett', date: 'Oct 24, 11:20 AM', level: 'INFO' },
        { id: 'LOG-4420', admin: 'System Bot', action: 'Locked Escrow Payment', target: 'Project #9822', date: 'Oct 24, 10:45 AM', level: 'SYSTEM' },
        { id: 'LOG-4419', admin: 'Master Admin', action: 'Updated Platform Fees', target: 'Global Config', date: 'Oct 23, 04:12 PM', level: 'CRITICAL' },
        { id: 'LOG-4418', admin: 'Support Lead', action: 'Closed Support Ticket', target: 'TKT-102', date: 'Oct 23, 01:30 PM', level: 'INFO' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">System Governance & Audit Logs</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Comprehensive record of all administrative actions and system-level events</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-[#003d4d] text-white text-[10px] font-bold rounded-xl shadow-lg shadow-[#003d4d]/20 uppercase tracking-widest"><Download size={16} /> Export Audit Trail</button>
                </div>
            </div>

            <div className="shine-card overflow-hidden">
                <div className="p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex justify-between items-center">
                    <div className="flex items-center gap-2 px-2">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="Filter audit trail..." className="bg-transparent border-none outline-none text-sm text-slate-600 dark:text-slate-300 w-64 font-poppins" />
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">Retention: 90 Days</span>
                        <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors"><Filter size={18} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <tr className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">Log Identity</th>
                                <th className="px-8 py-5">Administrator</th>
                                <th className="px-8 py-5">Action Performed</th>
                                <th className="px-8 py-5">Target Entity</th>
                                <th className="px-8 py-5">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.level === 'CRITICAL' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : log.level === 'SYSTEM' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                                            <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{log.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-800 dark:text-white font-poppins">{log.admin}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium font-inter">{log.action}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded tracking-widest">{log.target}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{log.date}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white md:col-span-1 relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                    <Database size={32} className="mb-6 opacity-60" />
                    <h3 className="text-xl font-bold mb-4 font-poppins">Storage Metrics</h3>
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-60">
                            <span>Audit Database Size</span>
                            <span>2.4 GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="w-[45%] h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                        </div>
                    </div>
                </div>
                <div className="shine-card p-8 md:col-span-2 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                        <Shield size={28} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-white font-poppins">Tamper-Proof Encryption</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">All system logs are cryptographically signed and immutable once written, ensuring absolute data integrity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogView;
