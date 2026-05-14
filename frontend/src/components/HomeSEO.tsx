import React from 'react';
import { motion } from 'framer-motion';

const HomeSEO: React.FC = () => {
    const seoSections = [
        {
            title: "Premium Global IT Freelancing Platform",
            content: "Shinefiling is the world's leading IT freelancer platform connecting enterprises with the top 3% of global technical talent. Our platform specializes in providing vetted software developers, cloud architects, and cybersecurity experts for mission-critical projects. Whether you are looking to hire a dedicated development team or find niche technical specialists, Shinefiling ensures a seamless recruitment process with guaranteed quality and performance."
        },
        {
            title: "End-to-End Business Compliance & Payroll",
            content: "Beyond talent acquisition, Shinefiling offers comprehensive Employer of Record (EOR) services and global payroll solutions. We handle the complexities of international labor laws, tax compliance, and multi-currency payments, allowing you to scale your technical team globally without the administrative burden. Our secure financial dashboard provides real-time tracking of project budgets, milestones, and contractor payments."
        },
        {
            title: "Vetted Technical Experts for Every Industry",
            content: "From Fintech and Healthcare to AI and E-commerce, our freelancers bring deep industry expertise to every engagement. Every expert on our platform undergoes a rigorous multi-stage vetting process including technical assessments, soft skills evaluation, and portfolio verification. This commitment to excellence makes Shinefiling the trusted partner for startups and Fortune 500 companies alike."
        },
        {
            title: "Build Your Digital Future with Shinefiling",
            content: "Leverage our AI-driven marketplace to find the perfect match for your technology stack. Whether it's React, Python, AWS, or Blockchain, our global network of IT professionals is ready to accelerate your digital transformation. Explore our browse-jobs and freelance-search features to discover how Shinefiling is redefining the future of work in the IT industry."
        }
    ];

    const keywords = [
        "Hire IT Freelancers", "Global Software Developers", "Technical Talent Marketplace", 
        "Vetted Developers", "Remote IT Teams", "Blockchain Experts", "Cloud Architects", 
        "Cybersecurity Consultants", "Freelance React Developers", "Node.js Specialists",
        "Python Developers", "AI Engineers", "Fintech Solutions", "EOR Services", 
        "Global Payroll for Freelancers", "Shinefiling Recruitment", "IT Staff Augmentation"
    ];

    return (
        <section className="sr-only" aria-hidden="false">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
                {/* Header */}
                <div className="mb-16">
                    <h2>
                        Information Architecture
                    </h2>
                    <h3>
                        Empowering the Global Tech Ecosystem
                    </h3>
                </div>

                {/* Content Grid */}
                <div className="grid">
                    {seoSections.map((section, index) => (
                        <div key={index}>
                            <h4>
                                {section.title}
                            </h4>
                            <p>
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tag Cloud */}
                <div>
                    <h4>
                        Related Search Keywords
                    </h4>
                    <div>
                        {keywords.map((tag, idx) => (
                            <span key={idx}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeSEO;
