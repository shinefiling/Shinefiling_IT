import React from 'react';
import { 
    Facebook, Twitter, Youtube, Instagram, 
    Globe, HelpCircle, Accessibility, Apple, PlayCircle
} from 'lucide-react';

const SiteFooter: React.FC = () => {
    const footerColumns = [
        {
            title: "Network",
            links: ["Browse Projects", "Hire Freelancers", "Project Categories", "Contests", "Preferred Program", "Enterprise", "Membership", "API for Developers"]
        },
        {
            title: "About",
            links: ["About us", "Security", "Team", "News", "Success Stories", "Reviews", "Careers", "Awards"]
        },
        {
            title: "Resources",
            links: ["Help & Support", "Trust & Safety", "Community", "Sitemap", "Accessibility", "Legal", "Copyright Policy"]
        },
        {
            title: "Terms",
            links: ["Privacy Policy", "Terms and Conditions", "Code of Conduct", "Fees and Charges", "Investor Relations"]
        }
    ];

    return (
        <footer className="bg-white text-[#242424] pt-16 pb-8 border-t border-gray-100 font-['Poppins']">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10">
                
                {/* Main Content Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-16 border-b border-gray-100">
                    
                    {/* Left Brand Column */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="flex items-center gap-2">
                            <img src={`${import.meta.env.BASE_URL}shine-logo.png`} alt="Shinefiling" className="h-12 w-auto" />
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-[#b5242c] cursor-pointer transition-colors">
                                <Globe size={18} strokeWidth={1.5} />
                                <span>India / English</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-[#b5242c] cursor-pointer transition-colors">
                                <HelpCircle size={18} strokeWidth={1.5} />
                                <span>Help & Support</span>
                            </div>
                            <div className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-[#b5242c] cursor-pointer transition-colors">
                                <Accessibility size={18} strokeWidth={1.5} />
                                <span>Accessibility</span>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Columns */}
                    {footerColumns.map((col, idx) => (
                        <div key={idx} className="lg:col-span-1">
                            <h4 className="text-[15px] font-bold mb-6 text-[#242424]">{col.title}</h4>
                            <ul className="space-y-3 text-[13px] text-[#777777]">
                                {col.links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-[#b5242c] transition-colors">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Right Apps Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <h4 className="text-[15px] font-bold mb-6 text-[#242424]">Apps</h4>
                        <div className="space-y-3">
                            <button className="w-full bg-white border border-gray-200 rounded-md p-2 flex items-center gap-3 hover:border-gray-400 transition-all shadow-sm">
                                <Apple size={24} className="fill-[#242424]" />
                                <div className="text-left">
                                    <p className="text-[9px] uppercase leading-none text-gray-400">Available on the</p>
                                    <p className="text-[14px] font-bold leading-tight text-[#242424]">App Store</p>
                                </div>
                            </button>
                            <button className="w-full bg-white border border-gray-200 rounded-md p-2 flex items-center gap-3 hover:border-gray-400 transition-all shadow-sm">
                                <PlayCircle size={24} className="text-[#242424]" />
                                <div className="text-left">
                                    <p className="text-[9px] uppercase leading-none text-gray-400">GET IT ON</p>
                                    <p className="text-[14px] font-bold leading-tight text-[#242424]">Google Play</p>
                                </div>
                            </button>
                        </div>
                        <div className="flex gap-4 pt-4 text-gray-400">
                            <Facebook size={20} className="hover:text-[#b5242c] cursor-pointer transition-colors" />
                            <Twitter size={20} className="hover:text-[#b5242c] cursor-pointer transition-colors" />
                            <Youtube size={20} className="hover:text-[#b5242c] cursor-pointer transition-colors" />
                            <Instagram size={20} className="hover:text-[#b5242c] cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar Area */}
                <div className="pt-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    <div className="flex gap-12">
                        <div>
                            <p className="text-[18px] font-bold text-[#242424]">87,903,300</p>
                            <p className="text-[12px] text-gray-400">Registered Users</p>
                        </div>
                        <div>
                            <p className="text-[18px] font-bold text-[#242424]">25,583,710</p>
                            <p className="text-[12px] text-gray-400">Total Jobs Posted</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 lg:max-w-[600px] text-[11px] text-gray-400 leading-relaxed lg:text-right">
                        <p className="mb-2">Shinefiling® is a registered Trademark of Shinefiling Technology Pty Limited (ACN 142 189 759) & Shinefiling Online India Private Limited (CIN U93000HR2011FTC043854)</p>
                        <p>Copyright © 2026 Shinefiling Technology Pty Limited (ACN 142 189 759). All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
