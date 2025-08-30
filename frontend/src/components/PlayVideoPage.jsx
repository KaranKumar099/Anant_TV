import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

function PlayVideoPage() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const {user} = useAuth()

    useEffect(() => {
        const fetchSubscriptions = async () => {
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
                console.log("subscriptions", res.data.data)
            } catch (err) {
                console.error("Error fetching subscriptions:", err);
            }
        }
        
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
                console.log("video : ", response.data.data)
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

        const fetchLikedVideos = async ()=>{
            if (!user?._id) return;
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/likes/videos`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setLikedVideos(res.data.data);
                console.log("liked videos", res.data.data)
            } catch (err) {
                console.error("Error fetching liked videos:", err);
            }
        }

        fetchVideo();
        fetchSubscriptions();
        fetchLikedVideos();
    }, [videoId, user]);

    const [isSubscribed, setIsSubscribed] = useState(false);
    useEffect(() => {
        const checkSubscription = () => {
            if (!video?.owner?._id || !subscriptions) return;

            const subscribed = subscriptions.some(
                (item) => item.channel._id === video.owner._id
            );

            setIsSubscribed(subscribed);
            console.log("Subscribed? ", subscribed);
        };

        checkSubscription();
    }, [video, subscriptions]);

    const [subsCount, setSubsCount]= useState(null)
    useEffect(()=>{
        if(!video) return; 
        const fetchSubsCount= async ()=>{
            try {
                const token=localStorage.getItem("accessToken")
                const res= await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/subscriptions/c/${video?.owner._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSubsCount(res.data.data.length)
            } catch (error) {
                console.error(error)
            }
        }
        fetchSubsCount()
    },[video])

    const toggleSubscription= async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/subscriptions/c/${video?.owner._id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            )
            console.log(res.data)
            setIsSubscribed((prev) => !prev);
        } catch (error) {
            console.error(error)
        }
    }

    const [isLiked, setIsLiked]= useState(null)
    useEffect(() => {
        const checkLikedVideos = () => {
            if (!video || likedVideos.length==0) return;

            const liked = likedVideos.some(
                (item) => item.likedBy === video._id
            );

            setIsLiked(liked);
            console.log("liked? ", liked);
        };
        checkLikedVideos();
    }, [video, likedVideos]);

    const [likesCount, setLikesCount]= useState(null)
    useEffect(()=>{
        if(!video) return; 
        const fetchLikesCount= async ()=>{
            try {
                const token=localStorage.getItem("accessToken")
                const res= await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/likes/videos/${videoId}/likesCount`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setLikesCount(res.data.data)
            } catch (error) {
                console.error("video likes count fetching error ",error)
            }
        }
        fetchLikesCount()
    },[video])

    const toggleLike= async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/likes/toggle/v/${videoId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
            )
            console.log(res.data)
            setIsLiked((prev) => !prev);
        } catch (error) {
            console.error(error)
        }
    }

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
                            <p className="text-gray-400 text-sm">{subsCount} subscribers</p>
                        </div>
                            <button onClick={toggleSubscription}
                                className={`px-4 py-2 rounded-md transition-colors ${
                                    isSubscribed
                                    ? "bg-gray-300/10 text-gray-200 hover:bg-gray-400"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}>{isSubscribed ? "Subscribed" : "Subscribe"}
                            </button>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#272727] hover:bg-[#3d3d3d] rounded-full" onClick={toggleLike}>
                            <i className={isLiked ? "ri-heart-3-fill pr-2" : "ri-heart-3-line pr-2"}></i>{likesCount}
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
