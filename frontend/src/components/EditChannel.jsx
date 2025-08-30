import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { div } from "framer-motion/client";

function EditChannel() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        username: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Load current channel data into form
    useEffect(() => {
        if (user?.data) {
            setFormData({
                email: user.data.email || "",
                fullName: user.data.fullName || "",
                username: user.data.username || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/update-account-details`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log(res.data);
            setMessage("✅ Channel updated successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "❌ Failed to update channel."
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[92vh] w-full bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <div className="w-md p-6 bg-gray-900 shadow-lg rounded-xl text-gray-200">
                <h2 className="text-2xl font-bold mb-5 text-center text-white">
                    Edit Channel
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Channel"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`mt-4 text-center text-sm ${
                            message.startsWith("✅")
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default EditChannel;
