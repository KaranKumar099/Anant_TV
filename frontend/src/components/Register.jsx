import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!avatar) {
      alert("Please select an avatar.");
      return;
    }

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("fullName", formData.fullName);
      data.append("password", formData.password);
      data.append("avatar", avatar);
      if (coverImage) data.append("coverImage", coverImage);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/register`,
        data
      );

      alert("Registration successful!");
      setFormData({ username: "", email: "", fullName: "", password: "" });
      setAvatar(null);
      setCoverImage(null);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed, check console for details.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <form
        onSubmit={submitHandler}
        className="bg-gray-900 border border-gray-700 shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold text-center text-white">
          Create Account 🚀
        </h1>
        <p className="text-center text-gray-400 text-sm">
          Join <span className="text-blue-400 font-semibold">AnantTV</span> today!
        </p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={changeHandler}
          className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={changeHandler}
          className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={changeHandler}
          className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={changeHandler}
          className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="avatar"
            className="cursor-pointer bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
          >
            {avatar ? `Avatar: ${avatar.name}` : "Upload Avatar"}
          </label>
          <input
            type="file"
            id="avatar"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="coverImage"
            className="cursor-pointer bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-300 hover:border-blue-400 hover:text-blue-400 transition"
          >
            {coverImage ? `Cover: ${coverImage.name}` : "Upload Cover Image"}
          </label>
          <input
            type="file"
            id="coverImage"
            accept=".png, .jpg, .jpeg"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold p-3 rounded-lg shadow-md"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;
