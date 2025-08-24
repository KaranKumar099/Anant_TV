import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import VideoCard from "../Cards/VideoCard";

function ChannelDashboard() {
    const { username } = useParams();
    const [channelDets, setChannelDets] = useState(null);
    const [videos, setVideos] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [current, setCurrent] = useState("videos");

    useEffect(() => {
        const fetchChannelDets = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `http://localhost:8000/api/v1/users/c/${username}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log(res.data.data);
                setChannelDets(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchChannelDets();
    }, []);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                if (!channelDets?._id) return;
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `http://localhost:8000/api/v1/videos?userId=${channelDets._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log(res.data.data.data);
                setVideos(res.data.data.data);
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };
        fetchVideos();

        const fetchPlaylists = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                console.log(user?.data?._id);
                const response = await axios.get(
                    `http://localhost:8000/api/v1/playlist/user/${channelDets._id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                // console.log("playlists : ",response.data.data)
                setPlaylists(response.data.data);
            } catch (error) {
                console.error("Playlists Fetching error :: ", error.message);
            }
        };
        fetchPlaylists();
    }, [channelDets]);

    return (
        <div className="flex flex-col w-full">
            {channelDets ? (
                <>
                    <div className="w-full h-56 p-4 pb-0 overflow-hidden">
                        <img
                            src={channelDets?.coverImage}
                            alt="Channel Banner"
                            className="w-full h-[95%] object-cover rounded-xl"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
                        <div className="w-40 h-40">
                            <img
                                src={channelDets?.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border border-gray-300"
                            />
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">
                                {channelDets?.username}
                            </h1>
                            <p className="text-sm text-gray-500">
                                @{channelDets?.fullName} •{" "}
                                {channelDets?.subscribersCount} subscribers •{" "}
                                {videos?.length} videos
                            </p>
                            <p className="mt-2 text-gray-700">
                                description 2 to 3 line
                            </p>
                            <a
                                href="#"
                                className="text-blue-600 text-sm hover:underline"
                            >
                                More info link
                            </a>
                            <div className="flex gap-3 mt-3">
                                <button className="px-4 py-2 bg-black text-white rounded-md cursor-pointer">
                                    Subscribe
                                </button>
                                <button className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-200 mt-4 px-4 overflow-x-auto">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                current === "videos"
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-600 hover:text-black"
                            }`}
                            name="videos"
                            onClick={(e) => setCurrent(e.target.name)}
                        >
                            Videos
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                current === "playlists"
                                    ? "text-black border-b-2 border-black"
                                    : "text-gray-600 hover:text-black"
                            }`}
                            name="playlists"
                            onClick={(e) => setCurrent(e.target.name)}
                        >
                            Playlists
                        </button>
                    </div>

                    <div className="flex gap-x-4 gap-y-8 flex-wrap p-4">
                        {current === "videos"
                            ? videos?.map((item) => (
                                  <VideoCard
                                      key={item._id}
                                      title={item.title}
                                      thumbnail={item.thumbnail}
                                      views={item.views}
                                      uploaded={item.createdAt.substr(0, 10)}
                                      buttons={false}
                                      videoId={item._id}
                                  />
                              ))
                            : playlists?.map((item) => (
                                  <PlaylistCard
                                      key={item._id}
                                      thumbnail={item?.videos?.[0]?.thumbnail}
                                      playlistName={item.name}
                                      vdoCount={item.videos?.length}
                                      updated={item.updatedAt.substr(0, 10)}
                                      playlistId={item._id}
                                  />
                              ))}
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}

export default ChannelDashboard;
