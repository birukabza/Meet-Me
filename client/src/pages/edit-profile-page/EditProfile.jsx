import { useState, useEffect, useRef } from 'react';

import CustomButton from "../../components/custom-buttons/CustomButton";

import { updateUserData } from '../../api/userApi';

import { useNavigate } from "react-router-dom"

import {CLOUDINARY_BASE_URL} from "../../constants/constants"

function EditProfile() {
    const storedData = JSON.parse(localStorage.getItem("user")) || {
        user_id: '',
        username: '',
        bio: '',
        avatar: '',
        first_name: '',
        last_name: '',
    };
    const storedAvatar = storedData.avatar
    const [updatedData, setUpdatedData] = useState(storedData);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef(null);

    const navigate = useNavigate();


    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [imageUrl])


    const handleChange = (e) => {
        setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, JPG, WEBP, or GIF).');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {  // Limit file size to 10MB
                alert('File size exceeds 10MB.');
                return;
            }

            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            setImageBlob(file);
            setImageUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {

            const response = await updateUserData({ ...updatedData, avatar: imageBlob || "" });

            localStorage.setItem("user", JSON.stringify(response.data))

            alert('Profile updated successfully!');
            navigate(`/profile/${storedData.username}`)
        } catch (error) {
            console.log(error);
            alert("Unable to update your profile!")
        }finally{
            setIsSaving(false)
        }
    };

    return (
        <div className="ml-60 p-8 w-full max-w-4xl">
            <h1 className="text-2xl font-semibold text-white mb-8">Edit Profile</h1>

            <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gray-800 mr-6 flex items-center justify-center">
                    {
                    imageUrl ? (
                        <img src={imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : storedAvatar ? (
                        <img src={`${CLOUDINARY_BASE_URL}${storedAvatar}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <span className="text-gray-500">No avatar</span>
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-medium text-white">Change Profile Photo</h2>
                    <button
                        onClick={handleButtonClick}
                        className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-cyan-800"
                        aria-label="Select an image from computer"
                    >
                        Select from computer
                    </button>
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="text-cyan-400 font-medium mt-1"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={updatedData.first_name}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-secondary focus:ring-2"
                            placeholder="Your first name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={updatedData.last_name}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-secondary focus:ring-2"
                            placeholder="Your last name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={updatedData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:ring-secondary focus:ring-2 focus:outline-none resize-none"
                            placeholder="Write something about yourself"
                        />
                    </div>


                </div>

                <div className="flex justify-end">
                    <CustomButton type="submit" width="w-24" disabled={isSaving}>{isSaving? "Saving...":"Save"}</CustomButton>
                </div>
            </form>
        </div>
    );
}

export default EditProfile;
