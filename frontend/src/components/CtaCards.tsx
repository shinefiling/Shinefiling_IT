import React from 'react';
import { motion } from 'framer-motion';

const CtaCards: React.FC = () => {
    return (
        <section className="bg-[#fdfaf0] py-20 lg:py-28">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-[#eee] rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group hover:shadow-2xl transition-all"
                    >
                        <div className="w-2/3 sm:w-2/5 group-hover:scale-110 transition-transform duration-500">
                            <img src="3655442-removebg-preview.png" alt="IT Expert" className="w-full h-auto" />
                        </div>
                        <div className="flex-1 text-center sm:text-right">
                            <h3 className="text-[#242424] font-bold text-xl lg:text-2xl mb-2 lg:mb-4 font-['Poppins']">Become an IT Freelancer</h3>
                            <p className="text-[#666] text-xs lg:text-sm mb-4 lg:mb-6 font-['Poppins'] leading-relaxed">Join our global network of elite software engineers and freelance IT professionals.</p>
                            <button className="bg-[#b5242c] text-white px-6 py-2.5 rounded-lg text-xs lg:text-sm font-bold hover:bg-[#a11f27] transition-colors">Apply Now</button>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-[#eee] rounded-xl p-6 lg:p-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 group hover:shadow-2xl transition-all"
                    >
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-[#242424] font-bold text-xl lg:text-2xl mb-2 lg:mb-4 font-['Poppins']">Hire Managed IT Teams</h3>
                            <p className="text-[#666] text-xs lg:text-sm mb-4 lg:mb-6 font-['Poppins'] leading-relaxed">Scale your software development with pre-vetted freelance IT teams and specialists.</p>
                            <button className="bg-[#242424] text-white px-6 py-2.5 rounded-lg text-xs lg:text-sm font-bold hover:bg-black transition-colors">Contact Sales</button>
                        </div>
                        <div className="w-2/3 sm:w-2/5 group-hover:scale-110 transition-transform duration-500">
                            <img src="6203116-removebg-preview.png" alt="Hire Talent" className="w-full h-auto" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CtaCards;
