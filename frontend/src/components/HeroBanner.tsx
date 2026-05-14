import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, ShieldCheck, CreditCard, Users } from 'lucide-react';
const HeroBanner: React.FC = () => {
    const [activeCardIndex, setActiveCardIndex] = React.useState(2);

    const cards = [
        { id: 0, color: '#0F2E4B', type: 'navy' },
        { id: 1, color: '#FFFFFF', type: 'white' },
        { id: 2, color: '#317CD7', type: 'blue' }
    ];

    // Auto-cycle effect
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveCardIndex((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleCardClick = (index: number) => {
        setActiveCardIndex(index);
    };

    return (
        <section
            className="relative min-h-screen flex flex-col items-center pt-24 md:pt-32 overflow-hidden bg-white"
        >
            {/* Blue Tint Layer Overlay */}
            <div className="absolute inset-0 bg-[#317CD7]/25 z-0"></div>
            {/* Cohesive Branded Overlays - Top to Bottom Synergy */}
            <div className="absolute inset-0 bg-[#317CD7]/15 z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#317CD7]/20 via-transparent to-white z-0"></div>

            {/* Ultra-High Atmospheric Blue Fog Layers - Background Immersion */}
            <div className="absolute bottom-0 left-0 w-full h-[75%] bg-gradient-to-t from-white via-white/80 via-[#317CD7]/30 to-transparent pointer-events-none z-[5]"></div>
            <div className="absolute bottom-0 left-0 w-full h-[55%] bg-white/60 pointer-events-none z-[5] blur-[120px]"></div>
            <div className="absolute -bottom-20 left-0 w-full h-[40%] bg-[#317CD7]/35 pointer-events-none z-[5] blur-[180px]"></div>

            {/* Background Large Text */}
            <div className="absolute top-[8%] left-0 w-full flex justify-center pointer-events-none select-none overflow-visible z-0">
                <h1 
                    className="text-[10vw] md:text-[11vw] font-bold text-white leading-none tracking-[0.05em] md:tracking-[0.2em] uppercase select-none font-['Urbanist'] transform scale-y-[1.2] origin-top"
                    style={{ 
                        textShadow: '1px 1px 0px rgba(0,0,0,0.07), 2px 2px 0px rgba(0,0,0,0.07), 0 10px 20px rgba(15, 46, 75, 0.1)',
                        WebkitMaskImage: 'linear-gradient(to bottom, white 25%, rgba(255,255,255,0.4) 70%, transparent 100%)',
                        maskImage: 'linear-gradient(to bottom, white 25%, rgba(255,255,255,0.4) 70%, transparent 100%)',
                        opacity: 0.9
                    }}
                >
                    SHINEFILING
                </h1>
            </div>

            <div className="max-w-[1500px] mx-auto px-6 w-full relative z-10 flex flex-col items-center">

                {/* Hero Visuals - Central Image with Floating Cards */}
                <div className="relative w-full h-[550px] md:h-[650px] lg:h-[900px] mb-0 flex justify-center items-center">

                    {/* Left Floating Card (Coded Design - Scaled Down) */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="absolute left-[-20px] md:left-0 top-[5%] md:top-[18%] z-20 flex scale-[0.45] md:scale-100 origin-left"
                    >
                        <div className="relative w-[240px] bg-white/90 backdrop-blur-2xl p-5 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-[8rem] shadow-[0_30px_80px_rgba(15,46,75,0.08)] border border-white flex flex-col items-center text-center group transition-all duration-700">
                            {/* The Globe */}
                            <div className="relative w-60 h-60 -mt-24 -mb-2 transition-transform duration-1000">
                                <div className="absolute inset-0 bg-[#317CD7]/20 rounded-full blur-2xl animate-pulse"></div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full relative z-10"
                                >
                                    <img
                                        src="images12.png"
                                        alt="Global Globe"
                                        className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(49,124,215,0.3)]"
                                    />
                                </motion.div>
                            </div>

                            {/* Typography */}
                            <h3 className="text-[18px] font-semibold text-[#0F2E4B] leading-[1.2] mb-1 max-w-[180px]">
                                Scale Your Technical Team Globally
                            </h3>
                             <p 
                                className="text-[15px] font-[500] leading-[26px]"
                                style={{ fontFamily: 'Poppins, sans-serif', color: 'rgb(33, 33, 33)' }}
                            >
                                Hire Vetted IT Experts
                            </p>

                        </div>
                    </motion.div>

                    {/* Main Central Image Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-[1250px] h-full flex justify-center mt-[-80px] md:mt-[80px]"
                    >
                        <img
                            src="Herobannercenter.png"
                            alt="Shinefiling Hero Center"
                            className="w-auto object-contain drop-shadow-[0_35px_35px_rgba(15,46,75,0.15)] scale-[1.9] md:scale-125 origin-center"
                        />

                        {/* Floating Social Proof Badge (Extra Added) */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="absolute bottom-[8%] md:bottom-[55%] left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-[25%] bg-white/80 backdrop-blur-xl border border-white p-3 px-5 rounded-full shadow-[0_20px_40px_rgba(15,46,75,0.1)] hidden md:flex items-center gap-4 z-20 group hover:scale-105 transition-transform cursor-default"
                        >
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img src="https://i.pravatar.cc/100?u=1" alt="User" className="w-full h-auto" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm">
                                    <img src="https://i.pravatar.cc/100?u=2" alt="User" className="w-full h-auto" />
                                </div>
                                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm relative">
                                    <img src="https://i.pravatar.cc/100?u=3" alt="User" className="w-full h-auto" />
                                    <div className="absolute inset-0 bg-[#317CD7]/40 backdrop-blur-[2px]"></div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse shadow-[0_0_8px_#10B981]"></div>
                                    <span className="text-[14px] font-semibold text-[#0F2E4B] leading-none tracking-tight">1.2k+</span>
                                </div>
                                <span className="text-[10px] text-[#0F2E4B]/50 font-bold uppercase tracking-widest">Experts Online</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 1 }}
                        className="absolute right-[-30px] md:right-0 top-[35%] md:top-[30%] z-20 flex flex-col items-center gap-12 scale-[0.45] md:scale-100 origin-right"
                    >
                        <div className="relative w-[300px] h-[300px] flex flex-col items-center">
                            {cards.map((card, i) => {
                                // Position logic
                                let position = 0;
                                if (card.id === activeCardIndex) position = 2; // Front
                                else if ((card.id + 1) % 3 === activeCardIndex) position = 1; // Middle
                                else position = 0; // Back

                                const textColor = card.type === 'white' ? '#0F2E4B' : 'white';

                                const content = [
                                    { title: "Tech Services", detail: "World-class talent pool", desc: "End-to-end technical solutions for enterprise scaling.", sub: "ELITE" },
                                    { title: "Expert Team", detail: "Top 1% of engineers", desc: "Access a curated network of senior engineers.", sub: "VETTED" },
                                    { title: "Fast Delivery", detail: "Ship projects 3x faster", desc: "Modern agile workflows for high-speed innovation.", sub: "AGILE" }
                                ][card.id];

                                return (
                                    <motion.div
                                        key={card.id}
                                        onClick={() => handleCardClick(card.id)}
                                        animate={{
                                            y: position * 35,
                                            scale: 0.9 + (position * 0.05),
                                            zIndex: position * 10,
                                            opacity: 1
                                        }}
                                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute w-full h-[190px] p-8 rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col justify-between cursor-pointer"
                                        style={{ backgroundColor: card.color }}
                                    >
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                                                    <Users size={18} style={{ color: textColor }} />
                                                </div>
                                                <span className="text-[9px] font-extrabold tracking-widest opacity-60 uppercase" style={{ color: textColor }}>{content.sub}</span>
                                            </div>
                                            <div className="w-10 h-6 bg-white/10 rounded-md flex items-center justify-center backdrop-blur-sm border border-white/10">
                                                <ShieldCheck size={14} style={{ color: textColor }} className="opacity-60" />
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <div 
                                                className="text-[20px] font-[600] leading-[24px] mb-2 tracking-tight font-['Space+Grotesk']" 
                                                style={{ color: textColor, fontFamily: "'Montserrat', sans-serif" }}
                                            >
                                                {content.title}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="text-[11px] font-bold opacity-70 mb-1" style={{ color: textColor, fontFamily: "'Montserrat', sans-serif" }}>{content.detail}</div>
                                                <div 
                                                    className="text-[15px] font-[500] leading-[26px] max-w-[220px]" 
                                                    style={{ 
                                                        color: card.type === 'white' ? 'rgb(33, 33, 33)' : 'white', 
                                                        opacity: card.type === 'white' ? 1 : 0.8,
                                                        fontFamily: 'Poppins, sans-serif' 
                                                    }}
                                                >
                                                    {content.desc}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Glossy Overlay */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none"></div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex gap-3">
                            {cards.map((card) => (
                                <button
                                    key={card.id}
                                    onClick={() => handleCardClick(card.id)}
                                    className={`h-2 rounded-full transition-all duration-500 ${activeCardIndex === card.id
                                        ? 'w-8 bg-[#317CD7]'
                                        : 'w-2 bg-[#0F2E4B]/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section - Precision Design */}
                <div className="w-full flex flex-col xl:flex-row items-center xl:items-end justify-center xl:justify-between mt-0 md:mt-0 xl:-mt-24 relative z-40 pb-0 gap-8 xl:gap-0">

                    {/* Description (Left) with Payrot Shape - Flush to Edge */}
                    <div className="relative mb-0 xl:ml-[-24px] w-full lg:max-w-[48%] xl:flex-1 xl:max-w-[42%] flex justify-center xl:justify-start">
                        <div
                            className="bg-white py-6 md:py-12 px-6 md:px-16 lg:px-20 shadow-[0_30px_60px_rgba(15,46,75,0.06)] border-t border-r border-white w-full"
                            style={{
                                /* This creates the slanted cut on the top-right corner to match reference */
                                clipPath: typeof window !== 'undefined' && window.innerWidth > 1024 ? 'polygon(0 0, 71.2% 0, 72.3% 0.8%, 100% 100%, 0 100%)' : 'none',
                                borderRadius: typeof window !== 'undefined' && window.innerWidth > 1024 ? '2.5rem 0.75rem 0 0' : '2rem 2rem 0 2rem'
                            }}
                        >
                            <div className="flex gap-4 mb-10 mt-4">
                                <div className="w-12 h-12 bg-[#0F2E4B] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <Globe size={22} strokeWidth={2.5} />
                                </div>
                                <div className="w-12 h-12 bg-[#317CD7] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <ShieldCheck size={22} strokeWidth={2.5} />
                                </div>
                            </div>

                            <h2 className="text-[#0F2E4B] text-[16px] md:text-[18px] font-bold leading-[1.4] mb-8 font-['Urbanist']">
                                Access the Top 3% of Global IT <br />
                                Talent and Scale Your Engineering <br />
                            </h2>

                            <Link to="/services" className="inline-block text-[12px] font-extrabold text-[#0F2E4B] uppercase tracking-[0.2em] border-b-2 border-[#0F2E4B] pb-1 hover:text-[#317CD7] hover:border-[#317CD7] transition-all">
                                BROWSE SERVICES <ArrowRight size={14} className="inline ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Center Action (The Bridge Shape) */}
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="relative flex flex-col items-center mb-0 px-4 flex-1 w-full xl:w-auto"
                    >
                        {/* The Bridge Background */}
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] xl:w-[100%] h-[280px] md:h-[320px] to-transparent z-0 hidden md:block"
                            style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
                        ></div>

                        <div className="relative z-10 flex flex-col items-center pb-8 md:pb-16">
                            <button className="bg-white border border-[#0F2E4B]/10 rounded-full px-6 py-2.5 md:px-8 md:py-3 text-[10px] md:text-[11px] font-extrabold text-[#0F2E4B] uppercase mb-8 md:mb-10 flex items-center gap-3 hover:bg-gray-50 transition-all shadow-md">
                                Open Account <ArrowRight size={16} />
                            </button>
                             <h2 
                                className="text-[24px] sm:text-[44px] xl:text-[56px] font-extrabold leading-[1.1] md:leading-[0.85] uppercase tracking-[-0.02em] md:tracking-[-0.05em] text-center font-['Urbanist'] text-white px-4"
                                style={{ 
                                    textShadow: '2px 2px 0px rgba(15, 46, 75, 0.3), 4px 4px 10px rgba(15, 46, 75, 0.2), 0px 10px 30px rgba(15, 46, 75, 0.15)' 
                                }}
                            >
                                GLOBAL TALENT <br />
                                <span className="opacity-80">ACCELERATED GROWTH</span>
                            </h2>
                        </div>
                    </motion.div>

                    {/* Stats (Right) */}
                    <div className="relative mb-12 md:mb-0 lg:mr-[-24px] w-full xl:flex-1 xl:max-w-[42%] flex justify-center lg:justify-end">
                        <div
                            className="bg-white py-6 md:py-12 px-6 md:px-16 lg:px-20 shadow-[0_30px_60px_rgba(15,46,75,0.06)] border-t border-l border-white w-full"
                            style={{
                                /* Mirrored slanted cut for the right side to match symmetry */
                                clipPath: typeof window !== 'undefined' && window.innerWidth > 1024 ? 'polygon(27.7% 0.8%, 28.8% 0, 100% 0, 100% 100%, 0 100%)' : 'none',
                                borderRadius: typeof window !== 'undefined' && window.innerWidth > 1024 ? '0.75rem 2.5rem 0 0' : '2rem 2rem 2rem 0'
                            }}
                        >
                            <div className="flex justify-end gap-4 mb-10 mt-4">
                                <div className="w-12 h-12 bg-[#317CD7] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <Users size={22} strokeWidth={2.5} />
                                </div>
                                <div className="w-12 h-12 bg-[#0F2E4B] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                                    <CreditCard size={22} strokeWidth={2.5} />
                                </div>
                            </div>
                             <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
                                <span className="text-[48px] md:text-[72px] font-extrabold text-[#317CD7] leading-none tracking-[-0.05em] font-['Urbanist']">25k+</span>
                                <div className="text-left border-l border-gray-100 pl-6">
                                    <p 
                                        className="font-bold leading-[25.2px]"
                                        style={{ fontFamily: "'Urbanist', sans-serif", fontSize: '18px', fontWeight: '800', color: 'rgb(15, 46, 75)' }}
                                    >
                                        Successful <br /> Engineering <br /> Deployments
                                    </p>
                                </div>
                            </div>
                            <button className="text-[12px] font-extrabold text-[#0F2E4B] uppercase tracking-[0.2em] flex items-center gap-2 group border-b-2 border-[#0F2E4B] pb-1">
                                VIEW PLATFORM STATS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroBanner;
