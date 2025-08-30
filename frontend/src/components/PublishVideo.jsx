import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function PublishVideo() {
    const [fileNames, setFileNames] = useState({
        thumbnail: "No File Chosen",
        videoFile: "No File Chosen",
    });

    const [vdoDets, setVdoDets] = useState({
        title: "",
        description: "",
        thumbnail: File,
        videoFile: File,
    });

    const handleVideoFileUpload = (e) => {
        setFileNames({ ...fileNames, videoFile: e.target.files[0].name });
        setVdoDets({ ...vdoDets, videoFile: e.target.files[0] });
    };

    const handleThumbnailUpload = (e) => {
        setFileNames({ ...fileNames, thumbnail: e.target.files[0].name });
        setVdoDets({ ...vdoDets, thumbnail: e.target.files[0] });
    };

    const handleTextChange = (e) => {
        setVdoDets({ ...vdoDets, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", vdoDets.title);
            formData.append("description", vdoDets.description);
            formData.append("thumbnail", vdoDets.thumbnail);
            formData.append("videoFile", vdoDets.videoFile);

            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/videos/`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Publish Video Success :: ", response.data);
            navigate("/your-videos");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-full w-full flex-1 flex flex-col items-center bg-gray-900 text-white py-8 px-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">
                Publish Video
            </h1>
            <form
                className="flex flex-col gap-6 bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg"
                onSubmit={handleFormSubmit}
            >
                {/* Title */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        value={vdoDets.title}
                        onChange={handleTextChange}
                        className="py-2 px-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label className="mb-1 font-medium">Description</label>
                    <textarea
                        name="description"
                        rows="4"
                        value={vdoDets.description}
                        onChange={handleTextChange}
                        className="py-2 px-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>

                {/* Thumbnail Upload */}
                <div>
                    <h2 className="font-medium mb-2">Thumbnail</h2>
                    <div className="flex justify-between items-center gap-4">
                        <input
                            name="thumbnail"
                            id="thumbnail"
                            type="file"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                        />
                        <label
                            htmlFor="thumbnail"
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white font-medium"
                        >
                            Choose File
                        </label>
                        <p className="text-sm text-gray-400 truncate">
                            {fileNames.thumbnail}
                        </p>
                    </div>
                </div>

                {/* Video File Upload */}
                <div>
                    <h2 className="font-medium mb-2">Video File</h2>
                    <div className="flex justify-between items-center gap-4">
                        <input
                            name="videoFile"
                            id="videoFile"
                            type="file"
                            required
                            className="hidden"
                            onChange={handleVideoFileUpload}
                        />
                        <label
                            htmlFor="videoFile"
                            className="cursor-pointer bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-white font-medium"
                        >
                            Choose File
                        </label>
                        <p className="text-sm text-gray-400 truncate">
                            {fileNames.videoFile}
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 w-full py-2 rounded-lg bg-green-600 hover:bg-green-700 transition font-semibold"
                >
                    Publish
                </button>
            </form>
        </div>
    );
}

export default PublishVideo;
