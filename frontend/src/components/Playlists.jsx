import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
import { PlaylistCard } from "../index.js";
import { motion } from "framer-motion";

function Playlists() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/playlist/user/${user?._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setPlaylists(response.data.data);
            } catch (error) {
                console.error("Playlists Fetching error :: ", error.message);
            }
        };
        fetchPlaylists();
    }, [user]);

    const handleCreatePlaylist = () => {
        navigate("create");
    };

    return (
        <div className="relative p-6 min-h-[92vh] w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-6"
            >
                Your Playlists
            </motion.h1>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2 flex-1">
                {playlists.map((item) => (
                    <motion.div
                        key={item._id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <PlaylistCard
                            thumbnail={item.videos[0]?.thumbnail}
                            playlistName={item.name}
                            channelName={"Karan Kumar"}
                            vdoCount={item.videos.length}
                            playlistId={item._id}
                        />
                    </motion.div>
                ))}
            </div>

            <motion.div
                className="absolute flex items-center gap-3 left-6 bottom-6 bg-indigo-600 hover:bg-indigo-500 shadow-lg p-3 pr-6 rounded-full cursor-pointer"
                whileHover={{ scale: 1.05 }}
                onClick={handleCreatePlaylist}
            >
                <div className="text-3xl h-10 w-10 bg-white rounded-full flex items-center justify-center text-indigo-600">
                    <i className="ri-add-line"></i>
                </div>
                <h2 className="font-semibold text-white">Create Playlist</h2>
            </motion.div>
        </div>
    );
}

export default Playlists;
