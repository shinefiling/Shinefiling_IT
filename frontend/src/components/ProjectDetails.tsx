import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Clock, MapPin, Calendar, Bookmark, Send, 
    BarChart, Info, Star, CheckCircle, AlertCircle, 
    ChevronLeft, Contact, Headphones, Languages, Lock,
    Folder, Eye
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const formRef = useRef<HTMLDivElement>(null);
    const [project, setProject] = useState<any>(null);
    const [proposals, setProposals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [message, setMessage] = useState('');
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchProject = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }); 
            if (!response.ok) throw new Error("Project not found");
            const data = await response.json();
            setProject(data);
            
            if (data) {
                fetchProposals(data.id);
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProposals = async (projectId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/proposals/project/${projectId}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                setProposals(data);
            }
        } catch (error) {
            console.error("Error fetching proposals:", error);
        }
    };

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setErrorMsg("Please login to submit a proposal.");
            return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user.id || user.userId;
        
        try {
            setSubmitting(true);
            setErrorMsg(null);
            
            const response = await fetch(`${API_BASE_URL}/api/proposals/project/${project.id}/freelancer/${userId}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    bidAmount: Number(bidAmount),
                    deliveryTime,
                    coverLetter: message
                })
            });

            if (!response.ok) throw new Error("Failed to submit proposal");

            setSuccessMsg("Proposal submitted successfully!");
            setBidAmount('');
            setDeliveryTime('');
            setMessage('');
            fetchProposals(project.id);
            
            setTimeout(() => setSuccessMsg(null), 5000);
        } catch (err) {
            setErrorMsg("Failed to submit proposal. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#fcfcfc] pt-[120px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
        </div>
    );

    if (!project) return (
        <div className="min-h-screen bg-[#fcfcfc] pt-[120px] text-center">
            <h2 className="text-2xl font-bold">Project not found</h2>
            <button onClick={() => navigate('/projects')} className="mt-4 text-[#ff0066] font-bold underline">Back to projects</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fdfaf0] pt-[100px] lg:pt-[150px] pb-20 font-['Poppins']">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                
                {/* Back Button */}
                <div className="mb-4">
                    <button 
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-[#555555] hover:text-[#b5242c] transition-colors font-medium text-[13px]"
                    >
                        <ChevronLeft size={16} /> Back to Projects
                    </button>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">
                    
                    {/* Main Content Area */}
                    <div className="space-y-4">
                        
                        {/* Header Section */}
                        <div className="bg-white rounded-md p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <div className="flex flex-wrap items-center gap-5 text-[12px] text-[#777777] font-normal leading-[24px] mb-3">
                                <span className="flex items-center gap-1.5 text-[#b5242c]"><Folder size={14} /> {project.category || "General"}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {project.location || "Remote"}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(project.postedAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1.5"><Eye size={14} /> 13,704 Views</span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                                <h1 className="text-[24px] lg:text-[30px] font-bold text-[#242424] leading-[32px] lg:leading-[42px] flex-1 break-words">
                                    {project.title}
                                </h1>
                                <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                                    <button className="p-2.5 border border-gray-100 rounded-md text-gray-400 hover:text-[#b5242c] hover:border-[#b5242c]/20 transition-all bg-[#f9fafb]">
                                        <Bookmark size={18} />
                                    </button>
                                    <button 
                                        onClick={scrollToForm}
                                        className="flex-1 md:flex-none bg-[#b5242c] hover:bg-[#a11f27] text-white px-6 py-2.5 rounded-md font-bold transition-all shadow-lg shadow-[#b5242c]/20 flex items-center justify-center gap-2 text-sm"
                                    >
                                        Send Proposal
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-[#fff0f0] text-[#b5242c] rounded-md"><Contact size={20} /></div>
                                    <div>
                                        <p className="text-[12px] text-[#777777] font-normal leading-[18px]">Freelancer Type</p>
                                        <p className="text-[14px] text-[#242424] font-medium leading-[20px]">{project.experienceLevel || "Individual"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-[#fff0f0] text-[#b5242c] rounded-md"><Calendar size={20} /></div>
                                    <div>
                                        <p className="text-[12px] text-[#777777] font-normal leading-[18px]">Duration</p>
                                        <p className="text-[14px] text-[#242424] font-medium leading-[20px]">{project.duration || "1-5 Days"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-[#fff0f0] text-[#b5242c] rounded-md"><BarChart size={20} /></div>
                                    <div>
                                        <p className="text-[12px] text-[#777777] font-normal leading-[18px]">Level</p>
                                        <p className="text-[14px] text-[#242424] font-medium leading-[20px]">Moderate</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-[#fff0f0] text-[#b5242c] rounded-md"><Headphones size={20} /></div>
                                    <div>
                                        <p className="text-[12px] text-[#777777] font-normal leading-[18px]">English</p>
                                        <p className="text-[14px] text-[#242424] font-medium leading-[20px]">Native</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 bg-[#fff0f0] text-[#b5242c] rounded-md"><Languages size={20} /></div>
                                    <div>
                                        <p className="text-[12px] text-[#777777] font-normal leading-[18px]">Languages</p>
                                        <p className="text-[14px] text-[#242424] font-medium leading-[20px]">English, Hindi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Banner Image Placeholder */}
                        <div className="w-full h-[80px] bg-gradient-to-r from-blue-600 to-indigo-700 rounded-md relative overflow-hidden flex items-center px-10">
                            <div className="relative z-10 text-white flex items-center gap-6">
                                <div>
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">No Paid Plugins Required</p>
                                    <h3 className="text-lg font-black">Freelance Marketplace</h3>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-md p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                            <h3 className="text-[16px] font-bold text-[#242424] mb-4 border-b border-gray-50 pb-3">Description</h3>
                            <div className="text-[14px] font-normal text-[#4b525e] leading-[24px] tracking-tight space-y-3">
                                <p>{project.description}</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Work on the existing codebase to improve performance.</li>
                                    <li>Implement new features as per the requirement document.</li>
                                    <li>Ensure the design is responsive and professional.</li>
                                </ul>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-[13px] font-bold text-[#242424] mb-3 uppercase tracking-wider">Skills Required</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills?.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1.5 bg-[#fdf0d5] text-[#4b525e] text-[13px] font-normal rounded-full">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                                <span>Address: {project.location || "Remote"}</span>
                                <span>Project ID: {project.id.toString().padStart(4, '0')}</span>
                            </div>
                        </div>

                        {/* Send Proposal Form */}
                        <div ref={formRef} className="bg-white rounded-md p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] scroll-mt-24">
                            <h3 className="text-[18px] font-bold text-[#242424] mb-6 flex items-center gap-2">
                                <Send size={18} className="text-[#b5242c]" /> Send Your Proposal
                            </h3>
                            
                            {!localStorage.getItem('user') ? (
                                <div className="py-10 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-lg">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <Lock size={24} className="text-[#b5242c]" />
                                    </div>
                                    <h4 className="text-[18px] font-bold text-[#242424] mb-2">Login Required</h4>
                                    <p className="text-gray-500 text-[14px] mb-6 max-w-[300px] mx-auto">You must be logged in as a freelancer to submit a proposal for this project.</p>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="bg-[#b5242c] hover:bg-[#a11f27] text-white px-10 py-3 rounded-md font-bold transition-all shadow-lg shadow-[#b5242c]/20 inline-flex items-center gap-2"
                                    >
                                        Sign In Now <ChevronLeft size={18} className="rotate-180" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {successMsg && (
                                        <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-100 rounded-md flex items-center gap-2 font-medium">
                                            <CheckCircle size={18} /> {successMsg}
                                        </div>
                                    )}

                                    {errorMsg && (
                                        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-md flex items-center gap-2 font-medium">
                                            <AlertCircle size={18} /> {errorMsg}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmitProposal}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-[#242424] uppercase tracking-wider">Your Bid Amount ({project.currency === 'USD' ? '$' : '₹'})</label>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{project.currency === 'USD' ? '$' : '₹'}</span>
                                                    <input 
                                                        type="number" 
                                                        required
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b5242c]/20 transition-all font-medium text-[#242424]"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-[#242424] uppercase tracking-wider">Estimated Delivery</label>
                                                <div className="relative group">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input 
                                                        type="text" 
                                                        required
                                                        value={deliveryTime}
                                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                                        placeholder="e.g. 7 days"
                                                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b5242c]/20 transition-all font-medium text-[#242424]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-8">
                                            <label className="text-[13px] font-bold text-[#242424] uppercase tracking-wider">Proposal Message</label>
                                            <textarea 
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={6}
                                                placeholder="Describe your approach and experience for this project..."
                                                className="w-full bg-[#f9fafb] border border-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#b5242c]/20 transition-all font-medium text-[#242424] resize-none"
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-[#b5242c] hover:bg-[#a11f27] text-white px-10 py-3.5 rounded-md font-bold transition-all shadow-lg shadow-[#b5242c]/20 flex items-center justify-center gap-2 w-full md:w-fit disabled:opacity-50"
                                        >
                                            {submitting ? "Submitting..." : <>Submit Proposal <Send size={18} /></>}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Proposal List Section */}
                        <div className="space-y-4">
                            <h3 className="text-[18px] font-bold text-[#242424] ml-2">Project Proposals ({proposals.length})</h3>
                            
                            {proposals.length === 0 ? (
                                <div className="bg-white rounded-md p-10 border border-gray-100 text-center text-gray-500 italic">
                                    No proposals yet. Be the first to bid!
                                </div>
                            ) : (
                                proposals.map((prop) => (
                                    <div key={prop.id} className="bg-white rounded-md p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:border-[#b5242c]/20 transition-all">
                                        <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            <img src={prop.freelancer?.profilePicture || `https://i.pravatar.cc/150?u=${prop.freelancer?.id}`} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-bold text-[#242424] hover:text-[#b5242c] cursor-pointer text-[15px]">{prop.freelancer?.fullName || prop.freelancer?.username}</h4>
                                                    <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(prop.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1 text-[#b5242c]"><Star size={12} className="fill-[#b5242c]" /> Top Rated</span>
                                                    </div>
                                                </div>
                                                <div className="text-left md:text-right shrink-0">
                                                    <p className="text-[20px] lg:text-[30px] font-bold text-[#242424] leading-tight mb-1">
                                                        {project.currency === 'USD' ? '$' : '₹'}{prop.bidAmount}
                                                    </p>
                                                    <p className="text-[12px] text-[#777777] font-normal uppercase tracking-wider">in {prop.deliveryTime}</p>
                                                </div>
                                            </div>
                                            <p className="text-[16px] text-[#777777] leading-[30px] font-normal tracking-tight">
                                                {prop.coverLetter}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>


                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        
                        {/* Budget Card */}
                        <div className="bg-white rounded-md p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-[12px] text-[#777777] font-normal leading-[24px] mb-1 uppercase tracking-widest">Budget</p>
                                    <h2 className="text-[24px] lg:text-[30px] font-bold text-[#242424] leading-tight">
                                        {project.currency === 'USD' ? '$' : '₹'}
                                        {project.budgetAmount?.toLocaleString()}
                                    </h2>
                                    <p className="text-[11px] text-[#b5242c] font-bold uppercase mt-4 tracking-tight flex items-center gap-1">
                                        {project.paymentType || "Fixed"} <Clock size={10} />
                                    </p>
                                </div>
                                <div className="bg-orange-50 text-orange-500 text-[10px] font-black uppercase px-2 py-1 rounded tracking-tighter">
                                    Active
                                </div>
                            </div>
                            <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center ml-auto opacity-20">
                                <Info size={32} />
                            </div>
                        </div>

                        {/* Employer Card */}
                        <div className="bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm">
                            <div className="h-24 bg-gray-100 relative">
                                <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400" alt="Office" className="w-full h-full object-cover opacity-50" />
                                <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-md p-1 shadow-md border border-gray-100 overflow-hidden">
                                    <div className="w-full h-full bg-[#1e2329] flex items-center justify-center text-white font-black text-xl italic">
                                        SF
                                    </div>
                                </div>
                            </div>
                            <div className="pt-10 pb-6 px-6 text-center">
                                <h4 className="font-bold text-[#242424] flex items-center justify-center gap-1.5 text-[15px]">
                                    Shinefiling Ltd <CheckCircle size={14} className="text-green-500" />
                                </h4>
                                <p className="text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-wider">Member since Jan 15, 2021</p>
                                <button className="w-full mt-6 bg-[#78b13f] hover:bg-[#689b35] text-white py-2.5 rounded-md font-bold text-sm transition-all shadow-sm">
                                    View Profile
                                </button>
                            </div>
                        </div>

                        {/* About Employer Card */}
                        <div className="bg-white rounded-md p-6 border border-gray-100 shadow-sm">
                            <h4 className="text-[14px] font-bold text-[#242424] mb-6">About The Employer</h4>
                            <div className="space-y-4 relative pl-4 before:absolute before:left-[1.5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-red-500">
                                <div className="relative">
                                    <div className="absolute left-[-17px] top-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                                    <p className="text-[14px] text-[#4b525e] font-normal leading-[24px] tracking-tight">{project.location || "United States"}</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-[-17px] top-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[14px] text-[#4b525e] font-normal leading-[24px] tracking-tight">12 Projects completed</p>
                                        <CheckCircle size={12} className="text-green-500" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-[-17px] top-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[14px] text-[#4b525e] font-normal leading-[24px] tracking-tight">Payment Method</p>
                                        <CheckCircle size={12} className="text-green-500" />
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-[-17px] top-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-[14px] text-[#4b525e] font-normal leading-[24px] tracking-tight">Email Verified</p>
                                        <CheckCircle size={12} className="text-green-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Banner Image */}
                        <div className="bg-[#fcfcfc] rounded-md overflow-hidden border border-gray-100 shadow-sm group cursor-pointer relative">
                            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400" alt="Banner" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
                                <h3 className="text-2xl font-black mb-2 italic">exertio</h3>
                                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">Freelance Marketplace & Directory WordPress Theme</p>
                            </div>
                        </div>

                        {/* Report Link */}
                        <button className="flex items-center justify-center gap-2 w-full text-[12px] text-gray-400 font-bold uppercase hover:text-red-500 transition-colors py-2">
                            <AlertCircle size={14} /> Report Project
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
