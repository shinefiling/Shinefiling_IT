import { useState, useEffect } from 'react';
import { 
    Calendar, ShieldCheck, 
    Mail, Plus, 
    ExternalLink, Briefcase, 
    MessageSquare, AlertCircle,
    X, CheckCircle2,
    Building2, Users, Edit2,
    LifeBuoy, ArrowLeft, ChevronRight,
    MapPin, Globe, History, Star, Image as ImageIcon, Trash2,
    TrendingUp, Award, Verified, Wallet, CreditCard, LayoutDashboard,
    Search, Bell, LogOut, Settings, Check, Clock, UserPlus,
    PlusCircle, ChevronDown, User, Activity, CheckSquare, History as HistoryIcon
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const ClientProfile: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isPublicView, setIsPublicView] = useState(false);
    
    const queryParams = new URLSearchParams(location.search);
    const queryEmail = queryParams.get('email');
    const queryTab = queryParams.get('tab');

    const [activeTab, setActiveTab] = useState<'dashboard' | 'wallet' | 'jobs' | 'verifications' | 'messages' | 'settings'> (
        (queryTab as any) || 'dashboard'
    );
    const [myProjects, setMyProjects] = useState<any[]>([]);
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [proposals, setProposals] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [escrows, setEscrows] = useState<any[]>([]);
    const [operationalMetrics, setOperationalMetrics] = useState({
        monthlySpend: 0,
        activeEscrow: 0,
        auditScore: 88
    });

    useEffect(() => {
        const fetchProfile = async () => {
            let targetEmail = queryEmail;
            const storedUser = localStorage.getItem('user');
            
            if (!targetEmail && !storedUser) {
                navigate('/login');
                return;
            }

            if (!targetEmail || targetEmail === 'undefined') {
                if (!storedUser) {
                    navigate('/login');
                    return;
                }
                const userData = JSON.parse(storedUser);
                targetEmail = userData.email;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/profiles/${targetEmail}`);
                if (response.ok) {
                    const profileData = await response.json();
                    setUser(profileData);
                    setEditForm(profileData);
                    fetchDynamicData(profileData);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [queryEmail]);

    const fetchDynamicData = async (profile: any) => {
        if (!profile?.email) return;

        try {
            const [jobsRes, projectsRes, txRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/jobs/client/${profile.email}`),
                fetch(`${API_BASE_URL}/api/projects/client/${profile.id}`),
                fetch(`${API_BASE_URL}/api/wallet/transactions/${profile.id || 0}`)
            ]);

            if (jobsRes.ok) setMyJobs(await jobsRes.json());
            if (projectsRes.ok) setMyProjects(await projectsRes.json());
            if (txRes.ok) setTransactions(await txRes.json());

            const appsRes = await fetch(`${API_BASE_URL}/api/job-applications/client/${profile.email}`);
            if (appsRes.ok) setApplications(await appsRes.json());

            const proposalsRes = await fetch(`${API_BASE_URL}/api/proposals/client/${profile.id}`);
            if (proposalsRes.ok) setProposals(await proposalsRes.json());

            const escrowsRes = await fetch(`${API_BASE_URL}/api/escrows/client/${profile.id}`);
            if (escrowsRes.ok) setEscrows(await escrowsRes.json());
            
        } catch (err) {
            console.error("Error fetching dynamic data:", err);
        }
    };

    const handleReleaseEscrow = async (escrowId: number) => {
        if (!window.confirm('Are you sure you want to release these funds to the freelancer?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/escrows/${escrowId}/release`, {
                method: 'POST'
            });
            if (response.ok) {
                alert('Funds released successfully!');
                fetchDynamicData(user);
            }
        } catch (err) {
            console.error("Error releasing escrow:", err);
        }
    };

    const handleRefundEscrow = async (escrowId: number) => {
        if (!window.confirm('Are you sure you want to refund these funds to your wallet?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/escrows/${escrowId}/refund`, {
                method: 'POST'
            });
            if (response.ok) {
                alert('Funds refunded successfully!');
                fetchDynamicData(user);
            }
        } catch (err) {
            console.error("Error refunding escrow:", err);
        }
    };

    const handleAddFunds = async () => {
        const amount = prompt('Enter amount to deposit:');
        if (!amount || isNaN(Number(amount))) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/wallet/deposit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    amount: Number(amount),
                    referenceId: 'MANUAL-' + Date.now()
                })
            });
            if (response.ok) {
                alert('Funds added successfully!');
                fetchDynamicData(user);
                // Also update user state balance
                setUser({ ...user, walletBalance: (user.walletBalance || 0) + Number(amount) });
            }
        } catch (err) {
            console.error("Error adding funds:", err);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ ...user, ...editForm })
            });
            if (response.ok) {
                const updated = await response.json();
                setUser(updated);
                localStorage.setItem('user', JSON.stringify(updated));
                setIsEditModalOpen(false);
                alert('Profile updated successfully!');
            }
        } catch (err) {
            console.error("Error saving profile:", err);
        }
    };

    const handleUpdatePhoto = async () => {
        if (!selectedFile || !user?.email) return;
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles/upload-photo/${user.email}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const updated = await response.json();
                setUser(updated);
                setIsPhotoModalOpen(false);
                setPhotoPreview(null);
            }
        } catch (err) {
            console.error("Error uploading photo:", err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    const handleApproveBid = async (proposalId: number) => {
        if (!window.confirm('Are you sure you want to approve this bid? The bid amount will be held in escrow.')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/proposals/${proposalId}/accept`, {
                method: 'POST'
            });
            if (response.ok) {
                alert('Bid approved and funds held in escrow!');
                fetchDynamicData(user);
                // Update local user state for balance
                const updatedProposal = await response.json();
                setUser({ ...user, walletBalance: user.walletBalance - updatedProposal.bidAmount });
            } else {
                const error = await response.json();
                alert('Error: ' + (error.message || 'Failed to approve bid'));
            }
        } catch (err) {
            console.error("Error approving bid:", err);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-5 rounded-none border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-none ${color} flex items-center justify-center text-white shadow-md`}>
                    <Icon size={18} />
                </div>
                {trend && (
                    <span className="text-[10px] font-bold text-[#b5242c] bg-[#b5242c]/5 px-2 py-0.5 rounded-none flex items-center gap-1">
                        <TrendingUp size={10} /> {trend}
                    </span>
                )}
            </div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-0.5">{title}</p>
            <p className="text-[22px] font-bold text-[#1a1a1a]">{value}</p>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'wallet':
                const activeEscrowAmount = escrows
                    .filter(e => e.status === 'HELD')
                    .reduce((sum, e) => sum + e.amount, 0);

                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 space-y-6">
                        {/* Wallet Balance Card */}
                        <div className="bg-white rounded-none px-8 py-6 text-[#1a1a1a] border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest">Financial Standing</p>
                                    <h2 className="text-[40px] font-bold tracking-tighter">₹{user?.walletBalance?.toLocaleString() || '0.00'}</h2>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleAddFunds}
                                        className="bg-[#b5242c] text-white px-6 py-2 rounded-none font-bold text-[12px] hover:bg-black transition-all"
                                    >
                                        Add Funds
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-none font-bold text-[12px]">Withdraw</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 border-t border-gray-50 pt-6">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-1">Total Spent</p>
                                    <p className="text-[18px] font-bold">₹{transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-1">Active Escrow</p>
                                    <p className="text-[18px] font-bold text-[#b5242c]">₹{activeEscrowAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-1">Last Transaction</p>
                                    <p className="text-[18px] font-bold opacity-60">#{transactions[0]?.id || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Management Section */}
                        <div className="bg-white border border-gray-100 rounded-none p-6 shadow-sm">
                            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-[#b5242c]" /> Escrow Management
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                                            <th className="py-3 px-4">Project</th>
                                            <th className="py-3 px-4">Freelancer</th>
                                            <th className="py-3 px-4">Amount</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {escrows.length === 0 ? (
                                            <tr><td colSpan={5} className="py-10 text-center text-gray-400 italic">No escrow records found</td></tr>
                                        ) : (
                                            escrows.map(escrow => (
                                                <tr key={escrow.id} className="text-[13px] hover:bg-gray-50">
                                                    <td className="py-4 px-4 font-bold">{escrow.project?.title}</td>
                                                    <td className="py-4 px-4">{escrow.freelancer?.fullName}</td>
                                                    <td className="py-4 px-4 font-bold">₹{escrow.amount.toLocaleString()}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold ${
                                                            escrow.status === 'HELD' ? 'bg-amber-50 text-amber-600' :
                                                            escrow.status === 'RELEASED' ? 'bg-green-50 text-green-600' :
                                                            'bg-gray-50 text-gray-600'
                                                        }`}>
                                                            {escrow.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        {escrow.status === 'HELD' && (
                                                            <div className="flex gap-2 justify-end">
                                                                <button 
                                                                    onClick={() => handleReleaseEscrow(escrow.id)}
                                                                    className="text-green-600 font-bold hover:underline"
                                                                >
                                                                    Release
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleRefundEscrow(escrow.id)}
                                                                    className="text-red-600 font-bold hover:underline"
                                                                >
                                                                    Refund
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="bg-white border border-gray-100 rounded-none p-6 shadow-sm">
                            <h3 className="text-[18px] font-bold text-[#1a1a1a] mb-6">Recent Transactions</h3>
                            <div className="space-y-4">
                                {transactions.length === 0 ? (
                                    <div className="py-10 text-center opacity-40 font-semibold">No Transaction History</div>
                                ) : (
                                    transactions.map((tx: any) => (
                                        <div key={tx.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-none flex items-center justify-center ${tx.type === 'DEPOSIT' || tx.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-[#1a1a1a]">{tx.description || tx.title || 'Wallet Transaction'}</p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'N/A'} • #{tx.id}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className={`text-[14px] font-bold ${tx.type === 'DEPOSIT' || tx.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.type === 'DEPOSIT' || tx.type === 'IN' ? '+' : '-'}₹{tx.amount?.toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'jobs':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 space-y-8">
                        {/* Summary Cards Section */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white border border-gray-100 p-6 rounded-none shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={18} className="text-[#b5242c]" />
                                        <h4 className="text-[14px] font-bold text-[#242424]">Inventory Status</h4>
                                    </div>
                                    <button className="text-gray-300"><ChevronRight size={16} /></button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: 'Total', value: myProjects.length + myJobs.length, trend: '+2' },
                                        { label: 'Active', value: myProjects.length, trend: '+1' },
                                        { label: 'Pending', value: applications.length, trend: '-3' },
                                        { label: 'Rejected', value: '0', trend: '0' },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <p className="text-[10px] font-bold text-gray-400 mb-1">{stat.label}</p>
                                            <p className="text-[20px] font-bold text-[#1a1a1a]">{stat.value}</p>
                                            <p className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-[#b5242c]' : 'text-gray-400'}`}>{stat.trend} vs yesterday</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-100 p-6 rounded-none shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={18} className="text-[#b5242c]" />
                                        <h4 className="text-[14px] font-bold text-[#242424]">Operational Summary</h4>
                                    </div>
                                    <button className="text-gray-300"><ChevronRight size={16} /></button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: 'Projects', value: myProjects.length, trend: '+12' },
                                        { label: 'Jobs', value: myJobs.length, trend: '+5' },
                                        { label: 'Bids', value: proposals.length, trend: '-2' },
                                        { label: 'Hirings', value: '0', trend: '-6' },
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <p className="text-[10px] font-bold text-gray-400 mb-1">{stat.label}</p>
                                            <p className="text-[20px] font-bold text-[#1a1a1a]">{stat.value}</p>
                                            <p className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-[#b5242c]' : 'text-gray-400'}`}>{stat.trend} vs yesterday</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-none p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-none flex items-center justify-center">
                                        <LayoutDashboard size={24} className="text-[#b5242c]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">Project Inventory</h3>
                                        <p className="text-[13px] text-gray-500 font-medium">Manage and oversee your active freelance projects</p>
                                    </div>
                                    <span className="bg-[#b5242c] text-white text-[12px] font-bold px-2.5 py-0.5 rounded-none ml-1">{myProjects.length}</span>
                                </div>
                                <button onClick={() => navigate('/post-project')} className="bg-[#b5242c] text-white px-6 py-3 rounded-none font-bold text-[14px] flex items-center gap-2 transition-all hover:bg-[#00332c] hover:shadow-lg active:scale-95">
                                    <PlusCircle size={20} /> Post New Project
                                </button>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50/50 p-2 rounded-none border border-gray-100">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-[320px]">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by title..." 
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-none text-[14px] outline-none focus:border-[#b5242c] transition-all"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-none text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                        <Wallet size={16} className="text-[#b5242c]" /> Compensation <ChevronDown size={14} />
                                    </button>
                                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-none text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                                        <CheckCircle2 size={16} className="text-[#b5242c]" /> Status <ChevronDown size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                                    <button className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[#b5242c] transition-colors">
                                        <Settings size={18} /> Settings
                                    </button>
                                    <button className="bg-[#1a1a1a] text-white px-6 py-3 rounded-none font-bold text-[13px] flex items-center gap-2 transition-all hover:bg-black hover:shadow-lg active:scale-95">
                                        <Check size={18} /> Bulk Approve
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-sm mb-10">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[#1a1a1a] text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                                            <th className="py-4 px-6 w-[15%]">Request Date</th>
                                            <th className="py-4 px-6 w-[20%]">Freelancer</th>
                                            <th className="py-4 px-6 w-[35%]">Project Details</th>
                                            <th className="py-4 px-6 w-[15%]">Budget</th>
                                            <th className="py-4 px-6 w-[15%] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {myProjects.length === 0 ? (
                                            <tr><td colSpan={5} className="py-20 text-center text-gray-400 font-medium italic bg-gray-50/20">No projects found in your inventory</td></tr>
                                        ) : (
                                            myProjects.map((project, idx) => (
                                                <tr key={project.id} className="transition-all hover:bg-gray-50/50 group">
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[13px] font-semibold text-gray-700">12 May 2024</p>
                                                        <p className="text-[11px] text-gray-400 mt-0.5">10:30 AM</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-none overflow-hidden border border-gray-100 shrink-0">
                                                                <img src={`https://i.pravatar.cc/150?u=${project.id}`} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="text-[13px] font-bold text-[#1a1a1a] truncate">Freelancer #{project.id}</p>
                                                                <p className="text-[10px] text-[#b5242c] font-semibold">Top Rated</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug line-clamp-2">{project.title}</p>
                                                        <p className="text-[11px] text-gray-400 mt-1">{project.category || 'Development'}</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[14px] font-bold text-[#1a1a1a]">₹{project.budgetAmount?.toLocaleString()}</p>
                                                        <p className="text-[10px] text-gray-400 font-semibold">Fixed Price</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button className="p-1.5 rounded-none border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                                                <X size={16} />
                                                            </button>
                                                            <button className="bg-[#b5242c] text-white px-3 py-1.5 rounded-none font-bold text-[11px] hover:bg-[#00332c] transition-all">
                                                                Approve
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-none p-8 mb-8 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-none flex items-center justify-center">
                                        <Briefcase size={24} className="text-[#b5242c]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">Job Postings</h3>
                                        <p className="text-[13px] text-gray-500 font-medium">Manage corporate employment opportunities</p>
                                    </div>
                                    <span className="bg-[#b5242c] text-white text-[12px] font-bold px-2.5 py-0.5 rounded-none ml-1">{myJobs.length}</span>
                                </div>
                                <button onClick={() => navigate('/post-job')} className="bg-[#b5242c] text-white px-6 py-3 rounded-none font-bold text-[14px] flex items-center gap-2 transition-all hover:bg-[#b5242c] active:scale-95">
                                    <Plus size={20} /> Post New Job
                                </button>
                            </div>
                            
                            <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[#1a1a1a] text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                                            <th className="py-4 px-6 w-[40%]">Job Details</th>
                                            <th className="py-4 px-6 w-[20%]">Enterprise</th>
                                            <th className="py-4 px-6 w-[20%]">Compensation</th>
                                            <th className="py-4 px-6 w-[20%] text-right">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {myJobs.length === 0 ? (
                                            <tr><td colSpan={4} className="py-20 text-center text-gray-400 font-bold italic bg-gray-50/20">No job postings found</td></tr>
                                        ) : (
                                            myJobs.map(job => (
                                                <tr key={job.id} className="hover:bg-gray-50/50 transition-all group">
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[13px] font-bold text-[#1a1a1a] leading-snug line-clamp-2">{job.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="px-2 py-0.5 bg-[#b5242c]/10 text-[#b5242c] text-[9px] font-bold rounded-none tracking-widest">{job.type}</span>
                                                            <span className="text-[10px] text-gray-400 font-medium">Posted 2 days ago</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 align-top text-[13px] font-bold text-gray-700 truncate">{job.company}</td>
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[14px] font-bold text-[#1a1a1a]">₹{job.price?.toLocaleString()}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold">Per Annum</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top text-right">
                                                        <p className="text-[13px] text-gray-700 font-bold">{job.location}</p>
                                                        <p className="text-[11px] text-gray-400">Remote Available</p>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-none p-8 mb-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gray-50 rounded-none flex items-center justify-center">
                                    <Star size={24} className="text-[#b5242c]" />
                                </div>
                                <div>
                                    <h3 className="text-[24px] font-bold text-[#1a1a1a] tracking-tight">Active Proposals</h3>
                                    <p className="text-[13px] text-gray-500 font-medium">Bids received on your active projects</p>
                                </div>
                                <span className="bg-[#b5242c] text-white text-[12px] font-bold px-2.5 py-0.5 rounded-none ml-1">{proposals.length}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-6">
                                {proposals.length === 0 ? (
                                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                        <Star size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-bold italic">No proposals received yet</p>
                                    </div>
                                ) : (
                                    proposals.map(prop => (
                                        <div key={prop.id} className="bg-white rounded-none border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#b5242c]/5 rounded-none translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
                                            
                                            <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className="w-12 h-12 rounded-none bg-gradient-to-br from-[#1e2329] to-[#000] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                                                            {prop.freelancer?.fullName?.charAt(0) || prop.freelancer?.username?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[18px] font-bold text-[#1a1a1a]">{prop.freelancer?.fullName || prop.freelancer?.username}</h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-[#b5242c]">
                                                                    <Verified size={12} /> Verified Expert
                                                                </span>
                                                                <span className="text-gray-300">•</span>
                                                                <p className="text-[11px] text-gray-400 font-bold">Project ID: <span className="text-gray-600 font-bold">#{prop.projectId || 'N/A'}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-3 gap-6 py-4 border-y border-gray-50 mb-5">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">Bid Amount</p>
                                                            <p className="text-[18px] font-bold text-[#b5242c]">₹{prop.bidAmount?.toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">Timeline</p>
                                                            <p className="text-[15px] font-bold text-gray-700 flex items-center gap-2">
                                                                <Clock size={16} className="text-gray-400" /> {prop.deliveryTime}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">Status</p>
                                                            <span className={`inline-flex px-2.5 py-1 rounded-none text-[10px] font-bold tracking-tight ${prop.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-[#b5242c]/5 text-[#b5242c] border border-[#b5242c]'}`}>
                                                                {prop.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <p className="text-[11px] font-bold text-gray-400 tracking-wider mb-2">Proposal Brief</p>
                                                        <p className="text-[14px] text-gray-600 leading-relaxed italic line-clamp-2 bg-gray-50 p-4 rounded-none border border-gray-100">
                                                            "{prop.coverLetter}"
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="lg:w-48 flex flex-col justify-center gap-3">
                                                    <button 
                                                        onClick={() => window.dispatchEvent(new CustomEvent('open-chat', { 
                                                            detail: { 
                                                                 contact: { 
                                                                      name: prop.freelancer?.fullName || prop.freelancer?.username, 
                                                                      username: prop.freelancer?.username,
                                                                      email: prop.freelancer?.email,
                                                                      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                                                                  } 
                                                             } 
                                                        }))}
                                                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-none font-bold text-[13px] hover:border-[#b5242c] hover:text-[#b5242c] transition-all group/chat"
                                                    >
                                                        <MessageSquare size={18} className="text-gray-400 group-hover/chat:text-[#b5242c]" /> Open Terminal
                                                    </button>
                                                    <button 
                                                        onClick={() => handleApproveBid(prop.id)}
                                                        className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-none font-bold text-[13px] hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
                                                        disabled={prop.status !== 'PENDING'}
                                                    >
                                                        <Check size={18} /> {prop.status === 'PENDING' ? 'Approve Bid' : 'Accepted'}
                                                    </button>
                                                    <button className="w-full bg-white border border-gray-100 text-gray-400 px-4 py-2 rounded-none font-bold text-[11px] hover:bg-red-50 hover:text-red-500 transition-all">
                                                        Decline
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-none p-8">
                            <h3 className="text-[20px] font-bold text-[#1a1a1a] mb-6">Recent Job Applications</h3>
                            <div className="space-y-4">
                                {applications.length === 0 ? (
                                    <div className="py-10 text-center opacity-40 font-bold">No Job Applications Received</div>
                                ) : (
                                    applications.map(app => (
                                        <div key={app.id} className="p-5 border border-gray-50 rounded-none bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-10 h-10 rounded-none bg-[#b5242c] text-white flex items-center justify-center font-bold text-sm">
                                                        {app.fullName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[16px] font-bold text-[#1a1a1a]">{app.fullName}</h4>
                                                        <p className="text-[12px] text-gray-500 font-bold">Applied for: <span className="font-bold text-gray-700">{app.jobTitle}</span></p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1">Experience</p>
                                                        <p className="text-[13px] font-bold text-gray-700">{app.experience}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 mb-1">Location</p>
                                                        <p className="text-[13px] font-bold text-gray-700">{app.location}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <p className="text-[10px] font-bold text-gray-400 mb-1">Skills</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {app.skills?.split(',').map((skill: string) => (
                                                            <span key={skill} className="px-2 py-1 bg-white border border-gray-100 rounded-none text-[10px] font-bold text-gray-600">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between items-end gap-3">
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-none text-[10px] font-bold ${app.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-[#b5242c]/5 text-[#b5242c]'}`}>
                                                        {app.status}
                                                    </span>
                                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(app.submittedAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => window.dispatchEvent(new CustomEvent('open-chat', { 
                                                            detail: { 
                                                                contact: { 
                                                                    name: app.fullName, 
                                                                    username: app.username,
                                                                    email: app.email,
                                                                    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                                                                } 
                                                            } 
                                                        }))}
                                                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-none font-bold text-[12px] hover:border-[#b5242c] hover:text-[#b5242c] transition-all"
                                                    >
                                                        <MessageSquare size={16} /> Chat
                                                    </button>
                                                    <button className="bg-[#b5242c] text-white px-4 py-2 rounded-none font-bold text-[12px] active:scale-95 transition-all">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'messages':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 bg-[#fdfaf0] border border-[#e2bebc]/20 rounded-none p-6 min-h-[500px]">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#e2bebc]/10">
                            <h3 className="text-[20px] font-bold text-[#261817]">Communications Terminal</h3>
                            <button className="bg-[#b5242c] text-white px-5 py-2 rounded-lg font-bold text-[12px]">Broadcast Message</button>
                        </div>
                        <div className="space-y-2">
                            {transactions.filter(t => t.type === 'MESSAGE').length === 0 ? ( // Using transactions state for messages temporarily if needed, or real messages state
                                <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                    <MessageSquare size={48} className="mb-4" />
                                    <p className="font-bold text-[14px]">No Encrypted Comms Found</p>
                                </div>
                            ) : (
                                transactions.map((msg: any) => (
                                    <div key={msg.id} className="p-4 bg-[#fff0ef]/30 rounded-lg border border-[#e2bebc]/10 hover:border-[#b5242c]/30 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[14px] font-bold text-[#261817] group-hover:text-[#b5242c] transition-colors">{msg.senderEmail}</p>
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{new Date(msg.sentAt).toLocaleTimeString()}</p>
                                        </div>
                                        <p className="text-[13px] text-[#5a403f] line-clamp-1 opacity-70">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                );
            case 'verifications':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 grid grid-cols-2 gap-6">
                        <div className="bg-[#fdfaf0] border border-[#e2bebc]/20 rounded-none p-6">
                            <h3 className="text-[18px] font-bold text-[#261817] mb-6">Corporate Credentials</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Business Identity', status: user?.identityVerified ? 'Verified' : 'Pending', date: 'Exp: 2025', icon: user?.identityVerified ? <ShieldCheck className="text-[#b5242c]" /> : <Clock className="text-amber-600" /> },
                                    { label: 'Financial Compliance', status: user?.paymentVerified ? 'Verified' : 'Required', date: 'Tax ID: OK', icon: user?.paymentVerified ? <ShieldCheck className="text-[#b5242c]" /> : <AlertCircle className="text-red-600" /> },
                                    { label: 'Contact Authentication', status: user?.phoneVerified ? 'Verified' : 'Pending', date: 'Verified via OTP', icon: user?.phoneVerified ? <ShieldCheck className="text-[#b5242c]" /> : <Clock className="text-amber-600" /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-[#fff0ef]/30 rounded-lg border border-[#e2bebc]/10">
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <div>
                                                <p className="text-[14px] font-bold text-[#261817]">{item.label}</p>
                                                <p className="text-[11px] text-[#5a403f] opacity-60 font-bold">{item.date}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${item.status === 'Verified' ? 'bg-[#b5242c]/5' : 'bg-amber-50 text-amber-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#fff0ef]/20 border border-dashed border-[#e2bebc] rounded-xl flex flex-col items-center justify-center p-10 text-center">
                            <ShieldCheck size={48} className="text-[#920218] mb-4 opacity-20" />
                            <h4 className="text-[16px] font-bold text-[#261817] mb-2">Upload New Credential</h4>
                            <p className="text-[12px] text-[#5a403f] opacity-60 mb-6">PDF or JPEG (Max 5MB)</p>
                            <button className="bg-white border border-[#e2bebc] px-6 py-2 rounded-lg font-bold text-[12px] text-[#5a403f] hover:bg-white/50 transition-all">Select File</button>
                        </div>
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 bg-[#fdfaf0] border border-[#e2bebc]/20 rounded-none p-8">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#e2bebc]/10">
                            <h3 className="text-[20px] font-bold text-[#261817]">Profile Configuration</h3>
                            <button onClick={handleSaveProfile} className="bg-[#b5242c] text-white px-6 py-2 rounded-lg font-bold text-[13px] hover:shadow-lg transition-all shadow-[0_10px_20px_-5px_rgba(181,36,44,0.3)]">Save Changes</button>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-[#5a403f] uppercase tracking-widest mb-2 block">Enterprise Name</label>
                                    <input 
                                        type="text" 
                                        value={editForm.fullName || ''} 
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full bg-[#fff0ef]/30 border border-[#e2bebc]/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#b5242c]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#5a403f] uppercase tracking-widest mb-2 block">Operational Brief</label>
                                    <textarea 
                                        rows={4}
                                        value={editForm.summary || ''}
                                        onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                                        className="w-full bg-[#fff0ef]/30 border border-[#e2bebc]/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#b5242c]" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-[#5a403f] uppercase tracking-widest mb-2 block">Strategic Identity</label>
                                    <input 
                                        type="text" 
                                        value={editForm.professionalHeadline || ''}
                                        onChange={(e) => setEditForm({ ...editForm, professionalHeadline: e.target.value })}
                                        className="w-full bg-[#fff0ef]/30 border border-[#e2bebc]/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#b5242c]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#5a403f] uppercase tracking-widest mb-2 block">Market Location</label>
                                    <input 
                                        type="text" 
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full bg-[#fff0ef]/30 border border-[#e2bebc]/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#b5242c]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            default: // Dashboard
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="col-span-9 space-y-6"
                    >
                        {/* Welcome Section */}
                        <div className="bg-white p-6 rounded-none border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#b5242c]/5 rounded-full -translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative z-10">
                                <h2 className="text-[22px] font-bold text-[#1a1a1a] tracking-tight mb-1">
                                    Welcome back, {user?.fullName?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ').split(' ')[0] || 'Client'}! 👋
                                </h2>
                                <p className="text-[13px] text-gray-500 font-bold max-w-md">
                                    You have <span className="text-[#b5242c] font-bold">{myProjects.length} active projects</span> and <span className="text-[#b5242c] font-bold">{proposals.length} new proposals</span>.
                                </p>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <button onClick={() => navigate('/post-project')} className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-none font-bold text-[12px] flex items-center gap-2 hover:bg-black transition-all shadow-md active:scale-95">
                                    <PlusCircle size={18} /> Post Project
                                </button>
                                <button onClick={() => navigate('/post-job')} className="bg-[#b5242c] text-white px-5 py-2.5 rounded-none font-bold text-[12px] flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95">
                                    <Plus size={18} /> Post Job
                                </button>
                            </div>
                        </div>

                        {/* Stat Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard 
                                title="Wallet Balance" 
                                value={`₹${user?.walletBalance?.toLocaleString() || '0.00'}`} 
                                icon={Wallet} 
                                color="bg-gradient-to-br from-[#b5242c] to-black" 
                            />
                            <StatCard 
                                title="Active Projects" 
                                value={myProjects.length} 
                                icon={Briefcase} 
                                color="bg-gradient-to-br from-[#b5242c] to-[#b5242c]" 
                                trend="+2"
                            />
                            <StatCard 
                                title="Active Escrow" 
                                value={`₹${escrows.filter(e => e.status === 'HELD').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`} 
                                icon={Activity} 
                                color="bg-gradient-to-br from-[#b5242c] to-[#b5242c]" 
                                trend="Live"
                            />
                            <StatCard 
                                title="Total Spend" 
                                value={`₹${transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`} 
                                icon={TrendingUp} 
                                color="bg-gradient-to-br from-[#b5242c] to-[#b5242c]" 
                                trend="Total"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Recent Projects List */}
                                <div className="bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="text-[16px] font-bold text-[#1a1a1a]">Recent Engagements</h3>
                                        <button onClick={() => setActiveTab('jobs')} className="text-primary font-bold text-[11px] hover:underline flex items-center gap-1">
                                            View All <ChevronRight size={12} />
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {myProjects.length === 0 ? (
                                            <div className="p-10 text-center text-gray-400 italic text-[13px]">No active projects found.</div>
                                        ) : (
                                            myProjects.slice(0, 4).map(project => (
                                                <div key={project.id} className="p-5 hover:bg-gray-50/50 transition-all flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-none bg-gray-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                            <Briefcase size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-bold text-[#1a1a1a]">{project.title}</p>
                                                            <p className="text-[11px] text-gray-400 font-medium">#{project.id} • {project.category || 'Development'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[14px] font-bold text-[#1a1a1a]">₹{project.budgetAmount?.toLocaleString()}</p>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[9px] font-semibold bg-[#b5242c]/5 text-[#b5242c] mt-1">Active</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-none bg-gradient-to-br from-[#1e2329] to-black text-white relative overflow-hidden group shadow-lg">
                                        <div className="relative z-10">
                                            <h4 className="text-[16px] font-bold mb-1">Hire Experts</h4>
                                            <p className="text-[11px] text-white/60 mb-4 leading-relaxed">Browse top-rated freelancers.</p>
                                            <button onClick={() => navigate('/browse-freelancers')} className="px-4 py-2 bg-white text-black rounded-none font-bold text-[11px] hover:bg-gray-100 transition-all">Browse Talent</button>
                                        </div>
                                        <Users size={60} className="absolute -right-3 -bottom-3 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-5 rounded-none bg-primary text-white relative overflow-hidden group shadow-lg shadow-primary/10">
                                        <div className="relative z-10">
                                            <h4 className="text-[16px] font-bold mb-1">Post a Job</h4>
                                            <p className="text-[11px] text-white/80 mb-4 leading-relaxed">Post a corporate job opening.</p>
                                            <button onClick={() => navigate('/post-job')} className="px-4 py-2 bg-white text-primary rounded-none font-bold text-[11px] hover:bg-gray-50 transition-all">Post Now</button>
                                        </div>
                                        <Briefcase size={60} className="absolute -right-3 -bottom-3 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-6">
                                {/* Activity Pulse */}
                                <div className="bg-white rounded-none border border-gray-100 p-5 shadow-sm">
                                    <h3 className="text-[14px] font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                                        <Activity size={16} className="text-primary" /> Operational Pulse
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Identity Verification', status: user?.identityVerified ? 'Verified' : 'Pending', val: user?.identityVerified ? 100 : 45 },
                                            { label: 'Payment Integration', status: user?.paymentVerified ? 'Verified' : 'Required', val: user?.paymentVerified ? 100 : 0 },
                                            { label: 'Profile Completion', status: '88%', val: 88 }
                                        ].map((item, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="text-[11px] font-semibold text-gray-600">{item.label}</span>
                                                    <span className={`text-[9px] font-bold ${item.val === 100 ? 'text-[#b5242c]' : 'text-primary'}`}>{item.status}</span>
                                                </div>
                                                <div className="h-1 w-full bg-gray-50 rounded-none overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.val}%` }}
                                                        className={`h-full ${item.val === 100 ? 'bg-[#b5242c]/50' : 'bg-primary'} rounded-none`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveTab('settings')} className="w-full mt-6 py-2.5 rounded-none border border-gray-100 text-[11px] font-bold text-gray-400 hover:text-primary hover:border-primary transition-all">
                                        Complete Profile
                                    </button>
                                </div>

                                {/* Support Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-none border border-gray-100 p-5 shadow-sm">
                                    <div className="w-10 h-10 rounded-none bg-white border border-gray-100 flex items-center justify-center text-primary mb-3 shadow-sm">
                                        <LifeBuoy size={20} />
                                    </div>
                                    <h4 className="text-[14px] font-bold text-[#1a1a1a] mb-1">Need Assistance?</h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Support team available 24/7.</p>
                                    <button className="w-full py-2.5 bg-white border border-gray-100 rounded-none text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">Contact Support</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 font-['Poppins'] text-[#261817] pt-[150px] pb-16">
            
            {/* Main Application Container */}
            <div className="max-w-[1300px] mx-auto px-4">
                
                {/* Hero Profile Header Section */}
                <section className="bg-white rounded-none border border-gray-100 p-6 shadow-sm mb-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                        {/* Avatar Area */}
                        <div className="relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
                            <div className="w-20 h-20 rounded-none overflow-hidden border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center text-white/20">
                                        <Building2 size={32} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-none border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                                <Plus size={12} className="text-primary" />
                            </div>
                        </div>
                        
                        {/* Profile Info Area */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                                <h1 className="text-[26px] font-bold text-[#1a1a1a] tracking-tight leading-none">
                                    {user?.fullName?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') || 'Client Profile'}
                                </h1>
                                <span className="bg-[#b5242c]/5 text-[#b5242c] px-2 py-0.5 rounded-none text-[9px] font-bold tracking-widest border border-[#b5242c] flex items-center gap-1">
                                    <Verified size={10} /> Verified Enterprise
                                </span>
                            </div>
                            
                            <p className="text-[13px] text-gray-500 font-medium mb-3 flex items-center justify-center md:justify-start gap-1.5">
                                <MapPin size={14} className="text-primary" /> {user?.location || 'Location Not Set'}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
                                <div className="flex items-center gap-1.5">
                                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                    <span className="text-[13px] font-bold">4.9</span>
                                    <span className="text-[11px] text-gray-400 font-medium">(124 Reviews)</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Activity size={16} className="text-blue-500" />
                                    <span className="text-[13px] font-bold">98% Success</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <HistoryIcon size={16} className="text-purple-500" />
                                    <span className="text-[13px] font-bold">Member Since May 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row md:flex-col gap-2 min-w-[160px]">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex-1 bg-white border border-gray-200 text-black px-4 py-2 rounded-none font-bold text-[12px] hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                            >
                                Edit Identity
                            </button>
                            <button 
                                onClick={() => navigate('/post-job')}
                                className="flex-1 bg-primary text-white px-4 py-2 rounded-none font-bold text-[12px] hover:opacity-90 transition-all active:scale-95 shadow-md"
                            >
                                Post Opportunity
                            </button>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    
                    {/* Sidebar Navigation */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white border border-gray-100 rounded-none p-3 flex flex-col gap-1 sticky top-[120px] shadow-sm">
                            <div className="px-3 mb-3 mt-1">
                                <p className="text-[9px] font-semibold text-gray-400 tracking-widest">Navigation Control</p>
                            </div>
                            
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
                                { id: 'wallet', label: 'Wallet & Escrow', icon: <Wallet size={16} /> },
                                { id: 'jobs', label: 'Management', icon: <Briefcase size={16} /> },
                                { id: 'verifications', label: 'Trust Center', icon: <ShieldCheck size={16} /> },
                                { id: 'messages', label: 'Terminal', icon: <MessageSquare size={16} /> },
                                { id: 'settings', label: 'Configuration', icon: <Settings size={16} /> },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`py-2.5 px-4 rounded-none flex items-center gap-3 transition-all font-semibold text-[13px] leading-none ${
                                        activeTab === item.id 
                                            ? 'bg-primary text-white shadow-md shadow-primary/10' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}

                            <div className="mt-6 pt-6 border-t border-gray-50">
                                <button className="w-full text-gray-500 px-4 py-2.5 flex items-center gap-3 transition-all hover:text-primary font-semibold text-[13px]">
                                    <LifeBuoy size={16} />
                                    Support
                                </button>
                                <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full text-gray-500 px-4 py-2.5 flex items-center gap-3 transition-all hover:text-red-500 font-semibold text-[13px]">
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="col-span-12 lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {renderTabContent()}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Footer Space */}
            <footer className="max-w-[1300px] mx-auto px-10 py-16 opacity-30 text-center text-[10px] font-semibold tracking-[0.2em] text-gray-400">
                © 2024 Shinefiling Enterprise // Global Operations Terminal
            </footer>
            {/* Edit Identity Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-none shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-[#1a1a1a]">Edit Enterprise Identity</h3>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Enterprise Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full border border-gray-200 p-3 rounded-none focus:border-primary outline-none transition-all font-semibold"
                                            value={editForm.fullName || ''}
                                            onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Strategic Headline</label>
                                        <input 
                                            type="text" 
                                            className="w-full border border-gray-200 p-3 rounded-none focus:border-primary outline-none transition-all font-semibold"
                                            value={editForm.professionalHeadline || ''}
                                            onChange={(e) => setEditForm({...editForm, professionalHeadline: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Market Location</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-200 p-3 rounded-none focus:border-primary outline-none transition-all font-semibold"
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operational Summary</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full border border-gray-200 p-3 rounded-none focus:border-primary outline-none transition-all font-semibold"
                                        value={editForm.summary || ''}
                                        onChange={(e) => setEditForm({...editForm, summary: e.target.value})}
                                    />
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button 
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-6 py-2.5 border border-gray-200 font-bold text-sm hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveProfile}
                                        className="px-8 py-2.5 bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Photo Modal */}
            <AnimatePresence>
                {isPhotoModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-md rounded-none shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[#1a1a1a]">Update Profile Picture</h3>
                                <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 flex flex-col items-center gap-6">
                                <div className="w-40 h-40 rounded-none border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                    {photoPreview ? (
                                        <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon size={48} className="mx-auto text-gray-200 mb-2" />
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Image</p>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="text-[11px] text-gray-500 text-center font-medium">
                                    Click to browse or drag and drop<br />
                                    <span className="text-[9px] font-bold text-gray-400">JPG, PNG (MAX 5MB)</span>
                                </p>
                                <div className="w-full flex gap-3 pt-4">
                                    <button 
                                        onClick={() => setIsPhotoModalOpen(false)}
                                        className="flex-1 py-3 border border-gray-200 font-bold text-[12px] hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleUpdatePhoto}
                                        disabled={!selectedFile}
                                        className={`flex-1 py-3 font-bold text-[12px] transition-all shadow-md ${selectedFile ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Upload Image
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientProfile;
