import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Wallet, CreditCard, 
    ShieldCheck, Zap, Info,
    ArrowRight, CheckCircle2
} from 'lucide-react';

interface AddFundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: number) => void;
    currentBalance: number;
}

const AddFundsModal: React.FC<AddFundsModalProps> = ({ isOpen, onClose, onConfirm, currentBalance }) => {
    const [amount, setAmount] = useState<string>('');
    const presets = [500, 1000, 2500, 5000, 10000];

    if (!isOpen) return null;

    const handleConfirm = () => {
        const numAmount = Number(amount);
        if (numAmount > 0) {
            onConfirm(numAmount);
            onClose();
            setAmount('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2500] overflow-y-auto bg-[#0F2E4B]/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-white/20 my-auto"
                    >
                        {/* Modal Header */}
                        <div className="bg-[#0F2E4B] p-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#317CD7] rounded-lg flex items-center justify-center shadow-lg shadow-[#317CD7]/20">
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold tracking-tight">Top Up Wallet</h3>
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Secure Escrow Deposits</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Balance Overview */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-8 flex justify-between items-center border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Balance Reserves</p>
                                    <p className="text-[18px] font-bold text-[#0F2E4B]">₹{currentBalance.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Wallet Status</p>
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-600">
                                        <CheckCircle2 size={12} /> Active
                                    </span>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="mb-8">
                                <label className="text-[11px] font-bold text-[#0F2E4B] uppercase tracking-[0.1em] mb-3 block">Specify Amount (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[20px] font-bold text-gray-400">₹</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white border-2 border-gray-100 rounded-xl py-4 pl-10 pr-4 text-[24px] font-bold text-[#0F2E4B] focus:border-[#317CD7] outline-none transition-all placeholder:text-gray-200"
                                    />
                                </div>
                            </div>

                            {/* Presets */}
                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Select</p>
                                <div className="flex flex-wrap gap-2">
                                    {presets.map(p => (
                                        <button 
                                            key={p}
                                            onClick={() => setAmount(p.toString())}
                                            className={`px-4 py-2 rounded-lg font-bold text-[12px] transition-all border ${amount === p.toString() ? 'bg-[#0F2E4B] border-[#0F2E4B] text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-[#317CD7] hover:text-[#317CD7]'}`}
                                        >
                                            +₹{p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Security Info */}
                            <div className="bg-blue-50/50 rounded-xl p-4 mb-8 border border-blue-100 flex gap-3">
                                <ShieldCheck size={20} className="text-[#317CD7] shrink-0" />
                                <div>
                                    <p className="text-[12px] font-bold text-[#0F2E4B]">Secured by Razorpay</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Your funds are protected via end-to-end encryption and 256-bit SSL security.</p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={handleConfirm}
                                disabled={!amount || Number(amount) <= 0}
                                className={`w-full py-4 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${!amount || Number(amount) <= 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#0F2E4B] text-white hover:bg-black shadow-xl shadow-[#0F2E4B]/20 active:scale-[0.98]'}`}
                            >
                                <Zap size={18} /> Proceed to Secure Payment <ArrowRight size={18} />
                            </button>

                            <p className="text-[10px] text-center text-gray-400 font-medium mt-6">
                                By proceeding, you agree to the <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Escrow Policy</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddFundsModal;
