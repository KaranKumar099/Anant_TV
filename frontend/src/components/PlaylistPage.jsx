import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const PlaylistPage = () => {
    const { playlistId } = useParams();

    const [playlistDets, setPlaylistDets] = useState({
        name: "",
        description: "",
        channel: "",
        videosCount: 0,
    });
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `http://localhost:8000/api/v1/playlist/${playlistId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log(response.data.data);
                setPlaylistDets({
                    name: response.data.data.name,
                    description: response.data.data.description,
                    channel: response.data.data.owner.username,
                    videosCount: response.data.data.videos.length,
                });
                setVideos(response.data.data.videos);
            } catch (error) {
                console.error(error);
            }
        }
        fetchVideos();
    }, []);

    const handleClick = (e) => {
        const card = e.target.closest(".main"); // find the current card container
        console.log(card);
        const modal = card.querySelector(".more-options-modal");
        console.log(modal);
        if (modal.style.display === "flex") {
            modal.style.display = "none";
        } else {
            modal.style.display = "flex";
        }
    };

    const removeVideoHandler = async (videoId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.patch(
                `http://localhost:8000/api/v1/playlist/remove/${videoId}/${playlistId}`,
                { playlistId, videoId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4">
            <div className="lg:w-1/3 bg-gradient-to-b from-gray-800 to-yellow-800 rounded-lg overflow-hidden">
                <img
                    src={videos[0]?.thumbnail}
                    alt="Playlist Thumbnail"
                    className="w-full h-90 object-cover p-4"
                />
                <div className="p-4 text-white">
                    <h1 className="text-2xl font-bold">{playlistDets.name}</h1>
                    <p className="mt-1">by {playlistDets.channel}</p>
                    <p className="text-sm opacity-80">
                        Playlist • {playlistDets.videosCount} videos
                    </p>
                    <p className="text-sm opacity-80 text-justify">
                        {playlistDets.description}
                    </p>

                    <div className="mt-4 flex gap-3">
                        <button className="bg-white text-black font-semibold px-4 py-2 rounded">
                            ▶ Play all
                        </button>
                        <button className="bg-gray-700 px-3 py-2 rounded">
                            add
                        </button>
                        <button className="bg-gray-700 px-3 py-2 rounded">
                            ↪
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                {videos.map((video) => (
                    <div
                        key={video._id}
                        className="main relative flex gap-3 mb-2 border-b py-1 hover:bg-gray-300 transition-colors duration-400 cursor-pointer"
                    >
                        <div className="relative">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-60 h-28 object-cover rounded"
                            />
                            <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
                                {parseFloat(video.duration).toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full">
                            <h3 className="font-semibold text-lg">
                                {video.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {video.owner.username}
                            </p>
                            <p className="text-sm text-gray-500">
                                {video.views} views •{" "}
                                {video.createdAt.substr(0, 10)}
                            </p>
                        </div>
                        <button
                            className="cursor-pointer rounded-full h-8 w-11 hover:bg-gray-300 transition-colors duration-500"
                            onClick={handleClick}
                        >
                            <i className="ri-more-2-line"></i>
                        </button>
                        <div className="more-options-modal absolute right-5 top-8 z-10 flex-col items-start bg-gray-300 w-[14rem] rounded-lg overflow-hidden hidden">
                            <div
                                className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300"
                                onClick={() => removeVideoHandler(video._id)}
                            >
                                <button className="cursor-pointer">
                                    Remove from Playlist
                                </button>
                            </div>
                            <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300">
                                <button className="cursor-pointer">
                                    Move to Top
                                </button>
                            </div>
                            <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300">
                                <button className="cursor-pointer">
                                    Move to Bottom
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistPage;
