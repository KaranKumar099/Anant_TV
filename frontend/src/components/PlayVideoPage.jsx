import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

function PlayVideoPage() {
    const { videoId } = useParams();
    const [video, setVideo] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [likedVideos, setLikedVideos] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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

        const fetchComments = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/comments/${videoId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // The backend might return comments with user data populated
                setComments(res.data.data.docs || res.data.data);
            } catch (error) {
                console.error("Comments fetching error", error);
            }
        };

        fetchVideo();
        fetchSubscriptions();
        fetchLikedVideos();
        fetchComments();
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

            // Locally update the subscriber count for immediate feedback
            if (isSubscribed) {
                setSubsCount((prev) => Math.max(0, prev - 1));
            } else {
                setSubsCount((prev) => (prev || 0) + 1);
            }

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
            
            // Locally update the like count for immediate feedback
            if (isLiked) {
                setLikesCount((prev) => Math.max(0, prev - 1));
            } else {
                setLikesCount((prev) => (prev || 0) + 1);
            }
            
            setIsLiked((prev) => !prev);
        } catch (error) {
            console.error(error)
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/comments/${videoId}`,
                { content: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Assuming res.data.data is the new comment object
            // We might need to refresh comments or manually add it
            // usually better to refresh to get the populated owner field if backend doesn't return it
            setComments([res.data.data, ...comments]);
            setCommentText("");
            
            // Re-fetch to get populated fields if necessary
            // fetchComments(); 
        } catch (error) {
            console.error("Error adding comment", error);
        }
    };

    const suggestedVideos = [
        {
            thumbnail: "/tron-wallpaper.jpg",
            title: "Among Us with Tanmay Bhat, GamerFleet, Karan Singh",
            channel: "Samay Raina",
            views: "2.5M views",
            time: "Streamed 4 years ago",
        },
        {
            thumbnail: "/tron-wallpaper2.jpg",
            title: "Boss RUN, LET'S FINISH THE GAME",
            channel: "Rickson Satrio",
            views: "2M views",
            time: "3 years ago",
        },
        {
            thumbnail: "/tron-wallpaper.jpg",
            title: "Among Us with Tanmay Bhat, GamerFleet, Karan Singh",
            channel: "Samay Raina",
            views: "2.5M views",
            time: "Streamed 4 years ago",
        },
        {
            thumbnail: "/tron-wallpaper2.jpg",
            title: "Boss RUN, LET'S FINISH THE GAME",
            channel: "Rickson Satrio",
            views: "2M views",
            time: "3 years ago",
        },
        {
            thumbnail: "/tron-wallpaper.jpg",
            title: "Among Us with Tanmay Bhat, GamerFleet, Karan Singh",
            channel: "Samay Raina",
            views: "2.5M views",
            time: "Streamed 4 years ago",
        },
        {
            thumbnail: "/tron-wallpaper2.jpg",
            title: "Boss RUN, LET'S FINISH THE GAME",
            channel: "Rickson Satrio",
            views: "2M views",
            time: "3 years ago",
        },
        {
            thumbnail: "/tron-wallpaper.jpg",
            title: "Among Us with Tanmay Bhat, GamerFleet, Karan Singh",
            channel: "Samay Raina",
            views: "2.5M views",
            time: "Streamed 4 years ago",
        },
        {
            thumbnail: "/tron-wallpaper2.jpg",
            title: "Boss RUN, LET'S FINISH THE GAME",
            channel: "Rickson Satrio",
            views: "2M views",
            time: "3 years ago",
        },
        {
            thumbnail: "/tron-wallpaper.jpg",
            title: "Among Us with Tanmay Bhat, GamerFleet, Karan Singh",
            channel: "Samay Raina",
            views: "2.5M views",
            time: "Streamed 4 years ago",
        },
        {
            thumbnail: "/tron-wallpaper2.jpg",
            title: "Boss RUN, LET'S FINISH THE GAME",
            channel: "Rickson Satrio",
            views: "2M views",
            time: "3 years ago",
        },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 bg-gradient-to-l from-gray-950 to-gray-900 text-white min-h-screen max-w-[1600px] mx-auto">
            <div className="flex-1">
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                    <video src={video?.videoFile} controls autoPlay className="w-full h-full"></video>
                </div>

                <h1 className="text-xl font-bold mt-4">{video?.title}</h1>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                        <Link to={`/channel-dashboard/${video?.owner.username}`} className="flex items-center gap-3 group">
                            <img
                                src={video?.owner.avatar}
                                alt="channel"
                                className="w-10 h-10 rounded-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div>
                                <h2 className="font-semibold hover:text-indigo-400 transition-colors">{video?.owner.username}</h2>
                                <p className="text-gray-400 text-sm">{subsCount} subscribers</p>
                            </div>
                        </Link>
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

                <div 
                    className={`mt-6 bg-white/5 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 group ${isDescriptionExpanded ? "h-auto" : "max-h-28 overflow-hidden"}`}
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <span>{video?.views} views</span>
                            <span className="text-gray-400">·</span>
                            <span>{video?.createdAt?.substr(0, 10)}</span>
                        </div>
                        
                        <div className={`text-sm text-gray-200 leading-relaxed transition-all ${!isDescriptionExpanded ? "line-clamp-2" : ""}`}>
                            {video?.description || "No description provided."}
                        </div>

                        {!isDescriptionExpanded && (
                            <button className="text-sm font-bold text-indigo-400 mt-1 self-start">
                                ...more
                            </button>
                        )}
                        
                        {isDescriptionExpanded && (
                            <button className="text-sm font-bold text-indigo-400 mt-4 self-start">
                                Show less
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                    <h3 className="text-xl font-bold mb-6">{comments.length} Comments</h3>
                    
                    {/* Add Comment */}
                    <div className="flex gap-4 mb-8">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold shrink-0">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <form onSubmit={handleAddComment} className="flex-1">
                            <input 
                                type="text" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-transparent border-b border-white/20 pb-2 focus:border-indigo-500 outline-none transition-colors text-sm"
                            />
                            <div className="flex justify-end mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setCommentText("")}
                                    className="px-4 py-2 hover:bg-white/10 rounded-full text-sm font-medium mr-2"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed rounded-full text-sm font-medium transition-colors"
                                >
                                    Comment
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.map((comment, index) => (
                            <div key={comment._id || index} className="flex gap-4 group">
                                <img 
                                    src={comment.owner?.avatar || "https://via.placeholder.com/40"} 
                                    alt="avatar" 
                                    className="h-10 w-10 rounded-full object-cover shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold">@{comment.owner?.username || "Anonymous"}</span>
                                        <span className="text-xs text-gray-400">{comment.createdAt?.substr(0, 10)}</span>
                                    </div>
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button className="text-xs text-gray-400 hover:text-white transition-colors">
                                            <i className="ri-thumb-up-line mr-1"></i> Like
                                        </button>
                                        <button className="text-xs text-gray-400 hover:text-white transition-colors">
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:w-[400px] w-full">
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
