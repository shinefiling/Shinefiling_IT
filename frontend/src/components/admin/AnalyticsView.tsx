import React from 'react';
import { TrendingUp, Users, Briefcase, Activity, IndianRupee, Globe, PieChart } from 'lucide-react';
import { StatCard, BarItem } from './Common';

const AnalyticsView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Platform Performance Analytics</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Deep dive into marketplace growth, user acquisition, and financial trends</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="shine-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-slate-800 dark:text-white font-poppins">Growth Velocity (YoY)</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Projects</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-teal-500 rounded-full"></div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Talent Growth</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 flex items-end gap-3 px-2">
                            {[40, 60, 45, 80, 95, 70, 85, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-t-lg relative group transition-all">
                                    <div style={{ height: `${h}%` }} className="bg-gradient-to-t from-orange-500/80 to-orange-500 w-full rounded-t-lg absolute bottom-0 transition-all group-hover:scale-y-105 origin-bottom shadow-lg shadow-orange-500/10"></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-4 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map(m => <span key={m}>{m}</span>)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="shine-card p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-6 font-poppins">User Acquisition</h3>
                            <div className="space-y-4">
                                <BarItem label="Organic Search" val={75} />
                                <BarItem label="Referral Network" val={45} />
                                <BarItem label="Direct Access" val={90} />
                                <BarItem label="Social Channels" val={30} />
                            </div>
                        </div>
                        <div className="shine-card p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-6 font-poppins">Market Share</h3>
                            <div className="flex items-center justify-center h-44">
                                <div className="w-32 h-32 rounded-full border-[10px] border-slate-50 dark:border-slate-900 border-t-orange-500 border-l-teal-500 flex items-center justify-center shadow-inner relative">
                                    <div className="text-center">
                                        <span className="text-2xl font-black text-slate-800 dark:text-white font-poppins">82%</span>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Dominance</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500"></div>
                        <PieChart className="mb-6 opacity-60" size={32} />
                        <h3 className="text-xl font-bold mb-6 font-poppins">Category Dominance</h3>
                        <div className="space-y-5">
                            {[
                                { label: 'Web Dev', val: '42%', color: 'bg-orange-500' },
                                { label: 'Mobile Apps', val: '28%', color: 'bg-blue-500' },
                                { label: 'AI/ML', val: '18%', color: 'bg-emerald-500' },
                                { label: 'UI/UX', val: '12%', color: 'bg-pink-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                        <span className="text-[13px] font-medium opacity-80 font-inter">{item.label}</span>
                                    </div>
                                    <span className="text-[13px] font-bold">{item.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="shine-card p-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Retention Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Freelancer Return Rate</span>
                                <span className="font-bold text-emerald-500 text-sm">92%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Client Repeat Hire</span>
                                <span className="font-bold text-blue-500 text-sm">68%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
