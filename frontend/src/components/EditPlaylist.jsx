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
                `http://localhost:8000/api/v1/playlist/${id}`,
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
            console.log(res.data.data);
        }
        prevDets();
    }, []);

    const handleChange = (e) => {
        setPlaylistDets({ ...playlistDets, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.patch(
                `http://localhost:8000/api/v1/playlist/${id}`,
                {
                    newName: playlistDets.name,
                    newDescription: playlistDets.description,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Edit playlist Success :: ", response.data);
            if (response) {
                navigate("/playlists");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-full w-full flex-1 flex flex-col items-center">
            <h1 className="text-2xl font-bold my-5">Edit Playlist</h1>
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
                    Edit
                </button>
            </form>
        </div>
    );
}

export default EditPlaylist;
