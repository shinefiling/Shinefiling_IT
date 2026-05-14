import React, { useState, useEffect } from 'react';
import { 
    User, Shield, Lock, Bell, CheckCircle, MapPin,
    Save, Key, Wallet, ShieldCheck, Briefcase, 
    AlertCircle, Smartphone, Check, Clock, Eye, EyeOff
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const Settings: React.FC = () => {
    const [activeSection, setActiveSection] = useState('profile');
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setProfile(parsedUser);
            if (!parsedUser.profileFetched) {
                fetchProfile(parsedUser.email, parsedUser);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }

        const handleUserUpdate = () => {
            const freshUser = localStorage.getItem('user');
            if (freshUser) {
                setProfile(JSON.parse(freshUser));
            }
        };

        window.addEventListener('user-updated', handleUserUpdate);
        return () => window.removeEventListener('user-updated', handleUserUpdate);
    }, []);

    const fetchProfile = async (email: string, currentUser: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles/${email}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                const updated = { ...currentUser, ...data, profileFetched: true };
                setProfile(updated);
                localStorage.setItem('user', JSON.stringify(updated));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Email & Notifications', icon: Bell },
        { id: 'membership', label: 'Membership', icon: Briefcase },
        { id: 'password', label: 'Password', icon: Key },
        { id: 'financials', label: 'Payment & Financials', icon: Wallet },
        { id: 'security', label: 'Account Security', icon: ShieldCheck },
        { id: 'verification', label: 'Trust & Verification', icon: Shield },
        { id: 'account', label: 'Account', icon: AlertCircle },
    ];

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        try {
            setSaving(true);
            const response = await fetch(`${API_BASE_URL}/api/profiles`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                setSuccessMsg("Settings saved successfully!");
                setTimeout(() => setSuccessMsg(null), 3000);
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
            <div className="w-10 h-10 border-4 border-[#0066ff] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-[#f8f9fa] min-h-screen pt-[110px] pb-20 font-['Poppins']">
            <div className="max-w-[1240px] mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <div className="lg:w-[300px] shrink-0">
                        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden sticky top-[110px]">
                            <div className="p-5 border-b border-gray-50 bg-gray-50/30">
                                <h3 className="font-bold text-[#12151b] text-[15px] tracking-tight uppercase opacity-50">User Settings</h3>
                            </div>
                            <div className="flex flex-col">
                                {sidebarItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`flex items-center gap-3.5 px-6 py-4.5 text-[14px] font-medium transition-all relative border-b border-gray-50/50 last:border-0 ${
                                            activeSection === item.id 
                                            ? 'text-[#0066ff] bg-blue-50/20' 
                                            : 'text-gray-500 hover:text-[#12151b] hover:bg-gray-50'
                                        }`}
                                    >
                                        {activeSection === item.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#0066ff]" />
                                        )}
                                        <item.icon size={19} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden min-h-[700px]">
                            
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <h2 className="text-[20px] font-bold text-[#12151b] tracking-tight">
                                    {sidebarItems.find(i => i.id === activeSection)?.label} Details
                                </h2>
                                {activeSection === 'profile' && (
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-8 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2 text-[14px] disabled:opacity-50"
                                    >
                                        {saving ? "Saving..." : <><Save size={18} /> Save Settings</>}
                                    </button>
                                )}
                            </div>

                            {/* Section: Profile */}
                            {activeSection === 'profile' && (
                                <div className="p-8 space-y-12">
                                    {/* Name Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                                            <h3 className="text-[16px] font-bold text-[#12151b]">Personal Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2.5">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">First Name</label>
                                                <input 
                                                    type="text" 
                                                    value={profile?.fullName?.split(' ')[0] || ''}
                                                    onChange={(e) => setProfile({...profile, fullName: e.target.value + ' ' + (profile.fullName?.split(' ')[1] || '')})}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] focus:ring-4 focus:ring-blue-50 transition-all font-medium text-[#12151b]"
                                                />
                                            </div>
                                            <div className="space-y-2.5">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Last Name</label>
                                                <input 
                                                    type="text" 
                                                    value={profile?.fullName?.split(' ').slice(1).join(' ') || ''}
                                                    onChange={(e) => setProfile({...profile, fullName: (profile.fullName?.split(' ')[0] || '') + ' ' + e.target.value})}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] focus:ring-4 focus:ring-blue-50 transition-all font-medium text-[#12151b]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                                            <h3 className="text-[16px] font-bold text-[#12151b]">Address</h3>
                                        </div>
                                        <div className="space-y-5">
                                            <div className="space-y-2.5">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Full Address</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="123 Street Name, Area"
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium text-[#12151b]"
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Apartment, suite, etc. (optional)"
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium text-[#12151b]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2.5">
                                                    <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">City / Town</label>
                                                    <input 
                                                        type="text" 
                                                        value={profile?.location?.split(',')[0] || ''}
                                                        onChange={(e) => setProfile({...profile, location: e.target.value + (profile.location?.includes(',') ? ',' + profile.location.split(',').slice(1).join(',') : '')})}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium text-[#12151b]"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2.5">
                                                        <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">ZIP Code</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="600001"
                                                            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium text-[#12151b]"
                                                        />
                                                    </div>
                                                    <div className="space-y-2.5">
                                                        <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">State</label>
                                                        <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium appearance-none text-[#12151b]">
                                                            <option>Tamil Nadu</option>
                                                            <option>Karnataka</option>
                                                            <option>Maharashtra</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2.5">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Country</label>
                                                <div className="relative group">
                                                    <input 
                                                        type="text" 
                                                        readOnly
                                                        value="India"
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-[14px] text-gray-400 font-medium cursor-not-allowed"
                                                    />
                                                    <Lock size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                                </div>
                                                <p className="text-[12px] text-gray-400 leading-relaxed">
                                                    To change your country, you need to <span className="text-[#0066ff] hover:underline cursor-pointer font-bold">verify your address</span>. This is required for tax and payment compliance.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Localization */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-2.5">
                                            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Time zone</label>
                                            <div className="relative">
                                                <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium appearance-none text-[#12151b]">
                                                    <option>Asia/Kolkata (GMT +05:30)</option>
                                                    <option>UTC +00:00</option>
                                                </select>
                                                <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Current Location</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    value={profile?.location || ""}
                                                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium text-[#12151b]"
                                                />
                                                <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0066ff]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Language Settings */}
                                    <div className="space-y-6 pt-6 border-t border-gray-50">
                                        <h3 className="text-[16px] font-bold text-[#12151b]">Language Settings</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-2.5">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Website Language</label>
                                                <select className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#0066ff] transition-all font-medium text-[#12151b]">
                                                    <option>English (US)</option>
                                                    <option>English (UK)</option>
                                                    <option>Tamil</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2.5">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Project Discovery</label>
                                                <div className="w-full min-h-[48px] bg-white border border-gray-200 rounded-lg px-4 py-2 flex flex-wrap gap-2 items-center">
                                                    {['English', 'JavaScript', 'React'].map(tag => (
                                                        <span key={tag} className="bg-blue-50 text-[#0066ff] px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 border border-blue-100">
                                                            {tag} <X size={10} className="cursor-pointer hover:text-red-500" />
                                                        </span>
                                                    ))}
                                                    <input type="text" placeholder="Add..." className="flex-1 outline-none text-[12px] bg-transparent min-w-[50px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Section */}
                                    <div className="p-6 bg-[#f8f9fa] rounded-xl border border-gray-100">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#0066ff] shadow-sm">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[14px] font-bold text-[#12151b]">Security Phone Number</h4>
                                                    <p className="text-[12px] text-gray-500">For two-step verification and account recovery</p>
                                                </div>
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                                                Verified <CheckCircle size={10} />
                                            </span>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[13px] font-medium text-gray-600">Primary: <span className="text-[#12151b] font-bold">+91 9489529875</span></p>
                                                <p className="text-[13px] font-medium text-gray-600">Country: <span className="text-[#12151b] font-bold">India (IN)</span></p>
                                            </div>
                                            <button className="bg-white border border-gray-200 text-[#12151b] px-6 py-2.5 rounded-lg text-[13px] font-bold hover:border-[#0066ff] hover:text-[#0066ff] transition-all shadow-sm">
                                                Request to Change
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Section: Password */}
                            {activeSection === 'password' && (
                                <div className="p-10 max-w-[600px]">
                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="text-[18px] font-bold text-[#12151b]">Update Password</h3>
                                            <p className="text-[13px] text-gray-400">Ensure your account is using a long, random password to stay secure.</p>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
                                                <div className="relative">
                                                    <input 
                                                        type={showPassword ? "text" : "password"} 
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#b5242c] transition-all"
                                                    />
                                                    <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#b5242c] transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                                                <input 
                                                    type="password" 
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-[#b5242c] transition-all"
                                                />
                                            </div>
                                        </div>
                                        
                                        <button className="bg-[#12151b] text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-all">
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Coming Soon Sections */}
                            {['notifications', 'membership', 'financials', 'security', 'verification', 'account'].includes(activeSection) && activeSection !== 'profile' && activeSection !== 'password' && (
                                <div className="p-20 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
                                    <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                            <Shield size={32} className="text-[#0066ff]" />
                                        </div>
                                    </div>
                                    <h2 className="text-[24px] font-bold text-[#12151b] mb-3 tracking-tight">
                                        {sidebarItems.find(i => i.id === activeSection)?.label} Management
                                    </h2>
                                    <p className="text-gray-400 max-w-[420px] mx-auto text-[15px] leading-relaxed">
                                        We're currently enhancing the <strong>{sidebarItems.find(i => i.id === activeSection)?.label.toLowerCase()}</strong> module to give you more granular control over your experience. 
                                        This feature will be available in the next platform update.
                                    </p>
                                    <div className="mt-10 flex gap-4">
                                        <button className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-[13px] font-bold hover:bg-gray-200 transition-all">Learn More</button>
                                        <button onClick={() => setActiveSection('profile')} className="px-6 py-2.5 bg-[#0066ff] text-white rounded-lg text-[13px] font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all">Back to Profile</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Bottom Info Card */}
                        <div className="mt-8 bg-[#1e2329] rounded-lg p-8 flex items-center justify-between text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-[18px] font-bold mb-2">Need professional assistance?</h3>
                                <p className="text-gray-400 text-[13px] max-w-[400px]">Our support team is available 24/7 to help you with your account configuration or any technical queries.</p>
                            </div>
                            <button className="bg-white text-[#12151b] px-8 py-3 rounded-lg font-bold text-[14px] hover:scale-105 transition-all relative z-10">Contact Support</button>
                            <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Global Success Notification */}
            {successMsg && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] animate-in slide-in-from-bottom-10">
                    <div className="bg-[#12151b] text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-white/10 min-w-[300px]">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                            <CheckCircle size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-[14px] leading-tight">Operation Successful</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">{successMsg}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const X: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default Settings;
