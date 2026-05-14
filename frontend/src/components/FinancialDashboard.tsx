import React, { useState, useEffect } from 'react';
import { 
    Wallet, ArrowUpRight, ArrowDownRight, 
    TrendingUp, CreditCard, History, 
    Plus, Download, IndianRupee, AlertCircle,
    CheckCircle2, Clock, Smartphone, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const FinancialDashboard: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            fetchTransactions(parsed.email);
        }
    }, []);

    const fetchTransactions = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard/transactions/${email}`);
            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (err) {
            console.error("Fetch transactions error:", err);
        }
    };

    const handleAction = async (type: 'ADD' | 'WITHDRAW') => {
        if (!amount || isNaN(Number(amount))) return;
        setLoading(true);
        
        try {
            const currentBalance = user.walletBalance || 0;
            const txAmount = Number(amount);
            
            if (type === 'WITHDRAW' && currentBalance < txAmount) {
                alert("Insufficient funds");
                return;
            }

            // 1. Create Transaction Record
            const txData = {
                userEmail: user.email,
                title: type === 'ADD' ? 'Funds Added via UPI' : 'Withdrawal to Bank Account',
                amount: txAmount,
                type: type === 'ADD' ? 'IN' : 'OUT',
                status: 'COMPLETED'
            };

            const response = await fetch(`${API_BASE_URL}/api/dashboard/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(txData)
            });

            if (response.ok) {
                const profileResponse = await fetch(`${API_BASE_URL}/api/profiles/${user.email}`);
                if (profileResponse.ok) {
                    const updatedUser = await profileResponse.json();
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    window.dispatchEvent(new Event('user-updated'));
                    fetchTransactions(user.email);
                }
                setIsAddFundsOpen(false);
                setIsWithdrawOpen(false);
                setAmount('');
            }
        } catch (err) {
            console.error("Financial action error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const stats = [
        { 
            label: "Total Earnings", 
            value: `₹${(user.walletBalance * 1.2).toLocaleString()}`, 
            sub: "+12% from last month",
            icon: CheckCircle2, 
            color: "text-green-600", 
            bg: "bg-green-50" 
        },
        { 
            label: "Pending Clearance", 
            value: "₹3,120.50", 
            sub: "Clearing in 4-6 days",
            icon: Clock, 
            color: "text-teal-600", 
            bg: "bg-teal-50" 
        },
        { 
            label: "Available Balance", 
            value: `₹${user.walletBalance?.toLocaleString() || '0'}`, 
            sub: "View breakdown",
            icon: Wallet, 
            color: "text-primary", 
            bg: "bg-red-50" 
        },
        { 
            label: "Last Withdrawal", 
            value: "₹1,200.00", 
            sub: "Oct 24, 2023 to HDFC",
            icon: CreditCard, 
            color: "text-gray-600", 
            bg: "bg-gray-50" 
        }
    ];

    return (
        <div className="min-h-screen bg-[#fffcf9] pt-[140px] pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-[28px] font-bold text-[#333] mb-1">Financial Overview</h1>
                        <p className="text-[14px] text-gray-500">Manage your earnings and linked accounts across projects.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsWithdrawOpen(true)}
                            className="px-6 py-2.5 rounded-lg border border-primary text-primary font-bold text-[13px] hover:bg-primary/5 transition-all"
                        >
                            Withdraw
                        </button>
                        <button 
                            onClick={() => setIsAddFundsOpen(true)}
                            className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-[13px] shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                        >
                            Add Funds
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">{stat.label}</p>
                                <div className={`w-8 h-8 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={16} />
                                </div>
                            </div>
                            <p className="text-[28px] font-bold text-[#111] mb-1">{stat.value}</p>
                            <p className={`text-[11px] font-medium ${stat.color.includes('primary') ? 'underline cursor-pointer' : 'text-gray-400'}`}>
                                {stat.color.includes('green') && <TrendingUp size={12} className="inline mr-1" />}
                                {stat.sub}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transaction History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_15px_rgb(0,0,0,0.02)] overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                                <h2 className="text-[17px] font-bold text-[#333]">Recent Transactions</h2>
                                <button className="text-[12px] font-bold text-primary hover:underline">View All</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {transactions.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400 italic text-[14px]">No transactions found.</div>
                                ) : (
                                    transactions.map((tx, i) => (
                                        <div key={i} className="p-6 hover:bg-gray-50/50 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    tx.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                                }`}>
                                                    {tx.type === 'IN' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-bold text-[#333] mb-0.5">{tx.title}</p>
                                                    <p className="text-[12px] text-gray-400">
                                                        {tx.type === 'IN' ? `Payment from ${tx.userEmail.split('@')[0]}` : `Reference: #TRX${tx.id || '9023456'}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-[15px] font-bold ${tx.type === 'IN' ? 'text-green-600' : 'text-[#333]'}`}>
                                                    {tx.type === 'IN' ? '+' : '-'}₹{tx.amount?.toLocaleString()}
                                                </p>
                                                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    tx.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                            <h3 className="text-[15px] font-bold text-[#333] mb-6">Linked Accounts</h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-red-50 flex items-center justify-between bg-white shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#111] font-bold text-[10px] border border-gray-100">HDFC</div>
                                        <div>
                                            <p className="text-[13px] font-bold">HDFC Savings</p>
                                            <p className="text-[11px] text-gray-400">**** 8842</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-red-50 text-primary text-[9px] font-bold rounded-sm uppercase">Primary</span>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#2a59b3] flex items-center justify-center text-white font-bold text-[10px]">SBI</div>
                                        <div>
                                            <p className="text-[13px] font-bold text-[#333]">SBI Current</p>
                                            <p className="text-[11px] text-gray-400">**** 1129</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-3.5 rounded-xl border border-dashed border-gray-200 text-[12px] font-bold text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                                    <Plus size={16} /> Link New Account
                                </button>
                            </div>
                        </div>

                        <div className="bg-primary rounded-xl p-8 text-white relative overflow-hidden group shadow-xl shadow-primary/20">
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6">
                                    <IndianRupee size={20} className="text-white" />
                                </div>
                                <h3 className="text-[20px] font-bold mb-3 leading-tight">Financial Tip</h3>
                                <p className="text-[13px] opacity-90 leading-relaxed mb-8">
                                    Set aside at least 25% of every invoice for tax season. Keeping a separate "Tax Pot" prevents cash flow stress at the end of the fiscal year.
                                </p>
                                <button className="px-6 py-2.5 bg-white text-primary rounded-lg font-bold text-[12px] hover:bg-gray-50 transition-all">
                                    Learn More
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[13px] font-bold text-[#333]">Monthly Goal: ₹30,000</p>
                            </div>
                            <div className="h-2 w-full bg-red-50 rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-green-600 rounded-full" style={{ width: '81%' }}></div>
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-gray-400 uppercase">81% Achieved</span>
                                <span className="text-gray-400 uppercase">₹5,500 to go</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(isAddFundsOpen || isWithdrawOpen) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-[20px] font-bold text-on-surface">
                                        {isAddFundsOpen ? "Add Funds" : "Withdraw Funds"}
                                    </h3>
                                    <button 
                                        onClick={() => { setIsAddFundsOpen(false); setIsWithdrawOpen(false); }}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <Plus size={24} className="rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Enter Amount (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                            <input 
                                                type="number" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-[20px] font-bold"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    {isWithdrawOpen && (
                                        <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
                                            <AlertCircle size={18} className="text-blue-600 shrink-0" />
                                            <p className="text-[12px] text-blue-800 leading-relaxed">
                                                Funds will be transferred to your linked **HDFC Bank Account**. Standard processing time is 1-3 business days.
                                            </p>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => handleAction(isAddFundsOpen ? 'ADD' : 'WITHDRAW')}
                                        disabled={loading || !amount}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[15px] shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? "Processing..." : (isAddFundsOpen ? "Complete Purchase" : "Initiate Withdrawal")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FinancialDashboard;
