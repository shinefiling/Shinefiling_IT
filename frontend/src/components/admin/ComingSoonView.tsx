import React from 'react';
import { Rocket, Star } from 'lucide-react';

const ComingSoonView = ({ tabName }: any) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-500 blur-3xl opacity-20 rounded-full"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 transform rotate-6 border border-white/20">
                <Rocket size={48} className="text-white drop-shadow-md" />
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12 animate-bounce">
                <Star size={24} className="text-orange-500 fill-orange-500" />
            </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-tighter font-roboto">Module Under Construction</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
            The <span className="text-orange-500 font-bold uppercase">{tabName.replace('_', ' ')}</span> workspace is currently being optimized for platform integration. Check back soon for full operational capability.
        </p>
        <button className="px-8 py-3 bg-slate-900 dark:bg-orange-500 text-white rounded-2xl font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20">
            Notify Me on Launch
        </button>
    </div>
);

export default ComingSoonView;
