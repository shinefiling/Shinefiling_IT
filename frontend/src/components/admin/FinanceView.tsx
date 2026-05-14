import React from 'react';
import { IndianRupee, TrendingUp, ArrowDownRight, ArrowUpRight, CreditCard, Download, Filter } from 'lucide-react';
import { StatCard } from './Common';

const FinanceView = () => {
    const transactions = [
        { id: 'TRX-9821', user: 'Tech Corp Inc.', amount: 50000, type: 'PAYMENT', status: 'COMPLETED', date: 'Oct 24, 2023' },
        { id: 'TRX-9820', user: 'Alexi Chen', amount: 4500, type: 'WITHDRAWAL', status: 'PENDING', date: 'Oct 23, 2023' },
        { id: 'TRX-9819', user: 'Cloud Systems', amount: 12000, type: 'PAYMENT', status: 'COMPLETED', date: 'Oct 22, 2023' },
        { id: 'TRX-9818', user: 'Sarah Williams', amount: 2500, type: 'COMMISSION', status: 'COMPLETED', date: 'Oct 22, 2023' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Escrow Value" value="₹12,45,000" trend={8.2} icon={IndianRupee} colorClass="bg-teal-600" subtext="Secured marketplace funds" />
                <StatCard title="Monthly Revenue" value="₹2,84,000" trend={12.5} icon={TrendingUp} colorClass="bg-orange-600" subtext="10% platform commission" />
                <StatCard title="Pending Payouts" value="₹42,500" trend={-2.1} icon={ArrowDownRight} colorClass="bg-blue-600" subtext="Awaiting verification" />
                <StatCard title="Active Disputes" value="₹0" trend={0} icon={ArrowUpRight} colorClass="bg-red-600" subtext="Requires resolution" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className="shine-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Transaction Ledger</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs">Real-time financial activity across the platform</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 hover:text-orange-500 transition-all"><Filter size={18} /></button>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#003d4d] text-white text-[10px] font-bold rounded-xl shadow-lg shadow-[#003d4d]/20 uppercase tracking-widest"><Download size={16} /> Export CSV</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-100 dark:border-slate-700">
                                    <tr className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                        <th className="py-4 px-2">Identity</th>
                                        <th className="py-4 px-2">User / Entity</th>
                                        <th className="py-4 px-2">Amount</th>
                                        <th className="py-4 px-2">Type</th>
                                        <th className="py-4 px-2">Status</th>
                                        <th className="py-4 px-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {transactions.map((trx) => (
                                        <tr key={trx.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="py-5 px-2 font-mono text-xs text-slate-400">{trx.id}</td>
                                            <td className="py-5 px-2 font-bold text-slate-800 dark:text-white font-poppins">{trx.user}</td>
                                            <td className="py-5 px-2 font-extrabold text-slate-800 dark:text-white font-poppins">₹{trx.amount.toLocaleString()}</td>
                                            <td className="py-5 px-2">
                                                <span className={`text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded uppercase ${
                                                    trx.type === 'PAYMENT' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600' :
                                                    trx.type === 'WITHDRAWAL' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' :
                                                    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
                                                }`}>{trx.type}</span>
                                            </td>
                                            <td className="py-5 px-2">
                                                <span className={`text-[10px] font-bold flex items-center gap-1.5 ${trx.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${trx.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                    {trx.status}
                                                </span>
                                            </td>
                                            <td className="py-5 px-2 text-slate-400 text-xs font-medium">{trx.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                        <CreditCard className="mb-6 opacity-60" size={32} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Platform Treasury</p>
                        <h2 className="text-3xl font-extrabold mb-1 font-poppins">₹42,15,000</h2>
                        <p className="text-[11px] opacity-60 mb-8 font-medium">Total volume processed in 2024</p>
                        
                        <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                            <div className="flex justify-between items-center">
                                <span className="text-xs opacity-60 font-medium">Success Rate</span>
                                <span className="text-xs font-bold text-emerald-400">99.8%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs opacity-60 font-medium">Avg. Payout Time</span>
                                <span className="text-xs font-bold">12 Hours</span>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all border border-white/10">Withdrawal Logs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceView;
