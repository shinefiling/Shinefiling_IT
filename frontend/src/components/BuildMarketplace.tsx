import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Cog } from 'lucide-react';

const BuildMarketplace: React.FC = () => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    return (
        <section className="bg-[#0F2E4B] py-20 lg:py-32 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="relative order-2 lg:order-1"
                >
                    <div className="relative z-10 mx-auto p-0 overflow-hidden min-h-[300px] flex items-center justify-center">
                        <img 
                            src="communtiy.png" 
                            alt="Marketplace" 
                            className={`w-full h-auto rounded-2xl transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4 }}
                    className="text-center lg:text-left order-1 lg:order-2"
                >
                    <span 
                        className="text-[#317CD7] text-sm font-extrabold tracking-[0.05em] mb-6 block"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                        The Future Of Work
                    </span>
                    <h2 
                        className="text-[32px] sm:text-[38px] lg:text-[52px] leading-[1.05] mb-8 tracking-tight text-white"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '800' }}
                    >
                        Empowering Global Innovation with Vetted IT Expertise.
                    </h2>
                    <p 
                        className="mb-12"
                        style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: '500', lineHeight: '26px', color: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        Shinefiling accelerates digital transformation by unifying elite technical talent across borders. We handle international compliance and global payroll so you can focus on building innovative products.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-10 text-left">
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="bg-[#317CD7] w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#317CD7]/20">
                                <Cog size={28} />
                            </div>
                            <h4 
                                className="text-white text-xl tracking-tight"
                                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '800' }}
                            >
                                DevOps Engineering
                            </h4>
                            <p 
                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '500', lineHeight: '24px', color: 'rgba(255, 255, 255, 0.6)' }}
                            >
                                Automate your infrastructure with our certified specialists.
                            </p>
                        </div>
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-white border border-white/10">
                                <Cloud size={28} className="text-[#317CD7]" />
                            </div>
                            <h4 
                                className="text-white text-xl tracking-tight"
                                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '800' }}
                            >
                                Cloud Infrastructure
                            </h4>
                            <p 
                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: '500', lineHeight: '24px', color: 'rgba(255, 255, 255, 0.6)' }}
                            >
                                Scalable Azure and Google Cloud solutions for enterprise.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BuildMarketplace;
