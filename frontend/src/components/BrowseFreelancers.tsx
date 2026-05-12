import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Star, Heart, 
    Filter, ChevronDown, ChevronUp, 
    Check, ArrowRight, UserCheck, Activity, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

interface Freelancer {
    id: number;
    fullName: string;
    username: string;
    email: string;
    professionalHeadline?: string;
    summary?: string;
    hourlyRate?: number;
    location?: string;
    profilePicture?: string;
    skills?: string[];
    userRole?: string;
    createdAt: string;
}

const BrowseFreelancers: React.FC = () => {
    const navigate = useNavigate();
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [clientJobs, setClientJobs] = useState<any[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
    
    // UI States
    const [activeFilters, setActiveFilters] = useState<string[]>(['keyword', 'price', 'skills']);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const fetchFreelancers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                // Show if it's explicitly FREELANCER or if userRole is missing (legacy data)
                const onlyFreelancers = data.filter((f: any) => f.userRole === 'FREELANCER' || !f.userRole);
                setFreelancers(onlyFreelancers);
                setFilteredFreelancers(onlyFreelancers);
            }
        } catch (error) {
            console.error("Error fetching freelancers:", error);
        } finally {
            setLoading(false);
        }

        // Fetch client jobs for invitation
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.userRole === 'CLIENT') {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/jobs/client/${user.email}`);
                    if (res.ok) setClientJobs(await res.json());
                } catch (e) { console.error(e); }
            }
        }
    };

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (priceRange.min > 0) params.append('minRate', priceRange.min.toString());
            if (priceRange.max < 10000) params.append('maxRate', priceRange.max.toString());
            if (selectedSkills.length > 0) {
                selectedSkills.forEach(skill => params.append('skills', skill));
            }

            const response = await fetch(`${API_BASE_URL}/api/profiles/search?${params.toString()}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                const onlyFreelancers = data.filter((f: any) => f.userRole === 'FREELANCER' || !f.userRole);
                setFilteredFreelancers(onlyFreelancers);
            }
        } catch (error) {
            console.error("Error filtering freelancers:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setPriceRange({ min: 0, max: 10000 });
        setSelectedSkills([]);
        setFilteredFreelancers(freelancers);
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev => 
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev => 
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const dynamicSkills = Array.from(new Set(freelancers.flatMap(f => f.skills || [])))
        .map(skill => ({
            name: skill,
            count: freelancers.filter(f => f.skills?.includes(skill)).length
        }))
        .sort((a, b) => b.count - a.count);

    const skillsList = dynamicSkills.length > 0 ? dynamicSkills : [
        { name: 'React Developer', count: 0 },
        { name: 'Java Developer', count: 0 },
        { name: 'UI/UX Designer', count: 0 },
        { name: 'Python Expert', count: 0 }
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfc] font-['Poppins'] pt-[80px]">
            
            {/* Header Banner */}
            <div className="relative h-[240px] w-full overflow-hidden flex items-center justify-center bg-[#242424]">
                <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" 
                    className="absolute inset-0 w-full h-full object-cover opacity-30" 
                    alt="Freelancer Search Banner"
                />
                <div className="relative z-10 text-center">
                    <h1 className="text-[36px] font-black text-white tracking-tight mb-2 uppercase">Freelancer Search</h1>
                    <div className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
                        <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                        <span className="text-white/30">/</span>
                        <span className="text-white">Freelancer Search</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 lg:hidden">
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-md font-bold text-[#242424] shadow-sm active:scale-[0.98] transition-all"
                >
                    <Filter size={18} className="text-[#b5242c]" />
                    Search Filters
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
                
                {/* Filter Sidebar - Mobile Overlay */}
                {isFilterOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-[2001] lg:hidden"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                {/* Left Sidebar - Filters */}
                <aside className={`
                    fixed inset-y-0 left-0 w-[300px] bg-white z-[2002] transition-transform duration-300 lg:static lg:w-auto lg:z-0 lg:translate-x-0 overflow-y-auto lg:overflow-visible
                    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="bg-white lg:rounded-none lg:border lg:border-[#eee] overflow-hidden lg:shadow-sm min-h-full">
                        <div className="px-5 py-4 border-b border-[#eee] flex items-center justify-between">
                            <h3 className="font-bold text-[#242424] text-[15px] flex items-center gap-2">
                                <Filter size={18} className="text-primary" />
                                Search Filters
                            </h3>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={clearFilters}
                                    className="text-[11px] font-black text-primary uppercase tracking-wider hover:underline"
                                >
                                    Clear
                                </button>
                                <button onClick={() => setIsFilterOpen(false)} className="lg:hidden text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Keyword Filter */}
                        <FilterSection 
                            title="Search by Keyword" 
                            isOpen={activeFilters.includes('keyword')} 
                            onToggle={() => toggleFilter('keyword')}
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="text"
                                    placeholder="Keywords..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#f9fafb] border border-[#eee] rounded-md text-[13px] outline-none focus:border-[#b5242c] transition-all"
                                />
                            </div>
                        </FilterSection>

                        {/* Price Rate Filter */}
                        <FilterSection 
                            title="Price Rate" 
                            isOpen={activeFilters.includes('price')} 
                            onToggle={() => toggleFilter('price')}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Min</label>
                                        <input 
                                            type="number" 
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                                            className="w-full px-3 py-2 bg-[#f9fafb] border border-[#eee] rounded text-[13px] outline-none focus:border-[#b5242c]"
                                        />
                                    </div>
                                    <span className="text-gray-400 mt-5">-</span>
                                    <div className="flex-1">
                                        <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Max</label>
                                        <input 
                                            type="number" 
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 0})}
                                            className="w-full px-3 py-2 bg-[#f9fafb] border border-[#eee] rounded text-[13px] outline-none focus:border-[#b5242c]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FilterSection>

                        {/* Skills Filter */}
                        <FilterSection 
                            title="Search by Skills" 
                            isOpen={activeFilters.includes('skills')} 
                            onToggle={() => toggleFilter('skills')}
                        >
                            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {skillsList.map(skill => (
                                    <label key={skill.name} className="flex items-center gap-3 group cursor-pointer">
                                        <div 
                                            onClick={() => toggleSkill(skill.name)}
                                            className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${selectedSkills.includes(skill.name) ? 'border-[#b5242c] bg-[#b5242c]' : 'border-[#eee] group-hover:border-[#b5242c]'}`}
                                        >
                                            <Check size={10} className={`text-white transition-all ${selectedSkills.includes(skill.name) ? 'scale-100' : 'scale-0'}`} />
                                        </div>
                                        <span className={`text-[13px] transition-colors ${selectedSkills.includes(skill.name) ? 'text-[#b5242c] font-bold' : 'text-[#555] group-hover:text-[#242424]'}`}>{skill.name} ({skill.count})</span>
                                    </label>
                                ))}
                            </div>
                        </FilterSection>

                        {['Level', 'Languages', 'Location'].map(filter => (
                            <div key={filter} className="px-5 py-4 border-t border-[#eee] flex items-center justify-between cursor-pointer group">
                                <h4 className="text-[14px] font-bold text-[#242424] group-hover:text-[#b5242c] transition-colors">{filter}</h4>
                                <ChevronDown size={18} className="text-gray-400" />
                            </div>
                        ))}

                        <div className="p-5 bg-white border-t border-[#eee]">
                            <p className="text-[11px] text-[#888] italic mb-4 leading-relaxed">select options and press the filter button to apply changes</p>
                            <button 
                                onClick={handleFilter}
                                className="w-full bg-primary text-white py-3 rounded-none font-bold text-[14px] uppercase tracking-wider hover:bg-[#a11f27] transition-all shadow-lg shadow-primary/10"
                            >
                                Filter Result
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right Side - Results List */}
                <div className="flex-1 space-y-6">
                    
                    {/* Results Toolbar */}
                    <div className="bg-white p-4 rounded-none border border-[#eee] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-bold text-[#242424] text-[15px]">Found {filteredFreelancers.length} Results</h2>
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                            <div className="flex items-center bg-gray-50 rounded-none p-1 border border-[#eee]">
                                <button className="p-1.5 bg-primary text-white rounded-none"><Filter size={16} /></button>
                                <button className="p-1.5 text-gray-400 hover:text-primary"><Activity size={16} /></button>
                            </div>
                            <select className="bg-gray-50 border border-[#eee] text-[13px] px-4 py-1.5 rounded-none outline-none focus:border-primary flex-1 sm:flex-none">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Price (Low to High)</option>
                                <option>Sort by: Rating</option>
                            </select>
                        </div>
                    </div>

                    {/* Freelancer List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-10 h-10 border-4 border-[#b5242c]/20 border-t-[#b5242c] rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500 font-medium">Scanning for available freelancers...</p>
                            </div>
                        ) : filteredFreelancers.length === 0 ? (
                            <div className="bg-white p-12 text-center rounded-none border border-[#eee]">
                                <UserCheck className="mx-auto text-gray-200 mb-4" size={60} />
                                <h3 className="text-xl font-bold text-[#242424] mb-2">No Freelancers Found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query.</p>
                            </div>
                        ) : (
                            filteredFreelancers.map(freelancer => (
                                <motion.div 
                                    key={freelancer.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-none border border-[#eee] shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 relative group overflow-hidden"
                                >
                                    {/* Top Right Tag - Placeholder for Premium/Hot */}
                                    <div className="absolute top-0 right-0 p-1 bg-primary text-white rotate-45 translate-x-3 -translate-y-3 px-6 shadow-md">
                                        <Star size={10} fill="currentColor" />
                                    </div>

                                    {/* Image Section */}
                                    <div className="shrink-0 w-full md:w-[120px] h-[120px] rounded-none overflow-hidden border border-[#eee]">
                                        <img 
                                            src={freelancer.profilePicture || `https://ui-avatars.com/api/?name=${freelancer.fullName}&background=random&color=fff&size=200`} 
                                            className="w-full h-full object-cover"
                                            alt={freelancer.fullName}
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <UserCheck size={14} className="text-blue-500" />
                                                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">{freelancer.username}</span>
                                            </div>
                                            <h3 className="text-[15px] font-bold text-[#242424] leading-[24px] group-hover:text-primary transition-colors">{freelancer.fullName}</h3>
                                            <p className="text-primary font-bold text-[14px] mt-0.5">
                                                ₹{freelancer.hourlyRate?.toLocaleString() || '0.00'} 
                                                <span className="text-gray-400 text-[13px] font-normal">/ hr</span>
                                            </p>
                                            <p className="text-[13px] font-normal text-[#555] leading-[20px] mt-1 italic">
                                                {freelancer.professionalHeadline || 'Professional Freelancer'}
                                            </p>
                                            <p className="text-[#888] text-[12px] mt-1">Member since {freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}</p>
                                        </div>
                                        
                                        <div className="mt-4 flex items-center gap-1 text-primary">
                                            <Star size={14} fill="currentColor" />
                                            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter">No Reviews</span>
                                        </div>

                                        {/* Portfolio Preview */}
                                        {(freelancer as any).portfolio?.length > 0 && (
                                            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
                                                {(freelancer as any).portfolio.map((item: any, idx: number) => (
                                                    <div key={idx} className="w-16 h-12 bg-gray-100 rounded-sm overflow-hidden shrink-0 border border-[#eee]">
                                                        <img src={item.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-col justify-between md:items-end gap-4 min-w-0 md:min-w-[200px] z-10">
                                        <div className="w-full space-y-2">
                                            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedFreelancer(freelancer);
                                                        setIsInviteModalOpen(true);
                                                    }}
                                                    className="flex-1 min-w-[80px] px-3 py-2.5 bg-white border border-[#b5242c] text-[#b5242c] rounded-sm font-bold text-[11px] uppercase tracking-wider hover:bg-[#b5242c] hover:text-white transition-all duration-300"
                                                >
                                                    Invite
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/messages?with=${freelancer.id}`);
                                                    }}
                                                    className="flex-1 min-w-[80px] px-3 py-2.5 bg-[#b5242c] text-white rounded-sm font-bold text-[11px] uppercase tracking-wider shadow-lg shadow-[#b5242c]/20 hover:bg-[#920218] transition-all duration-300"
                                                >
                                                    Message
                                                </button>
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/hire-me?id=${freelancer.id}`);
                                                }}
                                                className="w-full py-2.5 bg-[#261817] text-white rounded-sm font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                Hire & Contract <ArrowRight size={14} />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 w-full justify-between md:justify-end px-1">
                                            <button className="text-[12px] font-bold text-[#888] hover:text-[#b5242c] flex items-center gap-1.5 transition-colors group/follow">
                                                <Heart size={14} className="group-hover/follow:fill-[#b5242c] transition-all" /> Follow
                                            </button>
                                            <button className="p-2 bg-[#fff0ef] text-[#b5242c] rounded-full hover:bg-[#b5242c] hover:text-white transition-all border border-[#e2bebc]/30">
                                                <Heart size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && selectedFreelancer && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-none shadow-2xl overflow-hidden"
                        >
                            <div className="bg-primary p-6 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold uppercase tracking-tight">Invite to Project</h3>
                                    <p className="text-white/70 text-xs mt-1">Inviting <span className="font-bold text-white">{selectedFreelancer.fullName}</span></p>
                                </div>
                                <button onClick={() => setIsInviteModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
                            </div>
                            <div className="p-6">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Select One of Your Active Jobs</h4>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {clientJobs.length === 0 ? (
                                        <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-500 font-medium">No active jobs found.</p>
                                            <button onClick={() => navigate('/post-job')} className="text-primary font-bold text-xs mt-2 hover:underline">Post a Job First</button>
                                        </div>
                                    ) : (
                                        clientJobs.map(job => (
                                            <div 
                                                key={job.id} 
                                                className="p-4 border border-[#eee] hover:border-primary hover:bg-primary/5 cursor-pointer transition-all flex justify-between items-center group"
                                                onClick={async () => {
                                                    try {
                                                        const user = JSON.parse(localStorage.getItem('user') || '{}');
                                                        
                                                        // 1. Create a "Job Application" with INVITED status
                                                        const invitationData = {
                                                            jobId: job.id,
                                                            jobTitle: job.title,
                                                            company: user.fullName || 'Strategic Client',
                                                            clientEmail: user.email,
                                                            clientId: user.id,
                                                            freelancerId: selectedFreelancer.id,
                                                            email: selectedFreelancer.email,
                                                            fullName: selectedFreelancer.fullName,
                                                            status: 'INVITED',
                                                            skills: selectedFreelancer.skills?.join(', ') || '',
                                                            experience: 'Invitation based on profile'
                                                        };

                                                        const inviteRes = await fetch(`${API_BASE_URL}/api/job-applications/apply`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(invitationData)
                                                        });

                                                        // 2. Send an automated Chat Message
                                                        const invitationMessage = {
                                                            senderEmail: user.email,
                                                            receiverEmail: selectedFreelancer.email,
                                                            content: `Hello ${selectedFreelancer.fullName}! I'm impressed by your profile and would like to invite you to work on my project: "${job.title}". Please check the details in your profile invitations!`,
                                                        };
                                                        
                                                        const msgRes = await fetch(`${API_BASE_URL}/api/messages/send`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify(invitationMessage)
                                                        });

                                                        if (inviteRes.ok && msgRes.ok) {
                                                            alert(`Successfully invited ${selectedFreelancer.fullName} to ${job.title}!`);
                                                            setIsInviteModalOpen(false);
                                                        } else {
                                                            alert('Something went wrong. Please try again.');
                                                        }
                                                    } catch (e) { 
                                                        console.error(e);
                                                        alert('Connection error. Please try again.');
                                                    }
                                                }}
                                            >
                                                <div>
                                                    <p className="font-bold text-[14px] text-[#242424]">{job.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Budget: ₹{job.salary || 'Negotiable'}</p>
                                                </div>
                                                <ArrowRight size={18} className="text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-[#eee] flex justify-end">
                                <button onClick={() => setIsInviteModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FilterSection = ({ title, children, isOpen, onToggle }: any) => (
    <div className="border-t border-[#eee] first:border-t-0">
        <button 
            onClick={onToggle}
            className="w-full px-5 py-4 flex items-center justify-between group"
        >
            <h4 className="text-[14px] font-bold text-[#242424] group-hover:text-[#b5242c] transition-colors">{title}</h4>
            {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="px-5 pb-5 pt-0">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


export default BrowseFreelancers;
