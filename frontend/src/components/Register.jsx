import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

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
    <div className="flex items-center justify-center min-h-screen bg-[#030712] py-12 px-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
            <p className="text-gray-400 mt-2 text-sm">Join the AnantTV creator community</p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={changeHandler}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={changeHandler}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <input
                type="text"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={changeHandler}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Profile Avatar</label>
                <label
                  htmlFor="avatar"
                  className="cursor-pointer flex items-center justify-between bg-white/5 border border-dashed border-white/20 rounded-xl p-3 text-gray-300 hover:border-indigo-400 hover:bg-indigo-400/5 transition"
                >
                  <span className="text-sm truncate pr-4">
                    {avatar ? avatar.name : "Select JPG/PNG image"}
                  </span>
                  <i className="ri-image-add-line text-xl text-indigo-400"></i>
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
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Cover Image (Optional)</label>
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer flex items-center justify-between bg-white/5 border border-dashed border-white/20 rounded-xl p-3 text-gray-300 hover:border-fuchsia-400 hover:bg-fuchsia-400/5 transition"
                >
                  <span className="text-sm truncate pr-4">
                    {coverImage ? coverImage.name : "Select banner image"}
                  </span>
                  <i className="ri-landscape-line text-xl text-fuchsia-400"></i>
                </label>
                <input
                  type="file"
                  id="coverImage"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-500/20 transform transition active:scale-[0.98] mt-2"
            >
              Register Account
            </button>

            <div className="pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
