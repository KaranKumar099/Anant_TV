import axios from "axios";
import React, { useState } from "react";
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
                "http://localhost:8000/api/v1/playlist/",
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
        <div className="h-full w-full flex-1 flex flex-col items-center">
            <h1 className="text-2xl font-bold my-5">Create Playlist</h1>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                <div>
                    <label>Name</label>
                    <br />
                    <input
                        name="name"
                        type="text"
                        required
                        value={playlistDets.name}
                        onChange={handleChange}
                        className="py-1 px-2 w-md outline mt-1"
                    />
                </div>
                <div>
                    <label>Description</label>
                    <br />
                    <textarea
                        name="description"
                        rows="4"
                        value={playlistDets.description}
                        onChange={handleChange}
                        className="py-1 px-2 w-md outline mt-1"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="p-2 cursor-pointer text-white px-4 py-2 rounded bg-blue-500 transition"
                >
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreatePlaylist;
