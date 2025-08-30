import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

function PlayVideoPage() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/videos/${videoId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                setVideo(response.data.data);

                // increment views
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/videos/${videoId}/view`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // add to watch history
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/watch-history/add`,
                    { videoId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };
        fetchVideo();
    }, [videoId]);

    const suggestedVideos = [
        {
            thumbnail: "https://via.placeholder.com/200x120",
            title: "Among Us with Tanmay Bhat, GamerFleet, Karan Singh",
            channel: "Samay Raina",
            views: "2.5M views",
            time: "Streamed 4 years ago",
        },
        {
            thumbnail: "https://via.placeholder.com/200x120",
            title: "Boss RUN, LET'S FINISH THE GAME",
            channel: "Rickson Satrio",
            views: "2M views",
            time: "3 years ago",
        },
    ];

    return (
        <div className="flex gap-6 p-4 bg-gradient-to-l from-gray-950 to-gray-900 text-white min-h-screen">
            <div className="flex-1">
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                    <video src={video?.videoFile} controls autoPlay className="w-full h-full"></video>
                </div>

                <h1 className="text-2xl font-bold mt-4">{video?.title}</h1>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={video?.owner.avatar}
                            alt="channel"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className="font-semibold">{video?.owner.username}</h2>
                            <p className="text-gray-400 text-sm">3.79M subscribers</p>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full font-semibold text-white">
                            Subscribe
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#272727] hover:bg-[#3d3d3d] rounded-full">
                            <i className="ri-thumb-up-line"></i> 157K
                        </button>
                        <button className="px-4 py-2 bg-[#272727] hover:bg-[#3d3d3d] rounded-full">
                            Share
                        </button>
                        <button className="px-4 py-2 bg-[#272727] hover:bg-[#3d3d3d] rounded-full">
                            Download
                        </button>
                    </div>
                </div>

                <p className="text-gray-400 text-sm mt-4">
                    {video?.views} views · {video?.createdAt?.substr(0, 10)}
                </p>
            </div>

            <div className="w-[350px]">
                <h3 className="font-semibold mb-4 text-lg">Suggested Videos</h3>
                {suggestedVideos.map((video, index) => (
                    <div
                        key={index}
                        className="flex gap-3 mb-4 hover:bg-[#1a1a1a] p-2 rounded-lg cursor-pointer transition"
                    >
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-40 h-24 rounded-lg object-cover"
                        />
                        <div className="flex flex-col">
                            <h4 className="font-semibold line-clamp-2">{video.title}</h4>
                            <p className="text-sm text-gray-400">{video.channel}</p>
                            <p className="text-sm text-gray-400">
                                {video.views} · {video.time}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlayVideoPage;
