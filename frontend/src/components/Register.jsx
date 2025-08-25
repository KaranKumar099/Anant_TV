import axios from "axios";
import { useState } from "react";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
    });
    const [avatar, setAvatar] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("fullName", formData.fullName);
            data.append("password", formData.password);
            data.append("avatar", avatar);
            if (coverImage) data.append("coverImage", coverImage);

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/users/register`,
                data
            );
            // console.log(res.data)
        } catch (error) {
            throw new Error("Registration failed || Error : ", error);
        }
    };

    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="flex-1 w-full h-full flex justify-center items-center">
            <form onSubmit={submitHandler} className="flex flex-col gap-6">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={changeHandler}
                    className="outline-1 p-2 rounded-md w-2xs"
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={changeHandler}
                    className="outline-1 p-2 rounded-md w-2xs"
                />
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={changeHandler}
                    className="outline-1 p-2 rounded-md w-2xs"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={changeHandler}
                    className="outline-1 p-2 rounded-md w-2xs"
                />
                <div className="outline-1 p-2 rounded-md w-2xs">
                    <input
                        type="file"
                        id="avatar"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => setAvatar(e.target.files[0])}
                        className="hidden"
                    />
                    <label htmlFor="avatar">
                        Upload Avatar - {avatar ? avatar.name : "Choose File"}
                    </label>
                </div>
                <div className="outline-1 p-2 rounded-md w-2xs">
                    <input
                        type="file"
                        id="coverImage"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => setCoverImage(e.target.files[0])}
                        className="hidden"
                    />
                    <label htmlFor="coverImage">
                        Upload Cover Image -{" "}
                        {coverImage ? coverImage.name : "Choose File"}
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-400 outline-1 p-2 rounded-md w-2xs hover:bg-blue-500"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
