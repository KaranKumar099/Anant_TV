import { Header, SideBar } from "./index";
import { Outlet } from "react-router";
import { useState } from "react";

function Layout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-4 left-5 z-100 text-xl text-gray-200 px-2 py-1 rounded-lg hover:bg-gray-600 transition"
                >
                    {collapsed ? <i className="ri-menu-fold-2-line"></i> : <i className="ri-menu-unfold-2-line"></i>}
                </button>
            <div className="w-full fixed left-0 top-0 z-50">
                <Header />
            </div>

            <div className="flex flex-1 pt-16 h-full">
                <div
                    className={`fixed top-16 left-0 h-full bg-gray-900 transition-all duration-300 
                        ${collapsed ? "w-24" : "w-56"} 
                        hidden md:block`}
                >
                    <SideBar showLabels={!collapsed} />
                </div>

                <div className={`flex-1 bg-gray-200 overflow-y-scroll transition-all duration-300
                    ${collapsed ? "ml-20" : "ml-56"}`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
