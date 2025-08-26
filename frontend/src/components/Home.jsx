import axios from "axios";
import { useState, useEffect } from "react";
import { VideoCard } from "../index.js";
import { motion } from "framer-motion";

function Home() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/videos`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                setVideos(response.data.data.data);
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };
        fetchVideos();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-6 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold mb-8 tracking-wide text-gray-100"
            >
                Recommended Videos
            </motion.h1>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
                {videos.map((item) => (
                    <motion.div
                        key={item._id}
                        whileHover={{ scale: 1.01, y: -5 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="rounded-xl shadow-lg"
                    >
                        <VideoCard
                            title={item.title}
                            thumbnail={item.thumbnail}
                            owner={item.owner}
                            duration={item.duration}
                            views={item.views}
                            uploaded={item.createdAt}
                            buttons={false}
                            videoId={item._id}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default Home;
