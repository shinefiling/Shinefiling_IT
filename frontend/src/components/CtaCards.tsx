import React from 'react';
import { motion } from 'framer-motion';

const CtaCards: React.FC = () => {
    return (
        <section className="bg-white py-20 lg:py-28">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white border border-[#eee] rounded-xl p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all"
                    >
                        <div className="w-2/3 sm:w-2/5 group-hover:scale-110 transition-transform duration-500">
                            <img src="3655442-removebg-preview.png" alt="IT Expert" className="w-full h-auto" />
                        </div>
                        <div className="flex-1 text-center sm:text-right">
                            <h3 
                                className="mb-2 lg:mb-4 tracking-tight"
                                style={{ 
                                    fontFamily: "'Montserrat', sans-serif", 
                                    fontSize: '20px', 
                                    fontWeight: '800', 
                                    lineHeight: '24px', 
                                    color: 'rgb(15, 46, 75)' 
                                }}
                            >
                                Become an IT Freelancer
                            </h3>
                            <p 
                                className="mb-4 lg:mb-6"
                                style={{ 
                                    fontFamily: 'Poppins, sans-serif', 
                                    fontSize: '15px', 
                                    fontWeight: '500', 
                                    lineHeight: '26px', 
                                    color: 'rgb(33, 33, 33)' 
                                }}
                            >
                                Join our elite network of senior software engineers, cloud architects, and freelance IT specialists.
                            </p>
                            <button 
                                className="bg-[#0F2E4B] text-white px-8 py-3 rounded-[4px] text-[13px] font-bold hover:bg-[#1a3a5a] transition-all uppercase tracking-wider shadow-md"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                Apply Now
                            </button>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-[#eee] rounded-xl p-6 lg:p-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 group shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-2xl transition-all"
                    >
                        <div className="flex-1 text-center sm:text-left">
                            <h3 
                                className="mb-2 lg:mb-4 tracking-tight"
                                style={{ 
                                    fontFamily: "'Montserrat', sans-serif", 
                                    fontSize: '20px', 
                                    fontWeight: '800', 
                                    lineHeight: '24px', 
                                    color: 'rgb(15, 46, 75)' 
                                }}
                            >
                                Hire Managed IT Teams
                            </h3>
                            <p 
                                className="mb-4 lg:mb-6"
                                style={{ 
                                    fontFamily: 'Poppins, sans-serif', 
                                    fontSize: '15px', 
                                    fontWeight: '500', 
                                    lineHeight: '26px', 
                                    color: 'rgb(33, 33, 33)' 
                                }}
                            >
                                Scale your software development with pre-vetted freelance IT teams and technical specialists.
                            </p>
                            <button 
                                className="bg-[#317CD7] text-white px-8 py-3 rounded-[4px] text-[13px] font-bold hover:bg-[#2563b5] transition-all uppercase tracking-wider shadow-md"
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                                Contact Sales
                            </button>
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
