import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Search, Filter, 
    ChevronRight, Users, 
    MessageSquare, Briefcase, 
    FileText, CheckCircle2,
    Clock, ArrowRight, User,
    Star, Wallet, TrendingUp
} from 'lucide-react';
import { API_BASE_URL } from '../config';

interface ProjectTerminalProps {
    isOpen: boolean;
    onClose: () => void;
    myProjects: any[];
    proposals: any[];
    onReviewProposal: (prop: any) => void;
    initialProjectId?: string | null;
}

const ProjectTerminal: React.FC<ProjectTerminalProps> = ({ 
    isOpen, onClose, myProjects, proposals, onReviewProposal, initialProjectId 
}) => {
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId || (myProjects[0]?.id || null));
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (initialProjectId) {
            setSelectedProjectId(initialProjectId);
        }
    }, [initialProjectId]);

    const filteredProposals = proposals.filter(p => 
        (!selectedProjectId || String(p.projectId) === String(selectedProjectId)) &&
        (p.freelancer?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.freelancer?.email?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const activeProject = myProjects.find(p => p.id === selectedProjectId);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1500] bg-[#0F2E4B]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
                >
                    <div className="bg-white w-full max-w-[1400px] h-full sm:h-[90vh] rounded-xl overflow-hidden shadow-2xl flex flex-col">
                        {/* Terminal Header */}
                        <div className="bg-[#0F2E4B] text-white p-6 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#317CD7] rounded-xl flex items-center justify-center shadow-lg shadow-[#317CD7]/20">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h2 className="text-[20px] font-bold tracking-tight">Project Management Terminal</h2>
                                    <p className="text-[11px] text-white/60 font-bold uppercase tracking-widest mt-0.5">Control Center • Active Bidding</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex items-center gap-8 border-l border-white/10 pl-8 h-10">
                                    <div className="text-center">
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Total Projects</p>
                                        <p className="text-[16px] font-bold">{myProjects.length}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Incoming Bids</p>
                                        <p className="text-[16px] font-bold text-[#317CD7]">{proposals.length}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Terminal Body - Responsive */}
                        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                            {/* Project Sidebar */}
                            <div className="w-full lg:w-[320px] border-r border-gray-100 flex flex-col bg-gray-50/30 h-[200px] lg:h-full shrink-0">
                                <div className="p-5 border-b border-gray-100 bg-white">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search projects..." 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-[12px] font-medium focus:ring-2 focus:ring-[#317CD7]/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                                    <button 
                                        onClick={() => setSelectedProjectId(null)}
                                        className={`w-full p-4 rounded-xl text-left transition-all flex flex-col gap-1 border ${!selectedProjectId ? 'bg-white border-[#317CD7] shadow-sm shadow-[#317CD7]/10' : 'border-transparent hover:bg-white hover:border-gray-200'}`}
                                    >
                                        <p className={`text-[13px] font-bold ${!selectedProjectId ? 'text-[#317CD7]' : 'text-[#0F2E4B]'}`}>View All Projects</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">All Active Bids</p>
                                    </button>
                                    <div className="h-px bg-gray-100 mx-2 my-2" />
                                    {myProjects.map(project => (
                                        <button 
                                            key={project.id}
                                            onClick={() => setSelectedProjectId(project.id)}
                                            className={`w-full p-4 rounded-xl text-left transition-all flex flex-col gap-1 border group ${selectedProjectId === project.id ? 'bg-white border-[#317CD7] shadow-sm shadow-[#317CD7]/10' : 'border-transparent hover:bg-white hover:border-gray-200'}`}
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-[13px] font-bold line-clamp-1 flex-1 ${selectedProjectId === project.id ? 'text-[#317CD7]' : 'text-[#0F2E4B]'}`}>{project.title}</p>
                                                <span className="text-[10px] font-bold text-gray-300">#{project.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <Users size={10} className="text-gray-400" />
                                                    <span className="text-[10px] text-gray-400 font-bold">{proposals.filter(p => String(p.projectId) === String(project.id)).length} Bids</span>
                                                </div>
                                                <span className="text-gray-200">•</span>
                                                <span className="text-[10px] text-[#317CD7] font-bold uppercase tracking-tight">₹{project.budgetAmount?.toLocaleString()}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Data Area */}
                            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-[18px] font-bold text-[#0F2E4B]">
                                            {activeProject ? activeProject.title : 'All Project Bids'}
                                        </h3>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                            {filteredProposals.length} Partner Proposals Identified
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Filter partners..." 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-[12px] font-medium w-[240px] focus:ring-2 focus:ring-[#317CD7]/20 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden flex flex-col bg-white">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse min-w-[900px]">
                                            <thead>
                                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest w-[100px]">ID</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Partner</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Bid Amount</th>
                                                    <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Control</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 overflow-y-auto">
                                                {filteredProposals.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="py-24 text-center">
                                                            <div className="flex flex-col items-center justify-center opacity-60">
                                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                                                                    <Star size={32} className="text-gray-200" />
                                                                </div>
                                                                <p className="text-[#0F2E4B] font-bold text-lg">No Proposals Found</p>
                                                                <p className="text-gray-400 mt-1 text-[13px]">Select a different project or wait for new bids</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredProposals.map(prop => (
                                                        <tr key={prop.id} className="hover:bg-blue-50/20 transition-all group">
                                                            <td className="py-5 px-6">
                                                                <span className="text-[12px] font-bold text-gray-400">#{prop.id}</span>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-[#0F2E4B] text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                                        {prop.freelancer?.fullName?.charAt(0) || prop.freelancer?.username?.charAt(0)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[14px] font-bold text-[#0F2E4B] group-hover:text-[#317CD7] transition-colors">{prop.freelancer?.fullName || prop.freelancer?.username}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <p className="text-[13px] font-bold text-[#0F2E4B]">{prop.freelancer?.email}</p>
                                                                <p className="text-[11px] text-gray-500 font-medium">{prop.freelancer?.phone || 'No phone'}</p>
                                                            </td>
                                                            <td className="py-5 px-6">
                                                                <span className="px-3 py-1 bg-gray-50 text-[12px] font-bold text-gray-600 rounded-md border border-gray-100">
                                                                    {prop.deliveryTime}
                                                                </span>
                                                            </td>
                                                            <td className="py-5 px-6 text-center">
                                                                <span className="text-[16px] font-bold text-[#317CD7]">₹{prop.bidAmount?.toLocaleString()}</span>
                                                            </td>
                                                            <td className="py-5 px-6 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button 
                                                                        onClick={() => window.dispatchEvent(new CustomEvent('open-chat', { 
                                                                            detail: { 
                                                                                contact: { 
                                                                                    name: prop.freelancer?.fullName || prop.freelancer?.username, 
                                                                                    username: prop.freelancer?.username,
                                                                                    email: prop.freelancer?.email,
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
                                                                        onClick={() => onReviewProposal(prop)}
                                                                        className="px-4 py-2 bg-[#0F2E4B] text-white rounded-lg font-bold text-[12px] hover:bg-[#317CD7] transition-all active:scale-95 shadow-lg shadow-[#0F2E4B]/10"
                                                                    >
                                                                        Review Bid
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

export default ProjectTerminal;
