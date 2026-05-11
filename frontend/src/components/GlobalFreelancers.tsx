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
                    <span className="text-[#888] text-[12px] lg:text-[13px] font-bold uppercase tracking-[0.2em] mb-4 block">World-Wide Technical Excellence</span>
                    <h2 className="text-[32px] sm:text-[38px] lg:text-[44px] font-extrabold text-[#242424] leading-[1.1] mb-6 lg:mb-8 tracking-tight">
                        Connect with elite IT Freelancers across 190+ countries for technical innovation.
                    </h2>
                    <p className="text-[#666] text-[16px] lg:text-[17px] leading-[1.6] mb-6">
                        Our platform removes geographical barriers, allowing you to hire the world's best developers regardless of their location. We manage the global compliance and local logistics for you.
                    </p>
                    <p className="text-[#666] text-[16px] lg:text-[17px] leading-[1.6] mb-8 lg:mb-10">
                        With our world-wide network, you gain 24/7 technical coverage and the ability to scale your IT infrastructure with experts from every corner of the globe.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <button className="bg-[#b5242c] text-white px-10 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#a11f27] transition-all hover:scale-105 shadow-lg shadow-[#b5242c]/20">Explore Talent</button>
                        <button className="bg-[#242424] text-white px-10 py-3.5 rounded-full font-bold text-[14px] hover:bg-black transition-all hover:scale-105 shadow-lg shadow-black/20">Request a Quote</button>
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
