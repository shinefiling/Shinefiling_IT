import React from 'react';
import { Activity, Zap, TrendingUp, Globe, Target, Map, PieChart } from 'lucide-react';

const OperationalPulseView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Marketplace Operational Pulse</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Real-time demand sensing, skill gaps, and regional performance metrics</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="shine-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-slate-800 dark:text-white font-poppins">Active Demand Mapping</h3>
                            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-lg font-black uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-500/20">Live Intelligence</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Web Architecture', val: '+24%', status: 'Surging' },
                                { label: 'Mobile Engineering', val: '+12%', status: 'Stable' },
                                { label: 'Cloud Infrastructure', val: '+45%', status: 'Critical' },
                                { label: 'AI/ML Training', val: '+68%', status: 'Surging' }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-orange-200 transition-all">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-2 font-inter">{item.label}</p>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl font-black text-slate-800 dark:text-white font-poppins">{item.val}</span>
                                        <TrendingUp size={14} className="text-emerald-500" />
                                    </div>
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{item.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shine-card p-8">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-8 flex items-center gap-2 font-poppins">
                            <Map size={20} className="text-orange-500" /> Regional Talent Density
                        </h3>
                        <div className="space-y-6">
                            {[
                                { region: 'North America', density: 85, color: 'bg-orange-500' },
                                { region: 'Europe / UK', density: 62, color: 'bg-blue-500' },
                                { region: 'Asia Pacific', density: 94, color: 'bg-teal-500' },
                                { region: 'LATAM', density: 38, color: 'bg-purple-500' }
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 font-poppins">{item.region}</span>
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.density}% Utilization</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                                        <div style={{ width: `${item.density}%` }} className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                        <Zap className="mb-6 opacity-60" size={32} />
                        <h3 className="text-xl font-bold mb-4 font-poppins">Skill Gap Alert</h3>
                        <div className="space-y-4 relative z-10">
                            <p className="text-xs opacity-70 leading-relaxed mb-8 font-medium">
                                The marketplace is currently experiencing a critical shortage of certified <span className="text-orange-400 font-bold">AWS Architects</span> and <span className="text-orange-400 font-bold">AI Engineers</span>.
                            </p>
                            <button className="w-full py-3.5 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all">Launch Talent Bounty</button>
                        </div>
                    </div>

                    <div className="shine-card p-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Platform Vitality</h3>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Activity size={18} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-inter">System Uptime</span>
                                </div>
                                <span className="text-xs font-black text-emerald-500 font-mono">99.99%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-blue-500" />
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-inter">Global Nodes</span>
                                </div>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationalPulseView;
