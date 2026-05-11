import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, Check, CreditCard, 
    Calendar, Clock, Users, ShieldCheck, 
    MessageSquare, AlertCircle, ArrowLeft,
    ChevronLeft, Info, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const HireMe: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const freelancerId = searchParams.get('id');
    const [freelancer, setFreelancer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    
    // Order Data
    const [orderData, setOrderData] = useState({
        projectTitle: '',
        duration: '1 Month',
        headCount: 1,
        paymentMethod: 'Credit / Debit card',
        cardNumber: '7039 - 2299 - 1231 - 1289',
        expiryDate: '',
        securityCode: '',
        saveCard: true
    });

    useEffect(() => {
        if (freelancerId) {
            fetchFreelancer();
        }
    }, [freelancerId]);

    const fetchFreelancer = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profiles/${freelancerId}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (response.ok) {
                const data = await response.json();
                setFreelancer(data);
            }
        } catch (error) {
            console.error("Error fetching freelancer:", error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, name: '1. CUSTOMIZE PROJECT' },
        { id: 2, name: '2. ADD ONS' },
        { id: 3, name: '3. CONTRACT DETAILS' },
        { id: 4, name: '4. PAYMENT' }
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfaf0]">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fdfaf0] pt-[120px] pb-20 font-['Poppins']">
            <div className="max-w-[1280px] mx-auto px-6">
                
                {/* Header Section */}
                <div className="bg-white border border-[#eee] rounded-none p-8 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-[12px] text-gray-400 font-bold uppercase tracking-widest mb-2">
                                <span className="text-primary">Managed by</span>
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">S</div>
                                <span>Shinefiling Solutions</span>
                                <span className="mx-2">|</span>
                                <span>Chennai, India</span>
                            </div>
                            <h1 className="text-[32px] font-black text-[#111] leading-tight">
                                Hiring {freelancer?.fullName || 'Freelancer'}
                            </h1>
                            <div className="flex items-center gap-6 mt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={16} className="text-primary" />
                                    <span>Start Date: <span className="text-[#111] font-bold">ASAP</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Users size={16} className="text-primary" />
                                    <span>Team Size: <span className="text-[#111] font-bold">1 Specialist</span></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3 overflow-hidden">
                                {[1,2,3,4].map(i => (
                                    <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                                ))}
                                <div className="inline-block h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[12px] font-bold text-gray-500 ring-2 ring-white">5+</div>
                            </div>
                            <button className="bg-white border-2 border-primary text-primary px-6 py-2.5 rounded-none font-bold text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all">
                                <MessageSquare size={18} />
                                Chatroom
                            </button>
                        </div>
                    </div>

                    {/* Step Navigator */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[#eee] py-2">
                        {steps.map((s) => (
                            <button 
                                key={s.id}
                                onClick={() => setStep(s.id)}
                                className={`flex-1 min-w-[150px] py-4 text-[13px] font-black tracking-tight text-center transition-all border-r last:border-r-0 border-[#eee] ${step === s.id ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-primary'}`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8">
                    
                    {/* Main Content */}
                    <div className="space-y-8">
                        {step === 4 ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white border border-[#eee] rounded-none p-8 shadow-sm"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                        <Check size={20} />
                                    </div>
                                    <h2 className="text-[20px] font-black text-[#111]">Payment Details</h2>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-8 border-b border-[#eee] pb-4">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                                            </div>
                                            <span className="text-sm font-bold text-[#111]">Credit / Debit card</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer opacity-40 grayscale pointer-events-none">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-200"></div>
                                            <span className="text-sm font-bold text-gray-500">Paypal / Crypto</span>
                                        </label>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Card number</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    value={orderData.cardNumber}
                                                    readOnly
                                                    className="w-full px-5 py-4 bg-[#f9fafb] border border-[#eee] rounded-none font-bold text-[#111] focus:border-primary outline-none"
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white px-2 border border-[#eee] rounded py-1">
                                                    <span className="text-[10px] font-black text-blue-600 italic">VISA</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Name on card</label>
                                            <input 
                                                type="text" 
                                                placeholder="Enter full name"
                                                className="w-full px-5 py-4 bg-[#f9fafb] border border-[#eee] rounded-none font-bold text-[#111] focus:border-primary outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Expiration Date (MM/YY)</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM / YY"
                                                    className="w-full px-5 py-4 bg-[#f9fafb] border border-[#eee] rounded-none font-bold text-[#111] focus:border-primary outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Security code</label>
                                                <input 
                                                    type="password" 
                                                    placeholder="CVV"
                                                    className="w-full px-5 py-4 bg-[#f9fafb] border border-[#eee] rounded-none font-bold text-[#111] focus:border-primary outline-none"
                                                />
                                            </div>
                                        </div>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="hidden" checked={orderData.saveCard} onChange={() => setOrderData({...orderData, saveCard: !orderData.saveCard})} />
                                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${orderData.saveCard ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                                                {orderData.saveCard && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className="text-[13px] font-bold text-gray-600">Save this card for future payments</span>
                                        </label>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#eee]">
                                        <button className="flex-1 bg-emerald-500 text-white py-4 rounded-none font-black text-[14px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
                                            <ShieldCheck size={18} />
                                            PAY ₹{(freelancer?.hourlyRate * 160 || 5000).toLocaleString()}
                                        </button>
                                        <button className="flex-1 bg-white border border-emerald-500 text-emerald-500 py-4 rounded-none font-black text-[14px] uppercase tracking-wider hover:bg-emerald-50 transition-all">
                                            REQUEST INVOICE
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-[#eee] rounded-none p-8 shadow-sm text-center py-32"
                            >
                                <Info size={48} className="mx-auto text-primary/20 mb-4" />
                                <h3 className="text-2xl font-black text-[#111] mb-2">Step {step} Implementation</h3>
                                <p className="text-gray-500">Configure your project details to proceed to the next step.</p>
                                <button 
                                    onClick={() => setStep(step + 1)}
                                    className="mt-8 bg-primary text-white px-10 py-4 rounded-none font-black text-sm uppercase tracking-widest hover:bg-[#a11f27] transition-all"
                                >
                                    Proceed to Next Step
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white border border-[#eee] rounded-none p-6 shadow-sm">
                            <h3 className="text-[14px] font-black text-[#111] text-center mb-8 uppercase tracking-widest">Order summary - #SH{Math.floor(Math.random()*1000000)}</h3>
                            
                            <div className="space-y-4 border-b border-[#eee] pb-6 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[11px]">Date</span>
                                    <span className="text-[#111] font-bold">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[11px]">Time</span>
                                    <span className="text-[#111] font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[11px]">Specialist Count</span>
                                    <span className="text-[#111] font-bold">1</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-[12px] font-black text-[#111] uppercase mb-4 tracking-widest">Selected Services</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[#555] font-medium">{freelancer?.fullName || 'Senior Engineer'}</span>
                                        <span className="text-[#111] font-bold">₹{freelancer?.hourlyRate?.toLocaleString()}/hr</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[#555] font-medium">Standard Project Support</span>
                                        <span className="text-[#111] font-bold">Included</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-[12px] font-black text-[#111] uppercase mb-4 tracking-widest">Add-ons</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[#555] font-medium">Rush Delivery</span>
                                        <span className="text-[#111] font-bold">₹3,000</span>
                                    </div>
                                    <div className="flex justify-between text-[13px]">
                                        <span className="text-[#555] font-medium">Code Review</span>
                                        <span className="text-[#111] font-bold">₹3,500</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 border border-emerald-100 p-4 mb-8 flex items-center justify-between">
                                <span className="text-[12px] font-black text-emerald-700 tracking-widest uppercase">SHINE50</span>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase">Coupon Applied</span>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-[#eee]">
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#888] font-medium">Total amount</span>
                                    <span className="text-[#111] font-black text-lg">₹{(freelancer?.hourlyRate * 160 + 6500 || 56500).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#888] font-medium">Coupon applied</span>
                                    <span className="text-primary font-bold">-₹2,500</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#242424] p-6 text-white relative overflow-hidden group">
                            <div className="flex items-start gap-4">
                                <Wallet className="text-primary shrink-0" size={32} />
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-widest mb-1">Secure Payment</h4>
                                    <p className="text-[11px] text-gray-400 leading-relaxed">Your funds are protected by our milestone system. Release payments only when satisfied.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HireMe;
