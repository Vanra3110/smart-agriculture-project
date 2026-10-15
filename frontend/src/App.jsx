import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";

import Home from "./pages/Home";
import About from "./pages/About";
import Crops from "./pages/Crops";
import CropDetail from "./pages/Crops/CropDetail";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Recommendation from "./pages/Recommendation";
import Disease from "./pages/Disease";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// PageWrapper adds a global exit animation for all pages
function PageWrapper({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

// AnimatedRoutes allows useLocation for AnimatePresence
function AnimatedRoutes() {
    const location = useLocation();
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/crops" element={<PageWrapper><Crops /></PageWrapper>} />
                <Route path="/crops/:cropName" element={<PageWrapper><CropDetail /></PageWrapper>} />
                <Route path="/recommend" element={<PageWrapper><Recommendation /></PageWrapper>} />
                <Route path="/disease" element={<PageWrapper><Disease /></PageWrapper>} />
                
                {/* Auth & Session Routes */}
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                <Route
                    path="/profile"
                    element={
                        <PageWrapper>
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        </PageWrapper>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

function MainLayout() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <div className={`flex-1 flex flex-col ${isAuthPage ? "justify-center" : ""}`}>
                <AnimatedRoutes />
            </div>
            {!isAuthPage && <Footer />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <MainLayout />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;