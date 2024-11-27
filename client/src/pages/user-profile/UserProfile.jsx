import { FaPlus } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";


const UserProfile = ({avatarUrl}) => {
    return (
        <div className="ml-40 p-6 flex flex-row gap-12 max-w-5xl w-full">
            <div className="flex justify-center  mb-10">
                <div className="relative size-48">
                {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover border-4 border-primary shadow-md"
                        />
                    ) : (
                        <IoPersonCircleSharp className="w-full h-full text-gray-400" />
                    )}

                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                        <FaPlus />
                    </div>
                    <div className="absolute -bottom-7 -left-0 text-white">
                        <span>@biruk</span>
                    </div>
                </div>

            </div>

            <div className="flex flex-col justify-start gap-3 pt-5">

                <div className="flex justify-start mb-3 ">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:shadow-2xl hover:bg-primaryLight">
                        Edit Profile
                    </button>
                </div>

                <div className="flex gap-12 justify-center text-white">
                    <div className="flex gap-1">

                        <span>2</span>
                        <p>posts</p>

                    </div>
                    <div className="flex gap-1">

                        <span>2</span>
                        <p>followers</p>

                    </div>
                    <div className="flex gap-1">

                        <span>2</span>
                        <p>following</p>
                    </div>

                </div>

                <div className="mt-4">
                    <p className="text-white">Hi Guys this is my Bio</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

