import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

function PublishVideo() {
    const [fileNames, setFileNames] = useState({
        thumbnail: "No File Chosen",
        videoFile: "No File Chosen",
    });

    const [vdoDets, setVdoDets] = useState({
        title: "",
        description: "",
        thumbnail: null,
        videoFile: null,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleVideoFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileNames({ ...fileNames, videoFile: file.name });
            setVdoDets({ ...vdoDets, videoFile: file });
        }
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileNames({ ...fileNames, thumbnail: file.name });
            setVdoDets({ ...vdoDets, thumbnail: file });
        }
    };

    const handleTextChange = (e) => {
        setVdoDets({ ...vdoDets, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        setProgress(0);

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
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                }
            );
            console.log("Publish Video Success :: ", response.data);
            setIsUploading(false);
            navigate("/your-videos");
        } catch (error) {
            console.error("Upload Error:", error);
            setIsUploading(false);
            alert("Upload failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center py-12 px-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Publish Video</h1>
                    <p className="text-gray-400">Share your creative content with the AnantTV community</p>
                </div>

                <form
                    className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-8"
                    onSubmit={handleFormSubmit}
                >
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Video Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            disabled={isUploading}
                            value={vdoDets.title}
                            onChange={handleTextChange}
                            placeholder="A catchy title for your video"
                            className="w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            disabled={isUploading}
                            value={vdoDets.description}
                            onChange={handleTextChange}
                            placeholder="Tell your viewers about your video..."
                            className="w-full py-3.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600 resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Thumbnail</label>
                            <label
                                htmlFor="thumbnail"
                                className={`cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-indigo-500 hover:bg-indigo-500/5 border-white/10'}`}
                            >
                                <i className="ri-image-add-line text-3xl mb-2 text-indigo-400 group-hover:scale-110 transition"></i>
                                <span className="text-sm text-gray-400 text-center truncate w-full px-2">
                                    {vdoDets.thumbnail ? fileNames.thumbnail : "Choose JPG/PNG"}
                                </span>
                                <input
                                    name="thumbnail"
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleThumbnailUpload}
                                />
                            </label>
                        </div>

                        {/* Video File Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Video File</label>
                            <label
                                htmlFor="videoFile"
                                className={`cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : 'hover:border-fuchsia-500 hover:bg-fuchsia-400/5 border-white/10'}`}
                            >
                                <i className="ri-video-add-line text-3xl mb-2 text-fuchsia-400 group-hover:scale-110 transition"></i>
                                <span className="text-sm text-gray-400 text-center truncate w-full px-2">
                                    {vdoDets.videoFile ? fileNames.videoFile : "Select MP4/MOV"}
                                </span>
                                <input
                                    name="videoFile"
                                    id="videoFile"
                                    type="file"
                                    required
                                    accept="video/*"
                                    className="hidden"
                                    onChange={handleVideoFileUpload}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isUploading}
                        className={`w-full py-4 rounded-xl font-bold transform transition active:scale-[0.98] shadow-xl ${isUploading ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white hover:from-indigo-600 hover:to-fuchsia-700 shadow-indigo-500/20'}`}
                    >
                        {isUploading ? 'Publishing...' : 'Publish Video'}
                    </button>
                </form>
            </motion.div>

            {/* UPLOAD PROGRESS OVERLAY */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
                    >
                        <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                            <i className="ri-upload-cloud-2-line text-5xl text-indigo-500 mb-4 animate-bounce inline-block"></i>
                            <h2 className="text-2xl font-bold text-white mb-2">Uploading Video</h2>
                            <p className="text-gray-400 text-sm mb-6">Please keep this page open until the upload is finished.</p>
                            
                            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden mb-3 border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                                ></motion.div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-indigo-400">{progress}%</span>
                                <span className="text-gray-500">Processing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PublishVideo;
