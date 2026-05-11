import React from 'react';
import { motion } from 'framer-motion';

const BuildMarketplace: React.FC = () => {
    return (
        <section className="bg-[#1a2e2a] py-20 lg:py-28 overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="relative z-10 mx-auto max-w-[500px] lg:max-w-none">
                        <img src="communtiy.png" alt="Marketplace" className="w-full h-auto" />
                    </div>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                >
                    <span className="text-[#b5242c] text-[12px] lg:text-sm font-semibold uppercase tracking-widest mb-4 block">A Borderless Technical Ecosystem</span>
                    <h2 className="text-[24px] sm:text-[28px] lg:text-[32px] font-bold text-white leading-[32px] lg:leading-[42px] mb-6 lg:mb-8 font-['Poppins']">
                        Building the world's most trusted global IT Freelancer marketplace.
                    </h2>
                    <p className="text-white/60 text-[14px] lg:text-[15px] leading-[26px] lg:leading-[28px] mb-10 font-['Poppins']">
                        Shinefiling unifies the world's technical expertise. Our platform handles international contracts, global payments, and local tax compliance so you can focus on hiring the best IT freelancers.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-8 text-left">
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="bg-[#b5242c] w-10 lg:w-12 h-10 lg:h-12 rounded-lg flex items-center justify-center text-white text-lg">✎</div>
                            <h4 className="text-white font-bold text-base lg:text-lg">DevOps Engineering</h4>
                            <p className="text-white/50 text-[12px] lg:text-[13px] leading-relaxed">Automate your infrastructure with our certified DevOps specialists.</p>
                        </div>
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <div className="bg-[#b5242c] w-10 lg:w-12 h-10 lg:h-12 rounded-lg flex items-center justify-center text-white text-lg">🏷</div>
                            <h4 className="text-white font-bold text-base lg:text-lg">Cloud Infrastructure</h4>
                            <p className="text-white/50 text-[12px] lg:text-[13px] leading-relaxed">Scalable AWS, Azure, and Google Cloud solutions for your enterprise.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default BuildMarketplace;
