import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const getLinkClass = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
            isActive
                ? "bg-green-100 text-green-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`;

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <NavLink
                        to="/"
                        onClick={closeMenu}
                        className="flex items-center gap-2"
                    >
                        <span className="text-2xl">
                            🌾
                        </span>

                        <span className="text-lg font-bold text-slate-900">
                            Smart Agriculture AI
                        </span>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 sm:flex">

                        <NavLink
                            to="/"
                            className={getLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/crops"
                            className={getLinkClass}
                        >
                            Crops
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={getLinkClass}
                        >
                            About
                        </NavLink>

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>

                </div>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="border-t border-slate-100 py-3 sm:hidden">

                        <div className="flex flex-col gap-1">

                            <NavLink
                                to="/"
                                onClick={closeMenu}
                                className={getLinkClass}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/crops"
                                onClick={closeMenu}
                                className={getLinkClass}
                            >
                                Crops
                            </NavLink>

                            <NavLink
                                to="/about"
                                onClick={closeMenu}
                                className={getLinkClass}
                            >
                                About
                            </NavLink>

                        </div>

                    </div>
                )}

            </div>
        </nav>
    );
}

export default Navbar;