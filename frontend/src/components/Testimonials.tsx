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
        <section className="bg-white py-20 lg:py-28 relative overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-10 text-center relative z-10">
                <span className="text-[#b5242c] text-sm font-bold mb-4 block uppercase tracking-wider">Our Happy User!</span>
                <h2 className="text-[32px] font-bold text-[#242424] mb-4 font-['Poppins']">Elite IT Freelancer talent at your fingertips</h2>

                {/* Central Featured User */}
                <div className="mt-16 mb-12 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full border-4 border-[#b5242c]/20 p-1 mb-6">
                        <img src="https://i.pravatar.cc/150?u=7" alt="Featured User" className="w-full h-full rounded-full object-cover border-2 border-white" />
                    </div>
                    <p className="max-w-2xl text-[#666] text-sm leading-relaxed mb-6 font-['Poppins'] italic">
                        "Shinefiling connected me with high-end tech projects that matched my exact skill set in React and Node.js. It's the ultimate platform for any senior IT freelancer."
                    </p>
                    <h4 className="text-[#242424] font-bold text-lg font-['Poppins']">Sarah Bennett</h4>
                    <span className="text-[#888] text-sm font-medium">Senior Full Stack Developer</span>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-8">
                    <div className="w-2 h-2 rounded-full bg-[#eee]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#eee]"></div>
                    <div className="w-5 h-2 rounded-full bg-[#b5242c]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#eee]"></div>
                </div>
            </div>

            {/* Floating Users Background */}
            <div className="absolute inset-0 z-0 pointer-events-none hidden lg:block">
                {users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: user.id * 0.2 }}
                        className={`absolute ${user.pos} ${user.size} rounded-full border-2 border-white shadow-lg overflow-hidden grayscale hover:grayscale-0 transition-all`}
                    >
                        <img src={user.img} alt="User" className="w-full h-full object-cover" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
