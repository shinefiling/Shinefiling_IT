import React from 'react';
import { Users, Briefcase, CheckSquare, Activity, IndianRupee, TrendingUp, UserPlus, Building } from 'lucide-react';

export const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }: any) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-lg ${colorClass} flex items-center justify-center transition-transform group-hover:scale-110 shadow-md border border-white/20`}>
                <Icon size={16} className="text-white" />
            </div>
            {trend && (
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} shadow-sm`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div>
            <h3 className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-[0.15em] mb-0.5">{title}</h3>
            <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-slate-800 dark:text-white font-poppins leading-none">{value}</span>
            </div>
            {subtext && <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 font-medium">{subtext}</p>}
        </div>
    </div>
);

export const LegendItem = ({ color, label, val }: any) => (
    <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-sm ${color}`}></div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{label} ({val})</span>
    </div>
);

export const BarItem = ({ label, val }: any) => (
    <div>
        <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-widest">
            <span>{label}</span>
            <span>{val}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" style={{ width: `${val}%` }}></div>
        </div>
    </div>
);
