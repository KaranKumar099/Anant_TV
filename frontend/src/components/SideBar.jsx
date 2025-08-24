import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function SideBar() {
    const { user } = useAuth();

    const linkClasses = ({ isActive }) =>
        `w-[84%] py-2 px-3 text-left flex items-center rounded-md transition 
     ${isActive ? "bg-blue-400 text-white" : "bg-gray-200 hover:bg-blue-200"}`;

    return (
        <div className="flex flex-col items-center gap-2">
            <NavLink to="/" className={linkClasses}>
                <i className="mr-2 text-xl ri-home-line"></i>Home
            </NavLink>

            <NavLink to="/user/subscriptions" className={linkClasses}>
                <i className="mr-2 text-xl ri-group-2-line"></i>Subscriptions
            </NavLink>

            <NavLink to="/playlists" className={linkClasses}>
                <i className="mr-2 text-xl ri-play-list-2-line"></i>Playlists
            </NavLink>

            <NavLink to="/your-videos" className={linkClasses}>
                <i className="mr-2 text-xl ri-video-on-line"></i>Your Videos
            </NavLink>

            <NavLink to="/user/watch-history" className={linkClasses}>
                <i className="mr-2 text-xl ri-history-line"></i>History
            </NavLink>

            <NavLink to={`/user/channel/${user?._id}`} className={linkClasses}>
                <i className="mr-2 text-xl ri-dashboard-line"></i>Your Channel
            </NavLink>
        </div>
    );
}

export default SideBar;
