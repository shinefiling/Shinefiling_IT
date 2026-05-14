import React, { useState } from 'react';
import { User, MapPin, Mail, Phone, Shield, Edit2, Globe, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileView = ({ user }: any) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -mr-32 -mt-32"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'A')}&background=F97316&color=fff&size=200`} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-orange-500 hover:scale-110 transition-transform">
                            <Edit2 size={14} />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tight font-poppins">{user?.fullName || 'Administrator'}</h2>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 text-[10px] font-extrabold uppercase rounded-full border border-orange-200 dark:border-orange-500/20 tracking-widest">
                                <Shield size={10} /> Verified Admin
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mb-6 font-inter">
                            Master Administrator • Global Operations Lead
                        </p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-8">
                            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"><Mail size={14} className="text-orange-500" /></div>
                                <span className="text-[13px] font-medium">{user?.email || 'admin@shinefiling.com'}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"><MapPin size={14} className="text-orange-500" /></div>
                                <span className="text-[13px] font-medium">Headquarters</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                                <div className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800"><Globe size={14} className="text-orange-500" /></div>
                                <span className="text-[13px] font-medium">IST (UTC+5:30)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="px-6 py-2.5 bg-[#003d4d] text-white rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-[#002d38] transition-all shadow-lg shadow-[#003d4d]/20">Manage Access</button>
                        <button className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-extrabold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 transition-all shadow-sm">Audit Trail</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="shine-card p-8">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-poppins">
                            <User size={20} className="text-orange-500" /> Administrative Identity
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-[14px] leading-relaxed font-inter">
                            Lead Administrator responsible for oversee platform operations, talent verification, and marketplace integrity. 
                            Managing over 500+ active engagements and ensuring a high standard of professional excellence within the Shinefiling network.
                        </p>
                    </div>

                    <div className="shine-card p-8">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 font-poppins">System Engagement History</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-orange-200 transition-all">
                                    <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white font-poppins">Platform Protocol Update</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Yesterday • System Governance</p>
                                    </div>
                                    <Edit2 size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                        <Shield className="mb-8 opacity-60" size={32} />
                        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] opacity-60 mb-8">System Authority</h3>
                        <div className="space-y-8 relative z-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Access Level</p>
                                    <p className="text-3xl font-extrabold font-poppins">Tier 1</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Power</p>
                                    <p className="text-3xl font-extrabold font-poppins">Full</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-3">Administrator Key</p>
                                <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <span className="text-[11px] font-mono tracking-widest truncate opacity-80 uppercase">SF-ADMIN-99X2-K99</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shine-card p-6">
                        <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-6">Engagement Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-orange-50 dark:bg-orange-500/5 rounded-2xl border border-orange-100 dark:border-orange-500/10 text-center">
                                <p className="text-[9px] font-extrabold text-slate-400 uppercase mb-2 tracking-widest">Decisions</p>
                                <p className="text-2xl font-extrabold text-orange-600 font-poppins">1.2k</p>
                            </div>
                            <div className="p-5 bg-teal-50 dark:bg-teal-500/5 rounded-2xl border border-teal-100 dark:border-teal-500/10 text-center">
                                <p className="text-[9px] font-extrabold text-slate-400 uppercase mb-2 tracking-widest">Users</p>
                                <p className="text-2xl font-extrabold text-teal-600 font-poppins">429</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
