import React, { useState } from 'react';
import { Search, Filter, UserCheck, Star, MapPin, Mail, ChevronRight, Shield, BadgeCheck, MoreVertical } from 'lucide-react';

const UserManagementView = ({ users, type }: { users: any[], type: 'FREELANCER' | 'CLIENT' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredUsers = users.filter(u => 
        u.userRole === type && 
        (u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         u.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">
                        {type === 'FREELANCER' ? 'Certified Talent Network' : 'Enterprise Client Base'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                        {type === 'FREELANCER' ? 'Oversee and verify top-tier software engineers' : 'Manage relationships with your active hiring partners'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder={`Search ${type.toLowerCase()}s...`} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none w-64 transition-all font-poppins" 
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u) => (
                    <div key={u.id} className="shine-card hover:-translate-y-1 group overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-700">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'U')}&background=random&size=128`} alt={u.fullName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                                        <UserCheck size={10} className="text-white" />
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight mb-1 group-hover:text-orange-500 transition-colors font-poppins">{u.fullName}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{u.professionalHeadline || (type === 'FREELANCER' ? 'Senior Developer' : 'Project Owner')}</p>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <Mail size={14} className="text-slate-300" />
                                    <span className="truncate">{u.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <MapPin size={14} className="text-slate-300" />
                                    <span>{u.location || 'Global Operations'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                <div className="flex items-center gap-1.5 font-poppins">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">4.9</span>
                                    <span className="text-[10px] text-slate-400">(24 Reviews)</span>
                                </div>
                                {type === 'FREELANCER' && (
                                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">Verified</span>
                                )}
                            </div>
                        </div>
                        
                        <button className="w-full py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all font-poppins">
                            View Full Profile
                        </button>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="py-20 shine-card text-center text-slate-400 text-sm">
                    No {type.toLowerCase()}s found matching your search...
                </div>
            )}
        </div>
    );
};

export default UserManagementView;
