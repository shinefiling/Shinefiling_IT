import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Facebook, Twitter, Youtube, Instagram, 
    Globe, HelpCircle, Mail, MapPin, Phone,
    ChevronRight, Github, Linkedin
} from 'lucide-react';

const SiteFooter: React.FC = () => {
    const footerColumns = [
        {
            title: "Marketplace",
            links: [
                { name: "Find A Job", path: "/jobs" },
                { name: "Hire Developers", path: "/freelancers" },
                { name: "Find A Project", path: "/projects" },
                { name: "Post A Project", path: "/post-project" },
                { name: "Pricing Plans", path: "/pricing" }
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", path: "/about" },
                { name: "Our Team", path: "/team" },
                { name: "Success Stories", path: "/stories" },
                { name: "News & Press", path: "/news" },
                { name: "Careers", path: "/careers" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Help Center", path: "/help" },
                { name: "Trust & Safety", path: "/trust" },
                { name: "Community", path: "/community" },
                { name: "API Docs", path: "/api" },
                { name: "Sitemap", path: "/sitemap" }
            ]
        },
        {
            title: "Legal",
            links: [
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
                { name: "Code of Conduct", path: "/conduct" },
                { name: "Cookie Policy", path: "/cookies" }
            ]
        }
    ];

    return (
        <footer className="bg-[#0F2E4B] text-white pt-20 pb-10 overflow-hidden relative">
            {/* Background Atmosphere - Subtle Blue Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#317CD7]/10 blur-[150px] -z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#b5242c]/5 blur-[120px] -z-0 pointer-events-none"></div>

            <div className="max-w-[1320px] mx-auto px-6 md:px-10 relative z-10">
                
                {/* Top Section: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
                    <div className="lg:col-span-4 space-y-8">
                        <Link to="/" className="inline-block">
                            <img src="shine-logo.png" alt="Shinefiling" className="h-20 w-auto brightness-0 invert" />
                        </Link>
                        <p 
                            className="text-gray-200 text-[15px] max-w-sm" 
                            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '500', lineHeight: '26px' }}
                        >
                            Shinefiling is the world's leading marketplace for elite IT talent and managed technical teams. We empower businesses to scale globally with pre-vetted specialists.
                        </p>
                        <div className="flex gap-4">
                            {[Linkedin, Twitter, Facebook, Instagram, Github].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#317CD7] hover:text-white transition-all transform hover:-translate-y-1">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {footerColumns.map((col, idx) => (
                            <div key={idx}>
                                <h4 className="text-[16px] font-bold mb-8 uppercase tracking-widest text-[#317CD7]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    {col.title}
                                </h4>
                                <ul className="space-y-4">
                                    {col.links.map(link => (
                                        <li key={link.name}>
                                            <Link 
                                                to={link.path} 
                                                className="text-gray-200 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group text-[14px]"
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                <span className="w-1 h-1 bg-[#317CD7] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Section: Stats & Contact */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-white/10">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-[#317CD7]/10 flex items-center justify-center text-[#317CD7] group-hover:bg-[#317CD7] group-hover:text-white transition-all">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-[12px] text-white uppercase tracking-widest font-bold opacity-60">Email Us</p>
                            <p className="text-[15px] font-medium text-white">support@shinefiling.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-[#b5242c]/10 flex items-center justify-center text-[#b5242c] group-hover:bg-[#b5242c] group-hover:text-white transition-all">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-[12px] text-white uppercase tracking-widest font-bold opacity-60">Call Us</p>
                            <p className="text-[15px] font-medium text-white">+91 (800) 123-4567</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#0F2E4B] transition-all">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-[12px] text-white uppercase tracking-widest font-bold opacity-60">Global HQ</p>
                            <p className="text-[15px] font-medium text-white">Bangalore, India</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 text-white text-[12px] opacity-70">
                        <p>© 2026 Shinefiling. All rights reserved.</p>
                        <div className="hidden md:flex items-center gap-2">
                            <Globe size={14} />
                            <span>English (India)</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-8 text-white text-[12px] uppercase tracking-widest font-bold opacity-70">
                        <a href="#" className="hover:text-[#317CD7] transition-colors">Twitter</a>
                        <a href="#" className="hover:text-[#317CD7] transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-[#317CD7] transition-colors">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
