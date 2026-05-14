import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import {
    Search, ChevronDown, ChevronUp, Star, Bookmark, Clock,
    CheckCircle2, ChevronRight, ChevronLeft, MapPin,
    Lock, Info, AlertCircle, Filter, X, Mail, Check,
    Zap, TrendingUp, Wallet, Briefcase, Calendar
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const BrowseProjects: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [locationQuery, setLocationQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedExpLevel, setSelectedExpLevel] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter logic
    const toggleFilter = (filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    // Filter States
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<string[]>(['query', 'price', 'skills', 'category', 'experience']);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    React.useEffect(() => {
        handleFilter();
    }, []);

    const handleFilter = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (locationQuery) params.append('location', locationQuery);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedExpLevel) params.append('experienceLevel', selectedExpLevel);
            if (priceRange.min) params.append('minPrice', priceRange.min);
            if (priceRange.max) params.append('maxPrice', priceRange.max);
            if (selectedSkills.length > 0) {
                selectedSkills.forEach(skill => params.append('skills', skill));
            }

            const response = await fetch(`${API_BASE_URL}/api/projects/search?${params.toString()}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(data);
            setError(null);
        } catch (err: any) {
            console.error("Error filtering projects:", err);
            setError("Could not load projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setLocationQuery('');
        setSelectedCategory('');
        setSelectedExpLevel('');
        setPriceRange({ min: '', max: '' });
        setSelectedSkills([]);
        setSelectedPaymentTypes([]);
        handleFilter();
    };

    const itemsPerPage = 25;

    // Pagination Logic
    const totalPages = Math.ceil(projects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = projects.slice(startIndex, startIndex + itemsPerPage);

    const getTimeAgo = (dateString: string) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-[80px]" style={{ fontFamily: '"Poppins", sans-serif' }}>

            {/* 1. COMPACT SEARCH HEADER */}
            <div className="bg-[#0F2E4B] py-12 flex items-center justify-center">
                {/* Search Overlay */}
                <div className="w-full max-w-[900px] px-6">
                    <div className="bg-[#1a3a5a] p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search Projects"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white h-[42px] pl-11 pr-4 rounded-lg focus:outline-none font-semibold text-[#0F2E4B] text-[14px] placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Location (Optional)"
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

            <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-4 lg:hidden">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-md font-bold text-[#0F2E4B] shadow-sm active:scale-[0.98] transition-all"
                >
                    <Filter size={18} className="text-[#317CD7]" />
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
                                    className="text-[11px] font-extrabold text-[#317CD7] uppercase tracking-wider hover:underline"
                                >
                                    Clear
                                </button>
                                <button onClick={() => setIsFilterOpen(false)} className="lg:hidden text-gray-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-0">
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

                            {/* Project Type Filter */}
                            <FilterSection
                                title="Project Type"
                                isOpen={activeFilters.includes('experience')}
                                onToggle={() => toggleFilter('experience')}
                            >
                                <div className="space-y-2.5">
                                    {['Fixed Price', 'Hourly Rate'].map(type => (
                                        <label key={type} className="flex items-center gap-3 group cursor-pointer" onClick={() => {
                                            setSelectedPaymentTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
                                        }}>
                                            <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedPaymentTypes.includes(type) ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                {selectedPaymentTypes.includes(type) && <Check size={14} strokeWidth={4} className="text-white" />}
                                            </div>
                                            <span className={`text-[14px] font-medium transition-colors ${selectedPaymentTypes.includes(type) ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Budget Filter */}
                            <FilterSection
                                title="Budget Range"
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
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded text-[13px] outline-none focus:border-[#317CD7] placeholder:text-gray-400"
                                                placeholder="₹ 0"
                                            />
                                        </div>
                                        <span className="text-gray-400 mt-5">-</span>
                                        <div className="flex-1">
                                            <label className="text-[10px] text-gray-400 font-bold uppercase mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded text-[13px] outline-none focus:border-[#317CD7] placeholder:text-gray-400"
                                                placeholder="₹ 5k+"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </FilterSection>

                            {/* Skills Filter */}
                            <FilterSection
                                title="Skills"
                                isOpen={activeFilters.includes('skills')}
                                onToggle={() => toggleFilter('skills')}
                            >
                                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {['Java', 'MySQL', 'AngularJS', 'React.js', 'Payment Gateway Integration', 'AWS Lambda', 'Flutter', 'GitHub', 'Microservices', 'Spring Boot'].map(skill => (
                                        <label key={skill} className="flex items-center gap-3 group cursor-pointer" onClick={() => {
                                            setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
                                        }}>
                                            <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedSkills.includes(skill) ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                {selectedSkills.includes(skill) && <Check size={14} strokeWidth={4} className="text-white" />}
                                            </div>
                                            <span className={`text-[14px] font-medium transition-colors ${selectedSkills.includes(skill) ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            {/* Category Filter */}
                            <FilterSection
                                title="Category"
                                isOpen={activeFilters.includes('category')}
                                onToggle={() => toggleFilter('category')}
                            >
                                <div className="space-y-2.5">
                                    {Array.from(new Set(projects.map(p => p.category).filter(Boolean))).map(cat => (
                                        <label key={cat} className="flex items-center gap-3 group cursor-pointer" onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat || '')}>
                                            <div className={`w-5 h-5 rounded-sm border-2 transition-all flex items-center justify-center ${selectedCategory === cat ? 'bg-[#317CD7] border-[#317CD7]' : 'border-gray-200 group-hover:border-[#317CD7]'}`}>
                                                {selectedCategory === cat && <Check size={14} strokeWidth={4} className="text-white" />}
                                            </div>
                                            <span className={`text-[14px] font-medium transition-colors ${selectedCategory === cat ? 'text-[#0F2E4B] font-bold' : 'text-gray-600 group-hover:text-[#0F2E4B]'}`}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>
                        </div>

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

                {/* Right Content - Project List */}
                <main className="space-y-6">
                    {/* Results Bar */}
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
                        <span className="">
                            {loading ? "Loading projects..." : `Showing results ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, projects.length)} of ${projects.length} results`}
                        </span>

                        <div className="flex flex-col xs:flex-row items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="w-8 h-4 bg-gray-200 rounded-full relative transition-colors group-hover:bg-gray-300">
                                    <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full transition-all"></div>
                                </div>
                                <span className="text-[13px] font-medium text-gray-600">Receive alerts</span>
                            </label>

                            <div className="flex items-center gap-3">
                                <span className="text-[13px] text-gray-500">Sort by</span>
                                <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-md text-[13px] font-bold cursor-pointer hover:border-[#ff0066] transition-all group whitespace-nowrap">
                                    Newest First
                                    <ChevronDown size={14} className="text-gray-400 group-hover:text-[#ff0066]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Projects Loop */}
                    <div className="space-y-1">
                        {loading ? (
                            // Loading Shimmer
                            [1, 2, 3].map(i => (
                                <div key={i} className="bg-white border-b border-gray-100 py-8 animate-pulse">
                                    <div className="h-6 bg-gray-100 rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-gray-50 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-50 rounded w-2/3"></div>
                                </div>
                            ))
                        ) : error ? (
                            <div className="py-20 text-center">
                                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                                <p className="text-gray-500">{error}</p>
                                <button onClick={handleFilter} className="mt-4 text-[#317CD7] font-bold hover:underline">Try Again</button>
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="py-20 text-center">
                                <Search className="mx-auto text-gray-200 mb-4" size={48} />
                                <p className="text-gray-500">No projects found matching your search.</p>
                            </div>
                        ) : (
                            paginatedProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-100 hover:border-[#317CD7] hover:shadow-xl hover:shadow-[#317CD7]/5 transition-all relative group rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
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
                                                {project.title}
                                            </h3>
                                            {project.featured && <span className="px-2 py-0.5 bg-yellow-400 text-white text-[10px] font-extrabold rounded uppercase tracking-widest">Hot</span>}
                                        </div>

                                        <div className="flex items-center gap-2 mb-4 -mt-1">
                                            <span className="text-[13px] font-bold text-[#317CD7] uppercase tracking-wide">Shinefiling Project</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">ID: PR-00{project.id}</span>
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
                                                <span>{project.client?.location || 'Remote'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase size={16} className="text-gray-300" />
                                                <span>{project.experienceLevel || 'All Levels'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-gray-300" />
                                                <span>{project.paymentType || 'Fixed Price'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[#317CD7] font-bold">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                <span>{project.bidCount || 0} Proposals</span>
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
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-4 min-w-[150px]">
                                        <div className="text-right">
                                            <div
                                                style={{
                                                    fontFamily: '"Poppins", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '20px',
                                                    color: '#000000'
                                                }}
                                            >
                                                ₹{project.budgetAmount?.toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/projects/${project.id}`)}
                                            className="flex items-center gap-2 text-[#317CD7] font-bold text-[13px] uppercase tracking-widest transition-all group pb-1"
                                            style={{ fontFamily: '"Poppins", sans-serif' }}
                                        >
                                            <span className="border-b-2 border-transparent group-hover:border-[#317CD7] transition-all">
                                                View Details
                                            </span>
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Pagination - Only show if count > 25 */}
                    {projects.length > itemsPerPage && (
                        <div className="flex items-center justify-center gap-2 mt-12 py-8 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.max(1, prev - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className={`p-2 transition-all ${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-[#ff0066]'}`}
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && array[index - 1] !== page - 1 && (
                                            <span className="text-gray-400">...</span>
                                        )}
                                        <button
                                            onClick={() => {
                                                setCurrentPage(page);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`w-10 h-10 rounded-md text-[14px] font-extrabold transition-all ${page === currentPage ? 'bg-[#317CD7] text-white shadow-lg shadow-[#317CD7]/20' : 'bg-white border border-gray-100 text-[#0F2E4B] hover:border-[#317CD7] hover:text-[#317CD7]'}`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))
                            }

                            <button
                                onClick={() => {
                                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className={`p-2 transition-all ${currentPage === totalPages || totalPages === 0 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-[#ff0066]'}`}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </main>
            </div>


            {/* Newsletter Section */}
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

export default BrowseProjects;
