import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronDown, ChevronUp, Menu, X, User as UserIcon, LogOut,
    Settings, CreditCard, BarChart3, ShieldCheck,
    Zap, LifeBuoy, History, Wallet, Bell, MessageSquare,
    Briefcase, Plus, Megaphone, FolderKanban, FileText, Settings2,
    PlusCircle, UserCircle, ChevronLeft, Phone, Video, Smile, Send
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
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChatFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && selectedChat) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);
            
            setIsSending(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/upload/chat`, {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                });
                if (response.ok) {
                    const fileUrl = await response.text();
                    const fileMsg = {
                        senderEmail: user?.email,
                        receiverEmail: selectedChat.email,
                        content: `Attached File: ${file.name}\n${API_BASE_URL}${fileUrl}`,
                    };
                    
                    const msgRes = await fetch(`${API_BASE_URL}/api/messages/send`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fileMsg)
                    });
                    
                    if (msgRes.ok) {
                        setChatMessages([...chatMessages, { ...fileMsg, id: Date.now(), sentAt: new Date().toISOString(), sender: 'user' }]);
                    }
                }
            } catch (error) {
                console.error("File upload failed:", error);
            } finally {
                setIsSending(false);
            }
        }
    };

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

                data = data.map((n: any) => {
                    if (!n.senderName && n.message) {
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
            label: "Find A Job",
            dropdown: false,
            path: "/jobs"
        },
        {
            label: "Hire Developers",
            dropdown: false,
            path: "/freelancers"
        },
        { label: "Find A Project", path: "/projects", dropdown: false },
        { label: "Pricing", path: "/pricing", dropdown: false }
    ].filter(link => link.label !== 'Pricing');

    const isHomePage = location.pathname === '/';
    const showTransparent = isHomePage && !isScrolled;

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 h-[80px] flex items-center ${showTransparent ? 'bg-transparent' : 'bg-white shadow-sm h-[70px]'}`}>
                <div className="max-w-[1320px] mx-auto w-full px-4 lg:px-8 flex items-center justify-between h-full">
                    <div className="flex justify-start">
                        <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
                            <img src="shine-logo.png" alt="ShineFiling Logo" className="h-12 md:h-16 lg:h-18 w-auto object-contain hover:opacity-90 transition-all" />
                        </Link>
                    </div>

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
                                            className="group-hover:text-[#317CD7] text-[14px] font-[600] tracking-[0.02em] transition-all relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#317CD7] after:transition-all group-hover:after:w-full uppercase"
                                            style={{ fontFamily: '"Poppins", sans-serif', color: showTransparent ? 'white' : 'rgb(0, 0, 0)', lineHeight: '24px' }}
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <>
                                            <span 
                                                className="group-hover:text-[#317CD7] text-[14px] font-[600] tracking-[0.02em] transition-all uppercase"
                                                style={{ fontFamily: '"Poppins", sans-serif', color: showTransparent ? 'white' : 'rgb(0, 0, 0)', lineHeight: '24px' }}
                                            >
                                                {link.label}
                                            </span>
                                            <ChevronDown size={14} style={{ color: showTransparent ? 'white' : 'rgb(0, 0, 0)' }} className={`group-hover:text-[#317CD7] transition-all duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                                        </>
                                )}

                                {link.dropdown && activeDropdown === link.label && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 w-[240px] bg-white shadow-xl border-t-2 border-[#317CD7] rounded-b-xl py-4 z-[1001]"
                                    >
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-3 lg:gap-6">
                        {user && user.userRole === 'CLIENT' && (
                            <button
                                onClick={handlePostProject}
                                className="hidden sm:block bg-[#317CD7] text-white rounded-[4px] px-5 py-2 text-[14px] font-[600] tracking-[0.02em] transition-all hover:bg-[#2563b5] shadow-sm uppercase"
                                style={{ fontFamily: '"Poppins", sans-serif', lineHeight: '24px' }}
                            >
                                Post A Project
                            </button>
                        )}

                        {!user ? (
                            <div className="hidden md:flex items-center gap-6">
                                <Link 
                                    to="/login" 
                                    className="hover:text-[#317CD7] text-[14px] font-[600] tracking-[0.02em] transition-all px-2 uppercase"
                                    style={{ fontFamily: '"Poppins", sans-serif', color: showTransparent ? 'white' : 'rgb(0, 0, 0)', lineHeight: '24px' }}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="bg-[#0F2E4B] text-white rounded-[4px] px-6 py-2.5 text-[14px] font-[600] tracking-[0.02em] transition-all hover:bg-[#1a3a5a] shadow-sm uppercase"
                                    style={{ fontFamily: '"Poppins", sans-serif', lineHeight: '24px' }}
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:flex items-center gap-5">
                                    <div
                                        className="relative h-[90px] flex items-center"
                                        onMouseEnter={() => setIsNotificationsOpen(true)}
                                        onMouseLeave={() => setIsNotificationsOpen(false)}
                                    >
                                        <button className="text-[#0F2E4B] hover:text-[#317CD7] transition-colors relative group">
                                            <Bell size={20} strokeWidth={2} />
                                            {unreadCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-[13px] h-[13px] bg-[#317CD7] text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center">
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
                                                    <div className="absolute top-[-6px] right-[105px] w-3 h-3 bg-[#0F2E4B] rotate-45"></div>

                                                    <div className="bg-[#0F2E4B] px-5 py-3.5 relative">
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
                                                                                <p className="font-bold text-[#317CD7] mb-0.5">{n.senderName || n.title}</p>
                                                                                <p className="text-gray-500 font-medium">{n.senderName ? n.title + ': ' + n.message : n.message}</p>
                                                                            </div>
                                                                            {!n.read && (
                                                                                <span className="bg-[#317CD7] w-2 h-2 rounded-full shrink-0 mt-1.5 ml-2"></span>
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
                                                            className="text-[12px] font-bold text-[#317CD7] hover:underline"
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
                                            className="text-[#0F2E4B] hover:text-[#317CD7] transition-colors relative"
                                        >
                                            <MessageSquare size={20} strokeWidth={2} />
                                            {unreadMessagesCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-[13px] h-[13px] bg-[#317CD7] text-white text-[8px] font-bold rounded-full border border-white flex items-center justify-center">
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
                                                    <div className="absolute top-[-6px] right-[62px] w-3 h-3 bg-[#0F2E4B] rotate-45"></div>

                                                    <div className="bg-[#0F2E4B] px-5 py-3.5 relative flex items-center justify-between">
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

                                <div
                                    className="relative z-[1001]"
                                    onMouseEnter={() => setIsProfileOpen(true)}
                                    onMouseLeave={() => setIsProfileOpen(false)}
                                >
                                    <button
                                        className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-gray-100 transition-all h-[50px]"
                                    >
                                        <div className="w-9 h-9 bg-gradient-to-tr from-[#0F2E4B] to-[#317CD7] rounded-full flex items-center justify-center text-white">
                                            <UserIcon size={18} />
                                        </div>
                                        <div className="flex flex-col items-start leading-tight">
                                            <span 
                                                className="text-[13px] font-bold font-['Poppins'] capitalize"
                                                style={{ color: showTransparent ? 'white' : 'rgb(0, 0, 0)' }}
                                            >
                                                {user?.fullName?.split(' ')[0] || user?.username || 'User'}
                                            </span>
                                            <span 
                                                className="text-[10px] font-medium tracking-wide opacity-70"
                                                style={{ color: showTransparent ? 'white' : '#888' }}
                                            >
                                                ₹{(user?.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} style={{ color: showTransparent ? 'white' : '#888' }} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                className="absolute right-0 mt-2 w-[300px] bg-white rounded-xl shadow-2xl z-[99999] overflow-hidden flex flex-col max-h-[calc(100vh-120px)]"
                                            >
                                                <div className="overflow-y-auto custom-scrollbar">
                                                    {user.userRole === 'ADMIN' ? (
                                                        <div className="pt-4 pb-1.5">
                                                            <Link to="/admin-dashboard" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                <BarChart3 size={22} className="text-[#317CD7]" />
                                                                Admin Dashboard
                                                            </Link>
                                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins'] text-left" style={{ lineHeight: '26px' }}>
                                                                <LogOut size={22} className="text-[#EF4444]" />
                                                                Logout
                                                            </button>
                                                        </div>
                                                    ) : user.userRole === 'CLIENT' ? (
                                                        <>
                                                            <div className="pt-4 pb-1.5 border-b border-gray-50">
                                                                <Link to={user?.userRole === 'CLIENT' ? '/client-profile' : '/profile'} className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <UserIcon size={22} className="text-[#317CD7]" />
                                                                    My Profile
                                                                </Link>
                                                                <Link to="/post-job" className="flex items-center gap-3 px-5 py-2.5 text-[15px] text-[rgb(0, 0, 0)] font-bold tracking-[0.01em] hover:bg-gray-50 transition-all font-['Poppins'] text-primary">
                                                                    <PlusCircle size={22} className="text-[#2DD4BF]" />
                                                                    Post a Job
                                                                </Link>
                                                                <Link to="/client-profile?tab=jobs" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <FolderKanban size={22} className="text-[#F59E0B]" />
                                                                    Manage Projects
                                                                </Link>
                                                            </div>

                                                            <div className="py-1.5 border-b border-gray-50">
                                                                <Link to="/client-profile?tab=billing" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <Wallet size={22} className="text-[#8B5CF6]" />
                                                                    Billing & Payments
                                                                </Link>
                                                                <Link to="/client-profile?tab=invoices" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <FileText size={22} className="text-[#6366F1]" />
                                                                    Invoices
                                                                </Link>
                                                            </div>

                                                            <div className="py-1.5">
                                                                <Link to="/client-profile?tab=support" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <LifeBuoy size={22} className="text-[#EC4899]" />
                                                                    Help & Support
                                                                </Link>
                                                                <Link to="/client-profile?tab=settings" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <Settings2 size={22} className="text-[#64748B]" />
                                                                    Settings
                                                                </Link>
                                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins'] text-left" style={{ lineHeight: '26px' }}>
                                                                    <LogOut size={22} className="text-[#EF4444]" />
                                                                    Logout
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="pt-4 pb-1.5 border-b border-gray-50">
                                                                <Link to="/financial-dashboard" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <BarChart3 size={22} className="text-[#317CD7]" />
                                                                    Financial dashboard
                                                                </Link>
                                                            </div>

                                                            <div className="py-1.5 border-b border-gray-50">
                                                                <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <UserIcon size={22} className="text-[#317CD7]" />
                                                                    My Profile
                                                                </Link>
                                                                <Link to="/analytics" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <Zap size={22} className="text-[#F59E0B]" />
                                                                    Account analytics
                                                                </Link>
                                                            </div>

                                                            <div className="py-1.5 border-b border-gray-50">
                                                                <Link to="/settings" className="flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins']" style={{ lineHeight: '26px' }}>
                                                                    <Settings size={22} className="text-[#64748B]" />
                                                                    Settings
                                                                </Link>
                                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-[17px] text-[rgb(33,33,33)] font-medium transition-all font-['Poppins'] text-left" style={{ lineHeight: '26px' }}>
                                                                    <LogOut size={22} className="text-[#EF4444]" />
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

                        <button
                            className="xl:hidden p-2 text-[#242424] hover:text-[#317CD7] transition-all"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed inset-0 bg-black/50 z-[1009] transition-opacity duration-300 xl:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

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
                                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#317CD7] text-white text-[7px] font-bold rounded-full border border-white flex items-center justify-center">
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
                                <Link to="/signup" className="block w-full text-center py-3.5 bg-[#0F2E4B] text-white rounded-xl font-bold hover:bg-[#1a3a5a] transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                                    REGISTER
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6 mb-8">
                                <div className="p-4 bg-[#f9fafb] rounded-2xl flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[#0F2E4B] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0F2E4B]/20">
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
                            {user && user.userRole === 'CLIENT' && (
                                <button
                                    onClick={() => {
                                        handlePostProject();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-3 bg-[#317CD7] text-white rounded-xl font-bold hover:bg-[#2563b5] transition-all"
                                >
                                    POST A PROJECT
                                </button>
                            )}

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

            {user && location.pathname !== '/messages' && (
                <AnimatePresence>
                    {!isChatOpen && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={() => {
                                setIsChatOpen(true);
                            }}
                            className="fixed bottom-0 right-5 md:right-12 w-[calc(100%-40px)] md:w-auto md:min-w-[360px] bg-[#0F2E4B] border-none rounded-t-lg shadow-[0_-10px_40px_rgba(15,46,75,0.3)] cursor-pointer hover:bg-[#1a3a5a] transition-all z-[2000] flex items-center justify-between px-6 py-4 md:py-5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                                        <MessageSquare size={20} className="text-[#317CD7]" />
                                    </div>
                                    {unreadMessagesCount > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#317CD7] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0F2E4B]">
                                            {unreadMessagesCount}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[17px] font-bold text-white tracking-wide font-['Poppins']">Messages</span>
                            </div>
                            <div className="text-white/60">
                                <ChevronUp size={22} />
                            </div>
                        </motion.div>
                    )}

                    {isChatOpen && (
                        <motion.div
                            initial={{ y: 100, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.95 }}
                            className="fixed bottom-0 right-0 md:right-10 w-full md:w-[760px] h-[100vh] md:h-[620px] bg-white rounded-t-2xl md:rounded-b-none z-[2001] border border-gray-200/50 border-b-0 overflow-hidden flex font-['Poppins']"
                        >
                            <div className={`${(selectedChat || selectedNotification) ? 'hidden md:flex' : 'flex'} w-full md:w-[280px] border-r border-gray-100 flex-col bg-gray-50/50`}>
                                <div className="p-6 pb-2">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-[20px] font-bold text-[#0F2E4B] tracking-tight">Messages</h2>
                                        <button className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#317CD7] hover:bg-gray-50 transition-all border border-gray-100 shadow-sm">
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <div className="flex gap-1 mb-6 bg-gray-200/50 p-1 rounded-xl border border-gray-200/30">
                                        <button
                                            onClick={() => setChatTab('messages')}
                                            className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${chatTab === 'messages' ? 'bg-white text-[#317CD7] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Chats
                                        </button>
                                        <button
                                            onClick={() => setChatTab('notifications')}
                                            className={`flex-1 py-2 text-[12px] font-bold rounded-lg transition-all ${chatTab === 'notifications' ? 'bg-white text-[#317CD7] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            Alerts
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder={`Search ${chatTab}...`}
                                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-[13px] outline-none focus:border-[#317CD7]/50 transition-all shadow-sm placeholder:text-gray-400"
                                        />
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#317CD7] transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-2 py-3 custom-scrollbar space-y-1">
                                    {chatTab === 'messages' ? (
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
                                                {!n.read && <div className="w-1.5 h-1.5 bg-[#317CD7] mt-1 shrink-0"></div>}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className={`${(!selectedChat && !selectedNotification) ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white relative`}>
                                {chatTab === 'messages' && selectedChat ? (
                                    <>
                                        <div className="p-4 md:px-6 flex items-center justify-between border-b border-gray-100 relative z-10 bg-[#0F2E4B]">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-white/70 hover:bg-white/10 rounded-lg transition-all">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <div className="relative">
                                                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/20 shadow-sm flex items-center justify-center bg-[#317CD7]">
                                                        {(selectedChat.img || selectedChat.profilePicture) ? (
                                                            <img src={selectedChat.img || selectedChat.profilePicture} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-white text-[14px] font-bold">
                                                                {(selectedChat.name || selectedChat.fullName || '??').substring(0, 2).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0F2E4B]"></div>
                                                </div>
                                                <div className="leading-tight">
                                                    <h4 className="text-[16px] font-bold text-white tracking-tight">{selectedChat.name || selectedChat.fullName}</h4>
                                                    <p className="text-[11px] text-white/60 font-medium">Online now</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button className="text-white/70 hover:bg-white/10 p-2.5 rounded-full transition-all"><Phone size={18} /></button>
                                                <button className="text-white/70 hover:bg-white/10 p-2.5 rounded-full transition-all"><Video size={18} /></button>
                                                <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                                                <button onClick={() => setIsChatOpen(false)} className="text-white/70 hover:bg-red-500 hover:text-white p-2.5 rounded-full transition-all"><X size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col gap-6 custom-scrollbar">
                                            <div className="flex flex-col items-center my-4">
                                                <div className="bg-gray-200/50 px-4 py-1.5 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-widest border border-gray-200/30">Today, Jun 20</div>
                                            </div>

                                            <div className="flex flex-col gap-5">
                                                {chatMessages.map((msg) => (
                                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                                                        <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0 mt-auto bg-[#317CD7] flex items-center justify-center">
                                                                {msg.sender === 'user' ? (
                                                                    user?.profilePicture ? (
                                                                        <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-white text-[11px] font-bold">{(user?.fullName || 'ME').substring(0, 2).toUpperCase()}</span>
                                                                    )
                                                                ) : (
                                                                    (selectedChat.img || selectedChat.profilePicture) ? (
                                                                        <img src={selectedChat.img || selectedChat.profilePicture} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-white text-[11px] font-bold">{(selectedChat.name || selectedChat.fullName || '??').substring(0, 2).toUpperCase()}</span>
                                                                    )
                                                                )}
                                                            </div>
                                                            <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                                                <div className={`p-3.5 px-5 rounded-2xl text-[14px] leading-[22px] shadow-sm font-medium ${msg.sender === 'user'
                                                                        ? 'bg-[#0F2E4B] text-white rounded-br-none'
                                                                        : 'bg-white text-[#0F2E4B] border border-gray-100 rounded-bl-none'
                                                                    }`}>
                                                                    <p>{msg.text}</p>
                                                                </div>
                                                                <span className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">{msg.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={handleChatFileUpload}
                                                    className="hidden"
                                                />
                                                <button 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isSending}
                                                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[#317CD7] hover:bg-blue-50 transition-all border border-gray-100 shrink-0"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                                <div className="flex-1 relative group">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Type your message..."
                                                        value={messageInput}
                                                        onChange={(e) => setMessageInput(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        className="w-full h-10 md:h-12 pl-4 pr-12 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[#317CD7] focus:bg-white focus:shadow-[0_0_20px_rgba(49,124,215,0.1)] transition-all text-[14px] font-['Poppins'] font-medium"
                                                    />
                                                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#317CD7] transition-all">
                                                        <Smile size={20} />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={handleSendMessage}
                                                    disabled={isSending || !messageInput.trim()}
                                                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#317CD7] text-white flex items-center justify-center hover:bg-[#0F2E4B] transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none shrink-0"
                                                >
                                                    <Send size={18} />
                                                </button>
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
                                            {selectedNotification.message}. This was recorded at <span className="text-[#317CD7] font-bold">{new Date(selectedNotification.createdAt).toLocaleTimeString()}</span>.
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
                                                className="flex-1 py-3.5 bg-[#317CD7] text-white rounded-none font-bold text-[13px] hover:bg-[#2563b5] transition-all"
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
