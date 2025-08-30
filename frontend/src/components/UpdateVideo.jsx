import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

function UpdateVideo() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const [vdoDets, setVdoDets] = useState({
        title: "",
        description: "",
        thumbnail: null,
    });

    useEffect(() => {
        async function prevDets() {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/videos/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setVdoDets({
                ...vdoDets,
                title: res.data.data.title,
                description: res.data.data.description,
            });
            console.log(res.data.data);
        }
        prevDets();
    }, [id]);

    const [fileName, setFileName] = useState("No File Chosen");

    const handleThumbnailUpload = (e) => {
        setFileName(e.target.files[0].name);
        setVdoDets({ ...vdoDets, thumbnail: e.target.files[0] });
    };

    const handleTextChange = (e) => {
        setVdoDets({ ...vdoDets, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("newTitle", vdoDets.title);
            formData.append("newDescription", vdoDets.description);
            if (vdoDets.thumbnail) formData.append("thumbnail", vdoDets.thumbnail);

            const token = localStorage.getItem("accessToken");
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/videos/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Update Video Success :: ", response.data);
            setLoading(false);
            navigate("/your-videos");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="min-h-screen w-full flex-1 flex flex-col items-center bg-gray-900 text-white p-6">
            {loading ? (
            <div className="flex items-center justify-center h-full text-lg text-gray-300">
                Updating Video...
            </div>
            ) : ( <>
                <h1 className="text-3xl font-bold my-6 text-blue-400">Update Video</h1>
                <form onSubmit={handleFormSubmit}
                className="flex flex-col gap-6 bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg"
                >
                    <div>
                        <label className="text-gray-300 font-medium">Title</label>
                        <input
                        name="title"
                        type="text"
                        required
                        value={vdoDets.title}
                        onChange={handleTextChange}
                        className="mt-2 w-full py-2 px-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 font-medium">Description</label>
                        <textarea
                        name="description"
                        rows="4"
                        value={vdoDets.description}
                        onChange={handleTextChange}
                        className="mt-2 w-full py-2 px-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300 font-medium">Thumbnail</label>
                        <div className="mt-2 flex items-center gap-4">
                        <input
                            name="thumbnail"
                            id="thumbnail"
                            type="file"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                        />
                        <label
                            htmlFor="thumbnail"
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >Choose File
                        </label>
                        <p className="text-gray-400">{fileName}</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
                    >
                        Update
                    </button>
                </form>
            </>)}
        </div>
    )}

export default UpdateVideo