import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router";
import axios from "axios";
import AddToPlaylist from "../components/AddToPlaylist";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

/* ---------------- DROPDOWN ---------------- */

function DropdownMenu({ buttons, onUpdate, onDelete, onAddToPlaylist, position }) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      style={{ top: position.top, left: position.left }}
      className="fixed z-[999] w-56 rounded-xl overflow-hidden bg-gray-900/95 backdrop-blur-md border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col text-sm text-gray-200">
        {buttons ? (
          <>
            <MenuItem icon="ri-edit-line" label="Edit" onClick={onUpdate} />
            <MenuItem icon="ri-delete-bin-6-line" label="Delete" onClick={onDelete} danger />
          </>
        ) : (
          <>
            <MenuItem icon="ri-play-list-add-line" label="Add to playlist" onClick={onAddToPlaylist} />
            <MenuItem icon="ri-time-line" label="Save to Watch later" />
            <MenuItem icon="ri-download-2-line" label="Download" />
            <MenuItem icon="ri-share-box-line" label="Share" />
            <MenuItem icon="ri-spam-3-line" label="Not Interested" />
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-white/10 transition ${
        danger ? "text-red-400 hover:text-red-300" : ""
      }`}
    >
      <i className={`${icon} text-lg`} />
      <span>{label}</span>
    </div>
  );
}

/* ---------------- CARD ---------------- */

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

  /* -------- upload time formatter -------- */

  useEffect(() => {
    const timePassed = (uploaded) => {
      const t = new Date();
      const u = new Date(uploaded);
      const sec = Math.floor((t - u) / 1000);

      const map = [
        [31536000, "year"],
        [2592000, "month"],
        [86400, "day"],
        [3600, "hour"],
        [60, "minute"],
      ];

      for (let [s, n] of map) {
        const v = Math.floor(sec / s);
        if (v >= 1) return setUploadTime(`${v} ${n}${v > 1 ? "s" : ""} ago`);
      }

      setUploadTime("Just now");
    };

    timePassed(uploaded);
  }, [uploaded]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.left - 140 });
    setMenuOpen((prev) => !prev);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="group h-fit bg-white/3 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden hover:border-indigo-400/40 hover:shadow-indigo-500/20 transition duration-300"
    >
      {/* THUMBNAIL */}
      <div className="relative w-full aspect-video overflow-hidden" onClick={handlePlayVideo}>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition duration-500"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition" />

        {/* play icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
        >
          <i className="ri-play-circle-fill text-6xl drop-shadow-2xl" />
        </motion.div>

        {/* duration */}
        <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur px-2 py-0.5 text-xs rounded-md text-white">
          {parseFloat(duration || 0).toFixed(2)}
        </span>
      </div>

      {/* INFO */}
      <div className="p-4 flex justify-between gap-3">

        {/* content */}
        <div className="flex gap-3 w-full">

          {owner && (
            <div
              onClick={navigateToChannelDashboard}
              className="w-10 h-10 rounded-full overflow-hidden border border-white/20 hover:scale-105 transition shrink-0"
            >
              <img src={owner.avatar} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-col w-full" onClick={handlePlayVideo}>
            <h3 className="font-semibold text-gray-100 leading-tight line-clamp-2 group-hover:text-indigo-400 transition">
              {title}
            </h3>
            <p className="text-sm text-gray-400 hover:text-gray-200 transition">
              {owner?.username}
            </p>
            <p className="text-xs text-gray-500">
              {views} views • {uploadTime}
            </p>
          </div>
        </div>

        {/* menu */}
        <button
          onClick={toggleMenu}
          className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"
        >
          <i className="ri-more-2-line text-gray-300" />
        </button>
      </div>

      {/* MENU */}
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

      {/* PLAYLIST MODAL HOOK */}
      <div className="hidden">
        <AddToPlaylist videoId={videoId} />
      </div>
    </motion.div>
  );
}

export default VideoCard;