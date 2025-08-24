import { useContext, createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const fetchUser = async (token) => {
        try {
            // console.log("token : ",token)
            const response = await axios.get(
                "http://localhost:8000/api/v1/users/get-user",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUser(response.data.data);
            console.log("response : ", response.data.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsAuthenticated(true);
            fetchUser(token);
        }
    }, []);

    const login = (token) => {
        setIsAuthenticated(true);
        fetchUser(token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
