import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router'
import {VideoCard} from '../index'
import { useAuth } from '../Context/AuthContext'

function YourVideos() {
    const {user}=useAuth()
    const [videos, setVideos] = useState([])
    useEffect(()=>{
        const fetchVideos=async ()=>{
            try {
                const token=localStorage.getItem("accessToken")
                const id=user._id
                const response=await axios.get(`http://localhost:8000/api/v1/videos?userId=${id}`,
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true
                    }
                )
                console.log(response.data.data.data)
                setVideos(response.data.data.data)
            }
            catch (error) {
                console.error("Videos Fetching error :: ",error.message)
            }
        }
        fetchVideos();
    },[])

    const navigate=useNavigate()
    const handlePublishVideo = async ()=>{
        navigate(`publish`)
    }
  return (
    <>
    <div className='p-2 relative flex flex-col min-h-full'>
        <h1 className='text-2xl font-bold text-center'>YourVideos:</h1>
        <div className='flex flex-wrap gap-5 p-2 px-5 flex-1 overflow-y-auto'>
            {
                videos.map((item)=>(
                    <div key={item._id}>
                        <VideoCard title={item.title} thumbnail={item.thumbnail} owner={item.owner} views={item.views} videoId={item._id} 
                        uploaded={item.createdAt} duration={item.duration} buttons={true}/>
                    </div>
                ))
            }
        </div>
         <div className='absolute flex items-center gap-2 left-4 bottom-4 bg-blue-300 p-3 pr-5 rounded-full'>
            <button className='text-3xl h-8 w-8 text-blue-400 bg-white rounded-full cursor-pointer flex items-center justify-center'
                onClick={handlePublishVideo}><i className="ri-add-line"></i></button>
            <h1>Publish videos</h1>
        </div>
    </div>
    </>
  )
}

export default YourVideos