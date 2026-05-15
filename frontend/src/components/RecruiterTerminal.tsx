import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, X, Briefcase, FileText, 
    MessageSquare, ArrowLeft, CheckSquare 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface RecruiterTerminalProps {
    isOpen: boolean;
    onClose: () => void;
    myJobs: any[];
    applications: any[];
    onReviewProfile: (app: any) => void;
    initialJobId?: number | null;
}

const RecruiterTerminal: React.FC<RecruiterTerminalProps> = ({ 
    isOpen, 
    onClose, 
    myJobs, 
    applications, 
    onReviewProfile,
    initialJobId = null
}) => {
    const [selectedJobId, setSelectedJobId] = useState<number | null>(initialJobId);

    // Filter applications based on selected job
    const filteredApplications = applications.filter(app => !selectedJobId || app.jobId === selectedJobId);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1500] bg-gray-50 flex flex-col"
                >
                    {/* Modal Header */}
                    <div className="bg-[#0F2E4B] text-white px-8 py-6 flex justify-between items-center shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-[24px] font-bold tracking-tight">Recruiter Command Center</h2>
                                <p className="text-[12px] font-bold text-white/50 uppercase tracking-[0.2em]">Application Management Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {selectedJobId && (
                                <button 
                                    onClick={() => setSelectedJobId(null)}
                                    className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg font-bold text-[12px] transition-all flex items-center gap-2 border border-white/10"
                                >
                                    <X size={16} /> Clear Job Filter
                                </button>
                            )}
                            <button 
                                onClick={onClose}
                                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-[13px] transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
                            >
                                Exit Terminal <ArrowLeft size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body - Responsive Layout */}
                    <div className="flex-1 overflow-hidden p-4 lg:p-8">
                        <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-hidden">
                            {/* Left Side: Job Sidebar */}
                            <div className="w-full lg:w-[320px] bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col shrink-0 overflow-hidden h-[200px] lg:h-full">
                                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Your Job Postings</h4>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                    {myJobs.length === 0 ? (
                                        <div className="p-8 text-center border-2 border-dashed border-gray-100 rounded-xl">
                                            <Briefcase size={32} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-gray-400 font-medium">No active job posts found</p>
                                        </div>
                                    ) : (
                                        myJobs.map(job => {
                                            const appCount = applications.filter(a => a.jobId === job.id).length;
                                            return (
                                                <div 
                                                    key={job.id}
                                                    onClick={() => setSelectedJobId(job.id)}
                                                    className={`p-5 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                                                        selectedJobId === job.id 
                                                        ? 'bg-[#0F2E4B] border-[#0F2E4B] text-white shadow-xl scale-[1.02]' 
                                                        : 'bg-white border-gray-50 text-[#0F2E4B] hover:border-[#317CD7] hover:bg-blue-50/30'
                                                    }`}
                                                >
                                                    <p className={`text-[16px] font-bold leading-tight ${selectedJobId === job.id ? 'text-white' : 'text-[#0F2E4B]'}`}>{job.title}</p>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${selectedJobId === job.id ? 'bg-white/10 text-white/80' : 'bg-gray-50 text-gray-400'}`}>{job.type}</span>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} className={selectedJobId === job.id ? 'text-[#317CD7]' : 'text-gray-300'} />
                                                            <span className={`text-[12px] font-bold ${selectedJobId === job.id ? 'text-white/60' : 'text-gray-400'}`}>
                                                                {appCount}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Applications Table */}
                            <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white sticky top-0 z-10">
                                    <div>
                                        <h3 className="text-[20px] font-bold text-[#0F2E4B]">
                                            {selectedJobId ? myJobs.find(j => j.id === selectedJobId)?.title : 'All Active Candidates'}
                                        </h3>
                                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            {filteredApplications.length} Applications Identified
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="bg-gray-50 text-[#0F2E4B] px-4 py-2 rounded-lg font-bold text-[12px] border border-gray-100 hover:bg-gray-100 transition-all">Bulk Export</button>
                                        <button className="bg-[#317CD7] text-white px-4 py-2 rounded-lg font-bold text-[12px] hover:bg-[#2563b5] transition-all shadow-lg shadow-[#317CD7]/20">Bulk Approve</button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden flex flex-col bg-white">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[900px]">
                                            <thead>
                                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[100px]">ID</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Candidate</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Experience</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Resume</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 overflow-y-auto">
                                                {filteredApplications.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-24 text-center">
                                                            <div className="flex flex-col items-center justify-center opacity-60">
                                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                                                    <Users size={32} className="text-gray-200" />
                                                                </div>
                                                                <p className="text-[#0F2E4B] font-bold text-lg">No Profiles Found</p>
                                                                <p className="text-gray-400 mt-1 text-[13px]">Select a different job or wait for new applications</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredApplications.map(app => (
                                                        <tr key={app.id} className="hover:bg-blue-50/20 transition-all group">
                                                            <td className="py-5 px-6">
                                                                <span className="text-[12px] font-bold text-gray-400">#{app.id}</span>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-[#0F2E4B] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                                        {app.fullName?.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[14px] font-bold text-[#0F2E4B] group-hover:text-[#317CD7] transition-colors">{app.fullName}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <p className="text-[13px] font-bold text-[#0F2E4B]">{app.email}</p>
                                                                <p className="text-[11px] text-gray-500 font-medium">{app.phone || 'No phone'}</p>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <span className="px-3 py-1 bg-gray-50 text-[12px] font-bold text-gray-600 rounded-md border border-gray-100">
                                                                    {app.experience}
                                                                </span>
                                                            </td>
                                                            <td className="py-5 px-6 text-center">
                                                                {app.resumeUrl ? (
                                                                    <a 
                                                                        href={`${API_BASE_URL}${app.resumeUrl.startsWith('/') ? '' : '/'}${app.resumeUrl}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center justify-center w-9 h-9 bg-[#317CD7]/10 text-[#317CD7] rounded-lg hover:bg-[#317CD7] hover:text-white transition-all shadow-sm"
                                                                        title="View Resume"
                                                                    >
                                                                        <FileText size={18} />
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-[14px] font-bold text-gray-200">—</span>
                                                                )}
                                                            </td>
                                                            <td className="py-5 px-6 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button 
                                                                        onClick={() => window.dispatchEvent(new CustomEvent('open-chat', { 
                                                                            detail: { 
                                                                                contact: { 
                                                                                    name: app.fullName, 
                                                                                    username: app.username,
                                                                                    email: app.email,
                                                                                    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                                                                                } 
                                                                            } 
                                                                        }))}
                                                                        className="w-9 h-9 flex items-center justify-center bg-white border border-gray-100 text-gray-400 rounded-lg hover:border-[#317CD7] hover:text-[#317CD7] transition-all shadow-sm"
                                                                        title="Quick Message"
                                                                    >
                                                                        <MessageSquare size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => onReviewProfile(app)}
                                                                        className="px-4 py-2 bg-[#0F2E4B] text-white rounded-lg font-bold text-[12px] hover:bg-[#317CD7] transition-all active:scale-95 shadow-lg shadow-[#0F2E4B]/10"
                                                                    >
                                                                        Review Profile
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RecruiterTerminal;
