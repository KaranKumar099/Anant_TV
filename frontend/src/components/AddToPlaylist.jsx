import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

function AddToPlaylist({ videoId }) {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const userId = user?._id;
    useEffect(() => {
        if (!userId) return;
        const fetchPlaylists = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(
                    `http://localhost:8000/api/v1/playlist/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log(response.data.data);
                setPlaylists(response.data.data);
            } catch (error) {
                console.error("Playlists Fetching error :: ", error.message);
            }
        };
        fetchPlaylists();
    }, [user, videoId]);

    const [checked, setChecked] = useState(() =>
        Object.fromEntries(playlists.map((item) => [item._id, false]))
    );

    const toggle = (id) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const addVideoToPlaylistAction = async (playlistId) => {
        console.log("Adding video:", videoId, "to playlist:", playlistId);
        if (!videoId || !playlistId) return;
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.patch(
                `http://localhost:8000/api/v1/playlist/add/${videoId}/${playlistId}`,
                { videoId, playlistId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selected = playlists
            .filter((item) => checked[item._id])
            .map((item) => item._id);
        console.log(selected);
        if (selected.length === 0) {
            return;
        }
        selected.map(async (playlistId) => {
            await addVideoToPlaylistAction(playlistId);
        });
        e.target.parentElement.style.display = "none";
    };

    const handleExit = () => {
        const main = document.querySelector(".main");
        main.lastChild.style.display = "none";
    };

    const selectedCount = Object.values(checked).filter(Boolean).length;

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200 p-4"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    Save video to...
                </h1>
                <button className="h-6 w-6 bg-amber-200" onClick={handleExit}>
                    <i className="ri-close-large-line"></i>
                </button>
            </div>
            <div className="mt-6 space-y-3">
                {playlists.map((item) => (
                    <label
                        key={item._id}
                        htmlFor={item._id}
                        className="flex items-center gap-3 select-none rounded-xl 
            border border-slate-200 p-2 hover:border-slate-300 transition cursor-pointer"
                    >
                        <input
                            id={item._id}
                            type="checkbox"
                            checked={checked[item._id]}
                            onChange={() => toggle(item._id)}
                            className="h-4 w-4 accent-emerald-600"
                        />
                        <span className="text-slate-700">{item.name}</span>
                    </label>
                ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                    {selectedCount} selected
                </span>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium
           shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white transition focus:outline-none focus:ring-2 
           focus:ring-emerald-400"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}

export default AddToPlaylist;
