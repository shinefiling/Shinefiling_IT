import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, X, Verified, FileText, 
    ExternalLink, Linkedin, Globe, MessageSquare 
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ApplicationDetailsModalProps {
    application: any | null;
    onClose: () => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ application, onClose }) => {
    if (!application) return null;

    return (
        <AnimatePresence>
            {application && (
                <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-2 sm:p-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl my-auto"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#0F2E4B] text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{application.isProposal ? 'Proposal Dossier' : 'Candidate Dossier'}</h3>
                                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                                        {application.isProposal ? `Project ID: #${application.projectId || 'N/A'}` : `Job ID: #${application.jobId || 'N/A'}`}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="bg-gray-50/50 rounded-2xl p-6 mb-8 border border-gray-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{application.isProposal ? 'Partner Name' : 'Candidate Name'}</label>
                                        <p className="text-[18px] font-bold text-[#0F2E4B] truncate" title={application.fullName || application.username}>{application.fullName || application.username || 'Anonymous'}</p>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#317CD7] bg-[#317CD7]/5 px-2 py-0.5 rounded-lg">
                                            <Verified size={10} /> Verified Professional
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                                        <p className="text-[14px] font-bold text-gray-700 break-all">{application.email}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">Primary Contact</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone Number</label>
                                        <p className="text-[14px] font-bold text-gray-700">{application.phone || 'N/A'}</p>
                                        <p className="text-[11px] text-gray-400 font-medium">Mobile/Work</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Engagement Details</label>
                                        <div className="space-y-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                            {application.isProposal ? (
                                                <>
                                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                                        <span className="text-[13px] text-gray-500 font-medium">Bid Amount</span>
                                                        <span className="text-[16px] font-bold text-[#317CD7]">₹{application.bidAmount?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                                        <span className="text-[13px] text-gray-500 font-medium">Delivery Timeline</span>
                                                        <span className="text-[13px] font-bold text-[#0F2E4B]">{application.deliveryTime}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                                                    <span className="text-[13px] text-gray-500 font-medium">Experience Level</span>
                                                    <span className="text-[13px] font-bold text-[#0F2E4B]">{application.experience || 'N/A'}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-[13px] text-gray-500 font-medium">System Reference</span>
                                                <span className="text-[13px] font-bold text-gray-400">#{application.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Technical Proficiency</label>
                                        <div className="flex flex-wrap gap-2">
                                            {application.skills?.split(',').map((skill: string) => (
                                                <span key={skill} className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-bold text-[#317CD7] shadow-sm">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">{application.isProposal ? 'Proposal Narrative' : 'Applicant Statement'}</label>
                                        <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl">
                                            <p className="text-[14px] font-medium text-[rgb(33,33,33)] leading-[26px] whitespace-pre-line italic">
                                                "{application.isProposal ? application.coverLetter : (application.coverLetter || 'No statement provided.')}"
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Attached Documents & Socials</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {application.resumeUrl ? (
                                                <a 
                                                    href={`${API_BASE_URL}${application.resumeUrl.startsWith('/') ? '' : '/'}${application.resumeUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-[#317CD7]/5 border border-[#317CD7]/20 rounded-2xl hover:bg-[#317CD7]/10 transition-all group shadow-sm"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#317CD7] shadow-sm border border-[#317CD7]/10">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[13px] font-bold text-[#317CD7]">Download Resume</p>
                                                            <p className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">{application.resumeFileName || 'Official_Resume.pdf'}</p>
                                                        </div>
                                                    </div>
                                                    <ExternalLink size={16} className="text-gray-400 group-hover:text-[#317CD7] group-hover:translate-x-1 transition-transform" />
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-60">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                                                        <X size={20} />
                                                    </div>
                                                    <p className="text-[13px] font-bold text-gray-500">Resume Not Provided</p>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                {application.linkedin && (
                                                    <a 
                                                        href={application.linkedin.startsWith('http') ? application.linkedin : `https://${application.linkedin}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl hover:bg-blue-100 transition-all group"
                                                    >
                                                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#0A66C2] shadow-sm">
                                                            <Linkedin size={18} />
                                                        </div>
                                                        <span className="text-[12px] font-bold text-[#0A66C2]">LinkedIn</span>
                                                    </a>
                                                )}
                                                {application.portfolio && (
                                                    <a 
                                                        href={application.portfolio.startsWith('http') ? application.portfolio : `https://${application.portfolio}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all group"
                                                    >
                                                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-gray-600 shadow-sm">
                                                            <Globe size={18} />
                                                        </div>
                                                        <span className="text-[12px] font-bold text-gray-700">Portfolio</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            <button 
                                onClick={onClose}
                                className="px-6 py-3 font-bold text-[13px] text-gray-500 hover:text-gray-700 transition-all"
                            >
                                Dismiss Dossier
                            </button>
                            <button 
                                className="px-10 py-3 bg-[#0F2E4B] text-white font-bold text-[13px] rounded-xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-[#0F2E4B]/20 flex items-center gap-2"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('open-chat', { 
                                        detail: { 
                                            contact: { 
                                                name: application.fullName || application.username, 
                                                username: application.username,
                                                email: application.email,
                                                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                                            } 
                                        } 
                                    }));
                                    onClose();
                                }}
                            >
                                {application.isProposal ? 'Negotiate Bid' : 'Initiate Interview'} <MessageSquare size={16} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApplicationDetailsModal;
