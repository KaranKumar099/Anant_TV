import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

function PlaylistDropdown({ onEdit, onDelete, position }) {
    return createPortal(
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ top: position.top, left: position.left }}
            className="fixed z-50 flex-col items-start bg-gray-800/95 text-white w-52 rounded-lg overflow-hidden shadow-xl"
        >
            <div
                className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                onClick={onEdit}
            >
                <i className="ri-edit-line"></i>Edit
            </div>
            <div
                className="w-full py-2 px-4 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                onClick={onDelete}
            >
                <i className="ri-delete-bin-6-line"></i>Delete
            </div>
        </motion.div>,
        document.body
    );
}

function PlaylistCard({ thumbnail, playlistName, channelName, vdoCount, updated, playlistId }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    const handleToggleMenu = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMenuPos({ top: rect.bottom + 5, left: rect.left });
        setMenuOpen(!menuOpen);
    };

    const handleEditPlaylist = () => {
        navigate(`edit/${playlistId}`);
    };

    const handleDeletePlaylist = async () => {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/playlist/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}`, withCredentials: true },
        });
    };

    const handleViewFullPlaylistClick = () => {
        navigate(`../playlists/${playlistId}`);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-600/30 cursor-pointer transition-shadow duration-300"
        >
            <div className="relative w-full h-44" onClick={handleViewFullPlaylistClick}>
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={thumbnail}
                    alt={playlistName}
                    className="w-full h-full object-cover transition-transform duration-500"
                />
                <h6 className="absolute bottom-2 right-2 bg-black/70 rounded-md px-2 py-0.5 text-xs text-white font-semibold">
                    {vdoCount} videos
                </h6>
            </div>

            <div className="flex justify-between items-start p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-white line-clamp-2">{playlistName}</h3>
                    {channelName ? (
                        <p className="text-sm text-gray-400 mt-1">{channelName} • Playlist</p>
                    ) : (
                        <p className="text-sm text-gray-400 mt-1">Updated at {updated}</p>
                    )}
                    <button
                        className="text-xs text-indigo-400 font-semibold mt-2 hover:text-indigo-500 transition-colors"
                        onClick={handleViewFullPlaylistClick}
                    >
                        View full playlist
                    </button>
                </div>
                <button
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-white"
                    onClick={handleToggleMenu}
                >
                    <i className="ri-more-2-line"></i>
                </button>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <PlaylistDropdown
                        onEdit={handleEditPlaylist}
                        onDelete={handleDeletePlaylist}
                        position={menuPos}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default PlaylistCard;
