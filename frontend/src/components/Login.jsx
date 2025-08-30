import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    let navigate = useNavigate();

    const handler = async (e) => {
        e.preventDefault();
        try {
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
            // console.log("Login Success:", res.data);

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
        <div className="flex items-center justify-center min-h-[92vh] bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            <form
                onSubmit={handler}
                className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-6 border border-gray-700"
            >
                <h1 className="text-2xl font-bold text-center text-gray-100">
                    Welcome Back 👋
                </h1>
                <p className="text-center text-gray-400 text-sm">
                    Login to continue to <span className="font-semibold">AnantTV</span>
                </p>

                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username / Email"
                    className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                />

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold p-3 rounded-lg shadow-md"
                >
                    Login
                </button>

                <p className="text-center text-sm text-gray-400">
                    Don’t have an account?{" "}
                    <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;