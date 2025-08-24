import 'remixicon/fonts/remixicon.css'
import { useNavigate } from "react-router";
import axios from "axios";
import AddToPlaylist from "../components/AddToPlaylist";
import { useState, useEffect } from "react";

function VideoCard({ thumbnail, title, owner, views, duration, uploaded, videoId, buttons }) {
    const navigate=useNavigate()
    const updateVideoHandler = ()=> {
        navigate(`update/${videoId}`)
    }

    const deleteVideoHandler = async ()=> {
        const token=localStorage.getItem("accessToken");
        const response=await axios.delete(`http://localhost:8000/api/v1/videos/${videoId}`,{
            headers: {
                Authorization: `Bearer ${token}`,
                withCredentials: true
            }
        })
        console.log(response.data)
    }

    const handleClick=(e)=>{
        const options=e.target.parentElement.nextSibling
        if (options.style.display === 'flex') {
            options.style.display = 'none';
        } else {
            options.style.display = 'flex';
        }
    }

    const handleAddToPlaylist= (e)=>{
      const options=e.target.parentElement.parentElement
      options.style.display="none"
      const card = e.target.closest(".main");   // find the current card container
      const modal = card.querySelector(".add-to-playlist-modal");
      modal.style.display = "flex";
    }

    const handlePlayVideo = ()=>{
      navigate(`/video/play/${videoId}`)
    }

    const navigateToChannelDashboard = () => {
      navigate(`/channel-dashboard/${owner.username}`)
    }

    const [uploadTime, setUploadTime]=useState("")
    useEffect(()=>{
      const timePassed = (uploaded)=>{
        const today=new Date().toJSON().substring(0,19)
        const todayArr=today.split(/[-:T]/)
        const uploadedArr=uploaded.substring(0,19).split(/[-:T]/)
        let i=0;
        while(i<6 && todayArr[i]-uploadedArr[i]==0){
          i++;
        }
        if(i===0){
          setUploadTime(todayArr[i]-uploadedArr[i] + "years ago")
        }else if(i===1){
          setUploadTime(todayArr[i]-uploadedArr[i] + " months ago")
        }else if(i===2){
          setUploadTime(todayArr[i]-uploadedArr[i] + " days ago")
        }else if(i===3){
          setUploadTime(todayArr[i]-uploadedArr[i] + " hours ago")
        }else if(i===4){
          setUploadTime(todayArr[i]-uploadedArr[i] + " minutes ago")
        }else{
          setUploadTime(todayArr[i]-uploadedArr[i] + " seconds ago")
        }
      }
      timePassed(uploaded)
    })

  return (
      <div className="main w-sm cursor-pointer">
        <div className="relative w-full h-58 overflow-hidden rounded-lg" onClick={handlePlayVideo}>
          <img src={thumbnail} alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
          <h6 className="absolute bottom-2 right-2 bg-black/75 rounded py-0.5 px-1 text-white text-sm ">
            {parseFloat(duration).toFixed(2)}
          </h6>
        </div>
        <div className="mt-3 flex justify-between relative">
          <div className="flex w-full">
            {
              owner ? (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden" onClick={navigateToChannelDashboard}>
                  <img src={owner?.avatar} alt="owner avatar" className="h-full w-full object-cover"/>
                </div>
              ) : (<></>)
            }
            <div className="flex flex-col px-3 w-full" onClick={handlePlayVideo}>
              <h3 className="font-semibold leading-tight line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500">{owner?.username}</p>
              <p className="text-sm text-gray-500">
                {views} views • {uploadTime}
              </p>  
            </div>
          </div>
          <button className="cursor-pointer rounded-full h-10 w-11 hover:bg-gray-300 transition-colors duration-500"
              onClick={handleClick}><i className="ri-more-2-line"></i>
          </button>
          <div className="absolute left-11/12 top-10 z-10 flex-col items-start bg-gray-300 w-[14rem] rounded-lg overflow-hidden hidden">
          {
              (buttons) ? (
                  <>
                      <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300" onClick={updateVideoHandler}>
                        <button className="cursor-pointer"><i className="mr-2 ri-edit-line"></i>Edit</button>
                      </div>
                      <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300" onClick={deleteVideoHandler}>
                        <button className="cursor-pointer"><i className="mr-2 ri-delete-bin-6-line"></i>Delete</button>
                      </div>
                  </>
              ) : (    
                <>    
                  <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300" onClick={handleAddToPlaylist}>
                      <button className="cursor-pointer"><i className="mr-2 ri-play-list-add-line"></i>Add to playlist</button>
                  </div>
                  <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300">
                      <button className="cursor-pointer"><i className="mr-2 ri-time-line"></i>Save to Watch later</button>
                  </div>
                  <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300">
                      <button className="cursor-pointer"><i className="mr-2 ri-download-2-line"></i>Download</button>
                  </div>
                  <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300">
                      <button className="cursor-pointer"><i className="mr-2 ri-share-box-line"></i>Share</button>
                  </div>
                  <div className="w-full py-1 px-3 hover:bg-gray-400 transition-colors duration-300">
                      <button className="cursor-pointer"><i className="mr-2 ri-spam-3-line"></i>Not Interested</button>
                  </div>
                </>
              )
          }
          </div>
        </div>
        <div className="hidden absolute top-1/2 left-1/2 -translate-1/2 z-10 w-sm add-to-playlist-modal">
          <AddToPlaylist videoId={videoId}/>
        </div>
      </div>
  );
}

export default VideoCard;
