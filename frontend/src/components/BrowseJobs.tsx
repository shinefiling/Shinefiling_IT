import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import {
    Search, Filter,
    Heart, ChevronDown, Bell, CheckCircle, MapPin, Briefcase, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrowseJobs: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<any[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState(1000000);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [activeFilters, setActiveFilters] = useState<string[]>(['keyword', 'categories', 'type', 'location', 'experience', 'skills', 'date', 'price']);

    const toggleFilter = (filter: string) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    React.useEffect(() => {
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

    const handleFilter = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('query', searchQuery);
            if (selectedCategories.length > 0) {
                selectedCategories.forEach(cat => params.append('categories', cat));
            }
            if (selectedLevels.length > 0) {
                selectedLevels.forEach(lvl => params.append('englishLevels', lvl));
            }
            if (priceRange < 1000000) params.append('maxPrice', priceRange.toString());

            const response = await fetch(`http://localhost:8080/api/jobs/search?${params.toString()}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                setFilteredJobs(data);
            }
        } catch (err) {
            console.error("Error filtering jobs:", err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setPriceRange(1000000);
        setSelectedCategories([]);
        setSelectedLevels([]);
        setFilteredJobs(jobs);
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleLevel = (lvl: string) => {
        setSelectedLevels(prev =>
            prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]
        );
    };

    return (
        <div className="min-h-screen bg-[#fdfaf0] pt-[150px] pb-20 font-['Poppins']">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
                <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-8">

                    {/* Left Sidebar - Filters */}
                    <aside className="space-y-6 font-['Poppins']">
                        <div className="bg-white rounded-none p-0 shadow-sm border border-[#eee]">
                            <div className="px-6 py-5 border-b border-[#eee] flex items-center justify-between">
                                <h3 className="font-bold text-[#242424] flex items-center gap-2 font-['Poppins']">
                                    <Filter size={18} className="text-primary" />
                                    Search Filters
                                </h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-[11px] font-bold text-primary hover:underline uppercase font-['Poppins']"
                                >
                                    Clear Result
                                </button>
                            </div>

                            <FilterSection title="Search by Keyword" isOpen={activeFilters.includes('keyword')} onToggle={() => toggleFilter('keyword')}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="What are you looking for"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-[#f9fafb] border border-[#eee] rounded-none text-sm focus:outline-none focus:border-primary font-['Poppins']"
                                    />
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
                                </div>
                            </FilterSection>

                            <FilterSection title="Category" isOpen={activeFilters.includes('categories')} onToggle={() => toggleFilter('categories')}>
                                <div className="space-y-3">
                                    {["Development", "Design", "Marketing", "Writing", "Admin Support"].map(cat => (
                                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                                            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${selectedCategories.includes(cat) ? 'border-primary bg-primary' : 'border-gray-200 group-hover:border-primary'}`}>
                                                {selectedCategories.includes(cat) && <div className="w-1.5 h-1.5 bg-white"></div>}
                                            </div>
                                            <span className={`text-[13px] ${selectedCategories.includes(cat) ? 'text-primary font-bold' : 'text-gray-500'}`}>{cat}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Job Type" isOpen={activeFilters.includes('type')} onToggle={() => toggleFilter('type')}>
                                <div className="space-y-3">
                                    {["Full Time", "Part Time", "Contract", "Freelance"].map(type => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="hidden" />
                                            <div className="w-4 h-4 border border-gray-200 group-hover:border-primary flex items-center justify-center"></div>
                                            <span className="text-[13px] text-gray-500 group-hover:text-primary transition-colors">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Location Type" isOpen={activeFilters.includes('location')} onToggle={() => toggleFilter('location')}>
                                <div className="space-y-3">
                                    {["Remote", "On-site", "Hybrid"].map(loc => (
                                        <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="hidden" />
                                            <div className="w-4 h-4 border border-gray-200 group-hover:border-primary flex items-center justify-center"></div>
                                            <span className="text-[13px] text-gray-500 group-hover:text-primary transition-colors">{loc}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Experience Level" isOpen={activeFilters.includes('experience')} onToggle={() => toggleFilter('experience')}>
                                <div className="space-y-3">
                                    {["Fresher", "Intermediate", "Senior", "Lead"].map(lvl => (
                                        <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedLevels.includes(lvl)}
                                                onChange={() => toggleLevel(lvl)}
                                            />
                                            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${selectedLevels.includes(lvl) ? 'border-primary bg-primary' : 'border-gray-200 group-hover:border-primary'}`}>
                                                {selectedLevels.includes(lvl) && <div className="w-1.5 h-1.5 bg-white"></div>}
                                            </div>
                                            <span className={`text-[13px] ${selectedLevels.includes(lvl) ? 'text-primary font-bold' : 'text-gray-500'}`}>{lvl}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Top Skills" isOpen={activeFilters.includes('skills')} onToggle={() => toggleFilter('skills')}>
                                <div className="flex flex-wrap gap-2">
                                    {["React", "Node.js", "Java", "Python", "Figma", "AWS"].map(skill => (
                                        <button key={skill} className="px-3 py-1.5 border border-gray-100 text-[11px] font-bold text-gray-500 hover:border-primary hover:text-primary transition-all rounded-none">
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Date Posted" isOpen={activeFilters.includes('date')} onToggle={() => toggleFilter('date')}>
                                <div className="space-y-3">
                                    {["Last 24 Hours", "Last 7 Days", "Last 30 Days", "Any Time"].map(date => (
                                        <label key={date} className="flex items-center gap-3 cursor-pointer group">
                                            <input type="radio" name="date_posted" className="accent-primary" />
                                            <span className="text-[13px] text-gray-500">{date}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Price Range" isOpen={activeFilters.includes('price')} onToggle={() => toggleFilter('price')}>
                                <input type="range" min="0" max="1000000" value={priceRange} onChange={(e) => setPriceRange(parseInt(e.target.value))} className="w-full accent-primary h-1.5 bg-gray-200 cursor-pointer mb-4" />
                                <div className="flex items-center justify-between gap-4">
                                    <div className="bg-[#f9fafb] border border-[#eee] px-4 py-2 text-[13px] font-bold">₹0</div>
                                    <div className="bg-[#f9fafb] border border-[#eee] px-4 py-2 text-[13px] font-bold font-['Poppins']">₹{priceRange.toLocaleString()}</div>
                                </div>
                            </FilterSection>

                            <div className="p-6 border-t border-[#eee]">
                                <button onClick={handleFilter} className="w-full bg-primary text-white py-4 rounded-none font-bold text-sm hover:bg-[#a11f27] transition-all shadow-lg shadow-primary/10 uppercase tracking-wide">
                                    Apply All Filters
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Content - Job List */}
                    <main className="space-y-6 font-['Poppins']">
                        {/* Results Bar */}
                        <div className="bg-white rounded-none px-6 py-4 shadow-sm border border-[#eee] flex items-center justify-between">
                            <span className="text-sm font-bold text-[#242424] font-['Poppins']">Found {filteredJobs.length} Results</span>
                            <div className="flex items-center gap-3 font-['Poppins']">
                                <span className="text-[12px] text-[#888] font-medium">Sort by</span>
                                <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#eee] px-4 py-2 rounded-none text-sm font-bold cursor-pointer hover:border-[#b5242c] transition-all">
                                    Newest First
                                    <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>

                        {/* Job Alerts Banner */}
                        <div className="bg-white rounded-none px-6 py-6 shadow-sm border border-[#eee] flex flex-col md:flex-row items-center justify-between gap-6 font-['Poppins']">
                            <div>
                                <h4 className="font-bold text-[#242424] mb-1 font-['Poppins']">Job alerts</h4>
                                <p className="text-[12px] text-[#888] font-['Poppins']">Receive emails for the latest jobs matching your search criteria</p>
                            </div>
                            <button className="bg-primary text-white px-8 py-3 rounded-none font-bold text-[13px] hover:bg-[#a11f27] transition-all flex items-center gap-2 font-['Poppins']">
                                <Bell size={16} />
                                Job Alerts
                            </button>
                        </div>

                        {/* Jobs Loop */}
                        <div className="space-y-6">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="bg-white rounded-none shadow-sm border border-[#eee] p-8 animate-pulse">
                                        <div className="h-6 bg-gray-100 rounded w-1/2 mb-4"></div>
                                        <div className="h-4 bg-gray-50 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-50 rounded w-2/3"></div>
                                    </div>
                                ))
                            ) : filteredJobs.length === 0 ? (
                                <div className="bg-white rounded-none shadow-sm border border-[#eee] p-20 text-center">
                                    <Search size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-500 font-medium">No jobs found matching your criteria.</p>
                                </div>
                            ) : (
                                filteredJobs.map((job) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="bg-white rounded-none shadow-sm border border-[#eee] overflow-hidden group hover:border-primary transition-all relative min-h-[180px] flex flex-col p-2"
                                    >
                                        {/* Featured Ribbon Corner */}
                                        {job.featured && (
                                            <div className="absolute top-0 left-0 w-10 h-10 overflow-hidden z-20">
                                                <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-t-[#b5242c] border-r-[40px] border-r-transparent"></div>
                                                <CheckCircle size={12} className="absolute top-1.5 left-1.5 text-white" />
                                            </div>
                                        )}

                                        <div className="pt-5 px-3 pb-3 flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-1">
                                                <div className="flex-1">
                                                    <h3 className="text-[19px] font-bold text-[#242424] group-hover:text-[#b5242c] transition-colors leading-[24px] mb-2 font-['Poppins'] tracking-tight capitalize">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mb-2 text-[13px] text-gray-500 font-medium">
                                                        <div className="flex items-center gap-1.5">
                                                            <Briefcase size={14} className="text-gray-400" />
                                                            <span className="capitalize">{job.role || job.company}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin size={14} className="text-gray-400" />
                                                            <span className="capitalize">{job.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={14} className="text-gray-400" />
                                                            <span className="capitalize">{job.type}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-600 rounded-none text-[11px] font-bold border border-green-100 capitalize">
                                                            <span>{job.experience || 'Fresher'}</span>
                                                        </div>
                                                    </div>

                                                    {job.description && (
                                                        <p className="text-[13px] text-gray-500 line-clamp-2 mb-2 leading-snug">
                                                            {job.description}
                                                        </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.tags?.slice(0, 5).map((tag: string) => (
                                                            <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-none border border-gray-100 hover:border-primary/30 transition-all font-['Poppins'] capitalize">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className="text-[18px] font-bold text-[#242424] font-['Poppins']">
                                                        ₹{job.price?.toLocaleString('en-IN')}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Salary</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* fr-right-information */}
                                        <div className="px-3 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                            <div className="flex items-center gap-6">
                                                <div className="text-[12px] text-gray-500">
                                                    <span className="font-bold text-[#242424]">{job.proposals}</span> applications
                                                </div>
                                                <div className="text-[12px] text-gray-500">
                                                    Expires in <span className="font-bold text-[#242424]">{job.expiry}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-none transition-all border border-gray-100">
                                                    <Heart size={18} />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                                    className="bg-primary text-white px-8 py-2.5 rounded-none font-bold text-[13px] hover:bg-[#a11f27] transition-all font-['Poppins'] shadow-sm shadow-primary/20 uppercase tracking-wider"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Bottom Banner */}
                        <div className="bg-[#242424] p-8 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary  transition-transform  opacity-10"></div>
                            <h3 className="text-white text-xl font-bold mb-4 relative z-10 font-['Poppins']">Hire expert & get your any job done</h3>
                            <button
                                onClick={() => navigate('/post-job')}
                                className="bg-primary text-white px-10 py-3 font-bold text-sm relative z-10 hover:scale-105 transition-transform font-['Poppins']"
                            >
                                Post A Job
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

const FilterSection = ({ title, children, isOpen, onToggle }: any) => (
    <div className="border-t border-[#eee]">
        <button
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between group bg-white hover:bg-gray-50/50 transition-colors"
        >
            <h4 className="text-[14px] font-bold text-[#242424] group-hover:text-primary transition-colors">{title}</h4>
            <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                <ChevronDown size={18} className="text-gray-400 group-hover:text-primary" />
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div className="px-6 pb-6 pt-0">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export default BrowseJobs;
