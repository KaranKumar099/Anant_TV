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
        // console.log(username, password)

        // fetch method
        try {
            // const res=await fetch("http://localhost:8000/api/v1/users/login",{
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   body: JSON.stringify({username, password})
            // })
            // if(!res.ok){
            //   const errorData = await res.json();
            //   throw new Error(errorData.message || "Login failed");
            // }
            // const data = await res.json();
            // console.log("Login Success:", data);

            // axios method
            const token = localStorage.getItem("accessToken")
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
            // console.log("stored token ",localStorage.getItem("accessToken"));
            // console.log("stored token ",localStorage.getItem("refreshToken"));
            navigate("/");
        } catch (error) {
            console.error("Login Error:", error.message);
            alert(error.message);
        }
    };

    return (
        <>
            <form
                className="flex-1 w-full h-full flex flex-col justify-center items-center gap-6"
                onSubmit={handler}
            >
                <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username / Email"
                    className="outline-1 p-2 rounded-md w-2xs"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="outline-1 p-2 rounded-md w-2xs"
                />
                <button
                    type="submit"
                    className="bg-blue-400 outline-1 p-2 rounded-md w-2xs"
                >
                    Login
                </button>
            </form>
        </>
    );
}

export default Login;
