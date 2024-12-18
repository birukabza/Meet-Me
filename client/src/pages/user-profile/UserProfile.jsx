import UserDetails from "../../components/user-details/UserDetails";
import Posts from "../../components/posts/Posts";

import { MdOutlineFeaturedPlayList } from "react-icons/md";

import { useParams } from "react-router-dom";


const UserProfile = () => {

    const { username } = useParams()

    return (
        <div className="flex flex-col pl-64 py-16 mr-80 ">

            {/* user details */}
            <div className="flex flex-row gap-12 max-w-5xl w-full">
                <UserDetails username={username} />
            </div>

            {/* divider */}
            <div className="border-b border-gray-700 w-full] mt-10"></div>

            {/* {Header for post section} */}
            <div className="mt-1 flex flex-row justify-center gap-2">
                <MdOutlineFeaturedPlayList className="text-white mt-2"/>
                <h2 className="text-xl tracking-wider font-thin justify-self-center text-white mb-6">My Arts</h2>
            </div>
                <Posts username={username} />
        </div>
    );
};

export default UserProfile;

