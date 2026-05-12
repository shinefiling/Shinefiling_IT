import React, { useState, useEffect } from 'react';
import { Search, Briefcase, User, Calendar, ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';

const JobApplicationsView: React.FC = () => {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/applications`);
            if (response.ok) {
                setApplications(await response.json());
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => 
        app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Job Applications</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor all platform job applications in real-time</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search applications..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full md:w-64 outline-none focus:border-orange-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredApplications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 p-20 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <Briefcase className="mx-auto text-slate-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-slate-600">No Applications Found</h3>
                    </div>
                ) : (
                    filteredApplications.map((app) => (
                        <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                        >
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 shrink-0">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{app.jobTitle}</h3>
                                        <p className="text-slate-500 text-sm flex items-center gap-1">
                                            <span className="font-bold text-orange-500">Client:</span> {app.clientEmail}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-50 dark:border-slate-700">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Freelancer</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{app.fullName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-slate-400" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Experience</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{app.experience}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Submitted</p>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{new Date(app.submittedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {app.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex md:flex-col justify-center gap-2">
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-200 transition-all">
                                    <ExternalLink size={14} /> View Resume
                                </button>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20">
                                    Manage App
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobApplicationsView;
