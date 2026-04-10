import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/", icon: "home-5" },
    { label: "Subscriptions", to: "/user/subscriptions", icon: "user-shared" },
    { label: "Explore", to: "/explore", icon: "compass-discover" },
    { label: "Watchlist", to: "/watchlist", icon: "bookmark" },
    { label: "Download", to: "/downloads", icon: "download-cloud" },
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
      <div className="max-w-full px-10 h-16 flex items-center justify-between gap-4">

        {/* --- LEFT SECTION: Logo & Browse --- */}
        <div className="flex items-center gap-6 flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-200 text-2xl p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <i className="ri-menu-line"></i>
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              <img src="/AnantTV-logo.png" alt="AnantTV Logo" className="h-8 transition-transform group-hover:scale-110" />
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                AnantTV
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center">
            <div 
              className="relative"
              onMouseEnter={() => setBrowseOpen(true)}
              onMouseLeave={() => setBrowseOpen(false)}
            >
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer font-semibold text-sm">
                <i className="ri-apps-2-line text-lg"></i>
                Browse 
                <i className={`ri-arrow-down-s-line transition-transform duration-300 ${browseOpen ? "rotate-180" : ""}`}></i>
              </button>
              
              <AnimatePresence>
                {browseOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 pt-4 w-56"
                  >
                    <div className="bg-[#0f172a]/95 border border-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-2">
                      {navItems.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                              isActive 
                              ? "bg-indigo-500/10 text-indigo-400" 
                              : "text-gray-400 hover:bg-white/5 hover:text-gray-100"
                            }`
                          }
                        >
                          <i className={`ri-${item.icon}-line text-lg`}></i>
                          <span className="font-medium">{item.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* --- CENTER SECTION: Search Bar --- */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-xl">
          <div className="w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="ri-search-2-line text-gray-400 group-focus-within:text-indigo-400 transition-colors"></i>
            </div>
            <input
              type="text"
              placeholder="Search ..."
              className="w-full bg-[#111827] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* --- RIGHT SECTION: Actions --- */}
        <div className="flex items-center justify-end gap-5 flex-1 min-w-[200px]">
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/your-videos/publish")}
              className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-full transition"
            >
              <i className="ri-add-line text-lg text-indigo-400"></i>
              Create
            </motion.button>
          )}

          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
            >
              Sign In
            </button>
          )}

          {user && (
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition relative">
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-gray-900"></span>
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/user")}
                className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex justify-center items-center font-bold shadow-lg shadow-indigo-500/20 border-2 border-white/10"
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
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        isActive 
                        ? "bg-indigo-500/10 text-indigo-400" 
                        : "text-gray-300 hover:bg-white/5"
                      }`
                    }
                  >
                    <i className={`ri-${item.icon}-line text-xl`}></i>
                    <span className="font-semibold">{item.label}</span>
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
