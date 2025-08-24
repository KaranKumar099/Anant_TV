import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter} from "react-router"
import { AuthProvider } from './Context/AuthContext.jsx'
import { Home, Layout, Login, Register, User, YourVideos, PublishVideo, UpdateVideo, Subscriptions, Playlists, PlaylistPage, CreatePlaylist,  
          EditPlaylist, WatchHistory} from "./index.js"
import PlayVideoPage from './components/PlayVideoPage.jsx'
import EditChannel from './components/EditChannel.jsx'
import YourChannel from './components/YourChannel.jsx'
import ChannelDashboard from './components/ChannelDashboard.jsx'

const router=createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '',
        element: <Home/>
      },
      {
        path: '/register',
        element: <Register/>
      },
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/user',
        element: <User/>,
      },
      {
        path: '/user/subscriptions',
        element: <Subscriptions/>
      },
      {
        path: '/user/watch-history',
        element: <WatchHistory/>,
      },
      {
        path: '/user/channel/:id',
        element: <YourChannel/>,
      },
      {
        path: '/user/channel/edit',
        element: <EditChannel/>,
      },
      {
        path: '/channel-dashboard/:username',
        element: <ChannelDashboard/>,
      },
      {
        path: '/your-videos',
        element: <YourVideos/>,
      },
      {
        path: '/your-videos/publish',
        element: <PublishVideo/>,
      },
      {
        path: '/your-videos/update/:id',
        element: <UpdateVideo/>,
      },
      {
        path: '/playlists',
        element: <Playlists/>
      },
      {
        path: '/playlists/:playlistId',
        element: <PlaylistPage/>
      },
      {
        path: '/playlists/create',
        element: <CreatePlaylist/>
      },
      {
        path: '/playlists/edit/:id',
        element: <EditPlaylist/>
      },
      {
        path: '/video/play/:videoId',
        element: <PlayVideoPage/>
      },
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)
