import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Search, Star, Heart, 
    Filter, ChevronDown, ChevronUp, 
    Check, ArrowRight, UserCheck, Activity, X,
    MapPin, Mail, ChevronRight, Zap, TrendingUp, Wallet
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
    industry?: string;
    createdAt: string;
}

const BrowseFreelancers: React.FC = () => {
    const navigate = useNavigate();
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [invitingJobId, setInvitingJobId] = useState<number | null>(null);
    const [inviteSuccess, setInviteSuccess] = useState(false);
    const [jobSearchQuery, setJobSearchQuery] = useState('');
    const [clientJobs, setClientJobs] = useState<any[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
    
    // UI States
    const [activeFilters, setActiveFilters] = useState<string[]>(['keyword', 'price', 'skills', 'location', 'industry']);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredClientJobs = clientJobs.filter(job => 
        job.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        job.category?.toLowerCase().includes(jobSearchQuery.toLowerCase())
    );

    useEffect(() => {
        fetchFreelancers();
        fetchClientJobs();
    }, []);

    const fetchFreelancers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                const onlyFreelancers = data.filter((f: any) => f.userRole === 'FREELANCER' || !f.userRole);
                setFreelancers(onlyFreelancers);
                setFilteredFreelancers(onlyFreelancers);
            }
        } catch (error) {
            console.error("Error fetching freelancers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientJobs = async () => {
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

    const handleInviteClick = (freelancer: Freelancer) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        setSelectedFreelancer(freelancer);
        setIsInviteModalOpen(true);
    };

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (locationQuery) params.append('location', locationQuery);
            if (selectedIndustry) params.append('industry', selectedIndustry);
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
                setFilteredFreelancers(data);
            }
        } catch (error) {
            console.error("Error filtering freelancers:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocationQuery('');
        setSelectedIndustry('');
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

    const handleMessageClick = (freelancer: Freelancer) => {
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

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-[80px]" style={{ fontFamily: '"Poppins", sans-serif' }}>
            
            {/* 1. COMPACT SEARCH HEADER */}
            <div className="bg-[#0F2E4B] py-12 flex items-center justify-center">
                {/* Search Overlay */}
                <div className="w-full max-w-[900px] px-6">
                    <div className="bg-[#1a3a5a] p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Geo Location"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full bg-white h-[42px] pl-11 pr-4 rounded-lg focus:outline-none font-semibold text-[#0F2E4B] text-[14px] placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Keyword"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white h-[42px] pl-11 pr-4 rounded-lg focus:outline-none font-semibold text-[#0F2E4B] text-[14px] placeholder:text-gray-400"
                            />
                        </div>
                        <button 
                            onClick={handleFilter}
                            className="bg-[#317CD7] hover:bg-[#2563b5] text-white px-8 h-[42px] rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 text-[12px]"
                        >
                            <Search size={18} strokeWidth={3} />
                            SEARCH
                        </button>
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

            <div className="max-w-[1440px] mx-auto px-6 lg:pl-4 lg:pr-16 py-12 flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-12">
                
                {/* Filter Sidebar - Mobile Overlay */}
                {isFilterOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-[2001] lg:hidden"
                        onClick={() => setIsFilterOpen(false)}
                    />
                )}

                {/* Left Sidebar - Filters */}
                <aside className={`
                    fixed inset-y-0 left-0 w-[300px] bg-white z-[2002] transition-transform duration-300 lg:static lg:w-[320px] lg:z-0 lg:translate-x-0 overflow-y-auto lg:overflow-visible
                    ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm min-h-full">
                        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <h3 className="text-[#0F2E4B] flex items-center gap-2" style={{ 
                                fontFamily: '"Poppins", sans-serif',
                                fontSize: '15px',
                                lineHeight: '1',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.025em'
                            }}>
                                <Filter size={18} className="text-[#317CD7]" />
                                Search Filters
                            </h3>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={clearFilters}
                                    className="text-[11px] font-extrabold text-primary uppercase tracking-wider hover:underline"
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
                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by keyword..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-[40px] pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-[#317CD7] transition-all text-[13px] placeholder:text-gray-400"
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
                                    <label key={skill.name} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleSkill(skill.name)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedSkills.includes(skill.name) ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                {selectedSkills.includes(skill.name) && <Check size={14} strokeWidth={4} className="text-white" />}
                                            </div>
                                            <span className={`text-[14px] font-medium transition-colors ${selectedSkills.includes(skill.name) ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{skill.name}</span>
                                        </div>
                                        <span className="text-[11px] text-gray-300 font-bold">({skill.count})</span>
                                    </label>
                                ))}
                            </div>
                        </FilterSection>

                        {/* Location Filter */}
                        <FilterSection 
                            title="Location" 
                            isOpen={activeFilters.includes('location')} 
                            onToggle={() => toggleFilter('location')}
                        >
                            <div className="relative mb-4">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search by location..."
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                    className="w-full h-[40px] pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:border-[#317CD7] transition-all text-[13px] placeholder:text-gray-400"
                                />
                            </div>
                        </FilterSection>

                        {/* Industry/Sector Filter */}
                        <FilterSection 
                            title="Sectors" 
                            isOpen={activeFilters.includes('industry')} 
                            onToggle={() => toggleFilter('industry')}
                        >
                            <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {Array.from(new Set(freelancers.map(f => f.industry).filter(Boolean))).map(industry => (
                                    <label key={industry} className="flex items-center gap-3 group cursor-pointer" onClick={() => setSelectedIndustry(industry === selectedIndustry ? '' : industry || '')}>
                                        <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedIndustry === industry ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                            {selectedIndustry === industry && <Check size={14} strokeWidth={4} className="text-white" />}
                                        </div>
                                        <span className={`text-[14px] font-medium transition-colors ${selectedIndustry === industry ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{industry}</span>
                                    </label>
                                ))}
                                {Array.from(new Set(freelancers.map(f => f.industry).filter(Boolean))).length === 0 && (
                                    <p className="text-[12px] text-gray-400 italic">No sectors found in current data</p>
                                )}
                            </div>
                        </FilterSection>

                        <div className="p-5 bg-white border-t border-[#eee]">
                            <p className="text-[11px] text-[#888] italic mb-4 leading-relaxed">select options and press the filter button to apply changes</p>
                            <button 
                                onClick={handleFilter}
                                className="w-full bg-[#0F2E4B] text-white py-3 rounded-lg font-bold text-[13px] uppercase tracking-widest hover:bg-[#317CD7] transition-all shadow-md shadow-gray-100"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right Side - Results List */}
                <div className="flex-1 space-y-6">
                    
                    {/* Results Toolbar */}
                    <div 
                        className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 flex items-center justify-between"
                        style={{ 
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '13px',
                            lineHeight: '28px',
                            color: '#212121',
                            fontWeight: 500,
                            WebkitFontSmoothing: 'antialiased'
                        }}
                    >
                        <div className="pr-6 border-r border-gray-100 font-bold text-[#0F2E4B]">
                            Found <span className="text-[#317CD7]">{filteredFreelancers.length}</span> results
                        </div>
                        <div className="px-6 flex items-center gap-4">
                            <span className="text-gray-400">Sort by:</span>
                            <select className="bg-transparent border-none outline-none font-bold text-[#0F2E4B] cursor-pointer">
                                <option>Newest</option>
                                <option>Price (Low to High)</option>
                                <option>Rating</option>
                            </select>
                        </div>
                    </div>

                    {/* Freelancer List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-10 h-10 border-4 border-[#317CD7]/10 border-t-[#317CD7] rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Scanning for available freelancers...</p>
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
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col md:flex-row gap-6 relative group"
                                >
                                    {/* Image Section */}
                                    <div className="shrink-0 w-full md:w-[80px] h-[80px] rounded-xl overflow-hidden border border-gray-100 shadow-inner">
                                        <img 
                                            src={freelancer.profilePicture || `https://ui-avatars.com/api/?name=${freelancer.fullName}&background=random&color=fff&size=200`} 
                                            className="w-full h-full object-cover"
                                            alt={freelancer.fullName}
                                        />
                                    </div>

                                    {/* Info Section */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <span className="px-2.5 py-0.5 bg-blue-50 text-[#317CD7] text-[9px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
                                                Verified Expert
                                            </span>
                                            <div className="flex items-center gap-1 text-[#FFB800]">
                                                <Star size={11} fill="currentColor" />
                                                <span className="text-[11px] font-bold text-[#0F2E4B]">5.0</span>
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-[17px] font-bold text-[#0F2E4B] mb-1 group-hover:text-[#317CD7] transition-colors leading-tight">
                                            {freelancer.fullName}
                                        </h3>
                                        
                                        <p className="text-[#212121] text-[13px] font-medium leading-snug mb-3 line-clamp-1">
                                            {freelancer.professionalHeadline || 'Experienced Professional Freelancer'}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {freelancer.skills?.slice(0, 4).map(skill => (
                                                <span key={skill} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-semibold rounded-md border border-gray-100">
                                                    {skill}
                                                </span>
                                            ))}
                                            {freelancer.skills && freelancer.skills.length > 4 && (
                                                <span className="text-[10px] text-gray-400 font-bold flex items-center">+ {freelancer.skills.length - 4}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-gray-400 text-[12px]">
                                                {freelancer.hourlyRate && freelancer.hourlyRate > 2500 ? (
                                                    <Zap size={13} className="text-[#FFB800]" />
                                                ) : freelancer.hourlyRate && freelancer.hourlyRate >= 1000 ? (
                                                    <TrendingUp size={13} className="text-[#317CD7]" />
                                                ) : (
                                                    <Wallet size={13} className="text-[#2DD4BF]" />
                                                )}
                                                <span className="font-semibold text-[#0F2E4B]">₹{freelancer.hourlyRate?.toLocaleString()}/hr</span>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/profile/${freelancer.username}`)}
                                                className="group/btn flex items-center gap-2 text-[#317CD7] text-[12px] font-bold relative"
                                            >
                                                <span className="relative z-10 border-b border-transparent group-hover/btn:border-[#317CD7] transition-all duration-300">
                                                    View Profile
                                                </span>
                                                <ChevronRight size={14} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-col justify-between items-end gap-3 min-w-[150px]">
                                        <button className="p-2.5 bg-gray-50 text-gray-300 rounded-full hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100">
                                            <Heart size={16} />
                                        </button>
                                        <div className="w-full space-y-2">
                                            <button 
                                                onClick={() => handleInviteClick(freelancer)}
                                                className="w-full py-2 bg-[#0F2E4B] text-white rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-[#317CD7] transition-all"
                                            >
                                                Invite to Job
                                            </button>
                                            <button 
                                                onClick={() => handleMessageClick(freelancer)}
                                                className="w-full py-2 bg-white border border-gray-100 text-[#0F2E4B] rounded-lg font-bold text-[11px] uppercase tracking-widest hover:border-[#317CD7] hover:text-[#317CD7] transition-all"
                                            >
                                                Message
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
                    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsInviteModalOpen(false)}
                            className="absolute inset-0 bg-[#0F2E4B]/60 backdrop-blur-sm"
                        ></motion.div>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-[500px] bg-white rounded-2xl overflow-hidden shadow-2xl font-['Poppins']"
                        >
                            {/* Modal Header */}
                            <div className="bg-[#317CD7] p-8 text-white relative">
                                <button 
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="absolute top-6 right-6 text-white/80 hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                                <h2 className="uppercase tracking-tight mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, lineHeight: '32px' }}>Invite to Project</h2>
                                <p className="text-white/80" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 400 }}>Inviting <span className="font-bold text-white">{selectedFreelancer.fullName}</span></p>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8">
                                {inviteSuccess ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 shadow-sm">
                                            <Check size={40} strokeWidth={3} />
                                        </div>
                                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '20px', fontWeight: 700, color: '#0F2E4B', marginBottom: '8px' }}>Invitation Sent!</h3>
                                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', color: '#6B7280' }}>Your invite has been delivered to {selectedFreelancer.fullName}.</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <h3 
                                                style={{ 
                                                    fontFamily: 'Poppins, sans-serif', 
                                                    fontSize: '15px', 
                                                    fontWeight: 500, 
                                                    lineHeight: '1', 
                                                    color: 'rgb(33, 33, 33)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.025em'
                                                }}
                                            >
                                                Select one of your active jobs
                                            </h3>
                                            <div className="relative flex-1 max-w-[200px]">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                <input 
                                                    type="text"
                                                    placeholder="Search projects..."
                                                    value={jobSearchQuery}
                                                    onChange={(e) => setJobSearchQuery(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[12px] outline-none focus:border-[#317CD7] transition-all font-['Poppins']"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3 max-h-[340px] overflow-y-auto custom-scrollbar pr-2">
                                            {filteredClientJobs.length === 0 ? (
                                                <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                    <p className="text-gray-400 text-[13px] font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>{jobSearchQuery ? 'No matching projects found.' : 'No active jobs found.'}</p>
                                                    {!jobSearchQuery && (
                                                        <button 
                                                            onClick={() => navigate('/post-job')}
                                                            className="mt-4 text-[#317CD7] font-bold text-[12px] uppercase tracking-widest hover:underline"
                                                            style={{ fontFamily: 'Poppins, sans-serif' }}
                                                        >
                                                            Post a new job
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                filteredClientJobs.map((job) => (
                                                    <button 
                                                        key={job.id}
                                                        disabled={invitingJobId === job.id}
                                                        onClick={async () => {
                                                            setInvitingJobId(job.id);
                                                            try {
                                                                const res = await fetch(`${API_BASE_URL}/api/jobs/${job.id}/invite/${selectedFreelancer.id}`, {
                                                                    method: 'POST',
                                                                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                                                                });
                                                                if (res.ok) {
                                                                    setInviteSuccess(true);
                                                                    setTimeout(() => {
                                                                        setIsInviteModalOpen(false);
                                                                        setInviteSuccess(false);
                                                                    }, 2500);
                                                                } else {
                                                                    alert('Failed to send invitation.');
                                                                }
                                                            } catch (e) {
                                                                console.error(e);
                                                                alert('Error sending invitation.');
                                                            } finally {
                                                                setInvitingJobId(null);
                                                            }
                                                        }}
                                                        className="w-full p-5 bg-white border border-gray-100 rounded-xl text-left hover:border-[#317CD7] hover:shadow-md transition-all group flex items-center justify-between"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="px-2 py-0.5 bg-blue-50 text-[#317CD7] text-[9px] font-bold rounded uppercase tracking-wider border border-blue-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                                    {job.type || 'Fixed'}
                                                                </span>
                                                                {job.category && (
                                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-bold rounded uppercase tracking-wider border border-gray-100" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                                        {job.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 
                                                                className="mb-1 group-hover:text-[#317CD7] transition-colors"
                                                                style={{
                                                                    fontFamily: 'Poppins, sans-serif',
                                                                    fontSize: '15px',
                                                                    fontWeight: 500,
                                                                    lineHeight: '22px',
                                                                    color: 'rgb(33, 33, 33)'
                                                                }}
                                                            >
                                                                {job.title}
                                                            </h4>
                                                            <p 
                                                                style={{ 
                                                                    fontFamily: 'Poppins, sans-serif', 
                                                                    fontSize: '13px', 
                                                                    fontWeight: 500, 
                                                                    color: '#6B7280',
                                                                }}
                                                            >
                                                                Budget: <span className="text-[#0F2E4B] font-bold">₹{job.price?.toLocaleString() || 'Negotiable'}</span>
                                                            </p>
                                                        </div>
                                                        <div className="ml-4">
                                                            {invitingJobId === job.id ? (
                                                                <div className="w-5 h-5 border-2 border-[#317CD7] border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#317CD7] group-hover:text-white transition-all">
                                                                    <ArrowRight size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button 
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-8 py-3 uppercase tracking-widest hover:text-[#0F2E4B] transition-all"
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '15px',
                                        fontWeight: 500,
                                        lineHeight: '26px',
                                        color: 'rgb(107, 114, 128)'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <NewsletterSection />
        </div>
    );
};

const FilterSection = ({ title, isOpen, onToggle, children }: any) => {
    return (
        <div className="px-5 py-6 border-b border-gray-50 last:border-0">
            <button 
                onClick={onToggle} 
                className="w-full flex items-center justify-between mb-4 group"
            >
                <span 
                    className="transition-all"
                    style={{ 
                        fontFamily: '"Poppins", sans-serif',
                        fontSize: '17px',
                        lineHeight: '1',
                        color: '#000000',
                        fontWeight: 600
                    }}
                >
                    {title}
                </span>
                <ChevronDown size={14} className={`text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NewsletterSection = () => (
    <div className="bg-[#F9FAFB] py-16 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 lg:pl-4 lg:pr-16">
            <div className="bg-white rounded-xl p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-[600px]">
                    <h3 
                        style={{ 
                            fontFamily: '"Poppins", sans-serif',
                            color: '#040e24',
                            fontWeight: 700,
                            fontSize: '28px',
                            marginBottom: '1rem'
                        }}
                    >
                        Join Our Free Newsletter
                    </h3>
                    <p 
                        style={{ 
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '15px',
                            lineHeight: '26px',
                            color: '#212121',
                            fontWeight: 500
                        }}
                    >
                        Stay updated with the latest job opportunities and industry news delivered directly to your inbox.
                    </p>
                </div>
                <div className="flex-1 w-full flex flex-col sm:flex-row gap-4 max-w-[500px]">
                    <div className="flex-1 relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full bg-gray-50 border border-gray-100 h-[44px] pl-14 pr-6 rounded-lg focus:outline-none focus:border-[#317CD7] transition-all text-[14px]" 
                        />
                    </div>
                    <button className="bg-[#317CD7] hover:bg-[#2866B1] text-white px-8 h-[44px] rounded-lg font-bold uppercase tracking-widest transition-all text-[12px]">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    </div>
);


export default BrowseFreelancers;
