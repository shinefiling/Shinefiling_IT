import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    ChevronDown, ChevronUp, Menu, X, User as UserIcon, LogOut, 
    Settings, CreditCard, BarChart3, ShieldCheck,
    Zap, LifeBuoy, History, Wallet, Bell, MessageSquare,
    Briefcase, Plus, Megaphone, FolderKanban, FileText, Settings2,
    PlusCircle, UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [chatTab, setChatTab] = useState<'messages' | 'notifications'>('messages');
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [news, setNews] = useState("Welcome to Shinefiling! Stay tuned for daily IT news updates.");

    const fetchNews = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/news/latest`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                setNews(data.content);
            }
        } catch (err) {
            console.error("Error fetching news:", err);
        }
    };


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const loadUserData = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                const uid = parsedUser.id || parsedUser.userId;
                if (uid) fetchNotifications(uid);
            } else {
                setUser(null);
            }
        };

        loadUserData();
        fetchNews();

        const handleUserUpdate = () => {
            loadUserData();
        };

        const handleOpenChat = (e: any) => {
            const { contact } = e.detail || {};
            if (contact) {
                setSelectedChat(contact);
                setChatMessages([{ id: Date.now(), text: `Hi! I'd like to discuss the project with you.`, sender: 'other', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            }
            setIsChatOpen(true);
        };

        window.addEventListener('user-updated', handleUserUpdate);
        window.addEventListener('storage', handleUserUpdate);
        window.addEventListener('open-chat', handleOpenChat);

        const interval = setInterval(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                const uid = parsed.id || parsed.userId;
                if (uid) {
                    fetchNotifications(uid);
                    fetchLatestUserData(uid);
                }
            }
        }, 5000);

        const newsUpdateInterval = setInterval(fetchNews, 5 * 60 * 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('user-updated', handleUserUpdate);
            window.removeEventListener('storage', handleUserUpdate);
            window.removeEventListener('open-chat', handleOpenChat);
            clearInterval(interval);
            clearInterval(newsUpdateInterval);
        };
    }, [location]);

    const fetchNotifications = async (userId: any) => {
        if (!userId || userId === 'undefined') return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/user/${userId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (response.ok) {
                let data = await response.json();
                
                // Preprocess to extract names from messages if senderName is missing
                data = data.map((n: any) => {
                    if (!n.senderName && n.message) {
                        // Pattern: "Name has placed a bid" or "Name bid on"
                        const match = n.message.match(/^([A-Za-z\s]+)\s+(?:has placed a bid|bid on|has sent)/i);
                        if (match && match[1]) {
                            return { ...n, senderName: match[1].trim() };
                        }
                    }
                    return n;
                });

                setNotifications(data);
                setUnreadCount(data.filter((n: any) => !n.read).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markNotificationAsRead = async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (response.ok) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const fetchLatestUserData = async (userId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/wallet/balance/${userId}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUser((prev: any) => {
                    const updated = { ...prev, walletBalance: data.balance };
                    // Also update localStorage so other pages get the fresh balance
                    localStorage.setItem('user', JSON.stringify(updated));
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsProfileOpen(false);
        navigate('/');
    };

    const handlePostProject = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/post-project');
        }
        setIsMobileMenuOpen(false);
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return;

        const newMessage = {
            id: Date.now(),
            text: messageInput,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatMessages(prev => [...prev, newMessage]);
        setMessageInput('');
    };

    const navLinks = [
        { 
            label: "Find a Job", 
            dropdown: false,
           path: "/jobs"
        },
        { 
            label: "Hire Developers", 
            dropdown: false,
            path: "/freelancers" 
        },
        { label: "Find a project", path: "/projects", dropdown: false },
        { label: "Pricing", path: "/pricing", dropdown: false }
    ].filter(link => link.label !== 'Pricing');

    return (
        <>
            {/* Top News Ticker */}
            <Link to="/daily-updates" className="fixed top-0 left-0 right-0 h-[35px] bg-[#1a1a1a] z-[1001] flex items-center overflow-hidden border-b border-white/10 cursor-pointer group">
                <div className="bg-primary text-white px-4 h-full flex items-center text-[11px] font-bold uppercase tracking-widest z-10 shrink-0 shadow-[10px_0_15px_rgba(0,0,0,0.2)]">
                    <Megaphone size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Daily IT Update
                </div>
                <div className="flex-1 relative overflow-hidden h-full flex items-center">
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: '-100%' }}
                        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
                        className="whitespace-nowrap text-[13px] text-white/90 font-medium font-['Poppins'] flex items-center gap-10"
                    >
                        <span>{news}</span>
                        <span className="text-primary">•</span>
                        <span>{news}</span>
                        <span className="text-primary">•</span>
                        <span>{news}</span>
                    </motion.div>
                </div>
            </Link>

            <nav className={`fixed top-[35px] left-0 right-0 z-[1000] transition-all duration-300 h-[80px] flex items-center ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm border-b border-[#242424]/5'}`}>
            <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 flex items-center justify-between h-full">
                {/* Left: Logo */}
                <div className="flex justify-start">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                        <img src="shine-logo.png" alt="ShineFiling Logo" className="h-16 md:h-24 w-auto object-contain hover:opacity-90 transition-all" />
                    </Link>
                </div>
                
                {/* Center: Desktop Navigation Links */}
                <div className="hidden xl:flex items-center justify-center gap-8 h-[90px]">
                    {navLinks.map(link => (
                        <div 
                            key={link.label} 
                            className="group flex items-center gap-1.5 cursor-pointer h-[90px] relative"
                            onMouseEnter={() => setActiveDropdown(link.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            {!link.dropdown ? (
                                <Link 
                                    to={link.path || '#'}
                                    className="text-[#000000] group-hover:text-[#b5242c] text-[14px] font-medium leading-[21px] transition-colors font-['Poppins']"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <>
                                    <span className="text-[#000000] group-hover:text-[#b5242c] text-[14px] font-medium leading-[21px] transition-colors font-['Poppins']">
                                        {link.label}
                                    </span>
                                    <ChevronDown size={14} className={`text-[#000000] group-hover:text-[#b5242c] transition-all duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                                </>
                            )}
                            
                            {link.dropdown && activeDropdown === link.label && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 w-[240px] bg-white shadow-xl border-t-2 border-[#b5242c] rounded-b-xl py-4 z-[1001]"
                                >
                                    {/* {link.subItems?.map(item => (
                                        <Link 
                                            key={item.label}
                                            to={item.path}
                                            onClick={(e) => {
                                                if (item.path === '/post-project') {
                                                    e.preventDefault();
                                                    handlePostProject();
                                                }
                                            }}
                                            className="block px-6 py-2.5 text-[13px] text-[#444] hover:text-[#b5242c] hover:bg-gray-50 transition-all font-['Poppins']"
                                        >
                                            {item.label}
                                        </Link>
                                    ))} */}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center justify-end gap-3 lg:gap-6">
                    {/* Always show Post a Project */}
                    <button 
                        onClick={handlePostProject}
                        className="hidden sm:block bg-[#b5242c] text-white rounded-sm px-4 py-1.5 text-[13px] font-bold transition-all hover:bg-[#a11f27] font-['Poppins'] tracking-tight"
                    >
                        Post a Project
                    </button>

                    {!user ? (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/login" className="text-[#000000] hover:text-[#b5242c] text-[14px] font-medium transition-all font-['Poppins'] px-2 lg:px-4">
                                Sign in
                            </Link>
                            <Link to="/signup" className="bg-[#000000] text-white rounded-lg px-6 py-2.5 text-[14px] font-medium transition-all hover:bg-[#333] font-['Poppins']">
                                Register
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Quick Actions */}
                            <div className="hidden md:flex items-center gap-5 border-r border-gray-100 pr-6 mr-1">
                                <div 
                                    className="relative h-[90px] flex items-center"
                                    onMouseEnter={() => setIsNotificationsOpen(true)}
                                    onMouseLeave={() => setIsNotificationsOpen(false)}
                                >
                                    <button className="text-[#000000] hover:text-[#b5242c] transition-colors relative group">
                                        <Bell size={20} strokeWidth={1.5} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-[13px] h-[13px] bg-[#b5242c] text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isNotificationsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                                                className="absolute top-[80px] right-[-100px] w-[340px] bg-white rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[1001]"
                                            >
                                                {/* Arrow Pointer */}
                                                <div className="absolute top-[-6px] right-[105px] w-3 h-3 bg-[#b5242c] rotate-45"></div>

                                                {/* Brand Red Header */}
                                                <div className="bg-[#b5242c] px-5 py-3.5 relative">
                                                    <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Notifications</h3>
                                                </div>

                                                <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-6 py-10 text-center text-gray-400 text-[13px] italic font-['Poppins']">
                                                            No notifications yet
                                                        </div>
                                                    ) : (
                                                        notifications.map((n, i) => (
                                                            <div 
                                                                key={i} 
                                                                onClick={() => markNotificationAsRead(n.id)}
                                                                className={`px-4 py-3 flex gap-2.5 hover:bg-gray-50 cursor-pointer transition-colors relative border-b border-gray-50/50 last:border-0 ${!n.read ? 'bg-blue-50/30' : ''}`}
                                                            >
                                                                <div className="relative shrink-0">
                                                                    <div className="w-9 h-9 rounded-none flex items-center justify-center mt-0.5 border border-gray-100 bg-white">
                                                                        {n.img ? (
                                                                            <img src={n.img} alt="" className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span className="text-[12px] font-bold text-black uppercase">
                                                                                {n.senderName ? n.senderName.substring(0, 2).toUpperCase() : (n.title?.toLowerCase().includes('bid') ? 'BD' : 'U')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {!n.img && !n.senderName && (
                                                                        <div className="absolute -bottom-1 -right-1">
                                                                            <Bell size={12} className="text-black" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between mb-0">
                                                                        <div className="text-[12.5px] leading-tight font-['Poppins'] text-[#242424]">
                                                                            <p className="font-bold text-[#b5242c] mb-0.5">{n.senderName || n.title}</p>
                                                                            <p className="text-gray-500 font-medium">{n.senderName ? n.title + ': ' + n.message : n.message}</p>
                                                                        </div>
                                                                        {!n.read && (
                                                                            <span className="bg-[#b5242c] w-2 h-2 rounded-full shrink-0 mt-1.5 ml-2"></span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</p>
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                                                    <button 
                                                        onClick={() => {
                                                            setChatTab('notifications');
                                                            setIsChatOpen(true);
                                                            setIsNotificationsOpen(false);
                                                        }}
                                                        className="text-[12px] font-bold text-[#b5242c] hover:underline"
                                                    >
                                                        View All Notifications
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <div 
                                    className="relative h-[90px] flex items-center"
                                    onMouseEnter={() => setIsMessagesOpen(true)}
                                    onMouseLeave={() => setIsMessagesOpen(false)}
                                >
                                    <button 
                                        onClick={() => setIsChatOpen(true)}
                                        className="text-[#000000] hover:text-[#b5242c] transition-colors relative"
                                    >
                                        <MessageSquare size={20} strokeWidth={1.5} />
                                        {unreadMessagesCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-[13px] h-[13px] bg-[#b5242c] text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center">
                                                {unreadMessagesCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isMessagesOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                                                className="absolute top-[80px] right-[-50px] w-[340px] bg-white rounded-lg shadow-[0_10px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[1001]"
                                            >
                                                {/* Arrow Pointer */}
                                                <div className="absolute top-[-6px] right-[62px] w-3 h-3 bg-[#b5242c] rotate-45"></div>

                                                {/* Brand Red Header */}
                                                <div className="bg-[#b5242c] px-5 py-3.5 relative flex items-center justify-between">
                                                    <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Recent Messages</h3>
                                                    <button 
                                                        onClick={() => {
                                                            setChatTab('messages');
                                                            setIsChatOpen(true);
                                                            setIsMessagesOpen(false);
                                                        }}
                                                        className="text-[12px] font-bold text-white/90 hover:text-white transition-colors"
                                                    >
                                                        View All
                                                    </button>
                                                </div>
                                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                    <div className="px-6 py-12 text-center">
                                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                            <MessageSquare size={24} className="text-gray-300" />
                                                        </div>
                                                        <h4 className="text-[14px] font-bold text-[#242424] mb-1">No messages yet</h4>
                                                        <p className="text-[12px] text-gray-400 font-['Poppins']">Connect with freelancers to start a conversation.</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Profile Section */}

                            <div 
                                className="relative z-[1001]"
                                onMouseEnter={() => setIsProfileOpen(true)}
                                onMouseLeave={() => setIsProfileOpen(false)}
                            >
                                <button 
                                    className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-gray-100 transition-all h-[50px]"
                                >
                                    <div className="w-9 h-9 bg-gradient-to-tr from-[#b5242c] to-[#ff8e8e] rounded-full flex items-center justify-center text-white">
                                        <UserIcon size={18} />
                                    </div>
                                    <div className="flex flex-col items-start leading-tight">
                                        <span className="text-[13px] font-bold text-[#242424] font-['Poppins']">
                                            {user?.fullName?.split(' ')[0] || user?.username || 'User'}
                                        </span>
                                        <span className="text-[10px] text-[#888] font-medium tracking-wide">₹{(user?.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-[#888] transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-2 w-[300px] bg-white rounded-xl shadow-2xl z-[99999] overflow-hidden flex flex-col max-h-[calc(100vh-120px)]"
                                    > 
                                        <div className="overflow-y-auto custom-scrollbar pb-4">
                                            {/* White Header */}
                                            <div className="bg-white p-5 border-b border-gray-100 relative">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 shadow-sm">
                                                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Profile" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <h3 className="font-bold text-[15px] leading-tight text-[#242424] truncate">{user.fullName}</h3>
                                                        <p className="text-[12px] text-[#888] truncate">@{user.username || 'prakash_1417'}</p>
                                                    </div>
                                                </div>
                                            </div>



                                            {/* Conditional Section based on Role */}
                                            {user.userRole === 'ADMIN' ? (
                                                <div className="py-1.5">
                                                    <Link to="/admin-dashboard" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                        <ShieldCheck size={16} className="text-[#b5242c]" />
                                                        Admin Dashboard
                                                    </Link>
                                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all text-left">
                                                        <LogOut size={16} className="text-gray-400" />
                                                        Logout
                                                    </button>
                                                </div>
                                            ) : user.userRole === 'CLIENT' ? (
                                                <>
                                                    {/* Client Specific Section */}
                                                    <div className="py-1.5 border-b border-gray-50">
                                                        <Link to={user?.userRole === 'CLIENT' ? '/client-profile' : '/profile'} className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <UserCircle size={16} className="text-primary/70" />
                                                            My Profile
                                                        </Link>
                                                        <Link to="/post-job" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all font-bold text-primary">
                                                            <PlusCircle size={16} className="text-primary" />
                                                            Post a Job
                                                        </Link>
                                                        <Link to="/client-profile?tab=jobs" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <FolderKanban size={16} className="text-gray-400" />
                                                            Manage Projects
                                                        </Link>
                                                    </div>

                                                    <div className="py-1.5 border-b border-gray-50">
                                                        <Link to="/client-profile?tab=billing" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <Wallet size={16} className="text-gray-400" />
                                                            Billing & Payments
                                                        </Link>
                                                        <Link to="/client-profile?tab=invoices" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <FileText size={16} className="text-gray-400" />
                                                            Invoices
                                                        </Link>
                                                    </div>
                                                    
                                                    <div className="py-1.5">
                                                        <Link to="/client-profile?tab=support" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <LifeBuoy size={16} className="text-gray-400" />
                                                            Help & Support
                                                        </Link>
                                                        <Link to="/client-profile?tab=settings" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <Settings2 size={16} className="text-gray-400" />
                                                            Settings
                                                        </Link>
                                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all text-left">
                                                            <LogOut size={16} className="text-[#b5242c]" />
                                                            Logout
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Freelancer Specific Section (Updated) */}
                                                    <div className="py-1.5 border-b border-gray-50">
                                                        <Link to="/financial-dashboard" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <BarChart3 size={16} className="text-gray-400" />
                                                            Financial dashboard
                                                        </Link>
                                                    </div>

                                                    <div className="py-1.5 border-b border-gray-50">
                                                        <Link to="/profile" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <UserIcon size={16} className="text-gray-400" />
                                                            My Profile
                                                        </Link>
                                                        <Link to="/analytics" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <BarChart3 size={16} className="text-gray-400" />
                                                            Account analytics
                                                        </Link>
                                                    </div>
                                                    
                                                    <div className="py-1.5 border-b border-gray-50">
                                                        <Link to="/settings" className="flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all">
                                                            <Settings size={16} className="text-gray-400" />
                                                            Settings
                                                        </Link>
                                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2 text-[13px] text-[#444] hover:bg-gray-50 transition-all text-left">
                                                            <LogOut size={16} className="text-gray-400" />
                                                            Logout
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </div>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="xl:hidden p-2 text-[#242424] hover:text-[#b5242c] transition-all"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-[1009] transition-opacity duration-300 xl:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[1010] shadow-2xl transition-transform duration-300 xl:hidden transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-0 flex flex-col h-full overflow-hidden">
                    <div className="p-6 flex items-center justify-between border-b border-gray-50">
                        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <img src={`${import.meta.env.BASE_URL}shine-logo.png`} alt="Shinefiling" className="h-14 w-auto" />
                        </Link>
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X size={24} className="text-[#242424]" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-6 custom-scrollbar">
                        <div className="flex flex-col gap-6 mb-10">
                            {navLinks.map(link => (
                                <div key={link.label} className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between border-b border-[#f5f5f5] pb-4 cursor-pointer">
                                        {link.dropdown ? (
                                            <span className="text-[#242424] font-medium text-[15px]">{link.label}</span>
                                        ) : (
                                            <Link to={link.path || '#'} className="text-[#242424] font-medium text-[15px]" onClick={() => setIsMobileMenuOpen(false)}>
                                                {link.label}
                                            </Link>
                                        )}
                                        {link.dropdown && <ChevronDown size={16} className="text-[#888]" />}
                                    </div>
                                </div>
                            ))}
                            {user && (
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => {
                                            setIsChatOpen(true);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-between border-b border-[#f5f5f5] pb-4 cursor-pointer w-full text-left"
                                    >
                                        <span className="text-[#242424] font-medium text-[15px]">Messages</span>
                                        <div className="relative">
                                            <MessageSquare size={18} className="text-[#888]" />
                                            {unreadMessagesCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#b5242c] text-white text-[7px] font-bold rounded-full border border-white flex items-center justify-center">
                                                    {unreadMessagesCount}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {!user ? (
                            <div className="space-y-4 mb-8">
                                <Link to="/login" className="block w-full text-center py-3.5 border border-[#eee] rounded-xl font-bold text-[#242424] hover:bg-gray-50 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                    SIGN IN
                                </Link>
                                <Link to="/signup" className="block w-full text-center py-3.5 bg-[#000000] text-white rounded-xl font-bold hover:bg-[#333] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                    REGISTER
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6 mb-8">
                                <div className="p-4 bg-[#f9fafb] rounded-2xl flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#b5242c] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#b5242c]/20">
                                        <UserIcon size={24} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-[#242424] truncate">{user.fullName}</p>
                                        <p className="text-[11px] text-[#888] truncate">{user.email}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <Link to={user?.userRole === 'CLIENT' ? '/client-profile' : '/profile'} className="flex items-center gap-3 w-full p-3 text-[14px] font-medium text-[#444] hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                        <UserIcon size={18} className="text-gray-400" />
                                        My Profile
                                    </Link>
                                    
                                    {user.userRole === 'CLIENT' ? (
                                        <>
                                            <Link to="/client-profile?tab=jobs" className="flex items-center gap-3 w-full p-3 text-[14px] font-medium text-[#444] hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Briefcase size={18} className="text-gray-400" />
                                                Manage Projects
                                            </Link>
                                            <Link to="/client-profile?tab=invoices" className="flex items-center gap-3 w-full p-3 text-[14px] font-medium text-[#444] hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                <History size={18} className="text-gray-400" />
                                                Invoices
                                            </Link>
                                        </>
                                    ) : user.userRole === 'FREELANCER' ? (
                                        <>
                                            <Link to="/bids" className="flex items-center gap-3 w-full p-3 text-[14px] font-medium text-[#444] hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                <Zap size={18} className="text-gray-400" />
                                                Bid Insights
                                            </Link>
                                            <Link to="/withdraw" className="flex items-center gap-3 w-full p-3 text-[14px] font-medium text-[#444] hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                                <History size={18} className="text-gray-400" />
                                                Withdraw Funds
                                            </Link>
                                        </>
                                    ) : null}

                                    <Link to={user?.userRole === 'CLIENT' ? '/client-profile?tab=settings' : '/settings'} className="flex items-center gap-3 w-full p-3 text-[14px] font-medium text-[#444] hover:bg-gray-50 rounded-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Settings size={18} className="text-gray-400" />
                                        Settings
                                    </Link>
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <button 
                                onClick={() => {
                                    handlePostProject();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full py-4 bg-[#b5242c] text-white rounded-xl font-bold hover:bg-[#a11f27] transition-all"
                            >
                                POST A PROJECT
                            </button>
                            
                            {user && (
                                <button 
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-4 bg-gray-50 text-[#888] rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <LogOut size={18} />
                                    LOGOUT
                                </button>
                            )}
                        </div>
                    </div>
                </div>
        </div>

        {/* Floating Chat Window - Only show if user is logged in and not on messages page */}
        {user && location.pathname !== '/messages' && (
        <AnimatePresence>
            {/* Floating Chat Tab (Minimized state) */}
            {!isChatOpen && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    onClick={() => {
                        setIsChatOpen(true);
                    }}
                    className="fixed bottom-0 right-5 md:right-10 w-[calc(100%-40px)] max-w-[280px] bg-white border border-gray-200 border-b-0 rounded-none shadow-[0_-5px_25px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-gray-50 transition-colors z-[2000] flex items-center justify-between px-4 py-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                <MessageSquare size={16} className="text-[#b5242c]" />
                            </div>
                            {unreadMessagesCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#b5242c] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                                    {unreadMessagesCount}
                                </div>
                            )}
                        </div>
                        <span className="text-[14px] font-bold text-[#242424]">Messages</span>
                    </div>
                    <div className="text-gray-400 group-hover:text-[#b5242c] transition-colors">
                        <ChevronUp size={18} />
                    </div>
                </motion.div>
            )}

            {isChatOpen && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    className="fixed bottom-0 right-0 md:right-10 w-full md:w-[680px] h-[95vh] md:h-[520px] bg-[#fdfaf0] shadow-[0_-10px_60px_rgba(0,0,0,0.1)] rounded-none z-[2001] border border-gray-200/50 border-b-0 overflow-hidden flex font-['Poppins']"
                >
                    {/* Sidebar - Chat List */}
                    <div className={`${(selectedChat || selectedNotification) ? 'hidden md:flex' : 'flex'} w-full md:w-[250px] border-r border-gray-200/50 flex-col bg-[#fdfaf0]/80`}>
                        <div className="p-5 pb-2">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-[18px] font-bold text-[#242424]">Messages</h2>
                                <button className="w-8 h-8 rounded-none bg-gray-50 flex items-center justify-center text-[#b5242c] hover:bg-gray-100 transition-all border border-gray-100">
                                    <PlusCircle size={18} />
                                </button>
                            </div>
                            
                            <div className="flex gap-0 mb-5 bg-gray-100/50 p-1 rounded-none border border-gray-200/50">
                                <button 
                                    onClick={() => setChatTab('messages')}
                                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-none transition-all ${chatTab === 'messages' ? 'bg-white text-[#b5242c] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Chats
                                </button>
                                <button 
                                    onClick={() => setChatTab('notifications')}
                                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-none transition-all ${chatTab === 'notifications' ? 'bg-white text-[#b5242c] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    Alerts
                                </button>
                            </div>

                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder={`Search ${chatTab}...`} 
                                    className="w-full bg-white border border-gray-200 rounded-none py-2 pl-9 pr-3 text-[12px] outline-none focus:border-[#b5242c]/30 transition-all"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#b5242c] transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar space-y-1">
                            {chatTab === 'messages' ? (
                                // This will be populated by real chat data
                                <div className="py-20 text-center opacity-20">
                                    <MessageSquare size={40} className="mx-auto mb-3" />
                                    <p className="text-[12px] font-bold uppercase tracking-wider">No active chats</p>
                                </div>
                            ) : (
                                        notifications.map((n, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => setSelectedNotification(n)}
                                                className={`w-full p-3 rounded-none flex gap-3 transition-all text-left ${selectedNotification?.id === n.id ? 'bg-[#fff0ef] border-[#e2bebc]/30' : 'hover:bg-gray-50 border-transparent'} border`}
                                            >
                                                <div className="w-10 h-10 rounded-none bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {n.img ? (
                                                        <img src={n.img} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center">
                                                            <span className="text-[12px] font-bold text-black uppercase">
                                                                {n.senderName ? n.senderName.substring(0, 2).toUpperCase() : (n.title?.toLowerCase().includes('bid') ? 'BD' : 'U')}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className={`text-[12px] font-bold truncate ${!n.read ? 'text-[#242424]' : 'text-gray-500'}`}>{n.senderName || n.title}</p>
                                                        <Bell size={12} className="text-black shrink-0" />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 truncate">{n.message}</p>
                                                </div>
                                                {!n.read && <div className="w-1.5 h-1.5 bg-[#b5242c] mt-1 shrink-0"></div>}
                                            </button>
                                        ))
                            )}
                        </div>
                    </div>

                    {/* Main Area */}
                    <div className={`${(!selectedChat && !selectedNotification) ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-[#fdfaf0] relative`}>
                        {chatTab === 'messages' && selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 flex items-center justify-between border-b border-gray-200/50 relative z-10 bg-[#fdfaf0]">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-none transition-all mr-1">
                                            <ChevronDown size={20} className="rotate-90" />
                                        </button>
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-none overflow-hidden border border-gray-100">
                                                <img src={selectedChat.img || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-none border-2 border-white"></div>
                                        </div>
                                        <div className="leading-tight">
                                            <h4 className="text-[14px] font-bold text-[#242424] tracking-tight">{selectedChat.name}</h4>
                                            <p className="text-[11px] text-gray-400 font-medium">last seen recently</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="text-gray-400 hover:bg-gray-50 p-2 rounded-none transition-all"><ChevronDown size={18} /></button>
                                        <button className="text-gray-400 hover:bg-gray-50 p-2 rounded-none transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></button>
                                        <button className="text-gray-400 hover:bg-gray-50 p-2 rounded-none transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
                                        <div className="w-[1px] h-6 bg-gray-100 mx-1"></div>
                                        <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:bg-red-50 hover:text-red-500 p-2 rounded-none transition-all"><X size={18} /></button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-5 overflow-y-auto bg-[#fdfaf0] flex flex-col gap-5 custom-scrollbar">
                                    <div className="flex flex-col items-center my-4 opacity-50">
                                        <div className="bg-gray-50 px-3 py-1 rounded-none text-[10px] font-bold text-gray-500 uppercase tracking-widest">Today, Jun 20</div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {chatMessages.map((msg) => (
                                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className="w-8 h-8 rounded-none overflow-hidden border border-gray-100 shrink-0 mt-auto">
                                                        <img src={msg.sender === 'user' ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" : selectedChat.img} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                                        <div className={`p-3 px-4 rounded-none text-[13px] leading-relaxed ${
                                                            msg.sender === 'user' 
                                                            ? 'bg-[#eef5ff] text-[#242424] border border-[#d8e8ff]' 
                                                            : 'bg-[#f8f9fa] text-[#242424] border border-gray-100'
                                                        }`}>
                                                            <p>{msg.text}</p>
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 mt-1 font-medium">{msg.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Chat Input */}
                                <div className="p-4 bg-[#fdfaf0] border-t border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-none hover:bg-gray-50 transition-all"><Plus size={20} /></button>
                                        <div className="flex-1 flex items-center gap-3 bg-[#f8f9fa] rounded-none px-4 py-1 border border-gray-100 focus-within:border-gray-200 focus-within:bg-white transition-all">
                                            <input 
                                                type="text" 
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Write your message..." 
                                                className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#242424] py-2 placeholder:text-gray-400"
                                            />
                                            <div className="flex items-center gap-2">
                                                <button className="text-gray-400 hover:text-gray-600 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></button>
                                                <button 
                                                    onClick={handleSendMessage}
                                                    disabled={!messageInput.trim()}
                                                    className={`p-1.5 rounded-none transition-all ${messageInput.trim() ? 'text-[#b5242c] hover:bg-red-50' : 'text-gray-300'}`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : chatTab === 'notifications' && selectedNotification ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 bg-[#fafafa]">
                                <button onClick={() => setSelectedNotification(null)} className="absolute top-4 left-4 p-2 text-gray-400 hover:bg-gray-100 rounded-none transition-all">
                                    <ChevronDown size={20} className="rotate-90" />
                                </button>
                                <button onClick={() => setIsChatOpen(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-none transition-all">
                                    <X size={20} />
                                </button>
                                <div className="relative mb-8">
                                    <div className="w-28 h-28 rounded-none overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-white/50">
                                        {selectedNotification.img ? (
                                            <img src={selectedNotification.img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[32px] font-bold text-black uppercase">
                                                {selectedNotification.senderName ? selectedNotification.senderName.substring(0, 2).toUpperCase() : (selectedNotification.title?.toLowerCase().includes('bid') ? 'BD' : 'U')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 flex items-center justify-center">
                                        <Bell size={24} className="text-black" />
                                    </div>
                                </div>
                                <h3 className="text-[22px] font-bold text-[#242424] mb-3">{selectedNotification.senderName || selectedNotification.title}</h3>
                                <p className="text-[14px] text-gray-500 mb-10 leading-relaxed max-w-[320px] mx-auto">
                                    {selectedNotification.message}. This was recorded at <span className="text-[#b5242c] font-bold">{new Date(selectedNotification.createdAt).toLocaleTimeString()}</span>.
                                </p>
                                <div className="flex gap-4 w-full max-w-[300px]">
                                    <button 
                                        onClick={() => {
                                            if (user?.userRole === 'CLIENT') {
                                                navigate('/client-profile?tab=jobs');
                                            } else {
                                                navigate('/profile');
                                            }
                                            setIsChatOpen(false);
                                            setSelectedNotification(null);
                                        }}
                                        className="flex-1 py-3.5 bg-[#b5242c] text-white rounded-none font-bold text-[13px] hover:bg-[#a11f27] transition-all"
                                    >
                                        Action Required
                                    </button>
                                    <button 
                                        onClick={() => setSelectedNotification(null)}
                                        className="flex-1 py-3.5 bg-white border border-gray-200 text-gray-600 rounded-none font-bold text-[13px] hover:bg-gray-50 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 bg-[#fdfaf0]">
                                <button onClick={() => setIsChatOpen(false)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-none transition-all">
                                    <X size={20} />
                                </button>
                                <div className="mb-8">
                                    <div className="text-black">
                                        {chatTab === 'messages' ? <MessageSquare size={60} strokeWidth={1.5} /> : <Bell size={60} strokeWidth={1.5} />}
                                    </div>
                                </div>
                                <h3 className="text-[18px] font-bold text-[#242424] mb-2">No {chatTab === 'messages' ? 'Conversation' : 'Alert'} Selected</h3>
                                <p className="text-[13px] font-medium max-w-[240px] mx-auto leading-relaxed">Choose a {chatTab === 'messages' ? 'contact' : 'notification'} from the list to start communicating.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        )}
        </>
    );
};

export default Navbar;
