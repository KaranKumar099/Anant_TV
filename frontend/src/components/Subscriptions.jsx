import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

function Subscriptions() {
    const { user } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        async function fetchSubscriptions() {
            if (!user?._id) return;
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `http://localhost:8000/api/v1/subscriptions/u/${user._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log("subscriptions : ", res.data);
                setSubscriptions(res.data.data);
            } catch (err) {
                console.error("Error fetching subscriptions:", err);
            }
        }
        fetchSubscriptions();
    }, [user]);

    const navigate = useNavigate();
    const navigateToChannelDashboard = (owner) => {
        navigate(`/channel-dashboard/${owner.username}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {subscriptions.map((channel) => (
                    <div
                        key={channel.channel._id}
                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                    >
                        <img
                            src={channel.channel.avatar}
                            alt={channel.channel.username}
                            className="w-24 h-24 rounded-full mx-auto"
                        />
                        <h2 className="text-lg font-semibold text-center mt-3">
                            {channel.channel.username}
                        </h2>
                        <p className="text-gray-500 text-sm text-center">
                            {/* {channel.subscribers} */}51K
                        </p>
                        <button
                            className="mt-4 block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
              text-sm py-1 rounded"
                            onClick={() =>
                                navigateToChannelDashboard(channel.channel)
                            }
                        >
                            View Channel
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Subscriptions;
