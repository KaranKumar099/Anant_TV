import React from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

function LogOut() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const logOutHandler = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                "http://localhost:8000/api/v1/users/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            // console.log(response.data.message);

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };
    return (
        <button
            className="bg-blue-400 border-1 py-2 px-3 hover:rounded-full"
            onClick={logOutHandler}
        >
            <i className="mr-2 ri-logout-box-r-line"></i>LogOut
        </button>
    );
}

export default LogOut;
