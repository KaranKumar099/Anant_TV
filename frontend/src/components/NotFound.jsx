import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h1 className="text-[150px] font-black text-white/5 leading-none select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mb-8">
            The page you are looking for might have been removed, had its name changed, or requires you to be signed in to access.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/30"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition border border-white/20"
            >
              Sign In
            </button>
          </div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
    </div>
  );
}

export default NotFound;
