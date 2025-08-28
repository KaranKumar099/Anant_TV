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
                `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
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
            className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold shadow-md hover:bg-red-500 hover:shadow-lg 
            active:bg-red-700 active:scale-95 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={logOutHandler}
        >
            <i className="mr-2 ri-logout-box-r-line"></i>LogOut
        </button>
    );
}

export default LogOut;
