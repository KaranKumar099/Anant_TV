import "remixicon/fonts/remixicon.css";
import axios from "axios";
import { useNavigate } from "react-router";

function PlaylistCard({
    thumbnail,
    playlistName,
    channelName,
    vdoCount,
    updated,
    playlistId,
}) {
    const handleClick = (e) => {
        const options =
            e.target.parentElement.parentElement.parentElement.nextSibling;
        console.log(options);
        if (options.style.display === "flex") {
            options.style.display = "none";
        } else {
            options.style.display = "flex";
        }
    };

    const navigate = useNavigate();
    const handleEditPlaylist = () => {
        navigate(`edit/${playlistId}`);
    };

    const handleDeletePlaylist = async () => {
        const token = localStorage.getItem("accessToken");
        const response = await axios.delete(
            `http://localhost:8000/api/v1/playlist/${playlistId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                },
            }
        );
        console.log(response.data);
    };

    const handlePlaylistClick = () => {};

    const handleViewFullPlaylistClick = () => {
        navigate(`../playlists/${playlistId}`);
    };

    return (
        <div className="relative">
            <div
                className="min-w-2xs bg-red rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={handlePlaylistClick}
            >
                <div className="relative w-full h-44">
                    <img
                        src={thumbnail}
                        alt={playlistName}
                        className="w-full h-full object-cover"
                    />
                    <h6 className="absolute bottom-2 right-2 bg-black/75 rounded py-0.5 px-1 text-white text-sm ">
                        {vdoCount} videos
                    </h6>
                </div>
                <div className="flex justify-between items-start p-4">
                    <div>
                        <h3 className="font-semibold leading-tight line-clamp-2">
                            {playlistName}
                        </h3>
                        {channelName ? (
                            <p className="text-sm text-gray-500 mt-1">
                                {channelName} • Playlist
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1">
                                Updated at {updated}
                            </p>
                        )}
                        <button
                            className="w-full text-left text-xs text-gray-500 font-bold py-2 cursor-pointer hover:text-black transition-colors duration-300"
                            onClick={handleViewFullPlaylistClick}
                        >
                            View full playlist
                        </button>
                    </div>
                    <button
                        className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-300 transition-colors duration-500"
                        onClick={handleClick}
                    >
                        <i className="ri-more-2-line"></i>
                    </button>
                </div>
            </div>
            <div className="absolute left-8/9 bottom-0 z-50 flex-col items-start bg-gray-300 w-[14rem] rounded-lg overflow-hidden hidden">
                <div
                    className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300"
                    onClick={handleEditPlaylist}
                >
                    <button className="cursor-pointer">Edit</button>
                </div>
                <div
                    className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300"
                    onClick={handleDeletePlaylist}
                >
                    <button className="cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCard;
