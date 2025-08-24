import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function PublishVideo() {
    const [fileNames, setFileNames] = useState({
        thumbnail: "No File Chosen",
        videoFile: "No File Chosen",
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

    const [vdoDets, setVdoDets] = useState({
        title: "",
        description: "",
        thumbnail: File,
        videoFile: File,
    });

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
                "http://localhost:8000/api/v1/videos/",
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
        <div className="h-full w-full flex-1 flex flex-col items-center">
            <h1 className="text-2xl font-bold my-5">Publish Video</h1>
            <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                <div>
                    <label>Title</label>
                    <br />
                    <input
                        name="title"
                        type="text"
                        required
                        value={vdoDets.title}
                        onChange={handleTextChange}
                        className="py-1 px-2 w-md outline mt-1"
                    />
                </div>
                <div>
                    <label>Description</label>
                    <br />
                    <textarea
                        name="description"
                        rows="4"
                        value={vdoDets.description}
                        onChange={handleTextChange}
                        className="py-1 px-2 w-md outline mt-1"
                    ></textarea>
                </div>
                <div className="my-2">
                    <h2>Thumbnail</h2>
                    <div className="mt-1 flex justify-between items-center">
                        <input
                            name="thumbnail"
                            id="thumbnail"
                            type="file"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                        />
                        <label
                            htmlFor="thumbnail"
                            className="p-2 bg-gray-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Choose File
                        </label>
                        <p>{fileNames.thumbnail}</p>
                    </div>
                </div>
                <div>
                    <h2>Video File</h2>
                    <div className="mt-1 flex justify-between items-center">
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
                            className="p-2 bg-gray-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Choose File
                        </label>
                        <p>{fileNames.videoFile}</p>
                    </div>
                </div>
                <button
                    type="submit"
                    className="p-2 cursor-pointer text-white px-4 py-2 rounded bg-blue-500 transition"
                >
                    Publish
                </button>
            </form>
        </div>
    );
}

export default PublishVideo;
