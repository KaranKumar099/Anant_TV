import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";
import {
    Home,
    Layout,
    Login,
    Register,
    User,
    YourVideos,
    PublishVideo,
    UpdateVideo,
    Subscriptions,
    Playlists,
    PlaylistPage,
    CreatePlaylist,
    EditPlaylist,
    WatchHistory,
    PlayVideoPage,
    EditChannel,
    YourChannel,
    ChannelDashboard,
    NotFound
} from "./index.js";

const Protected = ({ children }) => {
    const { user } = useAuth();
    // Allow checking... if user is explicitly null (not signed in)
    // We check localStorage too as a fallback while auth is loading
    const token = localStorage.getItem("accessToken");
    
    if (!user && !token) {
        return <Navigate to="/not-found" replace />;
    }
    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/user",
                element: <Protected><User /></Protected>,
            },
            {
                path: "/user/subscriptions",
                element: <Protected><Subscriptions /></Protected>,
            },
            {
                path: "/user/watch-history",
                element: <Protected><WatchHistory /></Protected>,
            },
            {
                path: "/user/channel/:id",
                element: <Protected><YourChannel /></Protected>,
            },
            {
                path: "/user/channel/edit",
                element: <Protected><EditChannel /></Protected>,
            },
            {
                path: "/channel-dashboard/:username",
                element: <Protected><ChannelDashboard /></Protected>,
            },
            {
                path: "/your-videos",
                element: <Protected><YourVideos /></Protected>,
            },
            {
                path: "/your-videos/publish",
                element: <Protected><PublishVideo /></Protected>,
            },
            {
                path: "/your-videos/update/:id",
                element: <Protected><UpdateVideo /></Protected>,
            },
            {
                path: "/playlists",
                element: <Protected><Playlists /></Protected>,
            },
            {
                path: "/playlists/:playlistId",
                element: <Protected><PlaylistPage /></Protected>,
            },
            {
                path: "/playlists/create",
                element: <Protected><CreatePlaylist /></Protected>,
            },
            {
                path: "/playlists/edit/:id",
                element: <Protected><EditPlaylist /></Protected>,
            },
            {
                path: "/video/play/:videoId",
                element: <Protected><PlayVideoPage /></Protected>,
            },
            {
                path: "/not-found",
                element: <NotFound />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
