import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ReadyToScale: React.FC = () => {
    return (
        <section className="bg-white py-24 relative">
            <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
                
                {/* The Section with Deep Concave Cutout */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#0F2E4B] rounded-3xl p-12 lg:p-20 flex flex-col items-center text-center relative mt-48"
                >
                    {/* The Deep White Circular Cutout */}
                    <div className="absolute -top-[160px] md:-top-[240px] left-1/2 -translate-x-1/2 bg-white w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full flex flex-col items-center justify-center z-0">
                        {/* The Large Globe */}
                        <div className="w-[300px] h-[300px] md:w-[460px] md:h-[460px] mt-2 md:mt-4 relative">
                            <div className="absolute inset-0 bg-[#317CD7]/20 rounded-full blur-2xl md:blur-3xl animate-pulse"></div>
                            <img 
                                src="images12.png" 
                                alt="Globe" 
                                className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
                            />
                        </div>
                    </div>

                    <div className="relative z-10 max-w-3xl mt-24 md:mt-44">
                        <h2 className="text-[40px] lg:text-[52px] font-extrabold text-white leading-[1.1] mb-8 uppercase tracking-[-0.04em] font-['Urbanist']">
                            GROW BEYOND <br />
                            BORDERS WITH <span className="text-[#317CD7]">SHINEFILING</span>
                        </h2>
                        
                        <p 
                            className="mb-12 max-w-2xl mx-auto"
                            style={{ fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: '500', lineHeight: '26px', color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                            Hire and pay elite IT talent across 150+ countries. Shinefiling makes global technical recruitment fast, compliant, and cost-effective for enterprises.
                        </p>

                        <button className="bg-[#317CD7] hover:bg-[#2563b5] text-white rounded-full px-12 py-4 text-[12px] font-extrabold uppercase tracking-widest transition-all flex items-center gap-3 mx-auto group shadow-lg shadow-[#317CD7]/20">
                            Explore More <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* "WHO WE SERVE" Text below */}
                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-extrabold text-[#0F2E4B] uppercase tracking-widest">Who We Serve</h3>
                </div>
            </div>
        </section>
    );
};

export default ReadyToScale;
