import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, User, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../config';

const MessagesView: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/messages`);
            if (response.ok) {
                setMessages(await response.json());
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMessages = messages.filter(msg => 
        msg.senderEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.receiverEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Communication Logs</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time monitoring of platform chat interactions</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search logs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm w-full md:w-64 outline-none focus:border-orange-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Time</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Participants</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Content Preview</th>
                                <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {filteredMessages.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic">No message logs available</td>
                                </tr>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <motion.tr 
                                        key={msg.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={12} />
                                                <span className="text-xs font-medium">{new Date(msg.timestamp).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{msg.senderEmail}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{msg.receiverEmail}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[400px]">
                                            <p className="text-sm text-slate-600 dark:text-slate-300 truncate font-medium">{msg.content}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all">
                                                <ShieldAlert size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MessagesView;
