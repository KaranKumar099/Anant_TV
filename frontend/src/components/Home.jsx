import axios from "axios";
import { useState, useEffect } from "react";
import { VideoCard } from "../index.js";
import { motion } from "framer-motion";

function Home2() {
  const [videos, setVideos] = useState([]);
  const [featured, setFeatured] = useState([]);

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
    <div className="h-screen w-full bg-gradient-to-b from-[#0b0f19] via-[#0a0d2c] to-[#0b0f19] text-gray-100 flex gap-8 p-6 overflow-hidden">

    {/* LEFT FEED — scrollable */}
    <div className="w-full lg:w-3/4 h-full overflow-y-auto pr-2 custom-scroll">
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
        className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
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
    <div className="hidden lg:flex w-1/4 h-full flex-col">
      <aside className="sticky top-3">
        <h2 className="text-xl font-semibold mb-4 text-indigo-300">
          Featured Live
        </h2>
        <div className="space-y-4">
          {featured.map((live) => (
            <motion.div
              key={live._id}
              whileHover={{ scale: 1.01 }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-400/40 shadow-lg cursor-pointer"
            >
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <img
                  src={live.thumbnail}
                  className="w-full h-full object-cover"
                  alt={live.title}
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                  LIVE
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-gray-200 line-clamp-2">
                {live.title}
              </p>

              <p className="text-xs text-gray-400">
                {live?.owner?.username || "Channel"}
              </p>
            </motion.div>
          ))}
        </div>
      </aside>
    </div>
  </div>
);

}

export default Home2;
