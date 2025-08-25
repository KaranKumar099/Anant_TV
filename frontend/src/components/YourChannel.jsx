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
        <div className="flex flex-col w-full">
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
                        <div className="w-40 h-40 relative group">
                            <img
                                src={user?.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full border border-gray-300 group-hover:opacity-25"
                            />
                            <p className="absolute top-1/2 left-1/2 text-center -translate-1/2 opacity-0 group-hover:opacity-100">
                                <label
                                    htmlFor="avatar"
                                    className="cursor-pointer"
                                >
                                    <i className="ri-camera-line text-2xl"></i>
                                    <br></br>
                                    Click to Change
                                </label>
                                <input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    onChange={handleChangeImages}
                                    className="hidden"
                                />
                            </p>
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">
                                {user?.username}
                            </h1>
                            <p className="text-sm text-gray-500">
                                @{user?.fullName}
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
                                <button
                                    className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300 transition-colors duration-500"
                                    onClick={handleEditChannel}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 text-center bg-gray-300 py-10">
                            <h1 className="text-6xl">
                                {channelDets.subsCount}
                            </h1>
                            <p>Subscribers</p>
                        </div>
                        <div className="flex-1 text-center bg-gray-300 py-10">
                            <h1 className="text-6xl">{channelDets.vdoCount}</h1>
                            <p>Videos</p>
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
