import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { 
    Search, ChevronDown, ChevronUp, Star, Bookmark, Clock, 
    CheckCircle2, ChevronRight, ChevronLeft, MapPin,
    Lock, Info, AlertCircle, Filter, X
} from 'lucide-react';

const BrowseProjects: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Filter States
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    React.useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/projects/all`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(data);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching projects:", err);
            setError("Could not load projects. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesSkills = selectedSkills.length === 0 || 
                             selectedSkills.some(s => project.skills?.includes(s));
        
        const matchesPrice = (!priceRange.min || project.budgetAmount >= parseFloat(priceRange.min)) &&
                            (!priceRange.max || project.budgetAmount <= parseFloat(priceRange.max));

        const matchesPaymentType = selectedPaymentTypes.length === 0 || 
                                  selectedPaymentTypes.includes(project.paymentType === 'fixed' ? 'Fixed Price' : 'Hourly Rate');

        return matchesSearch && matchesSkills && matchesPrice && matchesPaymentType;
    });

    const itemsPerPage = 25;

    // Pagination Logic
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="min-h-screen bg-[#fdfaf0] pt-[80px]">
            
            {/* Top Search Section (Dark) */}
            <div className="bg-[#1e2329] py-12 text-white">
                <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                    <div className="max-w-[1000px] mx-auto">
                        <div className="flex flex-col gap-6">
                            <h1 className="text-[30px] font-bold tracking-tight">Browse</h1>
                            
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff0066] transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Search for projects"
                                        className="w-full bg-white text-[#242424] pl-12 pr-4 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff0066]/50 transition-all font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <button className="bg-[#ff0066] hover:bg-[#e0005a] text-white px-10 py-3.5 rounded-md font-bold transition-all shadow-lg shadow-[#ff0066]/20">
                                    Save
                                </button>
                            </div>
                            
                            <button className="text-[13px] text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors w-fit">
                                Show advanced options <ChevronDown size={14} />
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-4 lg:hidden">
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-md font-bold text-[#242424] shadow-sm active:scale-[0.98] transition-all"
                >
                    <Filter size={18} className="text-[#ff0066]" />
                    Search Filters
                </button>
            </div>

            <div className="max-w-[1320px] mx-auto px-4 lg:px-8 py-10">
                <div className="flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-6">
                    
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
                        <div className="bg-white p-6 lg:rounded-md lg:border lg:border-gray-100 lg:shadow-sm min-h-full">
                            <div className="flex items-center justify-between mb-6 lg:mb-8">
                                <h3 className="text-[18px] font-bold text-[#242424] tracking-tight flex items-center gap-2">
                                    <Filter size={18} className="text-[#ff0066]" />
                                    Search Filters
                                </h3>
                                <button onClick={() => setIsFilterOpen(false)} className="lg:hidden text-gray-400 hover:text-black">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">

                            {/* Project Type */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Project type</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={selectedPaymentTypes.includes('Hourly Rate')}
                                            onChange={(e) => {
                                                const type = 'Hourly Rate';
                                                setSelectedPaymentTypes(prev => e.target.checked ? [...prev, type] : prev.filter(t => t !== type));
                                            }}
                                        />
                                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${selectedPaymentTypes.includes('Hourly Rate') ? 'bg-[#ff0066] border-[#ff0066]' : 'border-gray-300 group-hover:border-[#ff0066]'}`}>
                                            {selectedPaymentTypes.includes('Hourly Rate') && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className="text-[13px] text-[#555] tracking-tight">Hourly Rate</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <input 
                                            type="checkbox" 
                                            className="hidden" 
                                            checked={selectedPaymentTypes.includes('Fixed Price')}
                                            onChange={(e) => {
                                                const type = 'Fixed Price';
                                                setSelectedPaymentTypes(prev => e.target.checked ? [...prev, type] : prev.filter(t => t !== type));
                                            }}
                                        />
                                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${selectedPaymentTypes.includes('Fixed Price') ? 'bg-[#ff0066] border-[#ff0066]' : 'border-gray-300 group-hover:border-[#ff0066]'}`}>
                                            {selectedPaymentTypes.includes('Fixed Price') && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className="text-[13px] text-[#242424] font-medium tracking-tight">Fixed Price</span>
                                    </label>
                                </div>
                            </div>

                            {/* Fixed Price */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Fixed price</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[11px] text-gray-400 font-bold uppercase">min</span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-8 border-r border-gray-100 flex items-center justify-center text-gray-400 text-[11px] font-bold">₹</div>
                                            <input 
                                                type="text" 
                                                placeholder="0" 
                                                className="w-full pl-10 pr-16 py-2 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#ff0066]" 
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            />
                                            <div className="absolute inset-y-0 right-0 px-3 flex items-center gap-1 border-l border-gray-100 text-gray-400 text-[11px] font-bold uppercase">
                                                INR
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[11px] text-gray-400 font-bold uppercase">max</span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-8 border-r border-gray-100 flex items-center justify-center text-gray-400 text-[11px] font-bold">₹</div>
                                            <input 
                                                type="text" 
                                                placeholder="1500+" 
                                                className="w-full pl-10 pr-16 py-2 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#ff0066]" 
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            />
                                            <div className="absolute inset-y-0 right-0 px-3 flex items-center gap-1 border-l border-gray-100 text-gray-400 text-[11px] font-bold uppercase">
                                                INR
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hourly Rate */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Hourly rate</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[11px] text-gray-400 font-bold uppercase">min</span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-8 border-r border-gray-100 flex items-center justify-center text-gray-400 text-[11px] font-bold">₹</div>
                                            <input type="text" placeholder="0" className="w-full pl-10 pr-16 py-2 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#ff0066]" />
                                            <div className="absolute inset-y-0 right-0 px-3 flex items-center gap-1 border-l border-gray-100 text-gray-400 text-[11px] font-bold uppercase">
                                                INR
                                                <div className="flex flex-col scale-75 opacity-50">
                                                    <ChevronUp size={10} />
                                                    <ChevronDown size={10} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[11px] text-gray-400 font-bold uppercase">max</span>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-8 border-r border-gray-100 flex items-center justify-center text-gray-400 text-[11px] font-bold">₹</div>
                                            <input type="text" placeholder="80+" className="w-full pl-10 pr-16 py-2 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#ff0066]" />
                                            <div className="absolute inset-y-0 right-0 px-3 flex items-center gap-1 border-l border-gray-100 text-gray-400 text-[11px] font-bold uppercase">
                                                INR
                                                <div className="flex flex-col scale-75 opacity-50">
                                                    <ChevronUp size={10} />
                                                    <ChevronDown size={10} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Skills</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="relative mb-4">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        type="text" 
                                        placeholder="Search skills" 
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-[12px] focus:outline-none focus:border-[#ff0066] shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                                    {['Java', 'MySQL', 'AngularJS', 'React.js', 'Payment Gateway Integration', 'AWS Lambda', 'Flutter', 'GitHub', 'Microservices', 'Spring Boot'].map((skill) => (
                                        <label key={skill} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input 
                                                type="checkbox" 
                                                className="hidden" 
                                                checked={selectedSkills.includes(skill)}
                                                onChange={(e) => {
                                                    setSelectedSkills(prev => e.target.checked ? [...prev, skill] : prev.filter(s => s !== skill));
                                                }}
                                            />
                                            <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all ${selectedSkills.includes(skill) ? 'bg-[#ff0066] border-[#ff0066]' : 'border-gray-300 group-hover:border-[#ff0066]'}`}>
                                                {selectedSkills.includes(skill) && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                            <span className={`text-[12px] tracking-tight ${selectedSkills.includes(skill) ? 'text-[#242424] font-medium' : 'text-[#555]'}`}>{skill}</span>
                                        </label>
                                    ))}
                                </div>
                                <button className="text-[12px] text-[#0066ff] font-bold mt-4 hover:underline block w-full text-center">View all (12)</button>
                            </div>

                            {/* Listing Type */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Listing type</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="space-y-2.5">
                                    {['Featured', 'Sealed', 'NDA', 'Urgent', 'Recruiter', 'IP Agreement'].map(type => (
                                        <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input type="checkbox" className="hidden" />
                                            <div className="w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-[#ff0066] transition-all">
                                                <div className="w-2.5 h-2.5 bg-[#ff0066] rounded-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                            </div>
                                            <span className="text-[13px] text-[#555] tracking-tight">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Project Location */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Project location</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="relative">
                                    <input type="text" placeholder="Enter a location" className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#ff0066]" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-50 text-[#242424] border border-gray-200">
                                        <MapPin size={12} className="fill-[#242424]/10" />
                                    </div>
                                </div>
                            </div>

                            {/* Client's Country */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Client's country</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input type="text" placeholder="Search countries" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-[#ff0066]" />
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="mb-0">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-[13px] font-bold text-[#242424] tracking-tight">Languages</label>
                                    <button className="text-[11px] font-medium text-[#0066ff] hover:underline">Clear</button>
                                </div>
                                <div className="relative mb-3">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input type="text" placeholder="Search languages" className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-[#ff0066]" />
                                </div>
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <input type="checkbox" className="hidden" defaultChecked />
                                    <div className="w-4 h-4 border border-[#ff0066] bg-[#ff0066] rounded-sm flex items-center justify-center transition-all shadow-sm">
                                        <CheckCircle2 size={12} className="text-white" />
                                    </div>
                                    <span className="text-[13px] text-[#242424] font-medium tracking-tight">English</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                    {/* Right Content - Project List */}
                    <main className="space-y-6">
                        {/* Results Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
                            <span className="text-[14px] font-medium text-gray-500">
                                {loading ? "Loading projects..." : `Top results ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredProjects.length)} of ${filteredProjects.length} results`}
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
                                [1,2,3].map(i => (
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
                                    <button onClick={fetchProjects} className="mt-4 text-[#ff0066] font-bold hover:underline">Try Again</button>
                                </div>
                            ) : filteredProjects.length === 0 ? (
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
                                        className="bg-white rounded-md p-4 border border-[#f0f0f0] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition-all relative mb-3 group"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-3">
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                                                    <h3 
                                                        onClick={() => navigate(`/projects/${project.id}`)}
                                                        className="text-[17px] font-bold text-[#242424] hover:text-[#0066ff] cursor-pointer tracking-tight leading-tight break-words flex-1"
                                                    >
                                                        {project.title}
                                                    </h3>
                                                    <div className="text-left sm:text-right shrink-0">
                                                        <div className="text-[15px] font-bold text-[#242424]">{project.bidCount || 0} bids</div>
                                                        <div className="text-[14px] font-bold text-[#242424] mt-0.5">
                                                            ₹{project.budgetAmount?.toLocaleString('en-IN')}
                                                        </div>
                                                        <div className="text-[9px] text-gray-400 font-medium uppercase tracking-wider">average bid</div>
                                                    </div>
                                                </div>

                                                <div className="text-[12px] font-bold text-[#242424] mb-1 uppercase">
                                                    Budget INR {project.budgetAmount?.toLocaleString('en-IN')}
                                                    <span className="ml-2 text-gray-400 font-medium lowercase">({project.paymentType || 'Fixed'})</span>
                                                </div>
                                                
                                                <p className="text-[14px] text-[#555555] leading-[22px] tracking-tight mb-2 line-clamp-2">
                                                    {project.description}
                                                </p>

                                                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                                                    {project.skills?.map((skill: string) => (
                                                        <span key={skill} className="text-[13px] text-[#0066ff] hover:underline cursor-pointer font-medium tracking-tight">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {[1,2,3,4,5].map(star => (
                                                            <Star 
                                                                key={star} 
                                                                size={12} 
                                                                className="text-gray-200 fill-gray-200" 
                                                            />
                                                        ))}
                                                        <span className="text-[12px] font-bold text-[#242424] ml-1">0.0</span>
                                                        <span className="text-[12px] text-gray-400 ml-1">
                                                            <Info size={12} className="inline mr-1" />
                                                            0
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-[12px] font-medium shrink-0">
                                                        <Clock size={12} />
                                                        {getTimeAgo(project.postedAt)}
                                                    </div>

                                                    <button className="p-1.5 text-gray-300 hover:text-[#ff0066] transition-colors ml-auto">
                                                        <Bookmark size={16} />
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex gap-2">
                                                        {project.upgrades?.includes('urgent') && <span className="px-2 py-0.5 bg-[#ff0066] text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter shadow-sm">Urgent</span>}
                                                        {project.upgrades?.includes('featured') && <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter">Featured</span>}
                                                        {project.upgrades?.includes('nda') && <span className="px-2 py-0.5 bg-gray-800 text-white text-[10px] font-bold rounded-sm uppercase tracking-tighter flex items-center gap-1"><Lock size={8} /> NDA</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Pagination - Only show if count > 25 */}
                        {filteredProjects.length > itemsPerPage && (
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
                                                className={`w-10 h-10 rounded-md text-[14px] font-bold transition-all ${page === currentPage ? 'bg-[#ff0066] text-white shadow-lg shadow-[#ff0066]/20' : 'bg-white border border-gray-100 text-[#555] hover:border-[#ff0066] hover:text-[#ff0066]'}`}
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
            </div>
        </div>
    );
};

export default BrowseProjects;
