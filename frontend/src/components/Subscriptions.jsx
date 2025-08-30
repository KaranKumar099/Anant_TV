import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

function Subscriptions() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSubscriptions() {
            if (!user?._id) return;
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/subscriptions/u/${user._id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setSubscriptions(res.data.data);
            } catch (err) {
                console.error("Error fetching subscriptions:", err);
            }
        }
        fetchSubscriptions();
    }, [user]);

    const navigateToChannelDashboard = (owner) => {
        navigate(`/channel-dashboard/${owner.username}`);
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-center mb-8"
            >
                Subscriptions
            </motion.h1>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subscriptions.map((channel) => (
                    <motion.div
                        key={channel.channel._id}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="bg-gray-800 rounded-xl shadow-md hover:shadow-indigo-600/40 p-4 flex flex-col items-center transition-shadow duration-300 cursor-pointer"
                    >
                        <img
                            src={channel.channel.avatar}
                            alt={channel.channel.username}
                            className="w-26 h-26 rounded-full shadow-md"
                        />
                        <h2 className="text-lg font-semibold text-center mt-3">
                            {channel.channel.username}
                        </h2>
                        <p className="text-gray-400 text-sm text-center">
                            51K Subscribers
                        </p>
                        <button
                            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-1 rounded transition-colors duration-300"
                            onClick={() =>
                                navigateToChannelDashboard(channel.channel)
                            }
                        >
                            View Channel
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
