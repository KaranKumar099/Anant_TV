import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { VideoCard } from "../index";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

function YourVideos() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/videos?userId=${user?._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setVideos(response.data.data.data);
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };
        fetchVideos();
    }, [user]);

    const handlePublishVideo = () => {
        navigate(`publish`);
    };

    return (
        <div className="relative p-6 flex flex-col min-h-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-6"
            >
                Your Videos
            </motion.h1>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2 flex-1">
                {videos.map((item) => (
                    <motion.div
                        key={item._id}
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="overflow-hidden rounded-xl"
                    >
                        <VideoCard
                            title={item.title}
                            thumbnail={item.thumbnail}
                            owner={item.owner}
                            views={item.views}
                            videoId={item._id}
                            uploaded={item.createdAt}
                            duration={item.duration}
                            buttons={true}
                        />
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="absolute flex items-center gap-3 left-6 bottom-6 bg-indigo-600 hover:bg-indigo-500 shadow-lg p-3 pr-6 rounded-full cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={handlePublishVideo}
            >
                <div className="text-3xl h-10 w-10 bg-white rounded-full flex items-center justify-center text-indigo-600">
                    <i className="ri-add-line"></i>
                </div>
                <h2 className="font-semibold text-white">Publish Videos</h2>
            </motion.div>
        </div>
    );
}

export default YourVideos;
