import React from 'react';
import { Globe, Palette, Shield, CreditCard, Save, RefreshCw, Bell } from 'lucide-react';

const SiteConfigView = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="shine-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-poppins">Global Platform Configuration</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Manage core marketplace settings, appearance, and financial policies</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"><Save size={18} /> Save All Changes</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="shine-card p-8">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-poppins">
                            <Palette size={20} className="text-orange-500" /> Platform Visual Identity
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Brand Color</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500 border-2 border-white dark:border-slate-800 shadow-sm"></div>
                                    <input type="text" defaultValue="#F97316" className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-orange-500/20 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Platform Logo Asset</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" defaultValue="/shine-logo.png" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-orange-500/20 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shine-card p-8">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-poppins">
                            <CreditCard size={20} className="text-emerald-500" /> Marketplace Fee Structure
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Commission (%)</label>
                                <input type="number" defaultValue="10" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Payout Fee (₹)</label>
                                <input type="number" defaultValue="250" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Daily IT News Update Section */}
                    <div className="shine-card p-8">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-poppins">
                            <Bell size={20} className="text-orange-500" /> Daily IT News Update
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Latest Update Content</label>
                                <textarea 
                                    id="newsContent"
                                    placeholder="Enter today's IT news update..."
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none min-h-[100px] resize-none font-poppins"
                                ></textarea>
                            </div>
                            <button 
                                onClick={async () => {
                                    const content = (document.getElementById('newsContent') as HTMLTextAreaElement).value;
                                    if (!content.trim()) return;
                                    try {
                                        const response = await fetch('http://localhost:8080/api/news/update', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'text/plain',
                                                'X-Requested-With': 'XMLHttpRequest'
                                            },
                                            body: content
                                        });
                                        if (response.ok) {
                                            alert('News updated successfully!');
                                            (document.getElementById('newsContent') as HTMLTextAreaElement).value = '';
                                        }
                                    } catch (err) {
                                        console.error("Error updating news:", err);
                                        alert('Failed to update news.');
                                    }
                                }}
                                className="w-full py-3 bg-[#003d4d] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#002d38] transition-all shadow-md"
                            >
                                Publish Update
                            </button>
                        </div>
                    </div>

                    <div className="shine-card p-8">
                        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2 font-poppins">
                            <Shield size={20} className="text-blue-500" /> Security & Access Controls
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white font-poppins">Two-Factor Authentication</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enforce for all Admins</p>
                                </div>
                                <div className="w-10 h-5 bg-orange-500 rounded-full relative cursor-pointer shadow-inner">
                                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 opacity-60">
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white font-poppins">New Registration Hold</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manual review required</p>
                                </div>
                                <div className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative cursor-pointer">
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#003d4d] p-8 rounded-[20px] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                        <RefreshCw className="mb-6 opacity-60" size={32} />
                        <h3 className="text-xl font-bold mb-4 font-poppins">Cache Management</h3>
                        <p className="text-xs opacity-70 mb-8 leading-relaxed font-medium">Changes to global configuration may take up to 10 minutes to propagate across all edge nodes.</p>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Purge Global CDN Cache</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteConfigView;
