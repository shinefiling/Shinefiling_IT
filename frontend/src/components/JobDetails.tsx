import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import {
    Calendar, MapPin, Briefcase, Clock,
    ChevronRight, Share2, Heart, Flag,
    IndianRupee, User, ShieldCheck, Star,
    CheckCircle2, ArrowLeft, Send, Plus,
    Facebook, Linkedin, Twitter, Mail,
    Instagram, MessageCircle,
    ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const JobDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [similarJobs, setSimilarJobs] = useState<any[]>([]);
    const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);

    const handleApplyJob = () => {
        navigate(`/apply-job/${id}`);
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setJob(data);

                    const similarResponse = await fetch(`${API_BASE_URL}/api/jobs?limit=5`, {
                        headers: { 'X-Requested-With': 'XMLHttpRequest' }
                    });
                    if (similarResponse.ok) {
                        const similarData = await similarResponse.json();
                        setSimilarJobs(similarData.filter((j: any) => j.id.toString() !== id?.toString()).slice(0, 4));
                    }
                }
            } catch (err) {
                console.error("Error fetching job:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id]);

    const renderDescription = () => {
        const desc = job.description || '';
        const skillsIndex = desc.indexOf('Skills:');
        const respIndex = desc.indexOf('Responsibilities:');

        let overview = desc;
        let skills = '';
        let responsibilities = '';

        if (skillsIndex !== -1) {
            overview = desc.substring(0, skillsIndex).trim();
            if (respIndex !== -1 && respIndex > skillsIndex) {
                skills = desc.substring(skillsIndex + 7, respIndex).trim();
                responsibilities = desc.substring(respIndex + 17).trim();
            } else {
                skills = desc.substring(skillsIndex + 7).trim();
            }
        } else if (respIndex !== -1) {
            overview = desc.substring(0, respIndex).trim();
            responsibilities = desc.substring(respIndex + 17).trim();
        }

        const bodyStyle = {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: '26px',
            color: 'rgb(33, 33, 33)',
        };

        return (
            <div className="max-w-none antialiased" style={bodyStyle}>
                <p className="mb-10 whitespace-pre-line">{overview || 'This is a fantastic opportunity for a highly motivated individual to join an outstanding team...'}</p>

                <div className="space-y-12">
                    {skills && (
                        <div className="mb-10">
                            <h4 
                                className="text-[18px] font-bold mb-6 uppercase tracking-widest border-b border-gray-50 pb-4"
                                style={{ color: 'rgb(33, 33, 33)' }}
                            >
                                Skills Required
                            </h4>
                            <ul className="space-y-4 pt-4">
                                {skills.split('\n').filter(s => s.trim()).map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-2.5 w-1.5 h-1.5 bg-[#317CD7] shrink-0 rounded-full"></div>
                                        <span>{item.trim().replace(/^[•\-\*]\s*/, '')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {responsibilities && (
                        <div>
                            <h4 
                                className="text-[18px] font-bold mb-6 uppercase tracking-widest border-b border-gray-50 pb-4"
                                style={{ color: 'rgb(33, 33, 33)' }}
                            >
                                Responsibilities
                            </h4>
                            <ul className="space-y-4 pt-4">
                                {responsibilities.split('\n').filter(r => r.trim()).map((item, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="mt-2.5 w-1.5 h-1.5 bg-[#317CD7] shrink-0 rounded-full"></div>
                                        <span>{item.trim().replace(/^[•\-\*]\s*/, '')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f8f9fa] pt-[120px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
        </div>
    );

    if (!job) return (
        <div className="min-h-screen bg-[#f8f9fa] pt-[120px] text-center">
            <h2 className="text-2xl font-bold text-[#0F2E4B]">Job not found</h2>
            <button onClick={() => navigate('/jobs')} className="mt-4 text-[#317CD7] font-bold underline">Back to Jobs</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20" style={{ fontFamily: '"Poppins", sans-serif' }}>
            
            {/* Full-Width Hero Banner */}
            {/* Full-Width Hero Banner */}
            <div className="relative overflow-hidden min-h-[320px] bg-[#0F2E4B] pt-[100px] lg:pt-[120px]">
                {/* Clean Background Layer */}
                <div className="absolute inset-0 z-0 bg-[#0F2E4B]"></div>

                {/* Banner Content (Centered Alignment Container) */}
                <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:pl-16 lg:pr-16 h-full p-8 lg:p-10 flex flex-col md:flex-row justify-between items-start gap-8">
                    
                    {/* Left Content: Title & Stats List */}
                    <div className="flex-1 max-w-[800px]">
                        <div className="space-y-1">
                            <p className="text-white font-semibold" style={{ fontSize: '18px' }}>Job Title</p>
                            <h1 
                                className="text-[#fff] capitalize"
                                style={{ 
                                    fontSize: '43px', 
                                    fontWeight: '300', 
                                    borderBottom: '1px solid #fff', 
                                    paddingTop: '10px', 
                                    paddingBottom: '24px', 
                                    marginBottom: '32px' 
                                }}
                            >
                                {job.title}
                            </h1>
                        </div>

                        {/* Vertical Stats List (Horizontal Layout with Contrast) */}
                        <div className="space-y-3">
                            <div className="flex items-baseline gap-3">
                                <p className="text-white font-semibold shrink-0" style={{ fontSize: '18px' }}>Position:</p>
                                <p className="text-white capitalize" style={{ fontSize: '20px', lineHeight: '24px', fontWeight: '300', fontFamily: '"Poppins", sans-serif' }}>
                                    {job.type || 'Full Time'}
                                </p>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-white font-semibold shrink-0" style={{ fontSize: '18px' }}>Salary:</p>
                                <p className="text-white" style={{ fontSize: '20px', lineHeight: '24px', fontWeight: '300', fontFamily: '"Poppins", sans-serif' }}>
                                    ₹{job.price?.toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-white font-semibold shrink-0" style={{ fontSize: '18px' }}>Location:</p>
                                <p className="text-white capitalize" style={{ fontSize: '20px', lineHeight: '24px', fontWeight: '300', fontFamily: '"Poppins", sans-serif' }}>
                                    {job.location || 'Remote'}
                                </p>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-white font-semibold shrink-0" style={{ fontSize: '18px' }}>Job ID:</p>
                                <p className="text-white" style={{ fontSize: '20px', lineHeight: '24px', fontWeight: '300', fontFamily: '"Poppins", sans-serif' }}>
                                    JB-00{job.id}
                                </p>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <p className="text-white font-semibold shrink-0" style={{ fontSize: '18px' }}>Applications:</p>
                                <p className="text-white" style={{ fontSize: '20px', lineHeight: '24px', fontWeight: '300', fontFamily: '"Poppins", sans-serif' }}>
                                    0
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Share & Action Buttons */}
                    <div className="w-full md:w-auto flex flex-col items-end gap-6 pt-4">
                        {/* Share Section */}
                        <div className="text-right">
                            <p className="text-[11px] text-white font-bold uppercase tracking-widest mb-3">Share This Job</p>
                            <div className="flex items-center gap-2.5">
                                {[Facebook, Linkedin, Twitter, Mail].map((Icon, i) => (
                                    <button key={i} className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white border border-white/5">
                                        <Icon size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stacked Action Buttons */}
                        <div className="w-full md:w-[240px] space-y-3">
                            <button className="w-full bg-[#317CD7]/20 text-white py-3 rounded font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5">
                                <Plus size={14} /> Add to job basket
                            </button>
                            <button 
                                onClick={handleApplyJob}
                                className="w-full bg-[#317CD7] text-white py-3.5 rounded font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-black/20"
                            >
                                <Send size={14} /> Apply for this job
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:pl-16 lg:pr-16 mt-12">
                
                {/* Back Button */}
                <div className="mb-6">
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="flex items-center gap-2 text-[#0F2E4B] hover:text-[#317CD7] transition-all font-bold text-[12px] uppercase tracking-wider"
                    >
                        <ArrowLeft size={16} /> Back to Jobs
                    </button>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-6">

                        {/* Description Section */}
                        <div className="bg-white rounded-xl p-8 border border-gray-100">
                            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                                <h3 
                                    className="text-[16px] font-bold uppercase tracking-widest"
                                    style={{ color: 'rgb(33, 33, 33)' }}
                                >
                                    Project Description
                                </h3>
                                <span className="text-[11px] text-gray-400 font-medium">Remote Opportunity</span>
                            </div>
                            <div className="p-4">
                                {renderDescription()}
                            </div>
                        </div>
                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        
                        {/* Similar Jobs */}
                        <div className="bg-white rounded-xl p-6 border border-gray-100">
                            <h3 className="text-[14px] font-bold text-[#0F2E4B] mb-6 uppercase tracking-widest">Similar Jobs</h3>
                            <div className="space-y-4">
                                {similarJobs.map((sj) => (
                                    <div 
                                        key={sj.id} 
                                        onClick={() => navigate(`/jobs/${sj.id}`)}
                                        className="p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border border-transparent hover:border-gray-100 group"
                                    >
                                        <h4 className="font-bold text-[#0F2E4B] group-hover:text-[#317CD7] transition-colors text-[14px] line-clamp-1 capitalize">{sj.title}</h4>
                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><MapPin size={10} /> {sj.location}</span>
                                            <span className="text-[#317CD7]">₹{sj.price?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="bg-[#0F2E4B] rounded-xl p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <h4 className="text-[18px] font-bold mb-2">Need Help?</h4>
                            <p className="text-[12px] opacity-70 mb-6 leading-relaxed">Our support team is available 24/7 to assist with your application.</p>
                            <button className="bg-white text-[#0F2E4B] px-6 py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-[#f8f9fa] transition-all">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
};

export default JobDetails;
