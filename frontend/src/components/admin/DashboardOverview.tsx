import { Users, Briefcase, CheckSquare, Activity, IndianRupee, TrendingUp, UserPlus, UserCheck, AlertCircle, Plus } from 'lucide-react';
import { StatCard, LegendItem, BarItem } from './Common';

const DashboardOverview = ({ stats, users, projects, loggedUser, onNavigate }: any) => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="space-y-6">
            {/* Header / Welcome Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-5">
                    <div className="w-[60px] h-[60px] rounded-full bg-orange-100 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-600 shadow-md overflow-hidden shrink-0">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(loggedUser?.fullName || 'Shinefiling')}&background=F97316&color=fff&bold=true&size=120`} 
                            alt="Profile" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-[#1e293b] dark:text-white font-poppins leading-tight">
                            {greeting}, {loggedUser?.fullName || 'Shinefiling'}! 👋
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-1 mt-2 text-[14px] font-medium text-[#64748b] dark:text-slate-400">
                            You have 
                            <span className="text-[#f97316] font-bold underline cursor-pointer hover:text-orange-600 transition-colors ml-1" onClick={() => onNavigate('verification')}>0 Pending Approvals</span>, 
                            <span className="text-[#f97316] font-bold underline cursor-pointer hover:text-orange-600 transition-colors ml-1" onClick={() => onNavigate('freelancer_network')}>24 Freelancer Partners</span> 
                            & 
                            <span className="text-[#f97316] font-bold underline cursor-pointer hover:text-orange-600 transition-colors ml-1" onClick={() => onNavigate('clients')}>3 Partners</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onNavigate('live_projects')} 
                        className="px-4 py-2 bg-[#003d4d] text-white text-sm font-bold rounded-[10px] hover:bg-[#002d38] transition-all shadow-lg shadow-[#003d4d]/10 flex items-center gap-1.5"
                    >
                        <Plus size={16} /> Add Project
                    </button>
                    <button 
                        onClick={() => onNavigate('live_projects')} 
                        className="px-4 py-2 bg-[#f97316] text-white text-sm font-bold rounded-[10px] hover:bg-[#ea580c] transition-all shadow-lg shadow-[#f97316]/20 flex items-center gap-1.5"
                    >
                        <Plus size={16} /> Add Request
                    </button>
                </div>
            </div>

            {/* Marketplace Stats Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-poppins">
                <StatCard title="Platform Talent" value={stats.totalFreelancers} trend={2.1} icon={Users} colorClass="bg-orange-500" subtext="Registered Developers" />
                <StatCard title="Live Engagements" value={projects.length} trend={5.4} icon={Activity} colorClass="bg-teal-600" subtext="Current Project Stream" />
                <StatCard title="Hires (Completed)" value={stats.totalProjects} trend={12.5} icon={CheckSquare} colorClass="bg-blue-500" subtext="Successfully Closed" />
                <StatCard title="Open Disputes" value="0" trend={-2.1} icon={AlertCircle} colorClass="bg-pink-500" subtext="Requires Attention" />
            </div>

            {/* Marketplace Stats Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-poppins">
                <StatCard title="Gross Transaction" value={`₹${stats.totalRevenue.toLocaleString()}`} trend={10.2} icon={IndianRupee} colorClass="bg-purple-500" subtext="Total GMV" />
                <StatCard title="Marketplace Fees" value={`₹${(stats.totalRevenue * 0.1).toLocaleString()}`} trend={8.5} icon={TrendingUp} colorClass="bg-red-500" subtext="Net commission (10%)" />
                <StatCard title="New Leads" value="31" trend={4.2} icon={UserPlus} colorClass="bg-green-500" subtext="Pending Onboarding" />
                <StatCard title="Pro Freelancers" value="24" trend={0} icon={UserCheck} colorClass="bg-slate-700" subtext="Top Tier Specialists" />
            </div>

            {/* Marketplace Specific Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="shine-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-poppins">Project Distribution</h3>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 uppercase tracking-widest">Global Pulse</span>
                    </div>
                    <div className="mb-6">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Active Gigs</p>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white font-poppins">{projects.length}</h2>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-900 rounded-full flex overflow-hidden mb-6">
                        <div className="w-1/2 bg-orange-500"></div>
                        <div className="w-1/4 bg-teal-500"></div>
                        <div className="w-1/4 bg-blue-500"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <LegendItem color="bg-orange-500" label="Dev" val="50%" />
                        <LegendItem color="bg-teal-500" label="Design" val="25%" />
                        <LegendItem color="bg-blue-500" label="Marketing" val="25%" />
                    </div>
                </div>

                <div className="shine-card p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-poppins">Talent Acquisition</h3>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 uppercase tracking-widest">Growth</span>
                    </div>
                    <div className="h-48 relative flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-[10px] border-slate-50 dark:border-slate-900 border-t-orange-500 border-l-teal-500 flex items-center justify-center shadow-inner">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</p>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-white font-poppins">{stats.totalFreelancers}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shine-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-poppins">Marketplace Growth</h3>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded font-bold text-slate-500 uppercase tracking-widest">Trending</span>
                    </div>
                    <div className="space-y-4">
                        <BarItem label="React Developers" val={92} />
                        <BarItem label="UI/UX Designers" val={78} />
                        <BarItem label="DevOps Engineers" val={56} />
                        <BarItem label="Data Scientists" val={42} />
                    </div>
                </div>
            </div>

            {/* Activity Lists Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                <div className="shine-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-poppins">Recent Project Hires</h3>
                        <button onClick={() => onNavigate('live_projects')} className="text-[10px] text-orange-500 font-bold uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4">
                        {projects.slice(0, 4).map((p: any, i: number) => (
                            <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-700 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-700 flex items-center justify-center text-orange-600">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight mb-0.5">{p.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-emerald-600 leading-none mb-1">₹{p.budget?.toLocaleString()}</p>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Verified</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="shine-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 font-poppins">Top Rated Freelancers</h3>
                        <button onClick={() => onNavigate('freelancer_network')} className="text-[10px] text-orange-500 font-bold uppercase tracking-widest hover:underline">Full Network</button>
                    </div>
                    <div className="space-y-4">
                        {users.filter((u: any) => u.userRole === 'FREELANCER').slice(0, 4).map((u: any, i: number) => (
                            <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-700 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random`} alt={u.fullName} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{u.fullName}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Level 2 Seller</p>
                                    </div>
                                </div>
                                <span className="text-orange-500">
                                    <UserCheck size={16} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
