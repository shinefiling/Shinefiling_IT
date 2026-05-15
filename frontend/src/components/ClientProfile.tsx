import { useState, useEffect } from 'react';
import { 
    Calendar, ShieldCheck, 
    Mail, Plus, 
    ExternalLink, Briefcase, 
    MessageSquare, AlertCircle, FileText,
    X, CheckCircle2,
    Building2, Users, Edit2,
    LifeBuoy, ArrowLeft, ChevronRight,
    MapPin, Globe, History, Star, Image as ImageIcon, Trash2, Linkedin,
    TrendingUp, Award, Verified, Wallet, CreditCard, LayoutDashboard,
    Search, Bell, LogOut, Settings, Check, Clock, UserPlus,
    PlusCircle, ChevronDown, User, Activity, CheckSquare, History as HistoryIcon
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL, RAZORPAY_KEY_ID } from '../config';
import RecruiterTerminal from './RecruiterTerminal';
import ProjectTerminal from './ProjectTerminal';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import AddFundsModal from './AddFundsModal';

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
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isAppManagementOpen, setIsAppManagementOpen] = useState(false);
    const [isProjectTerminalOpen, setIsProjectTerminalOpen] = useState(false);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

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

    const handleAddFunds = () => {
        setIsAddFundsOpen(true);
    };

    const initiateRazorpayPayment = async (amount: number) => {
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: amount * 100, // Amount in paise
            currency: "INR",
            name: "Shinefiling IT Freelancer",
            description: "Wallet Deposit",
            image: "https://shinefiling.com/favicon.png",
            handler: async function (response: any) {
                try {
                    const depositResponse = await fetch(`${API_BASE_URL}/api/wallet/deposit`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: user.id,
                            amount: amount,
                            referenceId: response.razorpay_payment_id
                        })
                    });
                    
                    if (depositResponse.ok) {
                        alert('Funds added successfully! Payment ID: ' + response.razorpay_payment_id);
                        fetchDynamicData(user);
                        setUser((prev: any) => ({ ...prev, walletBalance: (prev.walletBalance || 0) + amount }));
                    }
                } catch (err) {
                    console.error("Error finalizing deposit:", err);
                    alert("Payment was successful but balance update failed. Please contact support.");
                }
            },
            prefill: {
                name: user.fullName || user.username,
                email: user.email,
                contact: user.phone || ""
            },
            theme: {
                color: "#0F2E4B"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
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
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
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
        <div className="bg-white p-5 rounded-lg border border-gray-100  hover: transition-all group">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center text-white `}>
                    <Icon size={18} />
                </div>
                {trend && (
                    <span className="text-[10px] font-bold text-[#317CD7] bg-[#317CD7]/5 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <TrendingUp size={10} /> {trend}
                    </span>
                )}
            </div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider mb-0.5">{title}</p>
            <p className="text-[22px] font-bold text-[#0F2E4B]">{value}</p>
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
                        <div className="bg-white rounded-lg px-8 py-6 text-[#0F2E4B] border border-gray-100 ">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest">Financial Standing</p>
                                    <h2 className="text-[40px] font-bold tracking-tighter">₹{user?.walletBalance?.toLocaleString() || '0.00'}</h2>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleAddFunds}
                                        className="bg-[#317CD7] text-white px-6 py-2 rounded-lg font-bold text-[12px] hover:bg-black transition-all"
                                    >
                                        Add Funds
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-bold text-[12px]">Withdraw</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 mb-8">
                                <div className="col-span-2 bg-[#0F2E4B] text-white p-8 rounded-lg  relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-lg translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
                                    <div className="relative z-10">
                                        <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] mb-2">Strategic Reserves</p>
                                        <h2 className="text-[42px] font-bold tracking-tight mb-8">₹{user?.walletBalance?.toLocaleString() || '0.00'}</h2>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={handleAddFunds}
                                                className="bg-[#317CD7] text-white px-8 py-3 rounded-md font-bold text-[13px] hover:bg-[#2563b5] transition-all flex items-center gap-2   uppercase tracking-widest"
                                            >
                                                <PlusCircle size={18} /> Deposit Funds
                                            </button>
                                            <button className="bg-white/10 text-white border border-white/20 px-8 py-3 rounded-md font-bold text-[13px] hover:bg-white/20 transition-all uppercase tracking-widest">
                                                Withdrawal
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute right-10 bottom-10 opacity-10">
                                        <Wallet size={120} />
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-100 p-8 rounded-lg  flex flex-col justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Escrow Locked</p>
                                        <h3 className="text-[28px] font-bold text-[#0F2E4B]">₹{escrows.reduce((acc: number, curr: any) => acc + (curr.status === 'HELD' ? curr.amount : 0), 0).toLocaleString()}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#317CD7] bg-[#317CD7]/5 p-2 rounded-md">
                                        <ShieldCheck size={14} /> Total 3 Active Escrows
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-6 border-t border-gray-50 pt-6">
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-1">Total Spent</p>
                                    <p className="text-[18px] font-bold">₹{transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-1">Active Escrow</p>
                                    <p className="text-[18px] font-bold text-[#317CD7]">₹{activeEscrowAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-1">Last Transaction</p>
                                    <p className="text-[18px] font-bold opacity-60">#{transactions[0]?.id || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Management Section */}
                        <div className="bg-white border border-gray-100 rounded-lg p-6 ">
                            <h3 className="text-[18px] font-bold text-[#0F2E4B] mb-6 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-[#317CD7]" /> Escrow Management
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
                                            <tr><td colSpan={5} className="py-20 text-center text-[rgb(33,33,33)] font-medium text-[15px] leading-[26px]">No escrow records found</td></tr>
                                        ) : (
                                            escrows.map(escrow => (
                                                <tr key={escrow.id} className="text-[13px] hover:bg-gray-50">
                                                    <td className="py-4 px-4 font-bold">{escrow.project?.title}</td>
                                                    <td className="py-4 px-4">{escrow.freelancer?.fullName}</td>
                                                    <td className="py-4 px-4 font-bold">₹{escrow.amount.toLocaleString()}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
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
                        <div className="bg-white border border-gray-100 rounded-lg p-6 ">
                            <h3 className="text-[18px] font-bold text-[#0F2E4B] mb-6">Recent Transactions</h3>
                            <div className="space-y-4">
                                {transactions.length === 0 ? (
                                    <div className="py-20 text-center text-[rgb(33,33,33)] font-medium text-[15px] leading-[26px]">No Transaction History</div>
                                ) : (
                                    transactions.map((tx: any) => (
                                        <div key={tx.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'DEPOSIT' || tx.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    <CreditCard size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-[#0F2E4B]">{tx.description || tx.title || 'Wallet Transaction'}</p>
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
                        <div className="bg-white border border-gray-100 rounded-lg p-6 ">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <LayoutDashboard size={20} className="text-[#317CD7]" />
                                    </div>
                                    <h4 className="text-[18px] font-bold text-[#0F2E4B]">Operational Summary</h4>
                                </div>
                                <div className="grid grid-cols-4 gap-12 bg-gray-50/50 px-8 py-3 rounded-lg border border-gray-100">
                                    {[
                                        { label: 'Live Projects', value: myProjects.length, trend: '+12' },
                                        { label: 'Open Jobs', value: myJobs.length, trend: '+5' },
                                        { label: 'New Proposals', value: proposals.length, trend: '-2' },
                                        { label: 'Total Hirings', value: '0', trend: '-6' },
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">{stat.label}</p>
                                            <p className="text-[24px] font-bold text-[#0F2E4B] leading-none mb-1">{stat.value}</p>
                                            <p className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-[#317CD7]' : 'text-gray-400'}`}>{stat.trend}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-lg p-8 ">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <LayoutDashboard size={24} className="text-[#317CD7]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] font-bold text-[#0F2E4B] tracking-tight">Project Inventory</h3>
                                        <p className="text-[15px] font-medium text-[rgb(33,33,33)] leading-[26px]">Manage and oversee your active freelance projects</p>
                                    </div>
                                    <span className="bg-[#317CD7] text-white text-[12px] font-bold px-2.5 py-0.5 rounded-lg ml-1">{myProjects.length}</span>
                                </div>
                                <button onClick={() => navigate('/post-project')} className="bg-[#317CD7] text-white px-6 py-3 rounded-lg font-bold text-[14px] flex items-center gap-2 transition-all hover:bg-[#00332c] hover: active:scale-95">
                                    <PlusCircle size={20} /> Post New Project
                                </button>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="relative flex-1 max-w-[320px]">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by title..." 
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] outline-none focus:border-[#317CD7] transition-all"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all ">
                                        <Wallet size={16} className="text-[#317CD7]" /> Compensation <ChevronDown size={14} />
                                    </button>
                                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-all ">
                                        <CheckCircle2 size={16} className="text-[#317CD7]" /> Status <ChevronDown size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>
                                    <button className="flex items-center gap-2 text-[13px] font-semibold text-gray-500 hover:text-[#317CD7] transition-colors">
                                        <Settings size={18} /> Settings
                                    </button>
                                    <button className="bg-[#0F2E4B] text-white px-6 py-3 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-all hover:bg-black hover: active:scale-95">
                                        <Check size={18} /> Bulk Approve
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden  mb-10">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Engagement Date</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Partner</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Project Scope</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Budget Allocation</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {myProjects.length === 0 ? (
                                            <tr><td colSpan={5} className="py-24 text-center text-[rgb(33,33,33)] font-medium text-[15px] leading-[26px]">No projects found in your inventory</td></tr>
                                        ) : (
                                            myProjects.map((project, idx) => (
                                                <tr key={project.id} className="transition-all hover:bg-gray-50/50 group">
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[13px] font-bold text-[#0F2E4B]">12 May 2024</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">10:30 AM</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                                <img src={`https://i.pravatar.cc/150?u=${project.id}`} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="text-[13px] font-bold text-[#0F2E4B] truncate">Freelancer #{project.id}</p>
                                                                <p className="text-[10px] text-[#317CD7] font-semibold">Top Rated</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[15px] font-bold text-[#0F2E4B] leading-tight line-clamp-2">{project.title}</p>
                                                        <p className="text-[11px] text-[#317CD7] font-bold uppercase tracking-wider mt-1">{project.category || 'Development'}</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[18px] font-bold text-[#317CD7]">₹{project.budgetAmount?.toLocaleString()}</p>
                                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Fixed Price</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedProjectId(project.id);
                                                                    setIsProjectTerminalOpen(true);
                                                                }}
                                                                className="px-4 py-2 bg-[#317CD7] text-white rounded-lg font-bold text-[11px] hover:bg-[#2563b5] transition-all"
                                                            >
                                                                View Bids
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

                        <div className="bg-white border border-gray-100 rounded-lg p-8 mb-8 ">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <Briefcase size={24} className="text-[#317CD7]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[24px] font-bold text-[#0F2E4B] tracking-tight">Job Postings</h3>
                                        <p className="text-[15px] font-medium text-[rgb(33,33,33)] leading-[26px]">Manage corporate employment opportunities</p>
                                    </div>
                                    <span className="bg-[#317CD7] text-white text-[12px] font-bold px-2.5 py-0.5 rounded-lg ml-1">{myJobs.length}</span>
                                </div>
                                <button onClick={() => navigate('/post-job')} className="bg-[#317CD7] text-white px-6 py-3 rounded-lg font-bold text-[14px] flex items-center gap-2 transition-all hover:bg-[#317CD7] active:scale-95">
                                    <Plus size={20} /> Post New Job
                                </button>
                            </div>
                            
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden ">
                                <table className="w-full text-left border-collapse table-fixed">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-[#0F2E4B] text-[11px] font-bold uppercase tracking-widest border-b border-gray-100">
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Role / Designation</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Organization</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-left">Compensation</th>
                                            <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {myJobs.length === 0 ? (
                                            <tr><td colSpan={4} className="py-24 text-center text-[rgb(33,33,33)] font-medium text-[15px] leading-[26px]">No job postings found</td></tr>
                                        ) : (
                                            myJobs.map(job => (
                                                <tr key={job.id} className="hover:bg-gray-50/50 transition-all group">
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[15px] font-bold text-[#0F2E4B] leading-tight line-clamp-2">{job.title}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-bold rounded-lg tracking-widest">{job.type}</span>
                                                            <span className="text-[11px] font-bold text-[#317CD7] uppercase tracking-wider">Posted 2 days ago</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 align-top text-[14px] font-bold text-gray-600 truncate">{job.company}</td>
                                                    <td className="py-4 px-6 align-top">
                                                        <p className="text-[15px] font-bold text-[#0F2E4B]">₹{job.price?.toLocaleString()}</p>
                                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Per Annum</p>
                                                    </td>
                                                    <td className="py-4 px-6 align-top text-right">
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedJobId(Number(job.id));
                                                                setIsAppManagementOpen(true);
                                                            }}
                                                            className="px-4 py-2 bg-[#317CD7] text-white rounded-lg font-bold text-[11px] hover:bg-[#2563b5] transition-all"
                                                        >
                                                            View Applications
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                              </div>

                        {/* Quick Overview of Recent Apps (Small Card) */}
                        <div className="bg-white border border-gray-100 rounded-lg p-6 mb-8 flex justify-between items-center shadow-sm">
                            <div>
                                <h3 className="text-[18px] font-bold text-[#0F2E4B]">Application Management</h3>
                                <p className="text-[13px] text-gray-500 font-medium">Manage all incoming candidates in a dedicated full-screen interface</p>
                            </div>
                            <button 
                                onClick={() => setIsAppManagementOpen(true)}
                                className="bg-[#0F2E4B] text-white px-6 py-3 rounded-xl font-bold text-[13px] hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-[#0F2E4B]/20 active:scale-95"
                            >
                                <Users size={18} /> Open Management Terminal
                            </button>
                        </div>

                        {/* Full Screen Application Management Modal */}
                        <RecruiterTerminal 
                            isOpen={isAppManagementOpen}
                            onClose={() => setIsAppManagementOpen(false)}
                            myJobs={myJobs}
                            applications={applications}
                            onReviewProfile={(app) => setSelectedApplication(app)}
                            initialJobId={selectedJobId}
                        />

                        {/* Full Screen Project Management Modal */}
                        <ProjectTerminal 
                            isOpen={isProjectTerminalOpen}
                            onClose={() => setIsProjectTerminalOpen(false)}
                            myProjects={myProjects}
                            proposals={proposals}
                            onReviewProposal={(prop) => setSelectedApplication({ 
                                ...prop.freelancer, 
                                ...prop,
                                isProposal: true 
                            })}
                            initialProjectId={selectedProjectId}
                        />
                    </motion.div>
                );
            case 'messages':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 bg-white border border-gray-100/20 rounded-lg p-6 min-h-[500px]">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100/10">
                            <h3 className="text-[20px] font-bold text-[#0F2E4B]">Communications Terminal</h3>
                            <button className="bg-[#317CD7] text-white px-5 py-2 rounded-lg font-bold text-[12px]">Broadcast Message</button>
                        </div>
                        <div className="space-y-2">
                            {transactions.filter(t => t.type === 'MESSAGE').length === 0 ? ( // Using transactions state for messages temporarily if needed, or real messages state
                                <div className="flex flex-col items-center justify-center py-24 opacity-80">
                                    <MessageSquare size={48} className="mb-6 text-gray-200" />
                                    <p className="text-[rgb(33, 33, 33)] font-medium text-[15px] leading-[26px]">No Encrypted Comms Found</p>
                                </div>
                            ) : (
                                transactions.map((msg: any) => (
                                    <div key={msg.id} className="p-4 bg-gray-50/50 rounded-lg border border-gray-100/10 hover:border-[#317CD7]/30 transition-all cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-[14px] font-bold text-[#0F2E4B] group-hover:text-[#317CD7] transition-colors">{msg.senderEmail}</p>
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{new Date(msg.sentAt).toLocaleTimeString()}</p>
                                        </div>
                                        <p className="text-[13px] text-[#0F2E4B]/70 line-clamp-1 opacity-70">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                );
            case 'verifications':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 grid grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-100/20 rounded-lg p-6">
                            <h3 className="text-[18px] font-bold text-[#0F2E4B] mb-6">Corporate Credentials</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Business Identity', status: user?.identityVerified ? 'Verified' : 'Pending', date: 'Exp: 2025', icon: user?.identityVerified ? <ShieldCheck className="text-[#317CD7]" /> : <Clock className="text-amber-600" /> },
                                    { label: 'Financial Compliance', status: user?.paymentVerified ? 'Verified' : 'Required', date: 'Tax ID: OK', icon: user?.paymentVerified ? <ShieldCheck className="text-[#317CD7]" /> : <AlertCircle className="text-red-600" /> },
                                    { label: 'Contact Authentication', status: user?.phoneVerified ? 'Verified' : 'Pending', date: 'Verified via OTP', icon: user?.phoneVerified ? <ShieldCheck className="text-[#317CD7]" /> : <Clock className="text-amber-600" /> },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-gray-50/50 rounded-lg border border-gray-100/10">
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <div>
                                                <p className="text-[14px] font-bold text-[#0F2E4B]">{item.label}</p>
                                                <p className="text-[11px] text-[#0F2E4B]/70 opacity-60 font-bold">{item.date}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase ${item.status === 'Verified' ? 'bg-[#317CD7]/5' : 'bg-amber-50 text-amber-600'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50/50/20 border border-dashed border-gray-100/50 rounded-lg flex flex-col items-center justify-center p-10 text-center">
                            <ShieldCheck size={48} className="text-[#317CD7] mb-4 opacity-20" />
                            <h4 className="text-[16px] font-bold text-[#0F2E4B] mb-2">Upload New Credential</h4>
                            <p className="text-[12px] text-[#0F2E4B]/70 opacity-60 mb-6">PDF or JPEG (Max 5MB)</p>
                            <button className="bg-white border border-gray-100/50 px-6 py-2 rounded-lg font-bold text-[12px] text-[#0F2E4B]/70 hover:bg-white/50 transition-all">Select File</button>
                        </div>
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="col-span-9 bg-white border border-gray-100/20 rounded-lg p-8">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100/10">
                            <h3 className="text-[20px] font-bold text-[#0F2E4B]">Profile Configuration</h3>
                            <button onClick={handleSaveProfile} className="bg-[#317CD7] text-white px-6 py-2 rounded-lg font-bold text-[13px] hover: transition-all ">Save Changes</button>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-[#0F2E4B]/70 uppercase tracking-widest mb-2 block">Enterprise Name</label>
                                    <input 
                                        type="text" 
                                        value={editForm.fullName || ''} 
                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                        className="w-full bg-gray-50/50 border border-gray-100/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#317CD7]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#0F2E4B]/70 uppercase tracking-widest mb-2 block">Operational Brief</label>
                                    <textarea 
                                        rows={4}
                                        value={editForm.summary || ''}
                                        onChange={(e) => setEditForm({ ...editForm, summary: e.target.value })}
                                        className="w-full bg-gray-50/50 border border-gray-100/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#317CD7]" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-bold text-[#0F2E4B]/70 uppercase tracking-widest mb-2 block">Strategic Identity</label>
                                    <input 
                                        type="text" 
                                        value={editForm.professionalHeadline || ''}
                                        onChange={(e) => setEditForm({ ...editForm, professionalHeadline: e.target.value })}
                                        className="w-full bg-gray-50/50 border border-gray-100/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#317CD7]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-[#0F2E4B]/70 uppercase tracking-widest mb-2 block">Market Location</label>
                                    <input 
                                        type="text" 
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full bg-gray-50/50 border border-gray-100/30 rounded-lg px-4 py-3 text-[14px] font-bold focus:outline-none focus:border-[#317CD7]" 
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
                        <div className="bg-white p-6 rounded-lg border border-gray-100  flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#317CD7]/5 rounded-full -translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative z-10">
                                <h2 className="text-[22px] font-bold text-[#0F2E4B] tracking-tight mb-1">
                                    Welcome back, {user?.fullName?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ').split(' ')[0] || 'Client'}! 👋
                                </h2>
                                <p className="text-[13px] text-gray-500 font-bold max-w-md">
                                    You have <span className="text-[#317CD7] font-bold">{myProjects.length} active projects</span> and <span className="text-[#317CD7] font-bold">{proposals.length} new proposals</span>.
                                </p>
                            </div>
                            <div className="flex gap-3 relative z-10">
                                <button onClick={() => navigate('/post-project')} className="bg-[#0F2E4B] text-white px-5 py-2.5 rounded-lg font-bold text-[12px] flex items-center gap-2 hover:bg-black transition-all  active:scale-95">
                                    <PlusCircle size={18} /> Post Project
                                </button>
                                <button onClick={() => navigate('/post-job')} className="bg-[#317CD7] text-white px-5 py-2.5 rounded-lg font-bold text-[12px] flex items-center gap-2 hover:opacity-90 transition-all  active:scale-95">
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
                                color="bg-gradient-to-br from-[#317CD7] to-black" 
                            />
                            <StatCard 
                                title="Active Projects" 
                                value={myProjects.length} 
                                icon={Briefcase} 
                                color="bg-gradient-to-br from-[#317CD7] to-[#317CD7]" 
                                trend="+2"
                            />
                            <StatCard 
                                title="Active Escrow" 
                                value={`₹${escrows.filter(e => e.status === 'HELD').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}`} 
                                icon={Activity} 
                                color="bg-gradient-to-br from-[#317CD7] to-[#317CD7]" 
                                trend="Live"
                            />
                            <StatCard 
                                title="Total Spend" 
                                value={`₹${transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`} 
                                icon={TrendingUp} 
                                color="bg-gradient-to-br from-[#317CD7] to-[#317CD7]" 
                                trend="Total"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content Column */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Recent Projects List */}
                                <div className="bg-white rounded-lg border border-gray-100  overflow-hidden">
                                    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="text-[16px] font-bold text-[#0F2E4B]">Recent Engagements</h3>
                                        <button onClick={() => setActiveTab('jobs')} className="#317CD7 font-bold text-[11px] hover:underline flex items-center gap-1">
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
                                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center #317CD7 group-hover:scale-110 transition-transform">
                                                            <Briefcase size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[14px] font-bold text-[#0F2E4B] leading-tight">{project.title}</p>
                                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-1">#{project.id} • {project.category || 'Development'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[20px] font-semibold text-[#0F2E4B]">₹{project.budgetAmount?.toLocaleString()}</p>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#317CD7]/5 text-[#317CD7] mt-1">Active</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Recent Job Applications */}
                                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                                    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="text-[16px] font-bold text-[#0F2E4B]">Recent Job Applications</h3>
                                        <button onClick={() => { setActiveTab('jobs'); setIsAppManagementOpen(true); }} className="text-[#317CD7] font-bold text-[11px] hover:underline flex items-center gap-1">
                                            Manage All <ChevronRight size={12} />
                                        </button>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {applications.length === 0 ? (
                                            <div className="p-10 text-center text-gray-400 italic text-[13px]">No recent applications.</div>
                                        ) : (
                                            applications.slice(0, 3).map(app => (
                                                <div key={app.id} className="p-5 hover:bg-gray-50/50 transition-all flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-[#0F2E4B]/5 flex items-center justify-center text-[#0F2E4B] group-hover:scale-110 transition-transform">
                                                            <User size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] font-semibold text-[#0F2E4B]">{app.fullName}</p>
                                                            <p className="text-[13px] text-gray-500 font-medium">{app.experience} Experience</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedJobId(Number(app.jobId));
                                                            setIsAppManagementOpen(true);
                                                        }}
                                                        className="px-4 py-2 bg-gray-50 text-[#0F2E4B] rounded-lg font-bold text-[11px] hover:bg-[#317CD7] hover:text-white transition-all"
                                                    >
                                                        Review Profile
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-lg bg-[#0F2E4B] text-white relative overflow-hidden group ">
                                        <div className="relative z-10">
                                            <h4 className="text-[16px] font-bold mb-1 uppercase tracking-tight">Hire Experts</h4>
                                            <p className="text-[11px] text-white/60 mb-4 leading-relaxed font-medium">Browse top-rated freelancers.</p>
                                            <button onClick={() => navigate('/browse-freelancers')} className="px-4 py-2 bg-white text-[#0F2E4B] rounded-lg font-bold text-[11px] hover:bg-gray-50 transition-all uppercase tracking-widest">Browse Talent</button>
                                        </div>
                                        <Users size={60} className="absolute -right-3 -bottom-3 text-white/5 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-5 rounded-lg bg-[#317CD7] text-white relative overflow-hidden group  ">
                                        <div className="relative z-10">
                                            <h4 className="text-[16px] font-bold mb-1 uppercase tracking-tight">Post a Job</h4>
                                            <p className="text-[11px] text-white/80 mb-4 leading-relaxed font-medium">Post a corporate job opening.</p>
                                            <button onClick={() => navigate('/post-job')} className="px-4 py-2 bg-white text-[#317CD7] rounded-lg font-bold text-[11px] hover:bg-gray-50 transition-all uppercase tracking-widest">Post Now</button>
                                        </div>
                                        <Briefcase size={60} className="absolute -right-3 -bottom-3 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-6">
                                {/* Activity Pulse */}
                                <div className="bg-white rounded-lg border border-gray-100 p-5 ">
                                    <h3 className="text-[14px] font-bold text-[#0F2E4B] mb-4 flex items-center gap-2">
                                        <Activity size={16} className="text-[#317CD7]" /> Operational Pulse
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
                                                    <span className={`text-[9px] font-bold ${item.val === 100 ? 'text-[#317CD7]' : 'text-[#317CD7]'}`}>{item.status}</span>
                                                </div>
                                                <div className="h-1 w-full bg-gray-50 rounded-lg overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.val}%` }}
                                                        className={`h-full ${item.val === 100 ? 'bg-[#317CD7]/50' : 'bg-[#317CD7]'} rounded-lg`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setActiveTab('settings')} className="w-full mt-6 py-2.5 rounded-lg border border-gray-100 text-[11px] font-bold text-gray-400 hover:#317CD7 hover:border-primary transition-all">
                                        Complete Profile
                                    </button>
                                </div>

                                {/* Support Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100 p-5 ">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center #317CD7 mb-3 ">
                                        <LifeBuoy size={20} />
                                    </div>
                                    <h4 className="text-[14px] font-bold text-[#0F2E4B] mb-1">Need Assistance?</h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed mb-4">Support team available 24/7.</p>
                                    <button className="w-full py-2.5 bg-white border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-all ">Contact Support</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 text-[#0F2E4B] pt-[150px] pb-16" style={{ fontFamily: '"Poppins", sans-serif' }}>
            
            {/* Main Application Container */}
            <div className="max-w-[1300px] mx-auto px-4">
                
                {/* Hero Profile Header Section */}
                <section className="bg-[#0F2E4B] rounded-lg border border-white/10 p-10  mb-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        {/* Avatar Area */}
                        <div className="relative group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
                            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20  transition-transform group-hover:scale-105 bg-white/10">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <Building2 size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#317CD7] p-1.5 rounded-lg border-2 border-[#0F2E4B]  group-hover:scale-110 transition-transform">
                                <Plus size={14} className="text-white" />
                            </div>
                        </div>
                        
                        {/* Profile Info Area */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                                <h1 className="text-[28px] font-bold text-white tracking-tight leading-none">
                                    {user?.fullName?.split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') || 'Client Profile'}
                                </h1>
                                <span className="bg-[#317CD7] text-white px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest flex items-center gap-2">
                                    <Verified size={12} strokeWidth={3} /> VERIFIED ENTERPRISE
                                </span>
                            </div>
                            
                            <p className="text-[14px] text-white/70 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                                <MapPin size={16} className="text-[#317CD7]" /> {user?.location || 'Global Operations Terminal'}
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                                <div className="flex items-center gap-2">
                                    <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[15px] font-bold text-white">4.9</span>
                                    <span className="text-[12px] text-white/50 font-medium">(124 Reviews)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Activity size={18} className="text-[#317CD7]" />
                                    <span className="text-[15px] font-bold text-white">98% Success</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HistoryIcon size={18} className="text-[#317CD7]" />
                                    <span className="text-[15px] font-bold text-white">Member Since 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row md:flex-col gap-3 min-w-[180px]">
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex-1 bg-white text-[#0F2E4B] px-5 py-3 rounded-lg font-bold text-[13px] hover:bg-gray-50 transition-all active:scale-95  uppercase tracking-wider"
                            >
                                Edit Identity
                            </button>
                            <button 
                                onClick={() => navigate('/post-job')}
                                className="flex-1 bg-[#317CD7] text-white px-5 py-3 rounded-lg font-bold text-[13px] hover:bg-[#2563b5] transition-all active:scale-95  uppercase tracking-wider"
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
                        <div className="bg-white border border-gray-100 rounded-lg p-3 flex flex-col gap-1 sticky top-[120px] ">
                            <div className="px-3 mb-3 mt-1">
                                <p className="text-[9px] font-bold text-[#0F2E4B] tracking-widest uppercase">Navigation Control</p>
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
                                    className={`py-2.5 px-4 rounded-lg flex items-center gap-3 transition-all font-semibold text-[15px] leading-none ${
                                        activeTab === item.id 
                                            ? 'bg-[#317CD7] text-white  shadow-[#317CD7]/10' 
                                            : 'text-[#0F2E4B] hover:bg-gray-50 hover:text-[#317CD7]'
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}

                            <div className="mt-6 pt-6 border-t border-gray-50">
                                <button className="w-full text-[#0F2E4B] px-4 py-2.5 flex items-center gap-3 transition-all hover:text-[#317CD7] font-semibold text-[12px]">
                                    <LifeBuoy size={16} />
                                    Support
                                </button>
                                <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full text-[#0F2E4B] px-4 py-2.5 flex items-center gap-3 transition-all hover:text-red-500 font-semibold text-[12px]">
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
                            className="bg-white w-full max-w-2xl rounded-lg  overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="text-xl font-bold text-[#0F2E4B]">Edit Enterprise Identity</h3>
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
                                            className="w-full border border-gray-200 p-3 rounded-lg focus:border-[#317CD7] outline-none transition-all font-semibold"
                                            value={editForm.fullName || ''}
                                            onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Strategic Headline</label>
                                        <input 
                                            type="text" 
                                            className="w-full border border-gray-200 p-3 rounded-lg focus:border-[#317CD7] outline-none transition-all font-semibold"
                                            value={editForm.professionalHeadline || ''}
                                            onChange={(e) => setEditForm({...editForm, professionalHeadline: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Market Location</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-gray-200 p-3 rounded-lg focus:border-[#317CD7] outline-none transition-all font-semibold"
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Operational Summary</label>
                                    <textarea 
                                        rows={4}
                                        className="w-full border border-gray-200 p-3 rounded-lg focus:border-[#317CD7] outline-none transition-all font-semibold"
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
                                        className="px-8 py-2.5 bg-[#317CD7] text-white font-bold text-sm hover:bg-[#317CD7]/90 transition-all shadow-lg shadow-[#317CD7]/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Application Details Modal */}
            <ApplicationDetailsModal 
                application={selectedApplication}
                onClose={() => setSelectedApplication(null)}
            />

            {/* Photo Modal */}
            <AnimatePresence>
                {isPhotoModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-md rounded-lg  overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-[#0F2E4B]">Update Profile Picture</h3>
                                <button onClick={() => setIsPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 flex flex-col items-center gap-6">
                                <div className="w-40 h-40 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
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
                                        className={`flex-1 py-3 font-bold text-[12px] transition-all rounded-lg ${selectedFile ? 'bg-[#317CD7] text-white hover:bg-[#317CD7]/90 shadow-lg shadow-[#317CD7]/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        Upload Image
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Add Funds Modal */}
            <AddFundsModal 
                isOpen={isAddFundsOpen}
                onClose={() => setIsAddFundsOpen(false)}
                onConfirm={initiateRazorpayPayment}
                currentBalance={user?.walletBalance || 0}
            />
        </div>
    );
};

export default ClientProfile;
