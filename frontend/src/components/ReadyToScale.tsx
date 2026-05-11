import React from 'react';
import { motion } from 'framer-motion';

const ReadyToScale: React.FC = () => {
    return (
        <section className="bg-[#fdfaf0] py-20">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white border border-[#eee] rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
                >
                    <div className="max-w-2xl">
                        <h3 className="text-2xl lg:text-3xl font-bold text-[#242424] mb-4 font-['Poppins']">Ready To Scale With an IT Freelancer?</h3>
                        <p className="text-[#666] text-[15px] leading-relaxed font-['Poppins']">
                            Shinefiling is the leading hub for technical talent. Whether you need a single DevOps engineer or a full-stack team, we provide the IT freelancer expertise to drive your digital transformation.
                        </p>
                    </div>
                    <button className="bg-[#b5242c] text-white px-10 py-4 rounded-lg font-bold text-sm whitespace-nowrap hover:bg-[#a11f27] transition-all shadow-lg shadow-[#b5242c]/10">
                        Start Hiring
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default ReadyToScale;
