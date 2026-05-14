import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Bell, ChevronDown, Shield, Sun, Moon,
    TrendingUp, PieChart, Code, IndianRupee, BriefcaseIcon, UserCheck, MessageSquare, CreditCard, Globe, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Sub-components
import DashboardOverview from './DashboardOverview';
import LiveProjectsView from './LiveProjectsView';
import UserManagementView from './UserManagementView';
import ProfileView from './ProfileView';
import ProjectBiddingsView from './ProjectBiddingsView';
import VerificationView from './VerificationView';
import FinanceView from './FinanceView';
import AnalyticsView from './AnalyticsView';
import SupportView from './SupportView';
import OperationalPulseView from './OperationalPulseView';
import AuditLogView from './AuditLogView';
import SiteConfigView from './SiteConfigView';
import JobApplicationsView from './JobApplicationsView';
import MessagesView from './MessagesView';
import ComingSoonView from './ComingSoonView';

// --- STYLES ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Roboto:wght@300;400;500;700;900&display=swap');
    
    :root {
        --brand-orange: #F97316;
        --brand-teal: #003d4d;
        --bg-slate: #F8FAFC;
        --text-main: #1e293b;
        --text-muted: #64748b;
    }

    .font-poppins { font-family: 'Poppins', sans-serif; }
    .font-inter { font-family: 'Inter', sans-serif; }
    .font-roboto { font-family: 'Roboto', sans-serif; }

    .shine-card {
        background: white;
        border: 1px solid #f1f5f9;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .dark .shine-card {
        background: #1e293b;
        border-color: #334155;
        box-shadow: none;
    }

    .shine-button-orange {
        background: #F97316;
        color: white;
        font-weight: 700;
        border-radius: 10px;
        transition: all 0.2s;
        box-shadow: 0 10px 15px -3px rgb(249 115 22 / 0.2);
    }

    .shine-button-teal {
        background: #003d4d;
        color: white;
        font-weight: 700;
        border-radius: 10px;
        transition: all 0.2s;
        box-shadow: 0 10px 15px -3px rgb(0 61 77 / 0.1);
    }

    .body-text-standard {
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 2;
        color: #64748b;
    }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .sidebar-link {
        transition: all 0.2s ease;
        border-radius: 12px;
        margin: 0 12px;
    }
    
    .sidebar-link-active {
        background: #fff7ed;
        color: #f97316;
    }
    
    .dark .sidebar-link-active {
        background: #2d3748;
        color: #fb923c;
    }
`;

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Data States
    const [stats, setStats] = useState<any>({
        totalUsers: 0,
        totalProjects: 0,
        totalFreelancers: 0,
        totalClients: 0,
        totalRevenue: 0
    });
    const [users, setUsers] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loggedUser, setLoggedUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.userRole !== 'ADMIN') {
            navigate('/profile');
            return;
        }
        setLoggedUser(user);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, projectsRes] = await Promise.all([
                fetch('http://localhost:8080/api/admin/stats', { headers: { 'X-Requested-With': 'XMLHttpRequest' } }),
                fetch('http://localhost:8080/api/admin/users', { headers: { 'X-Requested-With': 'XMLHttpRequest' } }),
                fetch('http://localhost:8080/api/admin/projects', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (projectsRes.ok) setProjects(await projectsRes.json());
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const sidebarItems = [
        { 
            section: 'PLATFORM ECOSYSTEM',
            items: [
                { icon: LayoutDashboard, label: 'Global Command Center', id: 'dashboard', hot: true },
                { icon: TrendingUp, label: 'Market Intelligence', id: 'analytics_suite' },
                { icon: PieChart, label: 'Operational Pulse', id: 'market_pulse' }
            ]
        },
        {
            section: 'TALENT ARCHITECTURE',
            items: [
                { icon: Code, label: 'Global Talent Network', id: 'freelancer_network' },
                { icon: IndianRupee, label: 'Strategic Biddings', id: 'biddings' },
                { icon: Shield, label: 'Trust & Verification', id: 'verification' }
            ]
        },
        {
            section: 'PROJECT GOVERNANCE',
            items: [
                { icon: BriefcaseIcon, label: 'Active Engagements', id: 'live_projects' },
                { icon: Database, label: 'Job Applications', id: 'all_applications' },
                { icon: UserCheck, label: 'Client Ecosystem', id: 'clients' },
                { icon: MessageSquare, label: 'Communication Logs', id: 'all_messages' },
                { icon: MessageSquare, label: 'Escalation Support', id: 'support' }
            ]
        },
        {
            section: 'FINANCIAL INTEGRITY',
            items: [
                { icon: CreditCard, label: 'Escrow & Treasury', id: 'finance' },
                { icon: Database, label: 'Billing Infrastructure', id: 'audit' }
            ]
        },
        {
            section: 'ADMINISTRATIVE',
            items: [
                { icon: Shield, label: 'Executive Profile', id: 'profile' },
                { icon: Globe, label: 'Site Configuration', id: 'cms' }
            ]
        }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview stats={stats} users={users} projects={projects} loggedUser={loggedUser} onNavigate={setActiveTab} />;
            case 'analytics_suite':
                return <AnalyticsView />;
            case 'market_pulse':
                return <OperationalPulseView />;
            case 'live_projects':
                return <LiveProjectsView projects={projects} />;
            case 'freelancer_network':
                return <UserManagementView users={users} type="FREELANCER" />;
            case 'clients':
                return <UserManagementView users={users} type="CLIENT" />;
            case 'biddings':
                return <ProjectBiddingsView />;
            case 'verification':
                return <VerificationView />;
            case 'finance':
                return <FinanceView />;
            case 'audit':
                return <AuditLogView />;
            case 'support':
                return <SupportView />;
            case 'all_applications':
                return <JobApplicationsView />;
            case 'all_messages':
                return <MessagesView />;
            case 'cms':
                return <SiteConfigView />;
            case 'profile':
                return <ProfileView user={loggedUser} />;
            default:
                return <ComingSoonView tabName={activeTab} />;
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-[#F8FAFC] flex items-center justify-center font-roboto">
                <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-[#F8FAFC]'} font-roboto overflow-hidden transition-colors duration-200`}>
            <style>{styles}</style>

            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 z-50 flex flex-col transition-all duration-300 overflow-hidden shrink-0 shadow-xl shadow-slate-200/50`}>
                <div 
                    className="h-44 flex items-center justify-center px-6 border-b border-slate-50 dark:border-slate-700 shrink-0 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <img 
                        src="shine-logo.png" 
                        alt="Shinefiling" 
                        className="h-32 w-auto max-w-full object-contain transition-transform group-hover:scale-105" 
                    />
                </div>

                <div className="flex-1 overflow-y-auto py-6 no-scrollbar">
                    {sidebarItems.map((section) => (
                        <div key={section.section} className="mb-6">
                            <div className="px-6 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{section.section}</div>
                            <div className="space-y-1">
                                {section.items.map(item => (
                                    <SidebarItem 
                                        key={item.id} 
                                        {...item} 
                                        activeTab={activeTab} 
                                        setActiveTab={setActiveTab} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                
                {/* Header */}
                <header className="h-14 bg-white dark:bg-slate-800 flex items-center justify-end px-8 z-40 shrink-0 border-b border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-6">
                        <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button className="text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors">
                            <Bell size={18} />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="text-right">
                                <div className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                    {loggedUser?.fullName}
                                </div>
                                <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Shield size={10} className="text-orange-500" /> Master Administrator
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200">
                                <img src={`https://ui-avatars.com/api/?name=${loggedUser?.fullName || 'A'}&background=F97316&color=fff`} alt="Admin" className="w-full h-full" />
                            </div>
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </div>
                </header>

                {/* Dashboard Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar scroll-smooth">
                    <div className="max-w-[1600px] mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, id, hot, activeTab, setActiveTab }: any) => {
    const isActive = activeTab === id;
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-[calc(100%-24px)] flex items-center justify-between px-4 py-3 sidebar-link mx-3
                ${isActive ? 'sidebar-link-active' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className={`${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className={`text-[13px] font-medium tracking-tight font-poppins ${isActive ? 'font-bold' : ''}`}>{label}</span>
            </div>
            {hot && <span className="bg-red-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md uppercase">Hot</span>}
        </button>
    );
};

export default AdminDashboard;
