import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

function SideBar() {
    const { user } = useAuth();

    const linkClasses = ({ isActive }) =>
        `w-[85%] py-2 px-4 text-left flex items-center gap-3 rounded-xl font-medium tracking-wide transition-all duration-300
         ${isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"}`;

    const links = [
        { to: "/", label: "Home", icon: "ri-home-line" },
        { to: "/user/subscriptions", label: "Subscriptions", icon: "ri-group-2-line" },
        { to: "/playlists", label: "Playlists", icon: "ri-play-list-2-line" },
        { to: "/your-videos", label: "Your Videos", icon: "ri-video-on-line" },
        { to: "/user/watch-history", label: "History", icon: "ri-history-line" },
        { to: `/user/channel/${user?._id}`, label: "Your Channel", icon: "ri-dashboard-line" },
    ];

    return (
        <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-3 bg-gray-900 py-4 shadow-xl h-full"
        >
            {links.map(({ to, label, icon }) => (
                <motion.div key={label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full flex justify-center">
                    <NavLink to={to} className={linkClasses}>
                        <i className={`text-xl ${icon}`}></i>
                        <span>{label}</span>
                    </NavLink>
                </motion.div>
            ))}
        </motion.div>
    );
}

export default SideBar;
