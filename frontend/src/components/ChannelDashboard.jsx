import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { VideoCard, PlaylistCard } from "../index";

function ChannelDashboard() {
    const { username } = useParams();
    const [channelDets, setChannelDets] = useState(null);
    const [videos, setVideos] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [current, setCurrent] = useState("videos");
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchChannelDets = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/users/c/${username}`,
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
                setChannelDets(res.data.data);
                setIsSubscribed(res.data.data.isSubscribed)
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
                    `${import.meta.env.VITE_BACKEND_URL}/videos?userId=${channelDets._id}`,
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
                setVideos(res.data.data.data);
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };

        const fetchPlaylists = async () => {
            try {
                if (!channelDets?._id) return;
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/playlist/user/${channelDets._id}`,
                    { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
                );
                setPlaylists(response.data.data);
            } catch (error) {
                console.error("Playlists Fetching error :: ", error.message);
            }
        };

        fetchVideos();
        fetchPlaylists();
    }, [channelDets]);

    const toggleSubscription= async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/subscriptions/c/${channelDets?._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            )
            console.log(res.data)
            setIsSubscribed((prev) => !prev);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col min-h-screen w-full bg-gray-900">
            {channelDets ? (
                <>
                    <div className="relative w-full h-56 p-4 pb-0 overflow-hidden group">
                        <img
                            src={channelDets?.coverImage || null}
                            alt="No Channel Cover Image"
                            className="w-full h-[95%] object-cover rounded-xl group-hover:opacity-50"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
                        <div className="w-40 h-40 relative group flex-shrink-0">
                            <img src={channelDets?.avatar} alt="Profile"
                                className="w-full h-full object-cover rounded-full border-4 border-white shadow-md
                                transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-gray-200">{channelDets?.username}</h1>
                            <p className="text-gray-400">@{channelDets?.fullName}</p>
                            <p className="text-gray-600 line-clamp-3">Your channel description goes here, 2–3 lines max.</p>
                            <a href="#" className="text-blue-600 text-sm hover:underline">More info</a>
                            <div className="flex gap-3 mt-3">
                                <button onClick={toggleSubscription}
                                className={`px-4 py-2 rounded-md transition-colors ${
                                    isSubscribed
                                    ? "bg-gray-300/10 text-gray-200 hover:bg-gray-400"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}>
                                    {isSubscribed ? "Subscribed" : "Subscribe"}
                                </button>
                                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Join</button>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4 md:mt-0">
                        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-md w-36">
                            <h1 className="text-4xl font-bold">{channelDets?.subscribersCount}</h1>
                            <p className="text-gray-600">Subscribers</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-md w-36">
                            <h1 className="text-4xl font-bold">{videos?.length}</h1>
                            <p className="text-gray-600">Videos</p>
                        </div>
                        </div>
                    </div>

                    <div className="flex border-b border-gray-200 mt-4 px-4 overflow-x-auto">
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                current === "videos"
                                    ? "text-blue-600 border-b-2 border-black"
                                    : "text-gray-600 hover:text-white"
                            }`}
                            name="videos"
                            onClick={(e) => setCurrent(e.target.name)}
                        >
                            Videos
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium ${
                                current === "playlists"
                                    ? "text-blue-600 border-b-2 border-black"
                                    : "text-gray-600 hover:text-white"
                            }`}
                            name="playlists"
                            onClick={(e) => setCurrent(e.target.name)}
                        >
                            Playlists
                        </button>
                    </div>

                    <div className="p-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                        {current === "videos"
                            ? videos?.map((item) => (
                                  <VideoCard
                                      key={item._id}
                                      title={item.title}
                                      thumbnail={item.thumbnail}
                                      views={item.views}
                                      uploaded={item.createdAt.substr(0, 10)}
                                      buttons={false}
                                      duration={item.duration}
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
