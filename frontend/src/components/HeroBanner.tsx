import React from 'react';
import { motion } from 'framer-motion';

const HeroBanner: React.FC = () => {
    return (
        <section className="relative min-h-[90vh] lg:min-h-screen flex items-center pt-[140px] lg:pt-32 pb-20 lg:pb-28 bg-[#fdfaf0] overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center relative z-10">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-20 text-center lg:text-left"
                >
                    <h1 className="text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#242424] leading-[32px] sm:leading-[34px] lg:leading-[42px] mb-8 font-['Poppins'] lg:max-w-[800px]">
                        Hire Elite <span className="text-[#b5242c]">IT Freelancers</span> & <br />
                        Software Engineers via Shinefiling
                    </h1>

                    <p className="text-[14px] lg:text-[16px] font-normal text-[#555555] leading-[26px] lg:leading-[32px] max-w-xl mx-auto lg:mx-0 mb-10 lg:mb-14 font-['Poppins']">
                        Shinefiling is your premier destination for borderless IT talent. Access a global network of elite software engineers and DevOps experts to scale your technical team instantly.
                    </p>

                    <button className="bg-[#242424] hover:bg-black text-white rounded-[4px] px-8 lg:px-10 py-3 lg:py-3.5 text-[14px] lg:text-[15px] font-bold transition-all shadow-lg shadow-black/5 font-['Poppins'] uppercase tracking-wide">
                        Find Talent Now
                    </button>
                </motion.div>

                {/* Right Visuals - Single Image Only */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="relative flex justify-center lg:justify-start lg:-translate-x-10 z-10 mt-8 lg:mt-20"
                >
                    <div className="relative w-full max-w-[450px] sm:max-w-[550px] lg:max-w-[750px]">
                        <img
                            src="Herobanner1.png"
                            alt="Freelance Platform"
                            className="w-full h-auto object-contain scale-110 lg:scale-125 origin-bottom"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroBanner;
