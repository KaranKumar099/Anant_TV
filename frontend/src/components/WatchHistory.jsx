import { useState, useEffect } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import { motion } from "framer-motion";

const WatchHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/watch-history`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setHistory(response.data.data);
            } catch (error) {
                console.error("History Fetching error :: ", error.message);
            }
        };
        fetchHistory();
    }, []);

    const removeFromHistory = async (videoId) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/watch-history/${videoId}`,
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            );
            setHistory(history.filter((item) => item.video._id !== videoId));
        } catch (error) {
            console.error(error);
        }
    };

    const clearAllHistory = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/watch-history`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            setHistory([]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-950 text-white p-6 gap-6">
            <div className="flex-1 flex flex-col gap-4">
                <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold mb-4"
                >
                Watch History
                </motion.h1>

                <div className="flex flex-col gap-4">
                {history.slice().reverse().map((item) => (
                    <motion.div
                    key={item._id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-4 bg-gray-800 rounded-xl p-3 hover:shadow-lg transition-shadow duration-300 relative group"
                    >
                    <div className="relative w-60 h-36 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                        src={item.video?.thumbnail}
                        alt={item.video?.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                        {item.video.duration.slice(0, 4)}
                        </span>
                    </div>

                    <div className="flex flex-col flex-1">
                        <h2 className="text-lg font-semibold line-clamp-2">
                        {item.video?.title}
                        </h2>
                        <p className="text-sm text-gray-400">
                        {item.video?.owner.username} • {item.video?.views} views
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {item.video?.description}
                        </p>
                    </div>

                    <button
                        onClick={() => removeFromHistory(item._id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-colors duration-300"
                    >
                        <i className="ri-close-large-line text-xl"></i>
                    </button>
                    </motion.div>
                ))}
                </div>
            </div>

            <div className="w-80 flex-shrink-0 flex flex-col gap-4 bg-gray-900 rounded-xl p-4 max-h-screen">
                <input
                type="text"
                placeholder="Search watch history"
                className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors"
                onClick={clearAllHistory}
                >
                <i className="ri-delete-bin-6-line"></i> Clear all watch history
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors">
                <i className="ri-pause-circle-line"></i> Pause watch history
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors">
                <i className="ri-settings-3-line"></i> Manage all history
                </button>
            </div>
        </div>
    );
};

export default WatchHistory;
