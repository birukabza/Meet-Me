import { FaPlus } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";

import { fetchUserProfile } from "../../api/userApi";

import { useEffect } from "react";
import { useState } from "react";

import { SERVER_URL } from "../../constants/constants";

import PropTypes from "prop-types";

const UserDetails = ({ username }) => {
    const [loading, setLoading] = useState(true);
    const [followersCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [bio, setBio] = useState("");
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await fetchUserProfile(username);
                setIsFollowing(userData.is_following);
                setShowEditProfile(userData.is_self);
                setAvatarUrl(userData.avatar);
                setBio(userData.bio);
                setFollowerCount(userData.followers_count);
                setFollowingCount(userData.following_count);
            } catch (error) {
                console.log(error, "error occurred while getting user data");
            } finally {
                setLoading(false);
            }
        };
        getUserData();
    }, [username]);
    return (
        <>
            <div className="flex justify-center  mb-10">
                <div className="relative size-48">
                    {avatarUrl ? (
                        <img
                            src={`${SERVER_URL}${avatarUrl}`}
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover border-4 border-primary shadow-md"
                        />
                    ) : (
                        <IoPersonCircleSharp className="w-full h-full text-white" />
                    )}

                    {avatarUrl ? null : (
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:text-secondary">
                            <FaPlus />
                        </div>
                    )}

                    <div className="absolute -bottom-7 -left-0 text-white">
                        <span>@{username}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-start gap-3 pt-5">
                {showEditProfile ? (
                    <div className="flex justify-start mb-3 ">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:shadow-2xl hover:bg-secondary">
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <div className="flex justify-start mb-3 ">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:shadow-2xl hover:bg-secondary">
                            {isFollowing ? "Following" : "Follow"}
                        </button>
                    </div>
                )}

                <div className="flex gap-12 justify-center text-white">
                    <div className="flex gap-1">
                        <span>2</span>
                        <p>posts</p>
                    </div>
                    <div className="flex gap-1">
                        <span>{loading ? "-" : followersCount}</span>
                        <p>followers</p>
                    </div>
                    <div className="flex gap-1">
                        <span>{loading ? "-" : followingCount}</span>
                        <p>following</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-white">{loading ? "" : bio}</p>
                </div>
            </div>
        </>
    );
};

UserDetails.propTypes = {
    username: PropTypes.string.isRequired,
};

export default UserDetails;
