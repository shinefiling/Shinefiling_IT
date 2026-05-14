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

    const handleMessageClick = (freelancer: any) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        
        // Open floating chat
        const event = new CustomEvent('open-chat', { 
            detail: { 
                contact: {
                    id: freelancer.id,
                    fullName: freelancer.fullName,
                    email: freelancer.email,
                    profilePicture: freelancer.profilePicture
                } 
            } 
        });
        window.dispatchEvent(event);
    };

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
        <div className="min-h-screen bg-[#f8f9fa] pt-[100px] lg:pt-[120px] pb-20" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <div className="max-w-[1440px] mx-auto px-6 lg:pl-4 lg:pr-16">
                
                {/* Back Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/projects')}
                        className="flex items-center gap-2 text-[#0F2E4B] hover:text-[#317CD7] transition-all font-bold text-[12px] uppercase tracking-wider"
                    >
                        <ChevronLeft size={16} /> Back to Projects
                    </button>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6">
                    
                    {/* Main Content Area */}
                    <div className="space-y-4">
                        
                        {/* Header Section */}
                        <div className="bg-white rounded-xl px-7 py-6 border border-gray-100 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-[#317CD7]/10 text-[#317CD7] text-[10px] font-extrabold rounded uppercase tracking-wider">
                                    Shinefiling Project
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: PR-00{project.id}</span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <h1 
                                    className="text-[24px] lg:text-[28px] font-bold text-[#0F2E4B] leading-tight flex-1 capitalize"
                                    style={{ letterSpacing: '-0.01em' }}
                                >
                                    {project.title}
                                </h1>
                                <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                    <button className="p-2.5 border border-gray-100 rounded-lg text-gray-400 hover:text-[#317CD7] hover:border-[#317CD7]/20 transition-all bg-white shadow-sm">
                                        <Bookmark size={18} />
                                    </button>
                                    <button 
                                        onClick={scrollToForm}
                                        className="flex-1 md:flex-none bg-[#317CD7] hover:bg-[#2563b5] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md shadow-[#317CD7]/20 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest"
                                    >
                                        Apply for this project
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-7 pt-6 border-t border-gray-50">
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Experience</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#317CD7]/5 flex items-center justify-center text-[#317CD7]">
                                            <BarChart size={14} />
                                        </div>
                                        <p className="text-[13px] text-[#0F2E4B] font-bold capitalize">{project.experienceLevel || "Expert"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Category</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#317CD7]/5 flex items-center justify-center text-[#317CD7]">
                                            <Folder size={14} />
                                        </div>
                                        <p className="text-[13px] text-[#0F2E4B] font-bold capitalize">{project.category || "Development"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Duration</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#317CD7]/5 flex items-center justify-center text-[#317CD7]">
                                            <Calendar size={14} />
                                        </div>
                                        <p className="text-[13px] text-[#0F2E4B] font-bold capitalize">{project.duration || "1-3 Months"}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Location</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-[#317CD7]/5 flex items-center justify-center text-[#317CD7]">
                                            <MapPin size={14} />
                                        </div>
                                        <p className="text-[13px] text-[#0F2E4B] font-bold capitalize">{project.location || "Remote"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                                <h3 
                                    className="text-[16px] font-bold uppercase tracking-widest"
                                    style={{ color: 'rgb(33, 33, 33)' }}
                                >
                                    Project Description
                                </h3>
                                <span className="text-[11px] text-gray-400 font-medium">Posted {new Date(project.postedAt).toLocaleDateString()}</span>
                            </div>
                            <div 
                                className="antialiased" 
                                style={{ 
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '15px',
                                    fontWeight: 500,
                                    lineHeight: '26px',
                                    color: 'rgb(33, 33, 33)'
                                }}
                            >
                                <p className="mb-6">{project.description}</p>
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-[14px] font-bold text-[#0F2E4B] mb-3 uppercase tracking-widest">Deliverables & Requirements:</h4>
                                    <ul className="list-disc pl-5 space-y-2 opacity-80">
                                        <li>Execute tasks according to the specified technical guidelines.</li>
                                        <li>Maintain consistent communication through the Shinefiling platform.</li>
                                        <li>Submit work milestones within the agreed-upon timeframe.</li>
                                        <li>Ensure high-quality output that meets the client's standards.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-10">
                                <h4 
                                    className="text-[12px] font-bold mb-4 uppercase tracking-widest"
                                    style={{ color: 'rgb(33, 33, 33)' }}
                                >
                                    Skills Required
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills?.map((skill: string) => (
                                        <span key={skill} className="px-4 py-2 bg-gray-50 text-[#0F2E4B] text-[13px] font-bold rounded-lg border border-gray-100 transition-all hover:border-[#317CD7]/30">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                                <span>Location: {project.location || "Remote"}</span>
                                <span>Ref: SF-{project.id.toString().padStart(4, '0')}</span>
                            </div>
                        </div>

                        {/* Send Proposal Form */}
                        <div ref={formRef} className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm scroll-mt-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-[#317CD7]/10 rounded-xl flex items-center justify-center text-[#317CD7]">
                                    <Send size={24} />
                                </div>
                                <div>
                                    <h3 
                                        style={{ 
                                            fontFamily: 'Poppins, sans-serif',
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            lineHeight: '26px',
                                            color: 'rgb(33, 33, 33)'
                                        }}
                                    >
                                        Submit Your Proposal
                                    </h3>
                                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-widest">Connect with this client today</p>
                                </div>
                            </div>
                            
                            {!localStorage.getItem('user') ? (
                                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100 text-[#317CD7]">
                                        <Lock size={28} />
                                    </div>
                                    <h4 className="text-[18px] font-bold text-[#0F2E4B] mb-2">Freelancer Login Required</h4>
                                    <p className="text-gray-500 text-[14px] mb-8 max-w-[340px] mx-auto">To submit a proposal and start working on this project, you need to sign in with your freelancer account.</p>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="bg-[#0F2E4B] hover:bg-black text-white px-10 py-3.5 rounded-lg font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mx-auto text-[12px] uppercase tracking-widest"
                                    >
                                        Access Your Account <ChevronLeft size={16} className="rotate-180" />
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
                                                <label 
                                                    className="text-[12px] font-bold uppercase tracking-wider"
                                                    style={{ fontFamily: 'Poppins, sans-serif', color: 'rgb(33, 33, 33)' }}
                                                >
                                                    Your Bid Amount (₹)
                                                </label>
                                                <div className="relative group">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                    <input 
                                                        type="number" 
                                                        required
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#317CD7]/20 transition-all font-medium"
                                                        style={{ fontFamily: 'Poppins, sans-serif', color: 'rgb(33, 33, 33)' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label 
                                                    className="text-[12px] font-bold uppercase tracking-wider"
                                                    style={{ fontFamily: 'Poppins, sans-serif', color: 'rgb(33, 33, 33)' }}
                                                >
                                                    Estimated Delivery
                                                </label>
                                                <div className="relative group">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input 
                                                        type="text" 
                                                        required
                                                        value={deliveryTime}
                                                        onChange={(e) => setDeliveryTime(e.target.value)}
                                                        placeholder="e.g. 7 days"
                                                        className="w-full bg-[#f9fafb] border border-gray-100 rounded-md pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#317CD7]/20 transition-all font-medium"
                                                        style={{ fontFamily: 'Poppins, sans-serif', color: 'rgb(33, 33, 33)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-8">
                                            <label 
                                                className="text-[12px] font-bold uppercase tracking-wider"
                                                style={{ fontFamily: 'Poppins, sans-serif', color: 'rgb(33, 33, 33)' }}
                                            >
                                                Proposal Message
                                            </label>
                                            <textarea 
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={6}
                                                placeholder="Describe your approach and experience for this project..."
                                                className="w-full bg-[#f9fafb] border border-gray-100 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#317CD7]/20 transition-all font-medium resize-none"
                                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', color: 'rgb(33, 33, 33)' }}
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-[#317CD7] hover:bg-[#2563b5] text-white px-12 py-4 rounded-lg font-bold transition-all shadow-md shadow-[#317CD7]/20 flex items-center justify-center gap-2 w-full md:w-fit disabled:opacity-50 text-[12px] uppercase tracking-widest"
                                        >
                                            {submitting ? "Processing..." : <>Submit Proposal <Send size={18} /></>}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Proposal List Section */}
                        <div className="space-y-4">
                            <h3 
                                className="ml-2 uppercase tracking-wider"
                                style={{ 
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    lineHeight: '26px',
                                    color: 'rgb(33, 33, 33)'
                                }}
                            >
                                Recent Proposals - {proposals.length}
                            </h3>
                            
                            {proposals.length === 0 ? (
                                <div className="bg-white rounded-md p-10 border border-gray-100 text-center text-gray-500 italic">
                                    No proposals yet. Be the first to bid!
                                </div>
                            ) : (
                                proposals.map((prop) => (
                                    <div key={prop.id} className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 hover:border-[#317CD7]/30 transition-all group">
                                        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 p-1">
                                            {prop.freelancer?.profilePicture ? (
                                                <img src={prop.freelancer.profilePicture} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-full h-full bg-[#317CD7]/10 flex items-center justify-center text-[#317CD7] font-bold text-xl rounded-lg">
                                                    {(prop.freelancer?.fullName || prop.freelancer?.username || '??').substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 
                                                        className="capitalize transition-colors group-hover:text-[#317CD7]"
                                                        style={{ 
                                                            fontFamily: 'Poppins, sans-serif',
                                                            fontSize: '16px',
                                                            fontWeight: 700,
                                                            color: 'rgb(33, 33, 33)'
                                                        }}
                                                    >
                                                        {prop.freelancer?.fullName || prop.freelancer?.username}
                                                    </h4>
                                                    <div className="flex items-center gap-4 mt-1.5 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#317CD7]" /> {new Date(prop.createdAt).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1.5 text-[#317CD7]"><CheckCircle size={12} /> Verified Expert</span>
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p 
                                                        className="text-[22px] font-bold leading-tight"
                                                        style={{ 
                                                            fontFamily: 'Poppins, sans-serif',
                                                            color: 'rgb(33, 33, 33)'
                                                        }}
                                                    >
                                                        ₹{prop.bidAmount}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">in {prop.deliveryTime}</p>
                                                    <button 
                                                        onClick={() => handleMessageClick(prop.freelancer)}
                                                        className="mt-4 px-4 py-1.5 bg-[#0F2E4B] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-[#317CD7] transition-all flex items-center gap-2 justify-center w-full"
                                                    >
                                                        <Contact size={12} /> Message
                                                    </button>
                                                </div>
                                            </div>
                                            <p 
                                                className="antialiased"
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '26px',
                                                    color: 'rgb(33, 33, 33)'
                                                }}
                                            >
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
                        <div className="bg-[#0F2E4B] rounded-xl p-8 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <p className="text-[11px] font-extrabold uppercase tracking-widest opacity-60 mb-2">Project Budget</p>
                            <h2 className="text-[32px] font-bold leading-tight mb-4">
                                ₹{project.budgetAmount?.toLocaleString()}
                            </h2>
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                                <span className="px-3 py-1 bg-white/10 rounded text-[10px] font-extrabold uppercase tracking-widest">{project.paymentType || "Fixed Price"}</span>
                                <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#317CD7]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#317CD7] animate-pulse"></div> Active
                                </span>
                            </div>
                        </div>

                        {/* Employer Card */}
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <div className="h-28 bg-[#f8f9fa] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#317CD7]/5 to-transparent"></div>
                                <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl p-1.5 shadow-md border border-gray-100">
                                    <div className="w-full h-full bg-[#0F2E4B] rounded-xl flex items-center justify-center text-white font-extrabold text-2xl">
                                        SF
                                    </div>
                                </div>
                            </div>
                            <div className="pt-12 pb-8 px-8 text-center">
                                <h4 className="font-bold text-[#0F2E4B] flex items-center justify-center gap-2 text-[16px]">
                                    Shinefiling Ltd <CheckCircle size={16} className="text-[#317CD7]" />
                                </h4>
                                <p className="text-[11px] text-gray-400 font-extrabold mt-1.5 uppercase tracking-widest">Premium Client</p>
                                
                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-gray-400 font-medium">Location</span>
                                        <span className="text-[#0F2E4B] font-bold">United States</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-gray-400 font-medium">Projects</span>
                                        <span className="text-[#0F2E4B] font-bold">12 Completed</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-gray-400 font-medium">Member since</span>
                                        <span className="text-[#0F2E4B] font-bold">Jan 2021</span>
                                    </div>
                                </div>

                                <button className="w-full mt-8 bg-[#317CD7] hover:bg-[#2563b5] text-white py-3.5 rounded-lg font-bold text-[12px] uppercase tracking-widest transition-all shadow-md active:scale-95">
                                    View Client Profile
                                </button>
                            </div>
                        </div>

                        {/* Sidebar Banner Image */}
                        <div className="bg-[#fcfcfc] rounded-md overflow-hidden border border-gray-100 shadow-sm group cursor-pointer relative">
                            <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400" alt="Banner" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
                                <h3 className="text-2xl font-extrabold mb-2 italic">exertio</h3>
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
