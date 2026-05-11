import { useState, useEffect } from 'react';
import { 
    Calendar, ShieldCheck, 
    Mail, Plus, 
    ExternalLink, Briefcase, 
    MessageSquare, AlertCircle,
    X, CheckCircle2,
    Building2, Users,
    LifeBuoy, ArrowLeft, ChevronRight,
    MapPin, Globe, History, Star
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ClientProfile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isPublicView, setIsPublicView] = useState(false);
    
    const queryParams = new URLSearchParams(location.search);
    const queryEmail = queryParams.get('email');
    const queryTab = queryParams.get('tab');

    const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'reviews' | 'billing' | 'invoices' | 'settings'> (
        (queryTab as any) || 'about'
    );
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [proposals, setProposals] = useState<any[]>([]);
    const [loadingProposals, setLoadingProposals] = useState(false);

    useEffect(() => {
        if (queryTab) setActiveTab(queryTab as any);
    }, [queryTab]);

    const API_BASE_URL = 'http://localhost:8080/api/profiles';

    useEffect(() => {
        const fetchProfile = async () => {
            let targetEmail = queryEmail;
            const storedUser = localStorage.getItem('user');
            
            if (!targetEmail && storedUser) {
                const userData = JSON.parse(storedUser);
                targetEmail = userData.email;
                setIsPublicView(false);
            } else if (targetEmail) {
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setIsPublicView(userData.email !== targetEmail);
                } else {
                    setIsPublicView(true);
                }
            }

            if (!targetEmail || targetEmail === 'undefined') {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/${targetEmail}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                if (response.ok) {
                    const profileData = await response.json();
                    setUser(profileData);
                }
            } catch (err) {
                console.error('Error fetching client profile:', err);
            }
            setLoading(false);
        };

        fetchProfile();
    }, [queryEmail]);

    useEffect(() => {
        if (user?.id) fetchClientData();
    }, [user?.id]);

    const fetchClientData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/jobs`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const allJobs = await response.json();
                const clientJobs = allJobs.filter((j: any) => j.userEmail === user.email);
                setMyProjects(clientJobs);
            }
        } catch (err) {
            console.error("Error fetching client projects:", err);
        }
    };

    const fetchProposals = async (projectId: number) => {
        setLoadingProposals(true);
        try {
            const response = await fetch(`http://localhost:8080/api/proposals/project/${projectId}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                setProposals(data);
            }
        } catch (err) {
            console.error("Error fetching proposals:", err);
        } finally {
            setLoadingProposals(false);
        }
    };

    const handleViewProposals = (project: any) => {
        setSelectedProject(project);
        fetchProposals(project.id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface pt-[120px] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[13px] text-on-surface-variant">Loading client profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-surface pt-[120px] flex flex-col items-center justify-center px-6 text-center">
                <AlertCircle size={40} className="text-primary mb-6" />
                <h2 className="text-[24px] font-bold text-on-surface mb-3">Profile Not Found</h2>
                <button onClick={() => navigate('/jobs')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Back to Jobs</button>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f8fafc] pt-[80px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                
                {/* Premium Header */}
                <section className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm mb-8">
                    <div className="h-32 bg-gradient-to-r from-[#b5242c] to-[#8e1d23]"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex flex-col md:flex-row gap-6 -mt-12 items-end md:items-center">
                            <div className="w-32 h-32 rounded-2xl bg-white p-1 border-4 border-white shadow-lg overflow-hidden">
                                <div className="w-full h-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={48} className="text-gray-300" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-[28px] font-bold text-[#1e293b]">{user.fullName}</h1>
                                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 border border-green-100">
                                        <ShieldCheck size={14} /> VERIFIED EMPLOYER
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-[14px] text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {user.location || 'India'}</span>
                                    <span className="flex items-center gap-1.5"><Globe size={16} className="text-gray-400" /> Member since {new Date(user.joinedDate || user.createdAt).getFullYear()}</span>
                                    <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-400 fill-yellow-400" /> 5.0 (24 Reviews)</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 md:pt-0">
                                {isPublicView ? (
                                    <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                                        <MessageSquare size={18} /> Contact Company
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/post-job')} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
                                        <Plus size={18} /> Post a Job
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-200 w-fit overflow-x-auto">
                    {[
                        { id: 'about', label: 'Company Overview' },
                        { id: 'jobs', label: isPublicView ? 'Open Positions' : 'Manage Jobs' },
                        ...(!isPublicView ? [
                            { id: 'billing', label: 'Financials' },
                            { id: 'invoices', label: 'Invoices' },
                            { id: 'settings', label: 'Settings' }
                        ] : [])
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-2.5 rounded-xl text-[14px] font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {activeTab === 'about' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                                    <h2 className="text-[20px] font-bold text-[#1e293b] mb-6">About the Company</h2>
                                    <p className="text-[15px] text-gray-600 leading-[1.8] whitespace-pre-line mb-8">
                                        {user.summary || "No company description provided yet."}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Company Website</p>
                                            <a href="#" className="text-primary font-bold text-[14px] flex items-center gap-1 hover:underline">
                                                shinefiling.com <ExternalLink size={14} />
                                            </a>
                                        </div>
                                        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Scale</p>
                                            <p className="text-[#1e293b] font-bold text-[14px]">11 - 50 Professional Employees</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                                    <h2 className="text-[20px] font-bold text-[#1e293b] mb-6">Technical Ecosystem</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {['React.js', 'Next.js', 'Node.js', 'Spring Boot', 'AWS Cloud', 'UI/UX Design'].map(skill => (
                                            <span key={skill} className="px-5 py-2.5 bg-[#f1f5f9] border border-gray-100 rounded-xl text-[13px] font-bold text-[#475569]">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'jobs' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {(!selectedProject || isPublicView) ? (
                                    <>
                                        <div className="flex justify-between items-center mb-2">
                                            <h2 className="text-[20px] font-bold text-[#1e293b]">
                                                {isPublicView ? 'Available Opportunities' : 'Your Posted Jobs'}
                                            </h2>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {myProjects.length === 0 ? (
                                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                                    <Briefcase size={48} className="mx-auto mb-4 text-gray-200" />
                                                    <p className="text-gray-400 font-medium">No jobs posted yet.</p>
                                                </div>
                                            ) : (
                                                myProjects.map((project: any) => (
                                                    <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all group">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-[18px] text-[#1e293b] mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                                                <div className="flex items-center gap-4 text-[13px] text-gray-500">
                                                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}</span>
                                                                    <span className="flex items-center gap-1 font-bold text-[#b5242c]">₹{project.budget?.toLocaleString()}</span>
                                                                    <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{project.status || 'Active'}</span>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => isPublicView ? navigate(`/jobs/${project.id}`) : handleViewProposals(project)}
                                                                className="bg-gray-50 hover:bg-primary hover:text-white px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2"
                                                            >
                                                                {isPublicView ? 'View Details' : 'Manage Bids'} <ChevronRight size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-400 bg-white p-8 rounded-3xl border border-gray-200">
                                        <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-gray-400 hover:text-primary mb-8 text-[14px] font-bold">
                                            <ArrowLeft size={18} /> Back to Dashboard
                                        </button>
                                        <h2 className="text-[24px] font-bold text-[#1e293b] mb-6">{selectedProject.title}</h2>
                                        <div className="space-y-4">
                                            {proposals.map((proposal: any) => (
                                                <div key={proposal.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center font-bold text-primary">
                                                            {proposal.freelancer?.fullName?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-[#1e293b]">{proposal.freelancer?.fullName}</h4>
                                                            <p className="text-[12px] text-gray-500">Bid: <span className="font-bold text-[#b5242c]">₹{proposal.bidAmount?.toLocaleString()}</span></p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => navigate(`/messages?userId=${proposal.freelancer?.id}`)} className="bg-white border border-gray-200 px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-primary hover:text-white transition-all">Chat Now</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                            <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6">Trust & Reliability</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Verified Payments', status: true },
                                    { label: 'Identity Authenticated', status: true },
                                    { label: 'Secure Hiring History', status: true }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <span className="text-[13px] font-bold text-[#1e293b]">{item.label}</span>
                                        <CheckCircle2 size={18} className="text-green-500" />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {!isPublicView && (
                            <section className="bg-[#1e293b] rounded-3xl p-8 text-white shadow-xl">
                                <h3 className="text-[18px] font-bold mb-3">Wallet Snapshot</h3>
                                <p className="text-[32px] font-bold text-[#b5242c] mb-1">₹{user.walletBalance?.toLocaleString()}</p>
                                <p className="text-[12px] text-gray-400 mb-6">Available for instant project funding</p>
                                <button className="w-full bg-white text-[#1e293b] py-3.5 rounded-xl font-bold text-[14px] hover:opacity-90 transition-all">Add Credits</button>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ClientProfile;
