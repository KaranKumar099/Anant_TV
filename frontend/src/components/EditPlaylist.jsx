import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditPlaylist() {
    const { id } = useParams();
    const [playlistDets, setPlaylistDets] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        async function prevDets() {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/playlist/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPlaylistDets({
                name: res.data.data.name,
                description: res.data.data.description,
            });
        }
        prevDets();
    }, [id]);

    const handleChange = (e) => {
        setPlaylistDets({ ...playlistDets, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/playlist/${id}`,
                {
                    newName: playlistDets.name,
                    newDescription: playlistDets.description,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response) navigate("/playlists");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-[92vh] flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <div className="bg-gray-900 text-white shadow-xl rounded-xl w-full max-w-lg p-6 border border-gray-700">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Edit Playlist Details
                </h1>
                <form className="flex flex-col gap-5" onSubmit={handleFormSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            name="name"
                            type="text"
                            required
                            value={playlistDets.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            value={playlistDets.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditPlaylist;
