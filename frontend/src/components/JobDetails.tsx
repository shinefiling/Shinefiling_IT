import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { 
    Calendar, MapPin, Briefcase, Clock, 
    ChevronRight, Share2, Heart, Flag,
    IndianRupee, User, ShieldCheck, Star,
    CheckCircle2, ArrowLeft, Send
} from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Job Data:", data);
                    setJob(data);
                }
            } catch (err) {
                console.error("Error fetching job:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fffcf9]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffcf9]">
            <h2 className="text-2xl font-bold text-[#111] mb-4">Job Not Found</h2>
            <button onClick={() => navigate('/jobs')} className="text-primary font-bold hover:underline">Back to Jobs List</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fffcf9] pt-[150px] pb-20 font-['Poppins']">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
                
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">
                    <Link to="/jobs" className="hover:text-primary transition-colors capitalize">{job.category || 'Job'}</Link>
                    <ChevronRight size={12} />
                    <span className="text-primary">Job Details</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    
                    {/* Left Content */}
                    <main>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-100 p-10 shadow-[0_2px_15px_rgb(0,0,0,0.02)]"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                                <div className="flex-1">
                                    <h1 className="text-[32px] font-bold text-[#111] leading-tight mb-6 capitalize">
                                        {job.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-6 text-[12px] text-gray-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-primary" />
                                            <span className="capitalize">{job.location || 'Not Specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-primary" />
                                            <span className="capitalize">{job.experience || 'Not Specified'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-primary" />
                                            <span>Expires on {job.expiry || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {job.userEmail && (
                                        <button 
                                            onClick={() => navigate(`/client-profile?email=${job.userEmail}`)}
                                            className="px-5 py-2.5 border border-primary text-primary font-bold text-[12px] hover:bg-primary hover:text-white transition-all"
                                        >
                                            View Profile
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => navigate(`/apply-job/${id}`)}
                                        className="px-6 py-2.5 bg-primary text-white font-bold text-[12px] hover:bg-primary/90 transition-all shadow-md shadow-primary/20 uppercase tracking-widest"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-[17px] font-bold text-[#111] mb-5 uppercase tracking-wide">Job Description</h3>
                                    <p className="text-[14px] text-gray-500 leading-relaxed">
                                        {job.description || 'No description provided.'}
                                    </p>
                                </div>

                                {job.requirements && (
                                    <div>
                                        <h3 className="text-[17px] font-bold text-[#111] mb-5 uppercase tracking-wide">Requirements</h3>
                                        <ul className="space-y-4">
                                            {typeof job.requirements === 'string' 
                                                ? job.requirements.split('\n').map((req: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-500">
                                                        <div className="mt-1.5 w-1.5 h-1.5 bg-primary shrink-0"></div>
                                                        {req}
                                                    </li>
                                                ))
                                                : job.requirements.map((req: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-[14px] text-gray-500">
                                                        <div className="mt-1.5 w-1.5 h-1.5 bg-primary shrink-0"></div>
                                                        {req}
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-primary transition-colors">
                                        <Share2 size={14} /> Share Job
                                    </button>
                                    <button className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors">
                                        <Heart size={14} /> Save Job
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 text-[11px] font-bold text-gray-300 hover:text-gray-400 transition-colors">
                                    <Flag size={12} /> Report
                                </button>
                            </div>
                        </motion.div>
                    </main>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Project Summary Card */}
                        <div className="bg-white border border-gray-100 p-8 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                            <h3 className="text-[15px] font-bold text-[#111] mb-8 uppercase tracking-wider">Project Summary</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-gray-50 flex items-center justify-center text-primary">
                                        <IndianRupee size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Fixed Price</p>
                                        <p className="text-[14px] font-bold text-[#111]">₹{job.price?.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-gray-50 flex items-center justify-center text-primary">
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Posted</p>
                                        <p className="text-[14px] font-bold text-[#111]">{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-gray-50 flex items-center justify-center text-primary">
                                        <Send size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Proposals</p>
                                        <p className="text-[14px] font-bold text-[#111]">{job.proposals || 0} Submitted</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 bg-gray-50 flex items-center justify-center text-primary">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Job Location</p>
                                        <p className="text-[14px] font-bold text-[#111] capitalize">{job.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Tags */}
                        {job.tags && (
                            <div className="bg-white border border-gray-100 p-8 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                                <h3 className="text-[15px] font-bold text-[#111] mb-6 uppercase tracking-wider">Project Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(job.tags) ? job.tags : job.tags.split(',')).map((tag: string) => (
                                        <span key={tag} className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 hover:text-primary border border-gray-50 hover:border-primary transition-all capitalize">
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Client Verification Card */}
                        <div className="bg-[#111] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <ShieldCheck size={28} className="text-primary mb-6" />
                                <h3 className="text-[17px] font-bold mb-3">Client Verified</h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed mb-6">
                                    This client has a verified payment method and 100% project completion rate.
                                </p>
                                <div className="flex items-center gap-1 text-primary">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                                    <span className="ml-2 text-white font-bold text-[12px]">5.0 Rating</span>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={100} />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
