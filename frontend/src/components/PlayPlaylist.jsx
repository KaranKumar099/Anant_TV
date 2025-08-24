import { useState } from "react";

export default function PlayPlaylist() {
    const [videos] = useState([
        {
            id: 1,
            title: "ReactJS Basics Tutorial",
            channel: "CodeMaster",
            views: "1.2M views",
            uploaded: "2 weeks ago",
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        },
        {
            id: 2,
            title: "React Hooks Explained",
            channel: "CodeMaster",
            views: "850K views",
            uploaded: "1 month ago",
            thumbnail: "https://i.ytimg.com/vi/3fumBcKC6RE/hqdefault.jpg",
        },
        {
            id: 3,
            title: "Advanced React Patterns",
            channel: "CodeMaster",
            views: "600K views",
            uploaded: "2 months ago",
            thumbnail: "https://i.ytimg.com/vi/tgbNymZ7vqY/hqdefault.jpg",
        },
    ]);

    const [currentVideo, setCurrentVideo] = useState(videos[0]);

    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4">
            {/* Left Side - Video Player */}
            <div className="flex-1">
                <div className="aspect-video bg-black mb-4">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${currentVideo.thumbnail.split("/")[4]}`}
                        title={currentVideo.title}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
                <h1 className="text-xl font-bold mb-2">{currentVideo.title}</h1>
                <p className="text-sm text-gray-500">
                    {currentVideo.views} • {currentVideo.uploaded}
                </p>
            </div>

            {/* Right Side - Playlist Videos */}
            <div className="w-full lg:w-96 bg-gray-100 rounded-lg overflow-hidden flex flex-col">
                {/* Playlist Header */}
                <div className="p-4 border-b">
                    <h2 className="font-bold text-lg">ReactJS Tutorials</h2>
                    <p className="text-sm text-gray-600">
                        CodeMaster • {videos.length} videos
                    </p>
                    <button className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                        Play All
                    </button>
                </div>

                {/* Playlist Videos List */}
                <div className="overflow-y-auto flex-1">
                    {videos.map((video, index) => (
                        <div
                            key={video.id}
                            className={`flex gap-3 p-3 cursor-pointer hover:bg-gray-200 ${
                                video.id === currentVideo.id
                                    ? "bg-gray-300"
                                    : ""
                            }`}
                            onClick={() => setCurrentVideo(video)}
                        >
                            <span className="text-sm font-bold">
                                {index + 1}
                            </span>
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-32 h-20 object-cover rounded"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-semibold line-clamp-2">
                                    {video.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {video.channel}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {video.views} • {video.uploaded}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
