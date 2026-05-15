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

    React.useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/login');
        }
    }, [navigate]);
    
    const [formData, setFormData] = useState({
        title: '',
        overview: '',
        skills: '',
        responsibilities: '',
        company: '',
        price: '',
        type: 'Fixed',
        location: 'Remote',
        expiry: '30 Days',
        experience: 'Fresher',
        role: ''
    });



    const handlePostJob = async () => {
        const missingFields = [];
        if (!formData.title?.trim()) missingFields.push("Title");
        if (!formData.company?.trim()) missingFields.push("Company");
        if (!formData.price) missingFields.push("Price");
        if (!formData.overview?.trim()) missingFields.push("Overview");

        if (missingFields.length > 0) {
            setError(`${missingFields.join(", ")} ${missingFields.length > 1 ? "are" : "is"} required.`);
            return;
        }

        const structuredDescription = `
${formData.overview}

Skills:
${formData.skills}

Responsibilities:
${formData.responsibilities}
        `.trim();

        setIsLoading(true);
        setError(null);
        try {
            // Construct a clean payload matching the Job entity
            const jobPayload = {
                title: formData.title,
                description: structuredDescription,
                company: formData.company,
                price: parseFloat(formData.price),
                type: formData.type,
                location: formData.location,
                experience: formData.experience,
                role: formData.role,
                featured: true,
                proposals: "0 Received",
                expiry: "Until Deactivated",
                userEmail: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).email : null
            };

            const response = await fetch(`${API_BASE_URL}/api/jobs`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(jobPayload)
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
                    <h1 className="text-[32px] font-bold text-[#0F2E4B] tracking-tight mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Post a <span className="text-[#317CD7]">New Job</span></h1>
                    <p className="text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>Find the best talent for your company by posting a job opening.</p>
                </div>

                <div className="bg-white rounded-md border border-[#eee] p-8 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Job Title</label>
                            <input 
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="e.g. Senior Frontend Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Company Name</label>
                            <input 
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="e.g. Tech Solutions Inc"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Location</label>
                            <input 
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="e.g. Remote, Bangalore"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Salary (₹)</label>
                            <div className="relative">
                                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full pl-10 pr-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all text-[15px] font-medium text-[rgb(33,33,33)]"
                                    style={{ lineHeight: '26px' }}
                                    placeholder="e.g. 50000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Job Role</label>
                            <input 
                                type="text"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="e.g. Frontend Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Experience Required</label>
                            <select 
                                value={formData.experience}
                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all appearance-none text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                            >
                                <option value="Fresher">Fresher</option>
                                <option value="1-3 Years">1-3 Years</option>
                                <option value="3-5 Years">3-5 Years</option>
                                <option value="5+ Years">5+ Years</option>
                                <option value="Expert">Expert / Lead</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Job Type</label>
                            <select 
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all appearance-none text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                            >
                                <option value="Fixed">Fixed Price</option>
                                <option value="Hourly">Hourly Rate</option>
                                <option value="Full Time">Full Time</option>
                            </select>
                        </div>
                    </div>



                    <div className="space-y-6">
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Job Overview</label>
                            <textarea 
                                value={formData.overview}
                                onChange={(e) => setFormData({...formData, overview: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all min-h-[120px] resize-none text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="A fantastic opportunity for a highly motivated individual..."
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Skills Required</label>
                            <textarea 
                                value={formData.skills}
                                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all min-h-[100px] resize-none text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="e.g. 3-5 years experience, HTML/CSS, React..."
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-bold text-[rgb(33,33,33)] mb-2 tracking-tight" style={{ lineHeight: '22.4px' }}>Responsibilities</label>
                            <textarea 
                                value={formData.responsibilities}
                                onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                                className="w-full px-5 py-3 bg-[#f9fafb] border border-[#eee] rounded-md focus:border-[#317CD7] outline-none transition-all min-h-[100px] resize-none text-[15px] font-medium text-[rgb(33,33,33)]"
                                style={{ lineHeight: '26px' }}
                                placeholder="e.g. Developing UI, maintaining code, team collaboration..."
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-md flex items-center gap-3 text-red-600 text-sm font-medium animate-shake">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <button 
                        onClick={handlePostJob}
                        disabled={isLoading}
                        className="w-full py-4 bg-[#317CD7] text-white rounded-md font-bold text-lg hover:shadow-lg hover:shadow-[#317CD7]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (isSuccess ? "Job Posted Successfully!" : "Publish Job Opening")}
                        {!isLoading && !isSuccess && <ArrowRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default PostJob;
