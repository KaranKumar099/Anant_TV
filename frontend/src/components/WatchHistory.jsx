import { useState, useEffect } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";

const WatchHistory = () => {
    const [history, setHistory] = useState([]);
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    "http://localhost:8000/api/v1/watch-history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log(response.data.data);
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
            const res = await axios.delete(
                `http://localhost:8000/api/v1/watch-history/${videoId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(res.data);
            setHistory(history.filter((item) => item.video._id !== videoId));
        } catch (error) {
            console.error(error);
        }
    };

    const clearAllHistory = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.delete(
                `http://localhost:8000/api/v1/watch-history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(res.data);
            setHistory([]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 p-4">
                <h1 className="text-xl font-bold mb-4">Watch History</h1>
                <div className="flex flex-col space-y-4">
                    {history
                        .slice()
                        .reverse()
                        .map((item) => (
                            <div
                                key={item._id}
                                className="flex items-start gap-2 group hover:bg-gray-300 transition-colors duration-400 cursor-pointer"
                            >
                                <div className="relative w-60 h-36 flex-shrink-0">
                                    <img
                                        src={item.video?.thumbnail}
                                        alt={item.video?.title}
                                        className="w-full h-full object-cover rounded"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 rounded">
                                        {item.video.duration.slice(0, 4)}
                                    </span>
                                </div>

                                <div className="flex flex-col flex-1 p-1">
                                    <h2 className="text-lg font-semibold line-clamp-2">
                                        {item.video?.title}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {item.video?.owner.username} •{" "}
                                        {item.video?.views} views
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {item.video?.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeFromHistory(item._id)}
                                    className="opacity-0 mr-4 mt-3 rounded-full text-gray-500 group-hover:opacity-100 hover:text-black hover:bg-gray-100 cursor-pointer"
                                >
                                    <i className="ri-close-large-line"></i>
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            <div className="w-xs border-l p-4 space-y-4 text-sm">
                <input
                    type="text"
                    placeholder="Search watch history"
                    className="w-full border p-2 rounded text-sm"
                />
                <button
                    className="flex items-center gap-2 hover:bg-gray-100 w-full p-2 rounded"
                    onClick={clearAllHistory}
                >
                    <i className="ri-delete-bin-6-line"></i> Clear all watch
                    history
                </button>
                <button className="flex items-center gap-2 hover:bg-gray-100 w-full p-2 rounded">
                    <i className="ri-pause-circle-line"></i> Pause watch history
                </button>
                <button className="flex items-center gap-2 hover:bg-gray-100 w-full p-2 rounded">
                    <i className="ri-settings-3-line"></i> Manage all history
                </button>
            </div>
        </div>
    );
};

export default WatchHistory;
