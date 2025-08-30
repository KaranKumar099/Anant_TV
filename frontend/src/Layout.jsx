import { useState, useEffect } from "react";
import { Header, SideBar } from "./index";
import { Outlet } from "react-router";
import { motion } from "framer-motion";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = () => {
    if (windowWidth < 1000) {
      setSidebarOpen(!sidebarOpen);
      setCollapsed(false);
    } 
    else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="w-full fixed left-0 top-0 z-50">
        <Header onMenuClick={handleMenuClick} />
      </div>

      <div className="flex flex-1 pt-16 h-full">
        {windowWidth >= 1000 && (
          <div
            className={`fixed top-16 left-0 h-full bg-gray-900 transition-all duration-300 
              ${collapsed ? "w-20" : "w-56"} hidden md:block`}
          >
            <SideBar showLabels={!collapsed} />
          </div>
        )}

        {windowWidth >= 500 && windowWidth < 1000 && (
          <div className="w-20 fixed top-16 left-0 bg-gray-900 h-full">
            <SideBar showLabels={false} />
          </div>
        )}

        {sidebarOpen && windowWidth < 500 && (
          <>
            <motion.div
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 w-56 h-full bg-gray-900 shadow-2xl z-50"
            >
              <SideBar showLabels={true} />
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-2 right-3 text-gray-50/75"
              >
                <i className="ri-close-circle-line"></i>
              </button>
            </motion.div>

            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
          </>
        )}

        <div
          className={`flex-1 bg-gray-200 overflow-y-scroll transition-all duration-300
            ${windowWidth >= 1000 ? (collapsed ? "ml-20" : "ml-56") : windowWidth >= 500 ? "ml-20" : "ml-0"}`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
