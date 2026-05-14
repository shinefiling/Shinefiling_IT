import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { 
    Upload, Briefcase, Tag, FileText, ChevronRight, 
    ChevronLeft, Check, MapPin, Users, Eye, Shield, CreditCard,
    Plus, X, Clock, Info, Trophy, UserPlus, Lock, FileCheck, Star, AlertCircle,
    CheckCircle2, ArrowRight, Zap, Target, Loader2, IndianRupee
} from 'lucide-react';

const PostProject: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        role: '',
        experienceLevel: 'intermediate',
        category: 'Web Development',
        skills: [] as string[],
        currentSkill: '',
        paymentType: 'fixed',
        currency: 'INR',
        budgetAmount: '',
        duration: '1-3 months',
        projectType: 'standard'
    });

    const suggestedSkills = ['Web Development', 'Web Design', 'UI / User Interface', 'UX / User Experience', 'CSS'];
    const budgetRanges = ['₹600 - 1,500', '₹1,500 - 12,500', '₹12.5k - 37.5k', '₹37.5k - 75k', '₹75k - 150k'];
    const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD'];

    const addSkill = (skill: string) => {
        if (skill && !formData.skills.includes(skill) && formData.skills.length < 10) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skill], currentSkill: '' }));
        }
    };

    const removeSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handlePostProject = async () => {
        // Validation
        if (!formData.title.trim()) { setError("Project title is required"); return; }
        if (!formData.role.trim()) { setError("Primary role is required"); return; }
        if (!formData.description.trim()) { setError("Project description is required"); return; }
        if (formData.description.length < 50) { setError("Description must be at least 50 characters"); return; }
        if (formData.skills.length === 0) { setError("Please add at least one skill"); return; }
        if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) { setError("Please enter a valid budget amount"); return; }

        setIsLoading(true);
        setError(null);
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setError("Please login to post a project.");
                setIsLoading(false);
                return;
            }
            const user = JSON.parse(userStr);
            const userId = user.id || user.userId;

            const payload = {
                ...formData,
                budgetAmount: formData.budgetAmount ? parseFloat(formData.budgetAmount) : 0,
                client: { id: userId }
            };

            const response = await fetch(`${API_BASE_URL}/api/projects/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                setError("Failed to post project. Please try again.");
            }
        } catch (error) {
            console.error('Error posting project:', error);
            setError("A connection error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-[120px] pb-12 px-4 font-['Poppins'] selection:bg-[#317CD7]/10 tracking-tight relative">
            {/* Error Notification Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, x: 50, y: -20 }}
                        className="fixed top-24 right-6 z-[10000] bg-white border-l-4 border-red-500 shadow-2xl p-4 flex items-center gap-4 rounded-md min-w-[320px]"
                    >
                        <div className="bg-red-50 p-2 rounded-full text-red-500">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[14px] font-bold text-[#242424] tracking-tight">Requirement Missing</p>
                            <p className="text-[13px] text-gray-500 tracking-tight">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[720px] mx-auto">
                
                {/* Header Section */}
                <div className="mb-8 text-left">
                    <h1 className="text-[30px] font-bold text-[#0F2E4B] leading-[36px] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Post your project <span className="text-[#317CD7]">today.</span>
                    </h1>
                    <p className="text-[16px] text-[#555] font-normal leading-[28px] max-w-2xl tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Fill in the details below to reach thousands of top freelancers. Our platform is completely free to use.
                    </p>
                </div>

                <div className="space-y-4">
                             <SectionCard>
                        <SectionHeading num="01" title="Project Identity" />
                        <div className="space-y-4 mt-6">
                            <div>
                                <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Project title</label>
                                <input 
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md focus:border-[#317CD7] focus:ring-1 focus:ring-[#317CD7] outline-none text-[15px] font-medium text-[#0F2E4B] transition-all bg-white tracking-tight placeholder:text-gray-400"
                                    style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                    placeholder="Ex: Senior Full Stack Developer for Fintech App"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Primary role needed</label>
                                <input 
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md focus:border-[#317CD7] focus:ring-1 focus:ring-[#317CD7] outline-none text-[15px] font-medium text-[#0F2E4B] transition-all bg-white tracking-tight placeholder:text-gray-400"
                                    style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                    placeholder="Ex: React Architect, UI Designer"
                                />
                            </div>
                            <div>
                                <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Category</label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md outline-none text-[15px] font-medium text-[#0F2E4B] focus:border-[#317CD7] bg-white appearance-none tracking-tight"
                                    style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                >
                                    <option value="Web Development">Web Development</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="UI/UX Design">UI/UX Design</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="Content Writing">Content Writing</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[15px] font-medium text-[#0F2E4B] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Requirements description</label>
                                </div>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md focus:border-[#317CD7] focus:ring-1 focus:ring-[#317CD7] outline-none text-[15px] font-medium text-[#0F2E4B] min-h-[140px] bg-white tracking-tight placeholder:text-gray-400"
                                    style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                    placeholder="Briefly describe the professional requirements and goals..."
                                />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard>
                        <SectionHeading num="02" title="Professional Context" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div>
                                <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Experience level</label>
                                <select 
                                    value={formData.experienceLevel}
                                    onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                                    className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md outline-none text-[15px] font-medium text-[#0F2E4B] focus:border-[#317CD7] bg-white appearance-none tracking-tight"
                                    style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                >
                                    <option value="entry">Entry Level</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="expert">Expert / Consultant</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Project duration</label>
                                <select 
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                    className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md outline-none text-[15px] font-medium text-[#0F2E4B] focus:border-[#317CD7] bg-white appearance-none tracking-tight"
                                    style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                >
                                    <option value="less-than-1">Less than 1 month</option>
                                    <option value="1-3 months">1 to 3 months</option>
                                    <option value="3-6 months">3 to 6 months</option>
                                    <option value="6+ months">Long term (6+ months)</option>
                                </select>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Section: Skills */}
                    <SectionCard>
                        <SectionHeading num="03" title="Skills Required" />
                        <div className="mt-6">
                            <p className="text-[16px] text-[#555] font-normal leading-[28px] mb-3 tracking-tight font-['Poppins']">Add up to 10 skills that describe your project.</p>
                            
                            <div className="flex flex-wrap gap-2 p-3 border border-[#e5e7eb] rounded-md bg-white min-h-[60px] mb-3 focus-within:border-[#317CD7] transition-all">
                                {formData.skills.map(skill => (
                                    <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#317CD7]/5 border border-[#317CD7]/10 rounded-md text-[13px] font-medium text-[#317CD7] tracking-tight">
                                        {skill}
                                        <button onClick={() => removeSkill(skill)}><X size={14} className="text-[#317CD7]/60 hover:text-[#317CD7]" /></button>
                                    </span>
                                ))}
                                <input 
                                    type="text"
                                    placeholder="Add skills..."
                                    className="flex-1 bg-transparent border-none outline-none text-[14px] font-['Poppins'] placeholder:text-gray-400 placeholder:text-[14px] placeholder:font-['Poppins'] min-w-[150px] ml-2 tracking-tight"
                                    value={formData.currentSkill}
                                    onChange={(e) => setFormData({...formData, currentSkill: e.target.value})}
                                    onKeyPress={(e) => e.key === 'Enter' && addSkill(formData.currentSkill)}
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 items-center mt-3">
                                <span className="text-[13px] text-[#555] font-medium leading-[24px] tracking-tight mr-2 font-['Poppins']">Suggested:</span>
                                {suggestedSkills.map(skill => (
                                    <button 
                                        key={skill}
                                        onClick={() => addSkill(skill)}
                                        className="px-3 py-1.5 rounded-md border border-[#e5e7eb] text-[14px] text-[#555] font-medium leading-[20px] hover:border-[#317CD7] hover:text-[#317CD7] transition-all bg-white tracking-tight font-['Poppins']"
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </SectionCard>

                    {/* Section: Payment & Budget */}
                    <SectionCard>
                        <SectionHeading num="04" title="Budget & Price" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            <button 
                                onClick={() => setFormData({...formData, paymentType: 'fixed'})}
                                className={`relative flex items-center gap-4 p-4 rounded-md border-2 transition-all ${formData.paymentType === 'fixed' ? 'border-[#317CD7] bg-[#317CD7]/5' : 'border-[#e5e7eb] bg-white hover:border-gray-300'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.paymentType === 'fixed' ? 'bg-[#317CD7] text-white shadow-md shadow-[#317CD7]/20' : 'bg-gray-100 text-gray-400'}`}>
                                    <IndianRupee size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-[15px] font-medium text-[#0F2E4B] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Fixed Price</h4>
                                    <p className="text-[15px] text-[#555] font-normal leading-[24px] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>One-time payment</p>
                                </div>
                                {formData.paymentType === 'fixed' && <div className="absolute top-3 right-4 text-[#317CD7]"><CheckCircle2 size={16} /></div>}
                            </button>
                            <button 
                                onClick={() => setFormData({...formData, paymentType: 'hourly'})}
                                className={`relative flex items-center gap-4 p-4 rounded-md border-2 transition-all ${formData.paymentType === 'hourly' ? 'border-[#317CD7] bg-[#317CD7]/5' : 'border-[#e5e7eb] bg-white hover:border-gray-300'}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.paymentType === 'hourly' ? 'bg-[#317CD7] text-white shadow-md shadow-[#317CD7]/20' : 'bg-gray-100 text-gray-400'}`}>
                                    <Clock size={20} />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-[15px] font-medium text-[#0F2E4B] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Hourly Rate</h4>
                                    <p className="text-[15px] text-[#555] font-normal leading-[24px] tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>Pay for hours worked</p>
                                </div>
                                {formData.paymentType === 'hourly' && <div className="absolute top-3 right-4 text-[#317CD7]"><CheckCircle2 size={16} /></div>}
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#f0f0f0]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Currency</label>
                                    <select 
                                        value={formData.currency}
                                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                                        className="w-full px-5 py-3 border border-[#e5e7eb] rounded-md outline-none text-[15px] font-medium text-[#0F2E4B] focus:border-[#317CD7] bg-white appearance-none tracking-tight"
                                        style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                    >
                                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[15px] font-medium text-[#0F2E4B] mb-2 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}>Estimated price (Budget amount)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{formData.currency === 'USD' ? '$' : '₹'}</span>
                                        <input 
                                            type="number"
                                            value={formData.budgetAmount}
                                            onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})}
                                            className="w-full pl-10 pr-5 py-3 border border-[#e5e7eb] rounded-md focus:border-[#317CD7] outline-none text-[15px] font-medium text-[#0F2E4B] bg-white tracking-tight placeholder:text-gray-400"
                                            style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '26px' }}
                                            placeholder="Ex: 5000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SectionCard>



                    {/* Final Action Area */}
                    <div className="pt-6 flex flex-col items-center">
                        <button 
                            onClick={handlePostProject}
                            disabled={isLoading}
                            className="w-full max-w-[400px] py-5 bg-[#317CD7] text-white rounded-md font-bold text-[18px] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={24} /> : (isSuccess ? "Project Posted Successfully!" : "Post Project Now")}
                            {!isLoading && !isSuccess && <ArrowRight size={20} />}
                            {isSuccess && <CheckCircle2 size={24} />}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-md p-5 border border-[#f0f0f0] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
        {children}
    </motion.div>
);

const SectionHeading = ({ num, title }: { num: string, title: string }) => (
    <div className="flex items-center gap-3 pb-2 border-b border-[#f5f5f5]">
        <div className="text-[10px] font-extrabold text-[#317CD7] tracking-tighter leading-none mb-0.5 opacity-30">
            {num}
        </div>
        <h2 className="text-[26px] font-bold text-[#0F2E4B] leading-[34px] tracking-[-0.03em]" style={{ fontFamily: 'Poppins, sans-serif' }}>{title}</h2>
    </div>
);

export default PostProject;
