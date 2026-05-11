import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { API_BASE_URL } from './config';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CtaCards from './components/CtaCards';
import GlobalFreelancers from './components/GlobalFreelancers';
import BuildMarketplace from './components/BuildMarketplace';
import Testimonials from './components/Testimonials';
import ReadyToScale from './components/ReadyToScale';
import SiteFooter from './components/SiteFooter';
import Login from './components/Login';
import Signup from './components/Signup';
import Onboarding from './components/Onboarding';
import PostProject from './components/PostProject';
import Pricing from './components/Pricing';
import BrowseProjects from './components/BrowseProjects';
import BrowseJobs from './components/BrowseJobs';
import ProjectDetails from './components/ProjectDetails';
import Profile from './components/Profile';
import Settings from './components/Settings';
import AdminDashboard from './components/admin/AdminDashboard';
import BrowseFreelancers from './components/BrowseFreelancers';
import ForgotPassword from './components/ForgotPassword';
import ClientProfile from './components/ClientProfile';
import PostJob from './components/PostJob';
import FinancialDashboard from './components/FinancialDashboard';
import Analytics from './components/Analytics';
import DailyUpdates from './components/DailyUpdates';
import JobDetails from './components/JobDetails';
import HireMe from './components/HireMe';
import JobApply from './components/JobApply';

const HomePage: React.FC = () => (
    <>
        <HeroBanner />
        <CtaCards />
        <GlobalFreelancers />
        <Testimonials />
        <BuildMarketplace />
        <ReadyToScale />
    </>
);

const AppContent: React.FC = () => {
    const location = useLocation();
    const hideHeaderFooter = ['/login', '/signup', '/forgot-password', '/admin-dashboard'].includes(location.pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const fetchGlobalData = async () => {
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.email) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/profiles/${parsed.email}`, {
                            headers: { 'X-Requested-With': 'XMLHttpRequest' }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            const updatedUser = { ...parsed, ...data, profileFetched: true };
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            window.dispatchEvent(new Event('user-updated'));
                        } else if (response.status === 404) {
                            console.log("Profile not yet created for:", parsed.email);
                        }
                    } catch (error) {
                        console.error("Global profile fetch error:", error);
                    }
                }
            }
        };
        fetchGlobalData();
    }, []);

    return (
        <main className="bg-[#fdfaf0] min-h-screen text-[#222] overflow-x-hidden selection:bg-[#b5242c]/20">
            {!hideHeaderFooter && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/post-project" element={<PostProject />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/projects" element={<BrowseProjects />} />
                <Route path="/jobs" element={<BrowseJobs />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/client-profile" element={<ClientProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/freelancers" element={<BrowseFreelancers />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/financial-dashboard" element={<FinancialDashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/daily-updates" element={<DailyUpdates />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/hire-me" element={<HireMe />} />
                <Route path="/apply-job/:id" element={<JobApply />} />

            </Routes>
            {!hideHeaderFooter && <SiteFooter />}
        </main>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
