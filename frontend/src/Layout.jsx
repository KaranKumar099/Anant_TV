import { useState, useEffect } from "react";
import { Header, Home, SideBar } from "./index";
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
    <div className="h-screen overflow-hidden">
      <Header/>
      <Outlet/>
    </div>
  );
}

export default Layout;
