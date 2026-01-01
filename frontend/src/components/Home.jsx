import axios from "axios";
import { useState, useEffect } from "react";
import { PlaylistCard, VideoCard } from "../index.js";
import { motion, AnimatePresence } from "framer-motion";

function Home2() {
  const [videos, setVideos] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [rightMode, setRightMode] = useState("featured");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/videos`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setVideos(res?.data?.data?.data || []);

        // simple selection for featured (or replace with API later)
        setFeatured((res?.data?.data?.data || []).slice(0, 2));
      } catch (error) {
        console.error("Videos Fetching error :: ", error.message);
      }
    };

    fetchVideos();
  }, []);

return (
  <div className={`h-screen w-full bg-gradient-to-b from-[#0b0f19] via-[#0a0d2c] to-[#0b0f19] text-gray-100 flex ${sidebarOpen ? "lg:gap-6" : "gap-0"} p-6 overflow-hidden`}>
    {/* LEFT FEED — scrollable */}
    <div className="flex-1 h-full overflow-y-auto pr-2 custom-scroll">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 tracking-wide bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent"
      >
        Recommended For You
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`grid gap-5 sm:grid-cols-1 md:grid-cols-2 ${sidebarOpen ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}
      >
        {videos.map((item) => (
          <VideoCard
            key={item._id}
            title={item.title}
            thumbnail={item.thumbnail}
            owner={item.owner}
            duration={item.duration}
            views={item.views}
            uploaded={item.createdAt}
            buttons={false}
            videoId={item._id}
          />
        ))}
      </motion.div>
    </div>

    {/* RIGHT FEATURED — FIXED, NO SCROLL */}
    <motion.div
      className={`hidden lg:flex h-full flex-col transition-all duration-300
      ${sidebarOpen ? "w-1/4" : "w-0 min-w-0 overflow-hidden pointer-events-none"}`}
    >
      {/* COLLAPSE TOGGLE */}
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="self-end mb-2 px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-gray-200 hover:bg-white/15 transition"
      >
        {sidebarOpen ? "Collapse" : "Expand"}
      </button>

      {sidebarOpen && (
        <motion.aside
          key="panel"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
          className="h-full bg-gray-900/70 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-xl"
        >
          {/* DROPDOWN */}
          <select
            value={rightMode}
            onChange={(e) => setRightMode(e.target.value)}
            className="w-full mb-4 bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="featured">Featured Live</option>
            <option value="watchlist">Watchlist</option>
            <option value="downloads">Downloads</option>
            <option value="playlists">Playlists</option>
          </select>
          {/* DYNAMIC CONTENT */}
          <div className="space-y-4 overflow-y-auto pr-1 custom-scroll">
            {rightMode === "featured" && (
              <>
                <h2 className="text-lg font-semibold text-indigo-300">Featured Live</h2>
                {featured.map((live) => (
                  <motion.div
                    key={live._id}
                    whileHover={{ scale: 1.01 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-400/40 shadow-lg"
                  >
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <img src={live.thumbnail} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                        LIVE
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-200 line-clamp-2">{live.title}</p>
                  </motion.div>
                ))}
              </>
            )}
            {rightMode === "watchlist" && (
              <h2 className="text-indigo-300 text-lg font-semibold">Watchlist</h2>
            )}
            {rightMode === "downloads" && (
              <h2 className="text-indigo-300 text-lg font-semibold">Downloads</h2>
            )}
            {rightMode === "playlists" && (
              <h2 className="text-indigo-300 text-lg font-semibold">Playlists</h2>
            )}
          </div>
        </motion.aside>
      )}

      {/* <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="panel"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="h-full bg-gray-900/70 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-xl"
          >
            <select
              value={rightMode}
              onChange={(e) => setRightMode(e.target.value)}
              className="w-full mb-4 bg-white/10 border border-white/20 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="featured">Featured Live</option>
              <option value="watchlist">Watchlist</option>
              <option value="downloads">Downloads</option>
              <option value="playlists">Playlists</option>
            </select>

            <div className="space-y-4 overflow-y-auto pr-1 custom-scroll">

              {rightMode === "featured" && (
                <>
                  <h2 className="text-lg font-semibold text-indigo-300">Featured Live</h2>
                  {featured.map((live) => (
                    <motion.div
                      key={live._id}
                      whileHover={{ scale: 1.01 }}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-400/40 shadow-lg"
                    >
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <img src={live.thumbnail} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                          LIVE
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-200 line-clamp-2">{live.title}</p>
                    </motion.div>
                  ))}
                </>
              )}

              {rightMode === "watchlist" && (
                <h2 className="text-indigo-300 text-lg font-semibold">Watchlist</h2>
              )}

              {rightMode === "downloads" && (
                <h2 className="text-indigo-300 text-lg font-semibold">Downloads</h2>
              )}

              {rightMode === "playlists" && (
                <h2 className="text-indigo-300 text-lg font-semibold">Playlists</h2>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence> */}
    </motion.div>

    {/* FLOATING EXPAND BUTTON — only when collapsed */}
    {!sidebarOpen && (
      <button
        onClick={() => setSidebarOpen(true)}
        className="hidden lg:flex fixed right-6 top-22 z-50 
                  px-3 py-1 rounded-lg bg-white/10 border border-white/20 
                  text-gray-200 hover:bg-white/20 backdrop-blur-xl shadow-xl 
                  transition"
      >
        Expand
      </button>
    )}

  </div>
);

}

export default Home2;
