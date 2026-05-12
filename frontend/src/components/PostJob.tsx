import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { 
    Briefcase, Tag, FileText, ChevronRight, 
    Check, MapPin, Users, Plus, X, Clock, 
    CheckCircle2, ArrowRight, Loader2, IndianRupee, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostJob: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        price: '',
        type: 'Fixed',
        tags: [] as string[],
        currentTag: '',
        location: 'Remote',
        expiry: '30 Days',
        experience: 'Fresher',
        role: ''
    });

    const suggestedTags = ['React', 'Java', 'Python', 'UI/UX', 'Cloud'];

    const addTag = (tag: string) => {
        if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
            setFormData(prev => ({ ...prev, tags: [...prev.tags, tag], currentTag: '' }));
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const handlePostJob = async () => {
        if (!formData.title || !formData.company || !formData.price || !formData.description) {
            setError("All fields are required.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/jobs`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    featured: true,
                    proposals: "0 Received",
                    expiry: "30 Days",
                    userEmail: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : null
                })
            });
            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => navigate('/jobs'), 2000);
            } else {
                const errData = await response.text();
                setError(`Post failed: ${response.status} ${response.statusText}. ${errData.slice(0, 50)}`);
            }
        } catch (error) {
            setError("Connection error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-[140px] pb-12 px-4 font-['Poppins']">
            <div className="max-w-[720px] mx-auto">
                <div className="mb-10">
                    <h1 className="text-[32px] font-bold text-[#242424] tracking-tight mb-2">Post a <span className="text-primary">New Job</span></h1>
                    <p className="text-gray-500">Find the best talent for your company by posting a job opening.</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#eee] p-8 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Job Title</label>
                            <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all"
                                placeholder="e.g. Senior Frontend Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Company Name</label>
                            <input 
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all"
                                placeholder="e.g. Tech Solutions Inc"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Location</label>
                            <input 
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all"
                                placeholder="e.g. Remote, Bangalore"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Salary (₹)</label>
                            <div className="relative">
                                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full pl-10 pr-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all"
                                    placeholder="e.g. 50000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Job Role</label>
                            <input 
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all"
                                placeholder="e.g. Frontend Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Experience Required</label>
                            <select 
                                value={formData.experience}
                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all appearance-none"
                            >
                                <option value="Fresher">Fresher</option>
                                <option value="1-3 Years">1-3 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                                <option value="Expert">Expert / Lead</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Job Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all appearance-none"
                            >
                                <option value="Fixed">Fixed Price</option>
                                <option value="Hourly">Hourly Rate</option>
                                <option value="Full Time">Full Time</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Skills / Tags (Max 5)</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {formData.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold flex items-center gap-2 border border-primary/20">
                                    {tag}
                                    <button 
                                        onClick={(e) => { e.preventDefault(); removeTag(tag); }}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text"
                                    value={formData.currentTag}
                                    onChange={(e) => setFormData({...formData, currentTag: e.target.value})}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag(formData.currentTag);
                                        }
                                    }}
                                    className="w-full pl-10 pr-4 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all"
                                    placeholder="e.g. Java, React, Python..."
                                />
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); addTag(formData.currentTag); }}
                                className="px-6 bg-gray-100 text-[#444] rounded-xl font-bold text-sm hover:bg-gray-200 transition-all border border-[#ddd]"
                            >
                                Add Skill
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[14px] font-bold text-[#242424] mb-2 uppercase tracking-wider opacity-60">Job Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-xl focus:border-primary outline-none transition-all min-h-[150px] resize-none"
                            placeholder="Describe the job requirements and responsibilities..."
                        />
                    </div>

                    <button 
                        onClick={handlePostJob}
                        disabled={isLoading}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (isSuccess ? "Job Posted!" : "Publish Job Opening")}
                        {!isLoading && !isSuccess && <ArrowRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
