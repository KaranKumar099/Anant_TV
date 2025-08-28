import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {useAuth} from "../Context/AuthContext"

function Header() {
    const navigate= useNavigate()
    const { isAuthenticated } = useAuth()
    async function handleClickOnUser(){
        navigate("/user")
    }
    async function navigateToRegister(){
        navigate("/login")
    }

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-10 mb-6 flex items-center justify-around p-4 bg-gradient-to-r bg-gray-900 backdrop-blur-xl border border-white/10 shadow-lg"
        >
            <motion.h1
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold tracking-wide text-indigo-400"
            >
                AnantTV
            </motion.h1>

            <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search videos..."
                className="px-4 py-2 w-1/3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-400 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

            {
                !isAuthenticated ? (<button
                            className="text-gray-200 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm hover:cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            onClick={navigateToRegister}
                        >Login / SignUp
                        </button>) : <></>
            }
            

            <div className="flex items-center gap-5 text-gray-300" onClick={handleClickOnUser}>
                <motion.i
                    whileHover={{ scale: 1.2, color: "#818cf8" }}
                    className="ri-notification-3-line text-xl cursor-pointer transition"
                />
                <motion.i
                    whileHover={{ scale: 1.2, color: "#818cf8" }}
                    className="ri-user-3-line text-xl cursor-pointer transition"
                />
            </div>
        </motion.header>
    );
}

export default Header;
