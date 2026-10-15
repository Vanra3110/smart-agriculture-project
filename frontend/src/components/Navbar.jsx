import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrolledMenuOpen, setScrolledMenuOpen] = useState(false);

    const pillRef = useRef(null);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Track scroll position to trigger burger button transformation
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 80;
            setIsScrolled(scrolled);
            if (!scrolled) {
                setScrolledMenuOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close scrolled menu on click outside or escape key
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (scrolledMenuOpen && pillRef.current && !pillRef.current.contains(event.target)) {
                setScrolledMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && scrolledMenuOpen) {
                setScrolledMenuOpen(false);
            }
        };

        if (scrolledMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [scrolledMenuOpen]);

    // Mobile link styling
    const getMobileLinkClass = ({ isActive }) =>
        `rounded-xl px-3.5 py-2.5 text-sm font-medium transition flex items-center gap-2.5 ${
            isActive
                ? "bg-emerald-100 text-emerald-800 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    // Floating navigation pill styling (desktop/windows)
    const getFloatingLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
            isActive
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
        }`;

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = async () => {
        closeMenu();
        await logout();
        navigate("/login");
    };

    const handleNavLinkClick = () => {
        if (isScrolled) {
            setScrolledMenuOpen(false);
        }
    };

    const showPill = !isScrolled || scrolledMenuOpen;
    const showBurger = isScrolled && !scrolledMenuOpen;

    return (
        <header className="sticky top-0 z-50 w-full pointer-events-none">
            {/* Top Bar: Brand, Auth & Mobile Menu */}
            <div className="pointer-events-auto border-b border-slate-200/90 bg-white/90 backdrop-blur-md w-full shadow-2xs">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <NavLink
                            to="/"
                            onClick={closeMenu}
                            className="flex items-center gap-2 group"
                        >
                            <motion.span 
                                whileHover={{ rotate: 18, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                className="text-2xl inline-block"
                            >
                                🌾
                            </motion.span>

                            <div className="flex flex-col">
                                <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-emerald-700 transition">
                                    Smart Agriculture AI
                                </span>
                                <span className="text-[10px] text-emerald-600 font-semibold tracking-wider uppercase -mt-0.5">
                                    Intelligent Crop Diagnostics
                                </span>
                            </div>
                        </NavLink>

                        {/* Right: Desktop Auth & Session Controls */}
                        <div className="hidden items-center gap-3 lg:flex">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-2.5">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-2xs"
                                        title="View farmer profile"
                                    >
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white font-bold">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : "F"}
                                        </span>
                                        <span>{user?.name?.split(" ")[0] || "Farmer"}</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200 transition cursor-pointer"
                                        title="End session"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="rounded-full px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="rounded-full px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger Toggle Button */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
                            aria-label="Toggle navigation menu"
                        >
                            {menuOpen ? (
                                <span className="text-lg font-bold">✕</span>
                            ) : (
                                <span className="text-xl">☰</span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Navigation Dropdown */}
                    {menuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="border-t border-slate-100 py-3 lg:hidden pointer-events-auto"
                        >
                            <div className="flex flex-col gap-1">
                                <NavLink
                                    to="/"
                                    onClick={closeMenu}
                                    className={getMobileLinkClass}
                                >
                                    <span>🏠</span> Home
                                </NavLink>

                                <NavLink
                                    to="/recommend"
                                    onClick={closeMenu}
                                    className={getMobileLinkClass}
                                >
                                    <span>🌱</span> Recommend Crop
                                </NavLink>

                                <NavLink
                                    to="/disease"
                                    onClick={closeMenu}
                                    className={getMobileLinkClass}
                                >
                                    <span>🩺</span> Disease Detection
                                </NavLink>

                                <NavLink
                                    to="/crops"
                                    onClick={closeMenu}
                                    className={getMobileLinkClass}
                                >
                                    <span>🌾</span> Supported Crops
                                </NavLink>

                                <NavLink
                                    to="/about"
                                    onClick={closeMenu}
                                    className={getMobileLinkClass}
                                >
                                    <span>ℹ️</span> About Project
                                </NavLink>

                                {isAuthenticated ? (
                                    <>
                                        <NavLink
                                            to="/profile"
                                            onClick={closeMenu}
                                            className={getMobileLinkClass}
                                        >
                                            <span>📜</span> My Farm & Crop History
                                        </NavLink>

                                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-3">
                                            <span className="text-xs font-semibold text-slate-600">
                                                Signed in as <strong className="text-emerald-700">{user?.name}</strong>
                                            </span>
                                            <button
                                                onClick={handleLogout}
                                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition cursor-pointer"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 px-1">
                                        <Link
                                            to="/login"
                                            onClick={closeMenu}
                                            className="text-center py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={closeMenu}
                                            className="text-center py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Subtle Backdrop when Scrolled Pill Menu is Open */}
            <AnimatePresence>
                {isScrolled && scrolledMenuOpen && (
                    <motion.div
                        key="scrolled-menu-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setScrolledMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-30 pointer-events-auto"
                        aria-hidden="true"
                    />
                )}
            </AnimatePresence>

            {/* Centered Floating Pill Navigation (Always Returns to Original Center Position) */}
            <AnimatePresence>
                {showPill && (
                    <div className="hidden lg:flex justify-center w-full fixed top-[72px] left-0 right-0 pointer-events-none z-40">
                        <motion.nav 
                            ref={pillRef}
                            key="centered-floating-pill"
                            initial={{ 
                                y: isScrolled ? -18 : -10, 
                                opacity: 0, 
                                scale: 0.94 
                            }}
                            animate={{ 
                                y: 0, 
                                opacity: 1, 
                                scale: 1 
                            }}
                            exit={{ 
                                y: -16, 
                                opacity: 0, 
                                scale: 0.94 
                            }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 360, 
                                damping: 27,
                                mass: 0.8
                            }}
                            aria-label="Desktop Primary Navigation"
                            className={`pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/95 backdrop-blur-md border transition-all duration-200 ${
                                isScrolled 
                                    ? "border-emerald-300 shadow-2xl shadow-slate-900/20 ring-4 ring-emerald-500/10" 
                                    : "border-slate-200/90 shadow-md shadow-slate-900/10 hover:border-slate-300"
                            }`}
                        >
                            <NavLink
                                to="/"
                                onClick={handleNavLinkClick}
                                className={getFloatingLinkClass}
                            >
                                <span>🏠</span>
                                <span>Home</span>
                            </NavLink>

                            <NavLink
                                to="/recommend"
                                onClick={handleNavLinkClick}
                                className={getFloatingLinkClass}
                            >
                                <span>🌱</span>
                                <span>Recommend</span>
                            </NavLink>

                            <NavLink
                                to="/disease"
                                onClick={handleNavLinkClick}
                                className={getFloatingLinkClass}
                            >
                                <span>🩺</span>
                                <span>Disease Detect</span>
                            </NavLink>

                            <NavLink
                                to="/crops"
                                onClick={handleNavLinkClick}
                                className={getFloatingLinkClass}
                            >
                                <span>🌾</span>
                                <span>Crops</span>
                            </NavLink>

                            <NavLink
                                to="/about"
                                onClick={handleNavLinkClick}
                                className={getFloatingLinkClass}
                            >
                                <span>ℹ️</span>
                                <span>About</span>
                            </NavLink>

                            {isAuthenticated && (
                                <NavLink
                                    to="/profile"
                                    onClick={handleNavLinkClick}
                                    className={getFloatingLinkClass}
                                >
                                    <span>📜</span>
                                    <span>History & Profile</span>
                                </NavLink>
                            )}

                            {/* Close Button when opened while scrolled */}
                            {isScrolled && scrolledMenuOpen && (
                                <motion.button
                                    type="button"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={() => setScrolledMenuOpen(false)}
                                    className="ml-1 h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition text-xs font-bold cursor-pointer"
                                    title="Close floating menu (Esc)"
                                    aria-label="Close floating menu"
                                >
                                    ✕
                                </motion.button>
                            )}
                        </motion.nav>
                    </div>
                )}
            </AnimatePresence>

            {/* Scrolled State: Burger Button in Top-Right Corner Below Navbar */}
            <AnimatePresence>
                {showBurger && (
                    <div className="hidden lg:flex fixed top-[72px] right-4 sm:right-6 lg:right-10 pointer-events-none z-50">
                        <motion.button
                            key="scrolled-floating-burger"
                            onClick={() => setScrolledMenuOpen(true)}
                            initial={{ scale: 0.75, opacity: 0, y: -8 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.75, opacity: 0, y: -8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 420, 
                                damping: 26,
                                mass: 0.7
                            }}
                            className="pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-slate-900/10 hover:shadow-xl hover:border-emerald-400 text-slate-800 hover:text-emerald-700 transition cursor-pointer group"
                            title="Open navigation menu"
                            aria-label="Open navigation menu"
                        >
                            {/* 3-bar hamburger icon */}
                            <div className="flex flex-col justify-center items-center gap-[3px] w-4 h-4">
                                <span className="w-3.5 h-[2px] bg-slate-700 group-hover:bg-emerald-600 rounded-full transition-colors" />
                                <span className="w-3.5 h-[2px] bg-slate-700 group-hover:bg-emerald-600 rounded-full transition-colors" />
                                <span className="w-3.5 h-[2px] bg-slate-700 group-hover:bg-emerald-600 rounded-full transition-colors" />
                            </div>
                            <span className="text-xs font-bold tracking-wide">Menu</span>
                        </motion.button>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Navbar;