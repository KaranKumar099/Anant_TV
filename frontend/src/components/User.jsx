import { useAuth } from '../Context/AuthContext'

function User() {
    const {user} = useAuth();
  return (
    <>
            {
                user ? (
                    <div className='py-4 px-6 text-xl'>
                        <h1 className='text-3xl font-semibold'>User Details: </h1>
                        <h1>Full Name : {user?.fullName}</h1>
                        <h1>Username : {user?.username}</h1>
                        <h1>Email : {user?.email}</h1>
                        <div className='flex gap-20'>
                            <div>
                                <label>Avatar: </label>
                                <img src={user?.avatar} alt="User Avatar" className='w-80'/>
                            </div>
                            <div>
                                <label>Cover Image: </label>
                                <img src={user?.coverImage} alt="User cover image" className='w-80'/>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='py-4 px-6 text-xl'>
                        <h1 className='text-3xl font-semibold'>Please Login First</h1>
                    </div>
                )
            }
    </>
  )
}

export default User