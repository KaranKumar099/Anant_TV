import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "Watchlist", to: "/watchlist" },
    { label: "Download", to: "/downloads" },
  ];

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 w-full bg-gray-900/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">

          {/* LEFT SIDE — HAMBURGER (mobile) + LOGO */}
          <div className="flex items-center gap-3">

            {/* HAMBURGER — only < lg */}
            <button
              className="lg:hidden text-gray-200 text-2xl p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <i className="ri-menu-line"></i>
            </button>

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="AnantTV Logo" className="h-8" />
              <span className="text-xl font-bold tracking-wide text-indigo-400">
                AnantTV
              </span>
            </Link>
          </div>

          {/* CENTER NAV — only lg+ */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition hover:text-indigo-400 ${
                    isActive ? "text-indigo-400" : "text-gray-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* SEARCH BAR */}
          <div className="flex flex-1 items-center rounded-lg bg-white/10 border border-white/20 max-w-40 sm:max-w-3xs md:max-w-sm mx-4">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Search videos or channels..."
              className="w-full hidden sm:flex px-4 py-2 placeholder-gray-400 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              placeholder="Search..."
              className="w-full sm:hidden px-4 py-2 placeholder-gray-400 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <i class="ri-search-2-line text-xl text-white pr-2"></i>
          </div>

          {/* RIGHT SIDE — LOGIN / PROFILE */}
          <div className="flex items-center gap-4">
            {!user && (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-gray-200 text-sm hover:bg-white/15 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Login / Sign Up
              </button>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-300 hover:text-indigo-400"
                >
                  <i className="ri-notification-3-line text-xl"></i>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate("/user")}
                  className="h-9 w-9 rounded-full bg-indigo-500 text-white flex justify-center items-center font-semibold hover:opacity-90 transition focus:ring-2 focus:ring-indigo-500"
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* ---------- MOBILE NAV DRAWER ---------- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BLUR OVERLAY */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* SLIDE-IN MENU */}
            <motion.div
              className="fixed top-0 left-0 z-50 h-full w-72 bg-gray-900/95 border-r border-white/10 shadow-2xl backdrop-blur-xl p-5"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              {/* Header Row */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-indigo-300">
                  Menu
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-300 text-2xl hover:text-indigo-400"
                >
                  <i className="ri-close-line" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg text-gray-200 hover:bg-white/10 transition ${
                        isActive ? "bg-white/10 text-indigo-400" : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
