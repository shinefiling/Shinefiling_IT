import React, { useState, useEffect } from 'react';
import { 
    Users, Globe, Clock, Activity, 
    TrendingUp, TrendingDown, Eye, Search,
    BarChart3, PieChart, Star, Rocket,
    ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [timeRange, setTimeRange] = useState<'7' | '30'>('7');

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) setUser(JSON.parse(stored));
    }, []);

    if (!user) return null;

    const topStats = [
        { label: "Profile Views", value: "2,840", change: "+12%", icon: Eye, color: "text-red-400", bg: "bg-red-50" },
        { label: "Search Appearances", value: "1,120", change: "+8.4%", icon: Search, color: "text-orange-400", bg: "bg-orange-50" },
        { label: "Response Time", value: "45m", change: "-2%", icon: Clock, color: "text-pink-400", bg: "bg-pink-50" },
        { label: "Completion Rate", value: "99.2%", change: "+0.5%", icon: Activity, color: "text-teal-400", bg: "bg-teal-50" }
    ];

    const chartData = [
        { day: 'Mon', val: 65 },
        { day: 'Tue', val: 85 },
        { day: 'Wed', val: 45 },
        { day: 'Thu', val: 110 },
        { day: 'Fri', val: 75 },
        { day: 'Sat', val: 130, highlight: true },
        { day: 'Sun', val: 60 }
    ];

    const skills = [
        { name: "UI/UX Design", value: 88, color: "bg-blue-600" },
        { name: "React Development", value: 72, color: "bg-blue-500" },
        { name: "Data Visualization", value: 45, color: "bg-emerald-500" },
        { name: "Branding", value: 35, color: "bg-rose-700" }
    ];

    const activities = [
        { event: 'Project "Neon Genesis" Completed', date: 'Oct 28, 2023', status: 'Success', impact: '+8.2% Rating', value: '₹3,200.00', icon: Rocket },
        { event: '5-Star Review Received', date: 'Oct 22, 2023', status: 'Verified', impact: 'High Reach', value: '-', icon: Star },
        { event: 'Portfolio Featured in Weekly Digest', date: 'Oct 20, 2023', status: 'Boost', impact: '+850 Views', value: '-', icon: Search }
    ];

    return (
        <div className="min-h-screen bg-[#fffcf9] pt-[140px] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-[28px] font-bold text-[#333] mb-1">Account Analytics</h1>
                    <p className="text-[14px] text-gray-500">Real-time performance metrics and earnings growth.</p>
                </div>

                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {topStats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)]"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={16} />
                                </div>
                                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-md flex items-center gap-1">
                                    <TrendingUp size={10} /> {stat.change}
                                </span>
                            </div>
                            <p className="text-[12px] font-bold text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-[26px] font-bold text-[#111]">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Earnings Overview Chart */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-[0_2px_15px_rgb(0,0,0,0.02)] h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-[16px] font-bold text-[#333] mb-1">Earnings Overview</h3>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[24px] font-bold text-[#111]">₹12,450.00</p>
                                        <span className="text-[12px] text-green-600 font-medium">+15.2% this month</span>
                                    </div>
                                </div>
                                <div className="flex bg-gray-50 rounded-lg p-1">
                                    <button 
                                        onClick={() => setTimeRange('7')}
                                        className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${timeRange === '7' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                                    >
                                        7 Days
                                    </button>
                                    <button 
                                        onClick={() => setTimeRange('30')}
                                        className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${timeRange === '30' ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                                    >
                                        30 Days
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-end justify-between h-[250px] gap-4">
                                {chartData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <motion.div 
                                            initial={{ height: 0 }}
                                            animate={{ height: `${d.val}%` }}
                                            transition={{ delay: i * 0.1, duration: 0.8 }}
                                            className={`w-full max-w-[45px] rounded-t-lg transition-all relative ${
                                                d.highlight 
                                                ? 'bg-gradient-to-t from-primary/80 to-primary' 
                                                : 'bg-gradient-to-t from-primary/10 to-primary/30 group-hover:from-primary/20 group-hover:to-primary/40'
                                            }`}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                ₹{(d.val * 150).toLocaleString()}
                                            </div>
                                        </motion.div>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                            <h3 className="text-[15px] font-bold text-[#333] mb-6 uppercase tracking-wider">Skill Demand</h3>
                            <div className="space-y-6">
                                {skills.map((skill, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[12px] font-bold text-gray-600">{skill.name}</span>
                                            <span className="text-[11px] font-bold text-gray-400">{skill.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.value}%` }}
                                                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                                className={`h-full ${skill.color} rounded-full`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 pt-8 border-t border-gray-50 text-[12px] text-gray-400 leading-relaxed italic">
                                Trends indicate a rising demand for <span className="text-primary font-bold">Micro-animations</span> in your region.
                            </p>
                        </div>

                        <div className="bg-primary rounded-xl p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-[18px] font-bold mb-3 leading-tight">Premium Insights</h3>
                                <p className="text-[12px] opacity-90 leading-relaxed mb-6">
                                    Unlock deep-dive competitive analysis and niche market trends.
                                </p>
                                <button className="w-full py-3 bg-white text-primary rounded-lg font-bold text-[12px] hover:bg-gray-50 transition-all shadow-md">
                                    Upgrade Now
                                </button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Zap size={120} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-[17px] font-bold text-[#333]">Recent Performance Activity</h2>
                        <button className="text-[12px] font-bold text-primary hover:underline">View All Logs</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left bg-gray-50/50">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Event</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Impact</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {activities.map((act, i) => (
                                    <tr key={i} className="hover:bg-gray-50/30 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                                    <act.icon size={16} />
                                                </div>
                                                <span className="text-[13px] font-bold text-[#444]">{act.event}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-[12px] text-gray-400 font-medium tracking-tight">{act.date}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                                act.status === 'Success' ? 'bg-green-50 text-green-600' : 
                                                act.status === 'Verified' ? 'bg-orange-50 text-orange-600' : 'bg-primary/5 text-primary'
                                            }`}>
                                                {act.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-[12px] text-gray-600 font-bold">{act.impact}</td>
                                        <td className="px-6 py-5 text-[13px] font-bold text-[#111] text-right">{act.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
