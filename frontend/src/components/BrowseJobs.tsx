import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import {
    Search, Filter, X, MapPin, Briefcase, Clock,
    ChevronDown, Bell, CheckCircle, Heart, IndianRupee,
    Layers, Calendar, Mail, FileText, ExternalLink,
    Grid, List as ListIcon, Star, ArrowUpDown, ChevronRight, Check
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const BrowseJobs: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [priceRange, setPriceRange] = useState(1000000);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState('All Time');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/jobs`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
                setFilteredJobs(data);
            }
        } catch (err) {
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = jobs.filter(job => {
        const matchesSearch = !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLocation = !locationQuery ||
            job.location.toLowerCase().includes(locationQuery.toLowerCase());

        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.includes(job.category);

        const matchesType = selectedTypes.length === 0 ||
            selectedTypes.includes(job.type);

        const matchesPrice = job.price <= priceRange;

        const matchesDate = () => {
            if (selectedDate === 'All Time') return true;
            if (!job.postedAt) return false;
            const date = new Date(job.postedAt);
            const now = new Date();
            const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

            if (selectedDate === 'Last 24 Hours') return diffInHours <= 24;
            if (selectedDate === 'Last 7 Days') return diffInHours <= 24 * 7;
            if (selectedDate === 'Last 30 Days') return diffInHours <= 24 * 30;
            return true;
        };

        return matchesSearch && matchesLocation && matchesCategory && matchesType && matchesPrice && matchesDate();
    });

    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const paginatedJobs = filteredResults.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return (
            <div className="flex items-center gap-2">
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-[14px] font-bold transition-all ${
                            currentPage === page 
                            ? 'bg-[#0F2E4B] text-white shadow-lg' 
                            : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        {page}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-lg text-[14px] font-bold hover:bg-gray-50 transition-all"
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>
        );
    };

    const dynamicTypes = Array.from(new Set(jobs.map(j => j.type).filter(Boolean))).map(type => ({
        label: type,
        count: jobs.filter(j => j.type === type).length
    }));

    const dynamicCategories = Array.from(new Set(jobs.map(j => j.category).filter(Boolean))).map(cat => ({
        label: cat,
        count: jobs.filter(j => j.category === cat).length
    }));

    const featuredJobs = jobs.filter(j => j.featured).slice(0, 3);
    const allSectors = Array.from(new Set(jobs.map(j => j.category).filter(Boolean)));

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-[80px]" style={{ fontFamily: '"Poppins", sans-serif' }}>
            {/* 1. MAP HEADER SECTION */}
            <div className="relative h-[400px] bg-[#e5e7eb] overflow-hidden flex items-center justify-center">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-40 grayscale">
                    <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Map Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Search Overlay */}
                <div className="relative z-10 w-full max-w-[900px] px-6">
                    <div className="bg-[#0F2E4B] p-2 rounded-xl shadow-2xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Geo Location"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="w-full bg-white h-[42px] pl-11 pr-4 rounded-lg focus:outline-none focus:border-[#317CD7] focus:ring-1 focus:ring-[#317CD7] font-semibold text-[#0F2E4B] text-[14px] placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Keyword"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white h-[42px] pl-11 pr-4 rounded-lg focus:outline-none focus:border-[#317CD7] focus:ring-1 focus:ring-[#317CD7] font-semibold text-[#0F2E4B] text-[14px] placeholder:text-gray-400"
                            />
                        </div>
                        <button className="bg-[#317CD7] hover:bg-[#2563b5] text-white px-8 h-[42px] rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 text-[12px]">
                            <Search size={18} strokeWidth={3} />
                            SEARCH
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:pl-4 lg:pr-16 py-12">
                <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-10">

                    {/* LEFT SIDEBAR */}
                    <aside className="space-y-8">
                        {/* Free Resources Card */}
                        <div className="bg-[#0F2E4B] rounded-xl p-8 text-white relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <h2 className="text-2xl font-extrabold mb-4 leading-tight relative z-10 uppercase tracking-tighter">Free Resources</h2>
                            <p className="text-white/70 text-sm mb-6 leading-relaxed font-medium relative z-10">Our resources section will help you bag your dream job.</p>
                            <button className="w-full bg-white text-[#0F2E4B] py-3.5 rounded-lg font-extrabold text-[13px] uppercase tracking-widest hover:bg-[#317CD7] hover:text-white transition-all shadow-lg relative z-10">
                                Browse Resources
                            </button>
                            <FileText size={80} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
                        </div>

                        {/* Search Filter Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="pl-2 pr-4 py-5 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-extrabold text-[#0F2E4B] uppercase tracking-tight text-[15px]">Search Filters</h3>
                                <ChevronDown size={18} className="text-gray-400" />
                            </div>

                            <div className="px-4 py-6 space-y-8">
                                {/* Keyword */}
                                <div>
                                    <label className="block text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Search</label>
                                    <div className="relative">
                                        <input type="text" placeholder="Search Jobs..." className="w-full bg-gray-50 border border-gray-100 h-12 pl-10 pr-4 rounded-lg text-sm focus:outline-none focus:border-[#317CD7] transition-all" />
                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>

                                {/* Vacancy Type */}
                                <FilterSection title="Vacancy Type">
                                    <div className="space-y-3 pt-2">
                                        {dynamicTypes.length === 0 ? (
                                            <p className="text-[12px] text-gray-400 italic">No types found</p>
                                        ) : dynamicTypes.map(item => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between group cursor-pointer"
                                                onClick={() => {
                                                    setSelectedTypes(prev =>
                                                        prev.includes(item.label)
                                                            ? prev.filter(t => t !== item.label)
                                                            : [...prev, item.label]
                                                    );
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedTypes.includes(item.label) ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                        {selectedTypes.includes(item.label) && <Check size={14} strokeWidth={4} className="text-white" />}
                                                    </div>
                                                    <span className={`text-[14px] font-medium transition-colors ${selectedTypes.includes(item.label) ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{item.label}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-300 font-bold">({item.count})</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterSection>

                                {/* Sectors */}
                                <FilterSection title="Sectors">
                                    <div className="space-y-3 pt-2">
                                        {dynamicCategories.length === 0 ? (
                                            <p className="text-[12px] text-gray-400 italic">No sectors found</p>
                                        ) : dynamicCategories.map(item => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between group cursor-pointer"
                                                onClick={() => {
                                                    setSelectedCategories(prev =>
                                                        prev.includes(item.label)
                                                            ? prev.filter(c => c !== item.label)
                                                            : [...prev, item.label]
                                                    );
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedCategories.includes(item.label) ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                        {selectedCategories.includes(item.label) && <Check size={14} strokeWidth={4} className="text-white" />}
                                                    </div>
                                                    <span className={`text-[14px] font-medium transition-colors ${selectedCategories.includes(item.label) ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{item.label}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-300 font-bold">({item.count})</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterSection>

                                {/* Date Posted */}
                                <FilterSection title="Date Posted">
                                    <div className="space-y-3 pt-2">
                                        {["Last 24 Hours", "Last 7 Days", "Last 30 Days", "All Time"].map(item => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-3 group cursor-pointer"
                                                onClick={() => setSelectedDate(item)}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${selectedDate === item ? 'border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${selectedDate === item ? 'bg-[#317CD7]' : 'bg-transparent'}`}></div>
                                                </div>
                                                <span className={`text-[14px] transition-colors ${selectedDate === item ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </FilterSection>

                                {/* Salary Range */}
                                <FilterSection title="Salary">
                                    <div className="pt-4 px-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000000"
                                            step="1000"
                                            value={priceRange}
                                            onChange={(e) => setPriceRange(Number(e.target.value))}
                                            className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#317CD7]"
                                        />
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[12px] font-extrabold text-gray-400">₹0</span>
                                            <span className="text-[12px] font-extrabold text-[#0F2E4B]">₹{priceRange.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </FilterSection>
                            </div>
                        </div>

                        {/* Upload CV Card */}
                        <div className="bg-[#317CD7] rounded-xl p-8 text-white relative overflow-hidden group shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <h2 className="text-2xl font-extrabold mb-4 leading-tight uppercase tracking-tighter">Upload Your CV</h2>
                            <p className="text-white/80 text-sm mb-6 leading-relaxed font-medium">Upload your CV to apply for as many jobs as you like.</p>
                            <button className="w-full bg-white text-[#317CD7] py-3.5 rounded-lg font-extrabold text-[13px] uppercase tracking-widest hover:bg-[#0F2E4B] hover:text-white transition-all shadow-lg">
                                Upload Your CV
                            </button>
                        </div>

                        {/* Featured Jobs Mini List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-4 py-5 border-b border-gray-50">
                                <h3 className="font-extrabold text-[#0F2E4B] uppercase tracking-tight text-[15px]">Featured Jobs</h3>
                            </div>
                            <div className="p-0">
                                {featuredJobs.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 text-[13px] italic">No featured jobs currently</div>
                                ) : featuredJobs.map(job => (
                                    <div
                                        key={job.id}
                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                        className="px-4 py-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-all cursor-pointer group"
                                    >
                                        <h4 className="font-semibold text-[15px] text-[#0F2E4B] mb-1 group-hover:text-[#317CD7] truncate">{job.title}</h4>
                                        <div className="flex items-center gap-2 text-[12px] text-gray-400 font-medium">
                                            <MapPin size={12} />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-[#317CD7] font-semibold text-[13px]">₹{job.price?.toLocaleString()}</span>
                                            <span className="px-2 py-0.5 bg-blue-50 text-[#317CD7] rounded text-[10px] font-extrabold uppercase tracking-wider">{job.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="space-y-8">
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
                            <div className="flex items-center">
                                {/* Sort */}
                                <div className="flex items-center gap-2 text-[#0F2E4B] cursor-pointer hover:text-[#317CD7] transition-all pr-6 border-r border-gray-100">
                                    <ArrowUpDown size={18} className="text-[#317CD7]" />
                                    <span className="">Sort</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>

                                {/* View Options */}
                                <div className="flex items-center gap-6 px-6 border-r border-gray-100">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'text-[#317CD7]' : 'text-gray-400 hover:text-[#0F2E4B]'}`}
                                    >
                                        <Grid size={18} />
                                        <span className="">Grid</span>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`flex items-center gap-2 transition-all ${viewMode === 'list' ? 'text-[#317CD7]' : 'text-gray-400 hover:text-[#0F2E4B]'}`}
                                    >
                                        <ListIcon size={18} />
                                        <span className="">List</span>
                                    </button>
                                </div>

                                {/* Showing results */}
                                <div className="px-6">
                                    Showing <span className="font-bold">
                                        {filteredResults.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                                        {Math.min(currentPage * itemsPerPage, filteredResults.length)}
                                    </span> of <span className="font-bold">{filteredResults.length}</span> results
                                </div>
                            </div>

                            {/* Integrated Pagination */}
                            <Pagination />
                        </div>

                        {/* Job Listings Grid/List */}
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                            {loading ? (
                                [1, 2, 3, 4].map(i => <SkeletonLoader key={i} mode={viewMode} />)
                            ) : paginatedJobs.length === 0 ? (
                                <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100">
                                    <Search size={48} className="mx-auto text-gray-200 mb-4" />
                                    <h3 className="text-xl font-bold text-[#0F2E4B] mb-2">No jobs found</h3>
                                    <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                                </div>
                            ) : (
                                paginatedJobs.map((job) => (
                                    <JobCard key={job.id} job={job} mode={viewMode} />
                                ))
                            )}
                        </div>

                        {/* Bottom Pagination */}
                        <div className="flex justify-center pt-8 pb-4">
                            <Pagination />
                        </div>



                        {/* 4. BROWSE BY SECTOR SECTION */}
                        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
                            <h3
                                style={{
                                    fontFamily: '"Poppins", sans-serif',
                                    color: '#040e24',
                                    fontWeight: 600,
                                    fontSize: '24px',
                                    marginBottom: '2rem'
                                }}
                            >
                                Browse More Jobs by Sector
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {allSectors.length === 0 ? (
                                    <p className="text-gray-400 font-medium" style={{ fontFamily: '"Poppins", sans-serif' }}>No categories found in current listings</p>
                                ) : allSectors.map(sector => (
                                    <button
                                        key={sector}
                                        onClick={() => {
                                            setSelectedCategories([sector]);
                                            window.scrollTo({ top: 400, behavior: 'smooth' });
                                        }}
                                        className={`px-5 py-2.5 border rounded-full text-[13px] font-bold transition-all ${selectedCategories.includes(sector) ? 'bg-[#317CD7] border-[#317CD7] text-white' : 'bg-gray-50 border-gray-100 text-[#0F2E4B]/70 hover:border-[#317CD7] hover:text-[#317CD7] hover:bg-white'}`}
                                    >
                                        {sector}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className="bg-[#0F2E4B] text-white px-8 py-2.5 rounded-full font-extrabold text-[11px] uppercase tracking-widest hover:bg-[#317CD7] transition-all ml-auto"
                                >
                                    View All Sectors
                                </button>
                            </div>
                        </div>

                    </main>
                </div>
            </div>

            {/* 5. NEWSLETTER SECTION - Wide Horizontal Layout */}
            <div className="pb-24 pt-10">
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
                                    className="w-full bg-gray-50 border border-gray-100 h-[52px] pl-14 pr-6 rounded-xl focus:outline-none focus:border-[#317CD7] transition-all text-[14px] placeholder:text-gray-400"
                                />
                            </div>
                            <button className="bg-[#317CD7] hover:bg-[#2866B1] text-white px-8 h-[52px] rounded-xl font-bold uppercase tracking-widest transition-all text-[12px]">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterSection = ({ title, children }: any) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between mb-[22px] group"
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
                        <div className="pl-2 pr-5 pb-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const JobCard = ({ job, mode }: any) => {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white border border-gray-100 hover:border-[#317CD7] hover:shadow-xl hover:shadow-[#317CD7]/5 transition-all relative group ${mode === 'grid' ? 'rounded-2xl p-6' : 'rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6'
                }`}
        >
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h3
                        className="transition-all capitalize"
                        style={{
                            fontFamily: '"Poppins", sans-serif',
                            fontSize: '18px',
                            lineHeight: '32px',
                            color: '#000000',
                            fontWeight: 600
                        }}
                    >
                        {job.title}
                    </h3>
                    {job.featured && <span className="px-2 py-0.5 bg-yellow-400 text-white text-[10px] font-extrabold rounded uppercase tracking-widest">Hot</span>}
                </div>

                <div className="flex items-center gap-2 mb-4 -mt-1">
                    <span className="text-[13px] font-bold text-[#317CD7] uppercase tracking-wide">{job.company || 'Shinefiling'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">ID: 00{job.id}</span>
                </div>

                <div
                    className="flex flex-wrap items-center gap-x-6 gap-y-3 font-medium"
                    style={{
                        fontSize: '14px',
                        color: '#363636',
                        letterSpacing: '0.005em'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-300" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-300" />
                        <span>{job.experience || 'Not Specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-300" />
                        <span>{job.type || 'Full Time'}</span>
                    </div>
                    <div className={`flex items-center gap-2 font-bold ${job.expiry?.toLowerCase().includes('expired') ? 'text-red-400' : 'text-green-500'}`}>
                        <Calendar size={16} />
                        <span>{job.expiry || 'Until Deactivated'}</span>
                    </div>
                </div>
                <p
                    className="line-clamp-1 mt-4 font-medium"
                    style={{
                        fontSize: '13px',
                        color: '#000000',
                        fontStyle: 'normal'
                    }}
                >
                    {job.description?.replace(/Skills:|Responsibilities:|Overview:/g, '')}
                </p>
            </div>

            <div className={`flex flex-col items-end gap-4 ${mode === 'grid' ? 'mt-6 pt-6 border-t border-gray-50' : 'min-w-[150px]'}`}>
                <div className="text-right">
                    <div
                        style={{
                            fontFamily: '"Poppins", sans-serif',
                            fontWeight: 600,
                            fontSize: '20px',
                            color: '#000000'
                        }}
                    >
                        ₹{job.price?.toLocaleString()}
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="flex items-center gap-2 text-[#317CD7] font-bold text-[13px] uppercase tracking-widest transition-all group pb-1"
                    style={{ fontFamily: '"Poppins", sans-serif' }}
                >
                    <span className="border-b-2 border-transparent group-hover:border-[#317CD7] transition-all">
                        View More
                    </span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

const SkeletonLoader = ({ mode }: any) => (
    <div className={`bg-white border border-gray-100 rounded-xl p-8 animate-pulse ${mode === 'grid' ? 'h-[250px]' : 'h-[120px] flex items-center justify-between'}`}>
        <div className="space-y-3 flex-1">
            <div className="h-6 bg-gray-100 rounded w-1/2"></div>
            <div className="h-4 bg-gray-50 rounded w-1/3"></div>
        </div>
        <div className="w-32 h-10 bg-gray-100 rounded-lg"></div>
    </div>
);

export default BrowseJobs;
