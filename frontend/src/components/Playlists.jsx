import React, { useEffect, useState } from 'react'
import { useAuth } from '../Context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router'
import {PlaylistCard} from '../index.js'

function Playlists() {
    const {user}=useAuth()
    const [playlists, setPlaylists]=useState([])
    useEffect(()=>{
        const fetchPlaylists=async ()=>{
            try {
                const token=localStorage.getItem("accessToken")
                const response=await axios.get(`http://localhost:8000/api/v1/playlist/user/${user?._id}`,
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true
                    }
                )
                console.log(response.data.data)
                setPlaylists(response.data.data)
            }
            catch (error) {
                console.error("Playlists Fetching error :: ",error.message)
            }
        }
        fetchPlaylists();
    },[user])

    const navigate=useNavigate()
    const handleCreatePlaylist=()=>{
        navigate("create")
    }

  return (
    <div className='relative p-4 h-full w-full flex flex-col'>
        <h1 className='text-2xl font-bold text-center'>Your Playlists</h1>
        <div className='flex flex-wrap gap-5 p-2 flex-1 overflow-y-auto'>
            {
                playlists.map((item)=>(
                    <div key={item._id}>
                        <PlaylistCard thumbnail={item.videos[0]?.thumbnail} playlistName={item.name} channelName={"Karan Kumar"} vdoCount={item.videos.length} playlistId={item._id} />
                    </div>
                ))
            }
        </div>
         <div className='absolute flex items-center gap-2 left-4 bottom-4 bg-blue-300 p-3 pr-5 rounded-full'>
            <button className='text-3xl h-8 w-8 text-blue-400 bg-white rounded-full cursor-pointer flex items-center justify-center'
                onClick={handleCreatePlaylist}><i className="ri-add-line"></i></button>
            <h1>Create playlists</h1>
        </div>
    </div>
  )
}

export default Playlists