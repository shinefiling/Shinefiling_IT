import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
import { 
    User, Briefcase, FileText, CheckCircle, 
    ArrowLeft, ArrowRight, Upload, Globe,
    Linkedin, Mail, Phone, MapPin, Clock, IndianRupee, X, AlertCircle,
    ExternalLink, Trash2, FilePlus
} from 'lucide-react';

const JobApply: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const totalSteps = 4;

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: '',
        portfolio: '',
        linkedin: '',
        coverLetter: '',
        resume: null as File | null,
        resumeUrl: ''
    });

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                if (response.ok) {
                    const data = await response.json();
                    setJob(data);
                    
                    // Pre-fill from local storage if user is logged in
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    if (user) {
                        setFormData(prev => ({
                            ...prev,
                            fullName: user.fullName || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            location: user.location || ''
                        }));
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showError("File size exceeds 5MB limit");
                return;
            }

            setIsUploading(true);
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);

            try {
                const response = await fetch(`${API_BASE_URL}/api/upload/resume`, {
                    method: 'POST',
                    body: formDataUpload,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                if (response.ok) {
                    const fileUrl = await response.text();
                    setFormData(prev => ({ ...prev, resume: file, resumeUrl: fileUrl }));
                } else {
                    showError("Failed to upload resume to server.");
                }
            } catch (err) {
                console.error("Upload error:", err);
                showError("Connection error during upload.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, resume: null }));
    };

    const nextStep = () => {
        // Validation Logic
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.phone || !formData.location) {
                showError("Please fill all personal information fields");
                return;
            }
        } else if (step === 2) {
            if (!formData.experience || !formData.skills) {
                showError("Please provide your experience and skills");
                return;
            }
        } else if (step === 3) {
            if (!formData.resume && !formData.coverLetter) {
                showError("Please upload your resume or provide a short bio");
                return;
            }
        }

        if (step < totalSteps) setStep(step + 1);
    };

    const showError = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const applicationData = {
                jobId: job.id,
                jobTitle: job.title,
                company: job.company,
                clientEmail: job.userEmail, // The email of the person who posted the job
                freelancerId: user.id,      // The ID of the person applying
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                experience: formData.experience,
                skills: formData.skills,
                portfolio: formData.portfolio,
                linkedin: formData.linkedin,
                coverLetter: formData.coverLetter,
                resumeFileName: formData.resume ? formData.resume.name : 'No file uploaded',
                resumeUrl: (formData as any).resumeUrl || ''
            };

            const response = await fetch(`${API_BASE_URL}/api/job-applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(applicationData)
            });

            if (response.ok) {
                alert("Application submitted successfully!");
                navigate('/jobs');
            } else {
                alert("Failed to submit application. Please try again.");
            }
        } catch (err) {
            console.error("Error submitting application:", err);
            alert("An error occurred. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
            <div className="w-12 h-12 border-4 border-[#317CD7] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const steps = [
        { id: 1, title: 'Personal Info', icon: <User size={18} /> },
        { id: 2, title: 'Experience', icon: <Briefcase size={18} /> },
        { id: 3, title: 'Upload Resume', icon: <FileText size={18} /> },
        { id: 4, title: 'Review', icon: <CheckCircle size={18} /> }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] pt-[140px] md:pt-[120px] pb-20 font-['Poppins'] relative">
            
            {/* Error Notification */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -20, x: 20 }}
                        className="fixed top-8 right-8 z-[9999] bg-red-600 text-white px-6 py-4 shadow-2xl flex items-center gap-3 border-l-4 border-red-800"
                    >
                        <div className="bg-white/20 p-1.5 rounded-none">
                            <AlertCircle size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-tight opacity-80">Validation Error</p>
                            <p className="text-[13px] font-bold">{error}</p>
                        </div>
                        <button onClick={() => setError(null)} className="ml-4 opacity-60 hover:opacity-100">
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
                
                {/* Header Area */}
                <div className="mb-8 flex items-center justify-between bg-white p-6 shadow-sm border border-gray-100 rounded-md">
                    <div>
                        <button 
                            onClick={() => navigate(`/jobs/${id}`)}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#317CD7] font-bold text-[11px] uppercase tracking-tight transition-colors mb-2"
                        >
                            <ArrowLeft size={14} /> Back to Job
                        </button>
                        <h1 className="text-2xl font-bold text-[#0F2E4B]">{job?.title}</h1>
                        <p className="text-sm text-gray-500 font-medium">Applying at <span className="text-[#317CD7] font-bold">{job?.company || 'The Company'}</span></p>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Application ID</p>
                            <p className="text-sm font-bold text-[#0F2E4B]">#APP-{Math.floor(100000 + Math.random() * 900000)}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#f9fafb] rounded-md flex items-center justify-center text-[#317CD7]">
                            <Briefcase size={20} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    
                    {/* Left Side - Multi-step Form */}
                    <div className="space-y-6">
                        
                        {/* Progress Tracker */}
                        <div className="bg-white border border-gray-100 p-2 shadow-sm flex items-center justify-between rounded-md">
                            {steps.map((s, index) => (
                                <React.Fragment key={s.id}>
                                    <div 
                                        className={`flex-1 flex items-center justify-center py-3 gap-3 transition-all ${step === s.id ? 'bg-[#317CD7]/5 text-[#317CD7]' : 'text-gray-400'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-[12px] border ${step === s.id ? 'border-[#317CD7] bg-[#317CD7] text-white' : 'border-gray-200'}`}>
                                            {s.id}
                                        </div>
                                        <span className={`text-[12px] font-bold uppercase tracking-wider hidden sm:inline ${step === s.id ? 'text-[#317CD7]' : 'text-gray-400'}`}>
                                            {s.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="w-8 h-[1px] bg-gray-100 hidden sm:block"></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Form Content Area */}
                        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-md">
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="form-label">Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input 
                                                            type="text" 
                                                            name="fullName"
                                                            value={formData.fullName}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter your full name"
                                                            className="form-input-field pl-12"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="form-label">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input 
                                                            type="email" 
                                                            name="email"
                                                            value={formData.email}
                                                            readOnly
                                                            placeholder="your.email@example.com"
                                                            className="form-input-field pl-12 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="form-label">Phone Number</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input 
                                                            type="tel" 
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            placeholder="+91 00000 00000"
                                                            className="form-input-field pl-12"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="form-label">Current Location</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                        <input 
                                                            type="text" 
                                                            name="location"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            placeholder="City, Country"
                                                            className="form-input-field pl-12"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="form-label">Professional Experience</label>
                                                    <select 
                                                        name="experience"
                                                        value={formData.experience}
                                                        onChange={handleInputChange}
                                                        className="form-input-field"
                                                    >
                                                        <option value="">Select Experience</option>
                                                        <option value="fresher">Fresher (0-1 Years)</option>
                                                        <option value="junior">Junior (1-3 Years)</option>
                                                        <option value="mid">Mid-Level (3-5 Years)</option>
                                                        <option value="senior">Senior (5-8 Years)</option>
                                                        <option value="expert">Expert (8+ Years)</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="form-label">Skills & Expertise</label>
                                                    <textarea 
                                                        name="skills"
                                                        value={formData.skills}
                                                        onChange={handleInputChange}
                                                        placeholder="List your key skills (e.g. React, Node.js, TypeScript)"
                                                        rows={3}
                                                        className="form-input-field resize-none h-auto"
                                                    ></textarea>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="form-label">Portfolio Link</label>
                                                        <div className="relative">
                                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                            <input 
                                                                type="url" 
                                                                name="portfolio"
                                                                value={formData.portfolio}
                                                                onChange={handleInputChange}
                                                                placeholder="https://portfolio.com"
                                                                className="form-input-field pl-12"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="form-label">LinkedIn Profile</label>
                                                        <div className="relative">
                                                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                            <input 
                                                                type="url" 
                                                                name="linkedin"
                                                                value={formData.linkedin}
                                                                onChange={handleInputChange}
                                                                placeholder="https://linkedin.com/in/username"
                                                                className="form-input-field pl-12"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="form-label">Upload Resume (PDF/DOC)</label>
                                                    <div className="border border-gray-100 bg-[#f9fafb] p-10 text-center relative group hover:border-[#317CD7] transition-all rounded-md">
                                                        {!formData.resume ? (
                                                            <>
                                                                <div className="space-y-4">
                                                                    <div className="w-14 h-14 bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto text-[#317CD7] group-hover:scale-110 transition-transform rounded-md">
                                                                        {isUploading ? (
                                                                            <div className="w-6 h-6 border-2 border-[#317CD7] border-t-transparent rounded-full animate-spin"></div>
                                                                        ) : (
                                                                            <Upload size={24} />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-[rgb(33,33,33)]" style={{ lineHeight: '22.4px' }}>
                                                                            {isUploading ? 'Uploading Resume...' : 'Click to upload or drag and drop'}
                                                                        </p>
                                                                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight mt-1">PDF, DOC, DOCX up to 5MB</p>
                                                                    </div>
                                                                </div>
                                                                <input 
                                                                    type="file" 
                                                                    onChange={handleFileChange}
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                    accept=".pdf,.doc,.docx"
                                                                    disabled={isUploading}
                                                                />
                                                            </>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="w-14 h-14 bg-green-50 shadow-sm border border-green-100 flex items-center justify-center mx-auto text-green-600 rounded-md">
                                                                    <FileText size={24} />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-[rgb(33,33,33)]" style={{ lineHeight: '22.4px' }}>{formData.resume.name}</p>
                                                                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight mt-1">{(formData.resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                                </div>
                                                                <button 
                                                                    onClick={removeFile}
                                                                    className="flex items-center gap-2 mx-auto text-[11px] font-bold text-red-500 hover:text-red-600 uppercase tracking-tight"
                                                                >
                                                                    <Trash2 size={14} /> Remove File
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="form-label">Why should we hire you? (Short Bio)</label>
                                                    <textarea 
                                                        name="coverLetter"
                                                        value={formData.coverLetter}
                                                        onChange={handleInputChange}
                                                        placeholder="Briefly describe your suitability for this role..."
                                                        rows={5}
                                                        className="form-input-field resize-none h-auto"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 4 && (
                                        <motion.div
                                            key="step4"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="bg-white p-0 border border-gray-100 overflow-hidden shadow-sm">
                                                <div className="bg-[#f9fafb] px-8 py-4 border-b border-gray-100 flex items-center justify-between">
                                                    <h4 className="text-[16px] font-bold text-[rgb(33,33,33)] uppercase tracking-tight" style={{ lineHeight: '22.4px' }}>Application Review - #0487643</h4>
                                                    <div className="flex items-center gap-2 text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1 uppercase tracking-tighter">
                                                        <CheckCircle size={12} /> Data Verified
                                                    </div>
                                                </div>
                                                
                                                <div className="p-8 space-y-8">
                                                    {/* Section: Basic Info */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h5 className="text-[16px] font-bold text-[rgb(33,33,33)] uppercase tracking-tight" style={{ lineHeight: '22.4px' }}>Personal & Contact</h5>
                                                            <button onClick={() => setStep(1)} className="text-[11px] font-bold text-[#317CD7] hover:underline uppercase">Change</button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div>
                                                                <p className="text-[15px] font-medium text-[rgb(33,33,33)]" style={{ lineHeight: '26px' }}>{formData.fullName}</p>
                                                                <p className="text-[12px] text-gray-500 mt-0.5">{formData.email}</p>
                                                            </div>
                                                            <div className="text-right md:text-left">
                                                                <p className="text-[15px] font-medium text-[rgb(33,33,33)]" style={{ lineHeight: '26px' }}>{formData.phone}</p>
                                                                <p className="text-[12px] text-gray-500 mt-0.5">{formData.location}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="h-[1px] bg-gray-50"></div>

                                                    {/* Section: Professional Details */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h5 className="text-[16px] font-bold text-[rgb(33,33,33)] uppercase tracking-tight" style={{ lineHeight: '22.4px' }}>Professional Profile</h5>
                                                            <button onClick={() => setStep(2)} className="text-[11px] font-bold text-[#317CD7] hover:underline uppercase">Change</button>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                 <span className="text-[13px] text-gray-600">Experience Level</span>
                                                                <span className="text-[15px] font-medium text-[rgb(33,33,33)] capitalize" style={{ lineHeight: '26px' }}>{formData.experience || 'Not Specified'}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[13px] text-gray-600">Core Skills</span>
                                                                <span className="text-[15px] font-medium text-[rgb(33,33,33)] truncate max-w-[200px]" style={{ lineHeight: '26px' }}>{formData.skills || 'Not Specified'}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[13px] text-gray-600">Portfolio</span>
                                                                <span className="text-[13px] font-bold text-[#317CD7] truncate max-w-[200px]">{formData.portfolio || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="h-[1px] bg-gray-50"></div>

                                                    {/* Section: Attachments */}
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h5 className="text-[16px] font-bold text-[rgb(33,33,33)] uppercase tracking-tight" style={{ lineHeight: '22.4px' }}>Documents & Attachments</h5>
                                                            <button onClick={() => setStep(3)} className="text-[11px] font-bold text-[#317CD7] hover:underline uppercase">Change</button>
                                                        </div>
                                                        <div className="flex items-center gap-4 p-4 bg-[#f9fafb] border border-gray-100">
                                                            <div className={`w-10 h-10 shadow-sm flex items-center justify-center border border-gray-100 ${formData.resume ? 'bg-green-50 text-green-600' : 'bg-white text-[#317CD7]'}`}>
                                                                {formData.resume ? <CheckCircle size={20} /> : <FilePlus size={20} />}
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="text-[15px] font-medium text-[rgb(33,33,33)] truncate" style={{ lineHeight: '26px' }}>{formData.resume?.name || 'No resume uploaded'}</p>
                                                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
                                                                    {formData.resume ? `Resume / CV (${(formData.resume.size / (1024 * 1024)).toFixed(2)} MB)` : 'Please go back and upload your CV'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Section: Compatibility Score */}
                                                    <div className="mt-8 p-5 bg-green-50 border border-green-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center border border-green-200">
                                                                <span className="text-[14px] font-bold text-green-600">85%</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-[13px] font-bold text-green-800">Job Matching Score</p>
                                                                <p className="text-[11px] text-green-600 font-medium">Compatible with role requirements</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[11px] font-bold text-green-600 uppercase tracking-tight bg-white px-3 py-1 border border-green-100">Strong Match</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Donation Placeholder as in image */}
                                            <div className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100">
                                                <input type="checkbox" className="accent-orange-500" defaultChecked />
                                                <p className="text-[12px] text-orange-800 font-medium leading-relaxed flex-1">
                                                    Send notification to employer via SMS/Email immediately. <span className="text-orange-500 font-bold underline cursor-pointer ml-1">Details</span>
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <button 
                                    onClick={prevStep}
                                    disabled={step === 1}
                                    className={`flex items-center gap-2 px-6 py-3 font-bold text-[13px] uppercase tracking-wider transition-all ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-[#317CD7]'}`}
                                >
                                    <ArrowLeft size={16} /> Previous
                                </button>
                                
                                {step < totalSteps ? (
                                    <button 
                                        onClick={nextStep}
                                        className="bg-[#317CD7] text-white px-10 py-3 font-bold text-[13px] uppercase tracking-wider hover:bg-[#2a69b5] transition-all flex items-center gap-2 rounded-md"
                                    >
                                        Next Step <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleSubmit}
                                        className="bg-[#0F2E4B] text-white px-10 py-3 font-bold text-[13px] uppercase tracking-wider hover:bg-black transition-all flex items-center gap-2 rounded-md"
                                    >
                                        Submit Application <CheckCircle size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Job Summary Sidebar */}
                    <aside className="space-y-6">
                        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-md">
                            <div className="bg-[#f9fafb] px-6 py-4 border-b border-gray-100">
                                <h3 className="text-[16px] font-bold text-[rgb(33,33,33)] uppercase tracking-tight" style={{ lineHeight: '22.4px' }}>Job Summary</h3>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                         <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <Briefcase size={18} className="text-[#317CD7]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Position</p>
                                            <p className="text-[15px] font-medium text-[rgb(33,33,33)]" style={{ lineHeight: '26px' }}>{job?.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <IndianRupee size={18} className="text-[#317CD7]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Offered Salary</p>
                                            <p className="text-[15px] font-medium text-[rgb(33,33,33)]" style={{ lineHeight: '26px' }}>₹{job?.price?.toLocaleString('en-IN')} / year</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <MapPin size={18} className="text-[#317CD7]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Location</p>
                                            <p className="text-[15px] font-medium text-[rgb(33,33,33)] capitalize" style={{ lineHeight: '26px' }}>{job?.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <Clock size={18} className="text-[#317CD7]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Posted On</p>
                                            <p className="text-[15px] font-medium text-[rgb(33,33,33)]" style={{ lineHeight: '26px' }}>{new Date(job?.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-tight mb-4">Required Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {job?.tags?.slice(0, 5).map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 border border-gray-100 capitalize">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#317CD7] text-white space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-tight opacity-80">Quick Tip</p>
                                    <p className="text-[11px] font-medium leading-relaxed">
                                        Complete all steps to increase your hiring chances by 3x.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Need Help Card */}
                        <div className="bg-[#0F2E4B] p-6 text-white text-center">
                            <h4 className="text-[16px] font-bold text-white uppercase tracking-tight mb-2" style={{ lineHeight: '22.4px' }}>Need help applying?</h4>
                            <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">Our support team is available 24/7 to assist you with your application process.</p>
                            <button className="w-full py-2.5 border border-white/20 text-white font-bold text-[12px] hover:bg-white/10 transition-all uppercase tracking-wider">
                                Contact Support
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default JobApply;
