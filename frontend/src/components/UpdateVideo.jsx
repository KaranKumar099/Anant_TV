import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

function UpdateVideo() {
    const {id}=useParams();
    const [loading, setLoading] = useState(false)

    const [vdoDets, setVdoDets]=useState({
        title: "",
        description: "",
        thumbnail: File,
    })

    useEffect(()=>{
        async function prevDets(){
          const token= localStorage.getItem("accessToken")
          const res= await axios.get(`http://localhost:8000/api/v1/videos/${id}`,{
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          setVdoDets({
            ...vdoDets, 
            title: res.data.data.title,
            description: res.data.data.description
          })
          console.log(res.data.data)
        }
        prevDets()
    },[])

    const [fileName, setFileName] = useState("No File Chosen");

    const handleThumbnailUpload=(e)=>{
        setFileName(e.target.files[0].name)
        setVdoDets({...vdoDets, thumbnail: e.target.files[0]})
    }

    const handleTextChange = (e)=>{
        setVdoDets({...vdoDets, [e.target.name]: e.target.value})
    }

    const navigate=useNavigate()
    const handleFormSubmit=async (e)=>{
        e.preventDefault()
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("newTitle", vdoDets.title);
            formData.append("newDescription", vdoDets.description);
            formData.append("thumbnail", vdoDets.thumbnail);
            
            const token= localStorage.getItem("accessToken")
            const response = await axios.patch(`http://localhost:8000/api/v1/videos/${id}`, formData, 
                {headers:
                    {Authorization: `Bearer ${token}`}
                });
            console.log("Update Video Success :: ",response.data)
            setLoading(false)
            navigate("/your-videos")
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <div className='h-full w-full flex-1 flex flex-col items-center'>
        {
            loading ? "Loading..." : (
            <>
                <h1 className='text-2xl font-bold my-5'>Update Video</h1>
                <form className='flex flex-col gap-4' onSubmit={handleFormSubmit}>
                    <div>
                        <label>Title</label><br />
                        <input name="title" type="text" required value={vdoDets.title} onChange={handleTextChange}
                            className='py-1 px-2 w-md outline mt-1' />
                    </div>
                    <div>
                        <label>Description</label><br />
                        <textarea name='description' rows="4" value={vdoDets.description} onChange={handleTextChange}
                            className='py-1 px-2 w-md outline mt-1'></textarea>  
                    </div>
                    <div className='my-2'>
                        <h2>Thumbnail</h2>
                        <div className='mt-1 flex justify-between items-center'>
                            <input name="thumbnail" id='thumbnail' type='file' className='hidden' 
                                onChange={handleThumbnailUpload}/>
                            <label htmlFor="thumbnail" 
                                className='p-2 bg-gray-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition'
                                >Choose File</label>
                            <p>{fileName}</p>
                        </div>
                    </div>
                    <button type="submit" className='p-2 cursor-pointer text-white px-4 py-2 rounded bg-blue-500 transition'>Update</button>
                </form>
            </>)
        }
    </div>
  )
}

export default UpdateVideo