import "remixicon/fonts/remixicon.css";
import { NavLink } from "react-router-dom";
import LogOut from "./Logout";
import { useAuth } from "../Context/AuthContext";

function Header() {
    const { isAuthenticated, user } = useAuth();
    return (
        <>
            <header className="bg-gray-500 w-full flex justify-between items-center h-16 px-6">
                <div className="flex justify-between items-center gap-10">
                    <div>
                        <i className="ri-menu-line text-2xl"></i>
                    </div>
                    <div className="text-2xl font-bold h-8 flex items-center">
                        Anant
                        <span className="bg-blue-400 p-1 rounded-lg text-white">
                            TV
                        </span>
                    </div>
                </div>
                <ul className="flex justify-between items-center gap-10">
                    {isAuthenticated && user ? (
                        <LogOut />
                    ) : (
                        <>
                            <li>
                                <NavLink
                                    to="/register"
                                    className="bg-blue-400 border-1 py-2 px-4 hover:rounded-full"
                                >
                                    SignUp
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/login"
                                    className="bg-blue-400 border-1 py-2 px-3 hover:rounded-full"
                                >
                                    <i className="mr-2 ri-login-box-line"></i>
                                    Login
                                </NavLink>
                            </li>
                        </>
                    )}
                    <li>
                        <NavLink
                            to="/user"
                            className="bg-blue-400 border-1 py-2 px-3 hover:rounded-full"
                        >
                            <i className="ri-user-6-line"></i>
                        </NavLink>
                    </li>
                </ul>
            </header>
        </>
    );
}

export default Header;
