import React, { useState, useEffect } from 'react';
import { 
    Newspaper, Calendar, Tag, ChevronRight, 
    Share2, Bookmark, MessageSquare, TrendingUp,
    Search, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const DailyUpdates: React.FC = () => {
    const [newsList, setNewsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/news/all');
                if (response.ok) {
                    const data = await response.json();
                    setNewsList(data);
                } else {
                    // Fallback mock data if API fails or is empty
                    setNewsList([
                        { 
                            id: 1, 
                            title: "AI Revolutionizing IT Infrastructure in 2024", 
                            content: "Artificial Intelligence is no longer just a buzzword. It is actively reshaping how companies manage their data centers and cloud resources. Experts predict a 40% increase in AI-driven automation by the end of the year.",
                            category: "Artificial Intelligence",
                            date: "May 11, 2026",
                            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"
                        },
                        { 
                            id: 2, 
                            title: "Cybersecurity Threats: What Freelancers Need to Know", 
                            content: "With the rise of remote work, freelancers are becoming primary targets for phishing and ransomware. Secure your workspace with multi-factor authentication and updated VPN protocols.",
                            category: "Security",
                            date: "May 10, 2026",
                            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                        },
                        { 
                            id: 3, 
                            title: "React 19 Features You Should Start Using Today", 
                            content: "The latest React version introduces compiler-driven optimizations and better server component support. Learn how these changes will simplify your frontend architecture.",
                            category: "Web Development",
                            date: "May 09, 2026",
                            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800"
                        }
                    ]);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    return (
        <div className="min-h-screen bg-[#fffcf9] pt-[140px] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest rounded-full">
                            Tech Pulse
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                            Daily IT Updates
                        </span>
                    </div>
                    <h1 className="text-[42px] font-bold text-[#111] leading-tight mb-4">
                        Stay ahead of the <span className="text-primary">IT curve.</span>
                    </h1>
                    <p className="text-[16px] text-gray-500 max-w-2xl leading-relaxed">
                        Your daily source for curated technology news, industry shifts, and professional insights directly impacting the global freelancer ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-10">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            newsList.map((news, i) => (
                                <motion.article 
                                    key={news.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                                            <img 
                                                src={news.image || `https://source.unsplash.com/featured/?technology,${news.category}`} 
                                                alt={news.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[#111] text-[10px] font-bold uppercase rounded-lg shadow-sm">
                                                    {news.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="md:w-3/5 p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-4 text-gray-400 text-[11px] font-bold uppercase mb-4">
                                                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {news.date}</span>
                                                    <span>•</span>
                                                    <span>5 min read</span>
                                                </div>
                                                <h2 className="text-[22px] font-bold text-[#111] mb-4 group-hover:text-primary transition-colors leading-snug">
                                                    {news.title}
                                                </h2>
                                                <p className="text-[14px] text-gray-500 leading-relaxed line-clamp-3 mb-6">
                                                    {news.content}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                                <button className="flex items-center gap-2 text-[12px] font-bold text-primary group-hover:gap-3 transition-all">
                                                    Read Full Story <ChevronRight size={16} />
                                                </button>
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <button className="hover:text-primary transition-colors"><Bookmark size={16} /></button>
                                                    <button className="hover:text-primary transition-colors"><Share2 size={16} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Search */}
                        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search news..." 
                                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 text-[13px] focus:ring-2 focus:ring-primary/20"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Trending */}
                        <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm">
                            <h3 className="text-[16px] font-bold text-[#111] mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-primary" /> Trending Now
                            </h3>
                            <div className="space-y-6">
                                {[
                                    "Remote Work Trends 2026",
                                    "Quantum Computing Breakthroughs",
                                    "Node.js vs Go in High-Scale Apps",
                                    "The Rise of Solopreneurs"
                                ].map((tag, i) => (
                                    <div key={i} className="group cursor-pointer">
                                        <p className="text-[13px] font-bold text-[#333] mb-1 group-hover:text-primary transition-colors line-clamp-1">{tag}</p>
                                        <p className="text-[11px] text-gray-400">2.4k readers • 1h ago</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subscribe */}
                        <div className="bg-[#111] p-8 rounded-[24px] text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <Bell size={24} className="text-primary mb-6" />
                                <h3 className="text-[18px] font-bold mb-3">Newsletter</h3>
                                <p className="text-[12px] text-gray-400 leading-relaxed mb-6">
                                    Get the most important tech updates delivered straight to your inbox every morning.
                                </p>
                                <div className="space-y-3">
                                    <input 
                                        type="email" 
                                        placeholder="your@email.com" 
                                        className="w-full bg-white/10 border-none rounded-xl py-3 px-4 text-[13px] focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-[12px] hover:opacity-90 transition-all">
                                        Subscribe Now
                                    </button>
                                </div>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-10">
                                <Newspaper size={120} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyUpdates;
