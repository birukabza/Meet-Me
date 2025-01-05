import { useState, useEffect, useRef } from 'react';

import { FaTimes } from "react-icons/fa";

import PropTypes from 'prop-types';

import { createPost } from '../../api/userApi';

import CustomButton from '../custom-buttons/CustomButton';

const CreatePostModal = ({ onClose, onCreateNewPost }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageBlob, setImageBlob] = useState(null);
    const [caption, setCaption] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp', 'image/pdf'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG,jpg,webp, pdf or GIF).');
                return;
            }
    
            if (file.size > 10 * 1024 * 1024) {  // Limit file size to 5MB
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
    

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const handleSubmit = async () => {
        if (!imageUrl) {
            alert("Please choose an image.");
            return;
        }
        setIsPosting(true);
        setError(null);

        try {
            const response = await createPost({ image: imageBlob, content: caption });
            if (response.success) {
                alert("Post successfully created!");
                onCreateNewPost(response.data)
                setCaption('');
                setImageUrl(null);
                onClose();
            }
        } catch (error) {
            setError("Unexpected error occurred while posting.");
            console.error("Error while posting", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 ">
            <div className="size-[600px] bg-primaryLight p-4 rounded-lg shadow-lg max-w-full relative">
                <h2 className="text-xl font-bold mb-4 text-center">Share your art</h2>

                <div className="p-4 mb-4 flex flex-col items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="size-72 object-cover mb-4 rounded"
                        />
                    ) : (
                        <>
                            <button
                                onClick={handleButtonClick}
                                className="bg-primaryLight2 text-white px-4 py-2 rounded-lg hover:bg-primary"
                                aria-label="Select an image from computer"
                            >
                                Select from computer
                            </button>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                </div>

                <textarea
                    placeholder="Add a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full p-2 rounded-lg mb-4 resize-none text-white bg-gray-500"
                    rows="3"
                ></textarea>

                {error && (
                    <div className="text-red-600 text-sm mb-2 text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="absolute px-4 py-2 rounded-lg -top-8 -right-12 hover:text-red-600"
                    aria-label="Close the modal"
                >
                    <FaTimes size={30} />
                </button>

                <div className="flex justify-center items-center tracking-widest" onClick={handleSubmit}>
                    <CustomButton width="w-20" disabled={isPosting}>
                        {isPosting ? "Posting..." : "Post"}
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

CreatePostModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onCreateNewPost: PropTypes.func.isRequired,
};

export default CreatePostModal;
