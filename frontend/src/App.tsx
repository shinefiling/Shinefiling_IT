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
import HomeSEO from './components/HomeSEO';
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

import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => (
    <>
        <HeroBanner />
        <CtaCards />
        <GlobalFreelancers />
        {/* <Testimonials /> */}
        <BuildMarketplace />
        <ReadyToScale />
        <HomeSEO />
    </>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const hideHeaderFooter = ['/login', '/signup', '/forgot-password', '/admin-dashboard'].includes(location.pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user' && !e.newValue) {
                // Logout detected in another tab
                const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/projects', '/jobs', '/freelancers', '/pricing'];
                const isPublicPath = publicPaths.some(path => {
                    if (path === '/') return location.pathname === '/';
                    return location.pathname.startsWith(path);
                });

                if (!isPublicPath) {
                    window.location.href = '/ITfreelancers/login';
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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
                        const contentType = response.headers.get("content-type");
                        if (response.ok && contentType && contentType.includes("application/json")) {
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
        <main className="bg-[#F6F3EE] min-h-screen text-[#0F2E4B] overflow-x-hidden selection:bg-[#317CD7]/20">
            {!hideHeaderFooter && <Navbar />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Public Browse Routes */}
                <Route path="/projects" element={<BrowseProjects />} />
                <Route path="/jobs" element={<BrowseJobs />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/freelancers" element={<BrowseFreelancers />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Protected Routes */}
                <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                <Route path="/post-project" element={<ProtectedRoute><PostProject /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/client-profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
                <Route path="/financial-dashboard" element={<ProtectedRoute><FinancialDashboard /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/daily-updates" element={<ProtectedRoute><DailyUpdates /></ProtectedRoute>} />
                <Route path="/hire-me" element={<ProtectedRoute><HireMe /></ProtectedRoute>} />
                <Route path="/apply-job/:id" element={<ProtectedRoute><JobApply /></ProtectedRoute>} />
            </Routes>
            {!hideHeaderFooter && <SiteFooter />}
        </main>
    );
};

import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config';

const App: React.FC = () => {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Router basename="/ITfreelancers">
                <AppContent />
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
