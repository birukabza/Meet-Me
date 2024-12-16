import { useState, useEffect, useRef } from 'react';

import { FaTimes } from "react-icons/fa";

import CustomButton from '../custom-buttons/CustomButton'

import PropTypes from 'prop-types';

const CreatePostModal = ({ onClose }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
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

    const handleSubmit = () => {
        if (!imageUrl) {
            alert("Choose an image")
            return
        }
        
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 ">
            <div className="bg-primaryLight p-4 rounded-lg shadow-lg size-[600px] max-w-full relative">
                <h2 className="text-xl font-bold mb-4 text-center">Share your art</h2>

                <div className="p-4 mb-4 flex flex-col items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover mb-4 rounded"
                        />
                    ) : (
                        <>
                            <button
                                onClick={handleButtonClick}
                                className="bg-primaryLight2 text-white px-4 py-2 rounded-lg hover:bg-primary"
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
                    className="w-full p-2  rounded-lg mb-4 resize-none text-white bg-gray-500 "
                    rows="3"
                ></textarea>

                <button
                    onClick={onClose}
                    className="absolute  px-4 py-2 rounded-lg  -top-8 -right-12 hover:text-red-600"
                >
                        <FaTimes size={30}/>

                </button>
                <div className="flex justify-center items-center" onClick={handleSubmit}>
                    <CustomButton width='12'>
                        Post
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

CreatePostModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default CreatePostModal;
