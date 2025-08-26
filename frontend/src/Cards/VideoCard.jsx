import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router";
import axios from "axios";
import AddToPlaylist from "../components/AddToPlaylist";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

function DropdownMenu({ buttons, onUpdate, onDelete, onAddToPlaylist, position }) {
    return createPortal(
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 flex-col items-start bg-gray-800/95 text-gray-200 w-56 rounded-lg overflow-hidden shadow-xl"
        >
            {buttons ? (
                <>
                    <div onClick={onUpdate} className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-edit-line"></i>Edit
                    </div>
                    <div onClick={onDelete} className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-delete-bin-6-line"></i>Delete
                    </div>
                </>
            ) : (
                <>
                    <div onClick={onAddToPlaylist} className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-play-list-add-line"></i>Add to playlist
                    </div>
                    <div className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-time-line"></i>Save to Watch later
                    </div>
                    <div className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-download-2-line"></i>Download
                    </div>
                    <div className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-share-box-line"></i>Share
                    </div>
                    <div className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2">
                        <i className="ri-spam-3-line"></i>Not Interested
                    </div>
                </>
            )}
        </motion.div>,
        document.body
    );
}

function VideoCard({ thumbnail, title, owner, views, duration, uploaded, videoId, buttons }) {
    const navigate = useNavigate();
    const [uploadTime, setUploadTime] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    const updateVideoHandler = () => navigate(`update/${videoId}`);
    const deleteVideoHandler = async () => {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`http://localhost:8000/api/v1/videos/${videoId}`, {
            headers: { Authorization: `Bearer ${token}`, withCredentials: true },
        });
    };

    const handleAddToPlaylist = () => {};
    const handlePlayVideo = () => navigate(`/video/play/${videoId}`);
    const navigateToChannelDashboard = () => navigate(`/channel-dashboard/${owner?.username}`);

    useEffect(() => {
        const timePassed = (uploaded) => {
            const today = new Date().toJSON().substring(0, 19);
            const todayArr = today.split(/[-:T]/);
            const uploadedArr = uploaded.substring(0, 19).split(/[-:T]/);
            let i = 0;
            while (i < 6 && todayArr[i] - uploadedArr[i] === 0) i++;
            if (i === 0) setUploadTime(todayArr[i] - uploadedArr[i] + " years ago");
            else if (i === 1) setUploadTime(todayArr[i] - uploadedArr[i] + " months ago");
            else if (i === 2) setUploadTime(todayArr[i] - uploadedArr[i] + " days ago");
            else if (i === 3) setUploadTime(todayArr[i] - uploadedArr[i] + " hours ago");
            else if (i === 4) setUploadTime(todayArr[i] - uploadedArr[i] + " minutes ago");
            else setUploadTime(todayArr[i] - uploadedArr[i] + " seconds ago");
        };
        timePassed(uploaded);
    }, [uploaded]);

    const toggleMenu = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 5, left: rect.left });
        setMenuOpen(!menuOpen);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="main cursor-pointer bg-gray-900 rounded-xl shadow-lg hover:shadow-indigo-600/30 transition-shadow duration-300"
        >
            <div className="relative w-full aspect-video overflow-hidden rounded-t-xl" onClick={handlePlayVideo}>
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500"
                />
                <h6 className="absolute bottom-2 right-2 bg-black/70 rounded-md px-2 py-0.5 text-xs text-white font-semibold">
                    {parseFloat(duration).toFixed(2)}
                </h6>
            </div>

            <div className="p-3 flex justify-between relative">
                <div className="flex w-full gap-3">
                    {owner && (
                        <div
                            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-700 hover:scale-105 transition-transform"
                            onClick={navigateToChannelDashboard}
                        >
                            <img src={owner.avatar} alt="owner avatar" className="h-full w-full object-cover" />
                        </div>
                    )}
                    <div className="flex flex-col w-full" onClick={handlePlayVideo}>
                        <h3 className="font-semibold text-white leading-snug line-clamp-2 hover:text-indigo-400 transition-colors">{title}</h3>
                        <p className="text-sm text-gray-400">{owner?.username}</p>
                        <p className="text-xs text-gray-500">{views} views • {uploadTime}</p>
                    </div>
                </div>

                <button
                    className="rounded-full h-9 w-9 flex items-center justify-center hover:bg-gray-700 transition-colors"
                    onClick={toggleMenu}
                >
                    <i className="ri-more-2-line text-gray-300"></i>
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <DropdownMenu
                        buttons={buttons}
                        onUpdate={updateVideoHandler}
                        onDelete={deleteVideoHandler}
                        onAddToPlaylist={handleAddToPlaylist}
                        position={menuPos}
                    />
                )}
            </AnimatePresence>

            <div className="hidden absolute top-1/2 left-1/2 -translate-1/2 z-30 w-full add-to-playlist-modal">
                <AddToPlaylist videoId={videoId} />
            </div>
        </motion.div>
    );
}

export default VideoCard;