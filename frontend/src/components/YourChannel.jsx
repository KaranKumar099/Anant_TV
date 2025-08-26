import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { VideoCard, PlaylistCard } from "../index"

function YourChannel() {
    const { id } = useParams();
    const { user } = useAuth();
    const [channelDets, setChannelDets] = useState(null);
    const [videos, setVideos] = useState(null);
    const [playlists, setPlaylists] = useState(null);
    const [current, setCurrent] = useState("videos");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const fetchChannelDets = async () => {
            try {
                const stats = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/dashboard/${id}/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                // console.log(stats.data.data)
                setChannelDets(stats.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchChannelDets();

        const fetchVideos = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/videos?userId=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                // console.log("videos : ",response.data.data.data)
                setVideos(response.data.data.data);
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };
        fetchVideos();

        const fetchPlaylists = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                // console.log(user?.data?._id);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/playlist/user/${id}`,
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
    }, []);

    const navigate = useNavigate();
    const handleEditChannel = () => {
        navigate("../user/channel/edit");
    };

    const handleChangeImages = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = e.target.name;
        const formData = new FormData();
        formData.append(fileName, file);

        try {
            let addressRoute = `${import.meta.env.VITE_BACKEND_URL}/users/`;
            if (fileName === "avatar") {
                addressRoute += "update-avatar";
            } else {
                addressRoute += "update-cover-image";
            }
            const token = localStorage.getItem("accessToken");
            const res = await axios.patch(addressRoute, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-gray-900">
            {user && channelDets ? (
                <>
                    <div className="relative w-full h-56 p-4 pb-0 overflow-hidden group">
                        <img
                            src={user?.coverImage}
                            alt="Channel Banner"
                            className="w-full h-[95%] object-cover rounded-xl group-hover:opacity-50"
                        />
                        <p className="absolute top-1/2 left-1/2 text-center -translate-1/2 opacity-0 group-hover:opacity-100">
                            <label
                                htmlFor="coverFile"
                                className="cursor-pointer"
                            >
                                <i className="ri-camera-line text-2xl"></i>
                                <br></br>
                                Click to Change
                            </label>
                            <input
                                type="file"
                                name="coverFile"
                                id="coverFile"
                                onChange={handleChangeImages}
                                className="hidden"
                            />
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center p-4 gap-4">
                        <div className="w-40 h-40 relative group flex-shrink-0">
                        <img
                            src={user?.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
                        />
                        <label
                            htmlFor="avatar"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white opacity-0 group-hover:opacity-100 text-center transition-opacity duration-300"
                        >
                            <i className="ri-camera-line text-2xl"></i>
                            <p className="text-xs mt-1">Change Avatar</p>
                            <input type="file" name="avatar" id="avatar" onChange={handleChangeImages} className="hidden" />
                        </label>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-gray-200">{user?.username}</h1>
                            <p className="text-gray-400">@{user?.fullName}</p>
                            <p className="text-gray-600 line-clamp-3">Your channel description goes here, 2–3 lines max.</p>
                            <a href="#" className="text-blue-600 text-sm hover:underline">More info</a>
                            <div className="flex gap-3 mt-3">
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Subscribe</button>
                                <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Join</button>
                                <button onClick={handleEditChannel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Edit</button>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4 md:mt-0">
                        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-md w-36">
                            <h1 className="text-4xl font-bold">{channelDets.subsCount}</h1>
                            <p className="text-gray-600">Subscribers</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-xl text-center shadow-md w-36">
                            <h1 className="text-4xl font-bold">{channelDets.vdoCount}</h1>
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

                    <div className="p-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

export default YourChannel;
