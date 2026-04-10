import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { motion } from "framer-motion";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    let navigate = useNavigate();

    const handler = async (e) => {
        e.preventDefault();
        try {
            console.log(`username: ${username}, password: ${password}, ${import.meta.env.VITE_BACKEND_URL}/users/login`)
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/login`,
                { username, password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            console.log("Login Success:", res.data);

            localStorage.setItem("accessToken", res.data.data.accessToken);
            localStorage.setItem("refreshToken", res.data.data.refreshToken);
            login(res.data.data.accessToken);
            navigate("/");
        } catch (error) {
            console.error("Login Error:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#030712] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[120px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md px-6"
            >
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8">
                    <div className="text-center mb-10">
                        <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="bg-indigo-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30"
                        >
                            <i className="ri-shield-user-line text-3xl text-white"></i>
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            Access your personalized feed on AnantTV
                        </p>
                    </div>

                    <form onSubmit={handler} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username or Email</label>
                            <div className="relative group">
                                <i className="ri-user-3-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors"></i>
                                <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="your_username"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <i className="ri-lock-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fuchsia-400 transition-colors"></i>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-indigo-500/20 transform transition active:scale-[0.98] mt-4"
                        >
                            Sign In
                        </button>

                        <div className="pt-6 border-t border-white/10 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{" "}
                                <button
                                    type="button"
                                    className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition"
                                    onClick={() => navigate("/register")}
                                >
                                    Create Account
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;