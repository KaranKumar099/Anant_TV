import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

function EditChannel() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load current channel data into form
  useEffect(() => {
    if (user?.data) {
      setFormData({
        email: user.data.email || "",
        fullName: user.data.fullName || "",
        username: user.data.username || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token=localStorage.getItem("accessToken")
      const res = await axios.post(`http://localhost:8000/api/v1/users/update-account-details`, formData,
        {
            headers:{
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        }
      );
      console.log(res.data)
      setMessage("Channel updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update channel.");
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-xl font-bold mb-4">Edit Channel</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Channel"}
        </button>
      </form>

      {message && (
        <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}

export default EditChannel;
