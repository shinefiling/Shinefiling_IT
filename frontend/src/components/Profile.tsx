import { useState, useEffect } from 'react';
import { 
    MapPin, Calendar, Clock, ShieldCheck, 
    Smartphone, Mail, Edit2, Plus, 
    ExternalLink, Briefcase, GraduationCap, 
    MessageSquare, CreditCard, AlertCircle,
    Image as ImageIcon, Trash2, X, CheckCircle2,
    User, Phone
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL as GLOBAL_API_BASE_URL } from '../config';

const Profile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<any>(null);
    
    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [isExpEdit, setIsExpEdit] = useState(false);
    const [isEduEdit, setIsEduEdit] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

    // Forms
    const [editForm, setEditForm] = useState<any>({});
    const [expForm, setExpForm] = useState({ title: '', company: '', startDate: '', endDate: '', currentlyWorking: false, location: '', description: '' });
    const [eduForm, setEduForm] = useState({ institution: '', degree: '', startDate: '', endDate: '', location: '' });
    const [portfolioForm, setPortfolioForm] = useState({ title: '', image: '' });
    const [photoForm, setPhotoForm] = useState({ profilePicture: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [skillInput, setSkillInput] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'proposals' | 'verifications'>('about');
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [myProposals, setMyProposals] = useState<any[]>([]);
    const [fetchingData, setFetchingData] = useState(false);

    const API_BASE_URL = `${GLOBAL_API_BASE_URL}/api/profiles`;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.userRole === 'CLIENT') {
                navigate('/client-profile');
                return;
            }
        }

        const fetchProfile = async () => {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setLoading(false);
                return;
            }

            const userData = JSON.parse(storedUser);
            setUser(userData);
            setEditForm({
                ...userData,
                skills: userData.skills || []
            });
            setPhotoForm({
                profilePicture: userData.profilePicture || ''
            });

            // If it hasn't been fetched fully yet, fetch it in background
            if (!userData.profileFetched) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${userData.email}`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    if (response.ok) {
                        const profileData = await response.json();
                        const updatedData = { ...userData, ...profileData, profileFetched: true };
                        setUser(updatedData);
                        setEditForm({
                            ...updatedData,
                            skills: updatedData.skills || []
                        });
                        setPhotoForm({
                            profilePicture: updatedData.profilePicture || ''
                        });
                        localStorage.setItem('user', JSON.stringify(updatedData));
                        window.dispatchEvent(new Event('user-updated'));
                    }
                } catch (err) {
                    console.error('Error fetching profile fallback:', err);
                }
            }
            setLoading(false);
        };

        fetchProfile();

        const handleUserUpdate = () => {
            const freshUser = localStorage.getItem('user');
            if (freshUser) {
                const parsed = JSON.parse(freshUser);
                setUser(parsed);
                setEditForm({ ...parsed, skills: parsed.skills || [] });
                setPhotoForm({ profilePicture: parsed.profilePicture || '' });
            }
        };

        window.addEventListener('user-updated', handleUserUpdate);
        return () => window.removeEventListener('user-updated', handleUserUpdate);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'projects' || tab === 'about' || tab === 'proposals') {
            setActiveTab(tab as any);
        }
    }, [location]);

    useEffect(() => {
        if (user && user.id) {
            fetchAllUserContent();
        }
    }, [user?.id]);

    const fetchAllUserContent = async () => {
        const uid = user?.id || user?.userId;
        if (!uid) return;
        
        setFetchingData(true);
        try {
            const [projectsRes, proposalsRes] = await Promise.all([
                fetch(`${GLOBAL_API_BASE_URL}/api/projects/client/${user.id}`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } }),
                fetch(`${GLOBAL_API_BASE_URL}/api/proposals/freelancer/${user.id}`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            ]);

            if (projectsRes.ok) {
                const projectsData = await projectsRes.json();
                setMyProjects(projectsData);
            }
            if (proposalsRes.ok) {
                const proposalsData = await proposalsRes.json();
                setMyProposals(proposalsData);
            }
        } catch (err) {
            console.error("Error fetching user content:", err);
        } finally {
            setFetchingData(false);
        }
    };

    const saveToBackend = async (updatedUser: any) => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(updatedUser)
            });
            if (!response.ok) throw new Error('Failed to save to backend');
            const savedData = await response.json();
            setUser(savedData);
            localStorage.setItem('user', JSON.stringify(savedData));
            window.dispatchEvent(new Event('user-updated'));
            return true;
        } catch (err) {
            console.error('Save error:', err);
            alert('Error saving to backend. Changes might not persist.');
            return false;
        }
    };

    const handleSaveProfile = async () => {
        const updatedUser = { ...user, ...editForm };
        const success = await saveToBackend(updatedUser);
        if (success) {
            setIsEditModalOpen(false);
            alert('Profile updated successfully!');
        }
    };

    const handleAddExperience = async () => {
        const period = `${expForm.startDate} - ${expForm.currentlyWorking ? 'Present' : expForm.endDate}`;
        const newExp = { ...expForm, period };
        
        let updatedExperience;
        if (isExpEdit && editIndex !== null) {
            updatedExperience = [...user.experience];
            updatedExperience[editIndex] = newExp;
        } else {
            updatedExperience = [newExp, ...(user.experience || [])];
        }

        const updatedUser = { ...user, experience: updatedExperience };
        const success = await saveToBackend(updatedUser);
        if (success) {
            setIsExpModalOpen(false);
            setIsExpEdit(false);
            setEditIndex(null);
            setExpForm({ title: '', company: '', startDate: '', endDate: '', currentlyWorking: false, location: '', description: '' });
        }
    };

    const handleEditExperienceClick = (index: number) => {
        const exp = user.experience[index];
        const [start, end] = (exp.period || "").split(' - ');
        setExpForm({
            title: exp.title,
            company: exp.company,
            startDate: start || '',
            endDate: end === 'Present' ? '' : (end || ''),
            currentlyWorking: end === 'Present',
            location: exp.location || '',
            description: exp.description || ''
        });
        setEditIndex(index);
        setIsExpEdit(true);
        setIsExpModalOpen(true);
    };

    const handleAddEducation = async () => {
        const period = `${eduForm.startDate} - ${eduForm.endDate}`;
        const newEdu = { ...eduForm, period };

        let updatedEducation;
        if (isEduEdit && editIndex !== null) {
            updatedEducation = [...user.education];
            updatedEducation[editIndex] = newEdu;
        } else {
            updatedEducation = [newEdu, ...(user.education || [])];
        }

        const updatedUser = { ...user, education: updatedEducation };
        const success = await saveToBackend(updatedUser);
        if (success) {
            setIsEduModalOpen(false);
            setIsEduEdit(false);
            setEditIndex(null);
            setEduForm({ institution: '', degree: '', startDate: '', endDate: '', location: '' });
        }
    };

    const handleEditEducationClick = (index: number) => {
        const edu = user.education[index];
        const [start, end] = (edu.period || "").split(' - ');
        setEduForm({
            institution: edu.institution,
            degree: edu.degree,
            startDate: start || '',
            endDate: end || '',
            location: edu.location || ''
        });
        setEditIndex(index);
        setIsEduEdit(true);
        setIsEduModalOpen(true);
    };

    const handleAddPortfolio = async () => {
        const updatedUser = { ...user, portfolio: [portfolioForm, ...(user.portfolio || [])] };
        const success = await saveToBackend(updatedUser);
        if (success) {
            setIsPortfolioModalOpen(false);
            setPortfolioForm({ title: '', image: '' });
        }
    };

    const handleUpdatePhotos = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/upload-photo/${user.email}`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setUser(updatedProfile);
                localStorage.setItem('user', JSON.stringify(updatedProfile));
                window.dispatchEvent(new Event('user-updated'));
                setIsPhotoModalOpen(false);
                setSelectedFile(null);
                setPhotoPreview(null);
            } else {
                alert('Failed to upload photo');
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Error connecting to server for upload');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSkill = (skillStr: string) => {
        if (!skillStr) return;
        const newSkills = skillStr.split(',')
            .map(s => s.trim())
            .filter(s => s && !editForm.skills.includes(s));
            
        if (newSkills.length > 0) {
            setEditForm({ ...editForm, skills: [...editForm.skills, ...newSkills] });
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setEditForm({ ...editForm, skills: editForm.skills.filter((s: string) => s !== skill) });
    };

    const formatPeriod = (period: string) => {
        if (!period) return '';
        const [start, end] = period.split(' - ');
        const formatDate = (dateStr: string) => {
            if (!dateStr || dateStr === 'Present') return dateStr;
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        };
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const handleDeleteItem = async (type: 'experience' | 'education' | 'portfolio', index: number) => {
        const updatedUser = { ...user };
        updatedUser[type] = updatedUser[type].filter((_: any, i: number) => i !== index);
        await saveToBackend(updatedUser);
    };

    const handleVerify = async (field: string) => {
        const updatedUser = { ...user, [field]: true };
        const success = await saveToBackend(updatedUser);
        if (success) {
            // Success logic if needed
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface pt-[120px] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#b5242c] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[13px] text-black/60">Loading your profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-surface pt-[120px] flex flex-col items-center justify-center">
                <AlertCircle size={40} className="text-primary mb-4" />
                <h2 className="text-[18px] font-bold text-on-surface mb-2">Session expired</h2>
                <p className="text-[13px] text-black/50 mb-6">Please login to view and manage your profile.</p>
                <a href="/login" className="bg-primary text-white px-6 py-2.5 rounded-[4px] text-[14px] font-bold shadow hover:bg-[#a11f27] transition-all">Sign in now</a>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-surface pt-[80px]"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            
            <AnimatePresence mode="wait">
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
                                <h3 className="text-[18px] font-bold text-on-surface">Edit profile details</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-black/50 hover:text-primary transition-colors"><X size={20}/></button>
                            </div>
                            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Full name</label>
                                        <input type="text" value={editForm.fullName || ''} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px]" placeholder="Full name" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Professional headline</label>
                                        <input type="text" value={editForm.professionalHeadline || ''} onChange={(e) => setEditForm({...editForm, professionalHeadline: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px]" placeholder="Headline" />
                                    </div>
                                </div>
                                 <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Hourly rate (₹)</label>
                                        <input type="number" value={editForm.hourlyRate || ''} onChange={(e) => setEditForm({...editForm, hourlyRate: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px]" placeholder="1500" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Location</label>
                                        <input type="text" value={editForm.location || ''} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px]" placeholder="Location" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Phone number</label>
                                        <input type="text" value={editForm.phone || ''} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px]" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Username</label>
                                        <input type="text" value={editForm.username || ''} disabled className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] bg-gray-50 text-black/50 text-[13px]" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Skills</label>
                                    <div className="flex flex-wrap gap-2 mb-1.5">
                                        {editForm.skills?.map((skill: string) => (
                                            <span key={skill} className="bg-gray-100 text-on-surface px-2.5 py-1 rounded-[4px] text-[11px] font-bold flex items-center gap-1.5">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="text-black/50 hover:text-primary"><X size={10}/></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px]" placeholder="Add skills (comma separated)" />
                                        <button type="button" onClick={() => handleAddSkill(skillInput)} className="bg-gray-100 px-3 py-1.5 rounded-[4px] text-[12px] font-bold text-[#444] hover:bg-gray-200 transition-all">Add</button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-black/60 uppercase tracking-wide">Summary / Bio</label>
                                    <textarea rows={3} value={editForm.summary || ''} onChange={(e) => setEditForm({...editForm, summary: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] focus:outline-none focus:border-[#b5242c] text-[13px] resize-none leading-[23.52px]" placeholder="Bio..." />
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-1.5 text-[13px] font-bold text-black/60">Cancel</button>
                                <button onClick={handleSaveProfile} className="bg-primary text-white px-6 py-1.5 rounded-[4px] text-[13px] font-bold shadow-none hover:bg-[#a11f27]">Save changes</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isExpModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
                                <h3 className="text-[18px] font-bold text-on-surface">{isExpEdit ? 'Edit experience' : 'Add experience'}</h3>
                                <button onClick={() => { setIsExpModalOpen(false); setIsExpEdit(false); setEditIndex(null); }} className="text-black/50 hover:text-primary"><X size={20}/></button>
                            </div>
                            <div className="p-5 space-y-3">
                                <input type="text" value={expForm.title} onChange={(e) => setExpForm({...expForm, title: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" placeholder="Job title" />
                                <input type="text" value={expForm.company} onChange={(e) => setExpForm({...expForm, company: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" placeholder="Company" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="month" value={expForm.startDate} onChange={(e) => setExpForm({...expForm, startDate: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" />
                                    <input type="month" value={expForm.endDate} disabled={expForm.currentlyWorking} onChange={(e) => setExpForm({...expForm, endDate: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" />
                                </div>
                                <textarea rows={2} value={expForm.description} onChange={(e) => setExpForm({...expForm, description: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px] resize-none" placeholder="Description" />
                            </div>
                            <div className="p-5 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => { setIsExpModalOpen(false); setIsExpEdit(false); setEditIndex(null); }} className="px-5 py-1.5 text-[13px] font-bold text-black/60">Cancel</button>
                                <button onClick={handleAddExperience} className="bg-primary text-white px-7 py-1.5 rounded-[4px] text-[13px] font-bold">{isExpEdit ? 'Update' : 'Save'}</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isEduModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
                                <h3 className="text-[18px] font-bold text-on-surface">{isEduEdit ? 'Edit education' : 'Add education'}</h3>
                                <button onClick={() => { setIsEduModalOpen(false); setIsEduEdit(false); setEditIndex(null); }} className="text-black/50 hover:text-primary"><X size={20}/></button>
                            </div>
                            <div className="p-5 space-y-3">
                                <input type="text" value={eduForm.institution} onChange={(e) => setEduForm({...eduForm, institution: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" placeholder="Institution" />
                                <input type="text" value={eduForm.degree} onChange={(e) => setEduForm({...eduForm, degree: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" placeholder="Degree" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="month" value={eduForm.startDate} onChange={(e) => setEduForm({...eduForm, startDate: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" />
                                    <input type="month" value={eduForm.endDate} onChange={(e) => setEduForm({...eduForm, endDate: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" />
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => { setIsEduModalOpen(false); setIsEduEdit(false); setEditIndex(null); }} className="px-5 py-1.5 text-[13px] font-bold text-black/60">Cancel</button>
                                <button onClick={handleAddEducation} className="bg-primary text-white px-7 py-1.5 rounded-[4px] text-[13px] font-bold">{isEduEdit ? 'Update' : 'Save'}</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isPortfolioModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
                                <h3 className="text-[18px] font-bold text-on-surface">Add project</h3>
                                <button onClick={() => setIsPortfolioModalOpen(false)} className="text-black/50 hover:text-primary"><X size={20}/></button>
                            </div>
                            <div className="p-5 space-y-3">
                                <input type="text" value={portfolioForm.title} onChange={(e) => setPortfolioForm({...portfolioForm, title: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" placeholder="Project title" />
                                <input type="text" value={portfolioForm.image} onChange={(e) => setPortfolioForm({...portfolioForm, image: e.target.value})} className="w-full px-3 py-1.5 border border-gray-200 rounded-[4px] text-[13px]" placeholder="Image URL" />
                            </div>
                            <div className="p-5 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => setIsPortfolioModalOpen(false)} className="px-5 py-1.5 text-[13px] font-bold text-black/60">Cancel</button>
                                <button onClick={handleAddPortfolio} className="bg-primary text-white px-7 py-1.5 rounded-[4px] text-[13px] font-bold">Add</button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {isPhotoModalOpen && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
                                <h3 className="text-[18px] font-bold text-on-surface">Update profile photo</h3>
                                <button onClick={() => { setIsPhotoModalOpen(false); setPhotoPreview(null); }} className="text-black/50 hover:text-primary transition-colors"><X size={20}/></button>
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-40 h-40 rounded-none bg-gray-50 border border-outline-variant/30 overflow-hidden flex items-center justify-center mb-6 relative group">
                                        {(photoPreview || user.profilePicture) ? (
                                            <img src={photoPreview || user.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon size={40} className="text-gray-300" />
                                        )}
                                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                                            <Plus size={24} className="mb-1" />
                                            <span className="text-[12px] font-bold">Select Photo</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <p className="text-[12px] text-black/50 text-center px-4 leading-relaxed">
                                        Upload a high-quality square photo for your professional profile.
                                    </p>
                                </div>
                            </div>
                            <div className="p-5 bg-gray-50 flex justify-end gap-2">
                                <button onClick={() => { setIsPhotoModalOpen(false); setPhotoPreview(null); }} className="px-5 py-2 text-[13px] font-bold text-black/60">Cancel</button>
                                <button 
                                    onClick={handleUpdatePhotos} 
                                    disabled={!selectedFile}
                                    className={`px-7 py-2 rounded-lg text-[13px] font-bold shadow-none transition-all ${selectedFile ? 'bg-primary text-white hover:bg-[#a11f27]' : 'bg-gray-200 text-black/50 cursor-not-allowed'}`}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

                {/* Top Profile Container */}
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-6 mb-8">
                    {/* Profile Header Section */}
                    <div className="lg:w-2/3">
                        <section className="bg-white rounded-xl border border-[#e5e7eb] py-6 px-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="relative cursor-pointer group" onClick={() => setIsPhotoModalOpen(true)}>
                                    {user.profilePicture ? (
                                        <img 
                                            alt={user.fullName} 
                                            className="w-24 h-24 rounded-lg object-cover border-2 border-gray-100 group-hover:opacity-80 transition-opacity" 
                                            src={user.profilePicture} 
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center border-2 border-gray-100 group-hover:bg-gray-100 transition-all">
                                            <User size={40} className="text-black/50" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full border border-gray-200 shadow-sm group-hover:scale-110 transition-transform">
                                        {user.verified ? (
                                            <span className="material-symbols-outlined text-green-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-black/50 text-[18px]">add_a_photo</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h1 className="text-[24px] font-bold text-black">{user.fullName}</h1>
                                        {user.verified && (
                                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-green-100">
                                                <span className="material-symbols-outlined text-[12px]">shield</span>
                                                VERIFIED ARCHITECT
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[14px] text-black font-medium mb-3">{user.professionalHeadline || 'Professional Freelancer'}</p>
                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="flex items-center gap-1 text-black">
                                            <span className="material-symbols-outlined text-yellow-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="text-[13px] font-bold">{user.rating || '0.0'} / 5.0</span>
                                            <span className="text-black/50 text-[12px] ml-1">({user.reviewsCount || 0} Reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-black">
                                            <span className="material-symbols-outlined text-black/60 text-[18px]">location_on</span>
                                            <span className="text-[13px] font-medium text-black">{user.location || 'Remote'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-50/50 border border-green-100 px-3 py-1 rounded-lg">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[11px] font-bold text-green-600">Available</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-0.5">Wallet Balance</p>
                                        <p className="text-[24px] text-black font-bold">₹{user.walletBalance?.toLocaleString() || '0.00'}</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="bg-primary text-white px-8 py-2 rounded-lg text-[13px] font-bold hover:opacity-90 active:scale-95 transition-all shadow-sm whitespace-nowrap"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Expertise & Skills Side Section */}
                    <div className="lg:w-1/3 flex flex-col gap-4">
                        <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-[11px] font-bold text-black/50 uppercase tracking-[0.15em] mb-4 flex justify-between items-center">
                                Expertise & Skills
                                <button onClick={() => setIsEditModalOpen(true)} className="text-gray-300 hover:text-primary"><Edit2 size={12}/></button>
                            </h3>
                            {!user.skills || user.skills.length === 0 ? (
                                <p className="text-[12px] text-black/50 italic">No skills added yet.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {user.skills.map((skill: string) => (
                                        <span key={skill} className="px-3 py-1 bg-gray-50 text-black rounded-full text-[11px] font-bold border border-gray-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="pt-4 border-t border-gray-50 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-black/50">
                                        <MapPin size={16} />
                                    </div>
                                    <span className="font-bold text-black text-[13px] capitalize">{user.location || 'Chennai, India'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-black/50">
                                        <Calendar size={16} />
                                    </div>
                                    <span className="font-bold text-black text-[13px]">Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'May 2026'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-black/50">
                                        <Clock size={16} />
                                    </div>
                                    <span className="font-bold text-black text-[13px]">{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} local</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <nav className="flex border-b border-outline-variant/30 gap-10 mb-10 overflow-x-auto scrollbar-hide px-2">
                    {[
                        { id: 'about', label: 'About' },
                        { id: 'projects', label: 'Projects' },
                        { id: 'proposals', label: 'Proposals' },
                        { id: 'verifications', label: 'Verifications' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 text-[16px] font-semibold transition-all relative whitespace-nowrap px-1 ${
                                activeTab === tab.id ? 'text-on-surface' : 'text-black/60 hover:text-on-surface'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="profile-tab" 
                                    className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-primary rounded-full" 
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {activeTab === 'about' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Portfolio Section */}
                                <section className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-[20px] font-bold text-on-surface">Portfolio Showcase</h2>
                                        <button onClick={() => setIsPortfolioModalOpen(true)} className="text-primary font-bold text-[13px] flex items-center gap-1 hover:underline">
                                            Add New <Plus size={16} />
                                        </button>
                                    </div>
                                    
                                    {!user.portfolio || user.portfolio.length === 0 ? (
                                        <div onClick={() => setIsPortfolioModalOpen(true)} className="py-16 text-center bg-gray-50/50 border-2 border-dashed border-outline-variant/30 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                                            <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-black/50 font-medium">Click to upload your first portfolio project</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {user.portfolio.map((item: any, i: number) => (
                                                <div key={i} className="group cursor-pointer">
                                                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 border border-gray-50 shadow-sm relative">
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteItem('portfolio', i); }} 
                                                            className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                        >
                                                            <Trash2 size={14}/>
                                                        </button>
                                                    </div>
                                                    <h3 className="font-bold text-[14px] text-on-surface group-hover:text-primary transition-colors">{item.title}</h3>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Summary Section */}
                                <section className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-[20px] font-bold text-on-surface mb-4">Professional Bio</h2>
                                    <p className="text-[15px] text-black/80 leading-relaxed whitespace-pre-line">
                                        {user.summary || "No bio summary added yet. Click 'Edit Profile' to introduce yourself to potential clients."}
                                    </p>
                                </section>

                                {/* Experience Timeline */}
                                <section className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-[20px] font-bold text-on-surface">Work Experience</h2>
                                        <button onClick={() => { setIsExpEdit(false); setIsExpModalOpen(true); }} className="bg-gray-50 text-black/80 p-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    
                                    {!user.experience || user.experience.length === 0 ? (
                                        <p className="text-black/50 italic text-center py-10">No experience history added.</p>
                                    ) : (
                                        <div className="relative ml-4 space-y-12">
                                            <div className="absolute left-[-16px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                                            {user.experience.map((exp: any, i: number) => (
                                                <div key={i} className="relative pl-8 group">
                                                    <div className="absolute left-[-25px] top-1.5 w-[18px] h-[18px] rounded-full bg-white border-4 border-[#b5242c] z-10"></div>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-2">
                                                        <div>
                                                            <h3 className="font-bold text-[16px] text-on-surface">{exp.title}</h3>
                                                            <p className="text-primary font-bold text-[13px]">{exp.company}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[11px] font-bold text-black/50 bg-gray-50 px-3 py-1 rounded-full border border-outline-variant/30">
                                                                {formatPeriod(exp.period)}
                                                            </span>
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEditExperienceClick(i)} className="text-black/50 hover:text-primary transition-colors">
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button onClick={() => handleDeleteItem('experience', i)} className="text-black/50 hover:text-red-500 transition-colors">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[14px] text-black/60 leading-relaxed">{exp.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>

                                {/* Education Section */}
                                <section className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-[20px] font-bold text-on-surface">Education</h2>
                                        <button onClick={() => { setIsEduEdit(false); setIsEduModalOpen(true); }} className="bg-gray-50 text-black/80 p-2 rounded-lg hover:bg-primary hover:text-white transition-all">
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    
                                    {!user.education || user.education.length === 0 ? (
                                        <p className="text-black/50 italic text-center py-6">Education details not added.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {user.education.map((edu: any, i: number) => (
                                                <div key={i} className="p-6 bg-gray-50/50 border border-outline-variant/30 rounded-2xl relative group">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-outline-variant/30 flex items-center justify-center text-primary mb-4">
                                                        <GraduationCap size={22} />
                                                    </div>
                                                    <h3 className="font-bold text-[15px] text-on-surface mb-1">{edu.institution}</h3>
                                                    <p className="text-[13px] font-bold text-black/60 mb-2">{edu.degree}</p>
                                                    <p className="text-[11px] text-black/50 font-medium uppercase tracking-tight">{formatPeriod(edu.period)}</p>
                                                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditEducationClick(i)} className="text-black/50 hover:text-primary transition-colors">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button onClick={() => handleDeleteItem('education', i)} className="text-black/50 hover:text-red-500 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {activeTab === 'projects' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-[20px] font-bold text-on-surface">Projects I've Posted</h2>
                                        <button onClick={() => navigate('/post-project')} className="bg-primary text-white px-5 py-2 rounded-xl text-[13px] font-bold hover:bg-[#a11f27] transition-all flex items-center gap-2">
                                            <Plus size={16} /> Post Project
                                        </button>
                                    </div>
                                    
                                    {fetchingData ? (
                                        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#b5242c] border-t-transparent rounded-full animate-spin"></div></div>
                                    ) : myProjects.length === 0 ? (
                                        <div className="py-20 text-center bg-gray-50/50 border-2 border-dashed border-outline-variant/30 rounded-2xl">
                                            <Briefcase size={40} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-black/50 font-medium">You haven't posted any projects yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myProjects.map((proj) => (
                                                <div key={proj.id} className="p-6 border border-outline-variant/30 rounded-2xl hover:border-[#b5242c]/30 transition-all group bg-white shadow-sm hover:shadow-md">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                                        <div className="flex-1">
                                                            <h4 
                                                                onClick={() => navigate(`/projects/${proj.id}`)}
                                                                className="font-bold text-on-surface text-[17px] group-hover:text-primary cursor-pointer leading-snug mb-2"
                                                            >
                                                                {proj.title}
                                                            </h4>
                                                            <div className="flex flex-wrap items-center gap-4 text-[12px] text-black/50">
                                                                <span className="bg-on-surface text-white px-3 py-0.5 rounded-full font-bold uppercase tracking-tighter text-[9px]">{proj.category}</span>
                                                                <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(proj.postedAt).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1 font-bold text-primary"><MessageSquare size={13} /> {proj.bidCount || 0} Proposals</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-[20px] font-bold text-on-surface">₹{proj.budgetAmount?.toLocaleString()}</p>
                                                            <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest">{proj.paymentType}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-bold text-[10px] border border-green-100">
                                                                LIVE
                                                            </div>
                                                            <span className="text-[12px] font-medium text-black/60">Currently accepting proposals</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => navigate(`/projects/${proj.id}`)}
                                                            className="text-[13px] font-bold text-on-surface hover:text-primary flex items-center gap-1 transition-colors"
                                                        >
                                                            Manage <ExternalLink size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'proposals' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-[20px] font-bold text-on-surface">My Submitted Bids</h2>
                                        <button onClick={() => navigate('/projects')} className="text-primary font-bold text-[13px] flex items-center gap-1 hover:underline">
                                            Browse More <ExternalLink size={14} />
                                        </button>
                                    </div>

                                    {fetchingData ? (
                                        <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#b5242c] border-t-transparent rounded-full animate-spin"></div></div>
                                    ) : myProposals.length === 0 ? (
                                        <div className="py-20 text-center bg-gray-50/50 border-2 border-dashed border-outline-variant/30 rounded-2xl">
                                            <MessageSquare size={40} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-black/50 font-medium">You haven't submitted any bids yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myProposals.map((prop) => (
                                                <div key={prop.id} className="p-6 border border-outline-variant/30 rounded-2xl hover:border-[#b5242c]/30 transition-all bg-white shadow-sm">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                                                        <div className="flex-1">
                                                            <h4 
                                                                onClick={() => navigate(`/projects/${prop.project?.id}`)}
                                                                className="font-bold text-on-surface text-[17px] hover:text-primary cursor-pointer mb-2"
                                                            >
                                                                {prop.project?.title}
                                                            </h4>
                                                            <div className="flex items-center gap-4 text-[11px] text-black/50">
                                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(prop.createdAt).toLocaleDateString()}</span>
                                                                <span className={`px-3 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                                                                    prop.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-orange-50 text-orange-600'
                                                                }`}>
                                                                    {prop.status || 'PENDING'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[20px] font-bold text-on-surface">₹{prop.bidAmount?.toLocaleString()}</p>
                                                            <p className="text-[10px] text-black/50 font-bold uppercase tracking-widest">Your Bid</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                                        <p className="text-[13px] text-black/80 line-clamp-2 italic leading-relaxed">
                                                            "{prop.coverLetter}"
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[12px] font-bold text-on-surface flex items-center gap-1">
                                                                <Smartphone size={14} className="text-black/50" /> {prop.deliveryTime} Days
                                                            </span>
                                                        </div>
                                                        <button 
                                                            onClick={() => navigate(`/projects/${prop.project?.id}`)}
                                                            className="text-[13px] font-bold text-on-surface hover:text-primary transition-colors"
                                                        >
                                                            View Original
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'verifications' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-[20px] font-bold text-on-surface mb-8">Trust & Safety Badges</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {[
                                            { icon: User, label: "Identity", field: "identityVerified", status: user.identityVerified, desc: "Legal ID and government document verification." },
                                            { icon: CreditCard, label: "Payment", field: "paymentVerified", status: user.paymentVerified, desc: "Connected and verified payment withdrawal method." },
                                            { icon: Phone, label: "Phone", field: "phoneVerified", status: user.phoneVerified, desc: "Two-factor authentication via mobile device." },
                                            { icon: Mail, label: "Email", field: "emailVerified", status: user.emailVerified, desc: "Verified corporate or personal email address." }
                                        ].map((item, i) => (
                                            <div key={i} className="p-6 rounded-2xl border border-outline-variant/30 bg-gray-50/50 flex items-start gap-4 transition-all hover:bg-white hover:shadow-md">
                                                <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
                                                    item.status ? 'bg-green-50 border-green-100 text-green-600' : 'bg-white border-outline-variant/30 text-black/50'
                                                }`}>
                                                    <item.icon size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-[15px]">{item.label} Verification</h4>
                                                        {item.status && <CheckCircle2 size={14} className="text-green-500" fill="currentColor" />}
                                                    </div>
                                                    <p className="text-[12px] text-black/60 mb-3">{item.desc}</p>
                                                    {!item.status ? (
                                                        <button 
                                                            onClick={() => handleVerify(item.field)}
                                                            className="text-[11px] font-bold text-primary hover:underline"
                                                        >
                                                            Verify Now
                                                        </button>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-green-600">Active</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl border border-outline-variant/30 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-[20px] font-bold text-on-surface">Account Activity & Security</h2>
                                        <span className="text-[11px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Secure Session</span>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Last Active Time", value: user.lastActiveTime ? new Date(user.lastActiveTime).toLocaleString() : 'Just now', icon: Clock },
                                            { label: "System Name", value: user.lastActiveDevice || 'Windows 11 (Chrome Browser)', icon: Smartphone },
                                            { label: "Login Location", value: user.lastActiveLocation || 'Chennai, Tamil Nadu, IN', icon: MapPin }
                                        ].map((activity, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-outline-variant/10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant/20 flex items-center justify-center text-black/50">
                                                        <activity.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-black/50 uppercase tracking-wider">{activity.label}</p>
                                                        <p className="text-[14px] font-bold text-on-surface">{activity.value}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[12px] text-primary font-bold cursor-pointer hover:underline">View Logs</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-4">
                                        <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                        <div>
                                            <h4 className="text-[14px] font-bold text-orange-800 mb-1">Security Recommendation</h4>
                                            <p className="text-[12px] text-orange-700 leading-relaxed">
                                                We noticed you're accessing from a new device. Please ensure Two-Factor Authentication is enabled for maximum security.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar) - Now handled in Top Container for primary info */}
                    <aside className="lg:col-span-4 space-y-6">
                        {/* You can add secondary sidebar widgets here later */}
                    </aside>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
