import React from 'react';
import { motion } from 'framer-motion';

const GlobalFreelancers: React.FC = () => {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                >
                    <span 
                        className="text-[12px] lg:text-[13px] font-bold tracking-[0.05em] mb-4 block"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: '#317CD7' }}
                    >
                        World-Wide Technical Excellence
                    </span>
                    <h2 
                        className="text-[32px] sm:text-[38px] lg:text-[44px] leading-[1.1] mb-6 lg:mb-8 tracking-tight"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: '800', color: 'rgb(15, 46, 75)' }}
                    >
                        Connect With Elite IT Freelancers Across 190+ Countries For Technical Innovation.
                    </h2>
                    <p 
                        className="mb-6"
                        style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: '500', lineHeight: '26px', color: 'rgb(33, 33, 33)' }}
                    >
                        Our platform removes geographical barriers, allowing you to hire the world's best developers regardless of their location. We manage the global compliance and local logistics for you.
                    </p>
                    <p 
                        className="mb-8 lg:mb-10"
                        style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: '500', lineHeight: '26px', color: 'rgb(33, 33, 33)' }}
                    >
                        With our world-wide network, you gain 24/7 technical coverage and the ability to scale your IT infrastructure with experts from every corner of the globe.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <button 
                            className="bg-[#317CD7] text-white px-10 py-3.5 rounded-[4px] text-[14px] font-bold uppercase tracking-wider hover:bg-[#2563b5] transition-all shadow-md"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Explore Talent
                        </button>
                        <button 
                            className="bg-transparent border border-[#0F2E4B] text-[#0F2E4B] px-10 py-3.5 rounded-[4px] text-[14px] font-bold uppercase tracking-wider hover:bg-[#0F2E4B] hover:text-white transition-all"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                            Request a Quote
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative mt-12 lg:mt-0"
                >
                    <div className="relative z-10 rounded-2xl overflow-hidden mx-auto max-w-[500px] lg:max-w-none">
                        <img src="connection.png" alt="Service" className="w-full h-auto" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GlobalFreelancers;
