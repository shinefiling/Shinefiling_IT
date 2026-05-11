import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const Pricing: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [activeFaq, setActiveFaq] = useState<number | null>(0);
    const [faqCategory, setFaqCategory] = useState('General');

    const plans = [
        {
            name: "Free",
            price: 0,
            description: "Perfect for exploring the platform",
            buttonText: "Get Started",
            features: ["Full Text log search", "Basic alarms", "Community support"],
            highlight: false
        },
        {
            name: "Starter",
            price: 480,
            description: "Great for small businesses",
            buttonText: "Try Free for 14 days",
            features: ["Unlimited AWS accounts", "Unlimited invocations", "Advanced Alarms", "Email support"],
            highlight: false
        },
        {
            name: "Pro",
            price: 2500,
            description: "Best for growing teams",
            buttonText: "Try Free for 14 days",
            features: ["Smart Insights", "Premium notification channels", "Email & Chat support", "Advanced Analytics"],
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For large scale organizations",
            buttonText: "Contact Sales",
            features: ["Dedicated account manager", "Integration support", "Email & Chat support", "SLA Guarantee"],
            highlight: false
        }
    ];

    const comparisonData = [
        { feature: "Total Limit", free: "Unlimited", starter: "Unlimited", pro: "Unlimited", enterprise: "Unlimited" },
        { feature: "Transaction fee", free: "2.9% + ₹1", starter: "2.7% + ₹0.9", pro: "2.5% + ₹0.5", enterprise: "2.3% + ₹0.3" },
        { feature: "Secure payment", free: true, starter: true, pro: true, enterprise: true },
        { feature: "Apply tax rate", free: false, starter: true, pro: true, enterprise: true },
        { feature: "Multi-currency", free: false, starter: false, pro: true, enterprise: true },
        { feature: "Auto exchange rate", free: false, starter: false, pro: false, enterprise: true },
    ];

    const faqs = [
        {
            category: "General",
            question: "How to create an account?",
            answer: "To create an account, find the 'Sign up' or 'Create account' button, fill out the registration form with your personal information, and click 'Create account' or 'Sign up'. Verify your email address if needed, and then log in to start using the platform."
        },
        {
            category: "General",
            question: "Have any trust issue?",
            answer: "We use bank-level security and escrow systems to ensure all payments are safe. Your data is encrypted and never shared without permission."
        },
        {
            category: "Support",
            question: "How can I reset my password?",
            answer: "Go to the login page, click on 'Forgot Password', enter your email, and follow the instructions sent to your inbox."
        },
        {
            category: "Others",
            question: "What is the payment process?",
            answer: "We support Razorpay, UPI, and all major credit/debit cards. Payments are held in escrow until the project is completed."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fdfaf0] pt-[120px] pb-20 font-['Poppins']">
            {/* Header Section */}
            <div className="max-w-[1320px] mx-auto px-4 text-center mb-20">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[42px] font-bold text-[#242424] mb-4 font-['Poppins']"
                >
                    Simple transparent pricing
                </motion.h1>
                <p className="text-[#666] mb-10 text-lg font-['Poppins']">No contract. No surprise fees.</p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4">
                    <span className="text-xs font-bold text-[#b5242c] bg-[#b5242c]/10 px-4 py-1.5 rounded-full uppercase tracking-wider">20% Discount Per Yearly</span>
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full border border-[#eee] shadow-sm">
                        <button 
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-[#242424] text-white shadow-lg' : 'text-[#888] hover:text-[#242424]'}`}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-[#242424] text-white shadow-lg' : 'text-[#888] hover:text-[#242424]'}`}
                        >
                            Yearly
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-[1320px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                {plans.map((plan, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`rounded-[24px] p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${plan.highlight ? 'bg-[#b5242c] text-white border-[#b5242c] shadow-2xl shadow-[#b5242c]/30' : 'bg-white text-[#242424] border-[#eee]'}`}
                    >
                        <h3 className="text-xl font-bold mb-4 font-['Poppins']">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-bold font-['Poppins']">{typeof plan.price === 'number' ? `₹${billingCycle === 'yearly' ? Math.floor(plan.price * 0.8) : plan.price}` : plan.price}</span>
                            {typeof plan.price === 'number' && <span className={`text-sm font-medium ${plan.highlight ? 'text-white/70' : 'text-[#888]'}`}>/ Month</span>}
                        </div>
                        
                        <button className={`w-full py-4 rounded-xl font-bold text-sm mb-8 transition-all uppercase tracking-wide ${plan.highlight ? 'bg-[#242424] text-white hover:bg-black shadow-lg shadow-black/10' : 'bg-[#b5242c] text-white hover:bg-[#a11f27] shadow-lg shadow-[#b5242c]/10'}`}>
                            {plan.buttonText}
                        </button>

                        <div className="space-y-4">
                            {plan.features.map((feature, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-white/20' : 'bg-[#b5242c]/10'}`}>
                                        <Check size={12} className={plan.highlight ? 'text-white' : 'text-[#b5242c]'} />
                                    </div>
                                    <span className={`text-[13px] font-medium ${plan.highlight ? 'text-white/90' : 'text-[#666]'}`}>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Comparison Table */}
            <div className="max-w-[1320px] mx-auto px-4 mb-32 overflow-x-auto">
                <h2 className="text-[32px] font-bold text-[#242424] text-center mb-16 font-['Poppins']">Compare Plans</h2>
                <div className="bg-white rounded-3xl p-8 border border-[#eee] shadow-xl shadow-[#242424]/5 min-w-[800px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-6 font-bold text-[#242424] text-[16px] uppercase tracking-wider font-['Poppins']">Core features</th>
                                {plans.map(p => <th key={p.name} className="py-6 font-bold text-[#242424] text-center text-[16px] uppercase tracking-wider font-['Poppins']">{p.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-[#f9fafb] transition-colors">
                                    <td className="py-6 text-[14px] font-semibold text-[#242424] font-['Poppins']">{row.feature}</td>
                                    <td className="py-6 text-[14px] text-center font-bold text-[#b5242c]">{typeof row.free === 'boolean' ? (row.free ? <Check size={20} className="mx-auto"/> : '—') : row.free}</td>
                                    <td className="py-6 text-[14px] text-center font-bold text-[#b5242c]">{typeof row.starter === 'boolean' ? (row.starter ? <Check size={20} className="mx-auto"/> : '—') : row.starter}</td>
                                    <td className="py-6 text-[14px] text-center font-bold text-[#b5242c]">{typeof row.pro === 'boolean' ? (row.pro ? <Check size={20} className="mx-auto"/> : '—') : row.pro}</td>
                                    <td className="py-6 text-[14px] text-center font-bold text-[#b5242c]">{typeof row.enterprise === 'boolean' ? (row.enterprise ? <Check size={20} className="mx-auto"/> : '—') : row.enterprise}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-[1320px] mx-auto px-4 flex flex-col lg:flex-row gap-20 items-start">
                <div className="lg:w-1/3">
                    <span className="text-[#b5242c] font-bold text-xs uppercase tracking-widest mb-4 block">How to get started</span>
                    <h2 className="text-[32px] font-bold text-[#242424] mb-10 leading-tight font-['Poppins']">Frequently asked questions</h2>
                    
                    <div className="space-y-4">
                        {['General', 'Support', 'Others'].map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setFaqCategory(cat)}
                                className={`flex items-center gap-4 w-full p-5 rounded-2xl transition-all border ${faqCategory === cat ? 'bg-[#b5242c] text-white border-[#b5242c] shadow-lg shadow-[#b5242c]/20' : 'bg-white text-[#888] border-[#eee] hover:bg-gray-50'}`}
                            >
                                <HelpCircle size={20} />
                                <span className="font-bold text-sm uppercase tracking-wide">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:w-2/3 w-full bg-white rounded-3xl p-8 border border-[#eee] shadow-xl shadow-[#242424]/5">
                    <div className="space-y-4">
                        {faqs.filter(f => f.category === faqCategory).map((faq, idx) => (
                            <div key={idx} className="border-b border-gray-100 last:border-0">
                                <button 
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between py-8 text-left group"
                                >
                                    <span className="font-bold text-[#242424] group-hover:text-[#b5242c] transition-colors text-[16px] font-['Poppins']">{faq.question}</span>
                                    {activeFaq === idx ? <ChevronUp size={20} className="text-[#b5242c]"/> : <ChevronDown size={20} className="text-gray-400 group-hover:text-[#b5242c]"/>}
                                </button>
                                <AnimatePresence>
                                    {activeFaq === idx && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-[#555] text-[14px] leading-relaxed font-['Poppins']">{faq.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
