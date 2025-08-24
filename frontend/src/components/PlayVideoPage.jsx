import React, { useEffect, useState } from "react";
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
                    `http://localhost:8000/api/v1/videos/${videoId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                // console.log(response.data.data)
                setVideo(response.data.data);

                // increment views after fetching
                await axios.post(
                    `http://localhost:8000/api/v1/videos/${videoId}/view`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                // add video to history
                await axios.post(
                    `http://localhost:8000/api/v1/watch-history/add`,
                    { videoId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
            } catch (error) {
                console.error("Videos Fetching error :: ", error.message);
            }
        };
        fetchVideo();
    }, [videoId]);

    // useEffect(()=>{
    //     const incrementViews = async () => {
    //       try {
    //           const token=localStorage.getItem("accessToken")
    //           const response= await axios.post(`http://localhost:8000/api/v1/videos/${videoId}/view`,
    //             {videoId},
    //             {
    //                 headers:{
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //                 withCredentials: true
    //             }
    //           )
    //           console.log(response.data)
    //       } catch (error) {
    //         console.error("Error in incrementing views :: ",error.message)
    //       }
    //     }
    //     incrementViews()

    //     const addVideoToHistory = async () => {
    //         try {
    //           const token=localStorage.getItem("accessToken")
    //           const response= await axios.post(`http://localhost:8000/api/v1/watch-history/add`,
    //             {videoId},
    //             {
    //                 headers:{
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //                 withCredentials: true
    //             }
    //           )
    //           // console.log(response.data)
    //         } catch (error) {
    //           console.error("Error in adding video to Watch History :: ",error.message)
    //         }
    //     }
    //     addVideoToHistory()
    // },[video])

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
        <div className="flex gap-4 p-4 bg-white">
            <div className="flex-1">
                <div className="w-full aspect-video bg-black">
                    <video src={video?.videoFile} controls autoPlay></video>
                </div>
                <h1 className="text-xl font-bold mt-3">{video?.title}</h1>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={video?.owner.avatar}
                            alt="channel"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <h2 className="font-semibold">
                                {video?.owner.username}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                3.79M subscribers
                            </p>
                        </div>
                        <button className="ml-4 px-4 py-2 bg-black text-white rounded-full font-semibold">
                            Subscribe
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-gray-200 rounded-full">
                            👍 157K
                        </button>
                        <button className="px-4 py-2 bg-gray-200 rounded-full">
                            Share
                        </button>
                        <button className="px-4 py-2 bg-gray-200 rounded-full">
                            Download
                        </button>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mt-4">
                    {video?.views} views · {video?.createdAt.substr(0, 10)}
                </p>
            </div>

            <div className="w-[350px]">
                <h3 className="font-semibold mb-3">Suggested Videos</h3>
                {suggestedVideos.map((video, index) => (
                    <div key={index} className="flex gap-3 mb-3">
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-40 h-24 rounded-lg object-cover"
                        />
                        <div>
                            <h4 className="font-semibold line-clamp-2">
                                {video.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                                {video.channel}
                            </p>
                            <p className="text-sm text-gray-500">
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
