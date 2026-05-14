import React from 'react';
import { motion } from 'framer-motion';

const Testimonials: React.FC = () => {
    const users = [
        { id: 1, img: "https://i.pravatar.cc/150?u=1", pos: "top-10 left-[15%]", size: "w-12 h-12" },
        { id: 2, img: "https://i.pravatar.cc/150?u=2", pos: "top-40 left-[10%]", size: "w-14 h-14" },
        { id: 3, img: "https://i.pravatar.cc/150?u=3", pos: "bottom-10 left-[20%]", size: "w-16 h-16" },
        { id: 4, img: "https://i.pravatar.cc/150?u=4", pos: "top-20 right-[15%]", size: "w-12 h-12" },
        { id: 5, img: "https://i.pravatar.cc/150?u=5", pos: "top-48 right-[10%]", size: "w-14 h-14" },
        { id: 6, img: "https://i.pravatar.cc/150?u=6", pos: "bottom-12 right-[25%]", size: "w-12 h-12" },
    ];

    return (
        <section className="bg-[#F6F3EE] py-20 lg:py-32 relative overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10 text-center relative z-10">
                <span className="text-[#317CD7] text-sm font-extrabold mb-6 block uppercase tracking-widest">Our Happy Users</span>
                <h2 className="text-[44px] lg:text-[56px] font-extrabold text-[#0F2E4B] leading-[1.05] mb-12 uppercase tracking-tighter">
                    ELITE TALENT <br />
                    <span className="text-[#317CD7]">AT YOUR FINGERTIPS</span>
                </h2>

                {/* Central Featured User */}
                <div className="mt-16 mb-12 flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full border-4 border-[#317CD7]/20 p-1 mb-8">
                        <img src="https://i.pravatar.cc/150?u=7" alt="Featured User" className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl" />
                    </div>
                    <p className="max-w-2xl text-[#0F2E4B]/70 text-lg leading-relaxed mb-8 italic font-medium">
                        "Shinefiling connected me with high-end tech projects that matched my exact skill set in React and Node.js. It's the ultimate platform for any senior IT freelancer."
                    </p>
                    <h4 className="text-[#0F2E4B] font-extrabold text-xl uppercase tracking-tight">Sarah Bennett</h4>
                    <span className="text-[#317CD7] text-sm font-bold uppercase tracking-wider">Senior Full Stack Developer</span>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-12">
                    <div className="w-2 h-2 rounded-full bg-[#0F2E4B]/10"></div>
                    <div className="w-2 h-2 rounded-full bg-[#0F2E4B]/10"></div>
                    <div className="w-8 h-2 rounded-full bg-[#317CD7]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#0F2E4B]/10"></div>
                </div>
            </div>

            {/* Floating Users Background */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
                {users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: user.id * 0.3 }}
                        className={`absolute ${user.pos} ${user.size} rounded-full border-4 border-white shadow-2xl overflow-hidden grayscale hover:grayscale-0 transition-all`}
                    >
                        <img src={user.img} alt="User" className="w-full h-full object-cover" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
