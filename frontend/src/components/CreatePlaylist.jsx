import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function CreatePlaylist() {
    const [playlistDets, setPlaylistDets] = useState({
        name: "",
        description: "",
    });

    const handleChange = (e) => {
        setPlaylistDets({ ...playlistDets, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/playlist/`,
                playlistDets,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Create Playlist Success :: ", response.data);
            if (response) {
                navigate("/playlists");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white px-4">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">Create Playlist</h1>
            
            <form 
                className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5"
                onSubmit={handleFormSubmit}
            >
                <div>
                    <label className="block text-gray-300 font-medium">Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        value={playlistDets.name}
                        onChange={handleChange}
                        className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter playlist name"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 font-medium">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={playlistDets.description}
                        onChange={handleChange}
                        className="mt-2 w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter playlist description"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors font-semibold shadow-md"
                >
                    Create Playlist
                </button>
            </form>
        </div>
    );
}

export default CreatePlaylist;
