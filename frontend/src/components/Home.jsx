import axios from 'axios'
import React, { useState, useEffect } from 'react'
import {VideoCard} from '../index.js'

function Home() {
    const [videos, setVideos] = useState([])
    useEffect(()=>{
        const fetchVideos=async ()=>{
            try {
                const token=localStorage.getItem("accessToken")
                const response=await axios.get("http://localhost:8000/api/v1/videos",
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
  return (
    <>
        <div className='flex gap-x-4 gap-y-8 flex-wrap p-4'>
            {
              videos.map((item)=>(
                <div key={item._id}>
                    <VideoCard title={item.title} thumbnail={item.thumbnail} owner={item.owner} duration={item.duration} views={item.views} uploaded={item.createdAt} 
                    buttons={false} videoId={item._id}/>
                </div>
              ))
            }
        </div>
    </>
  )
}

export default Home