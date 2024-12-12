import UserDetails from "../../components/user-details/UserDetails";
import Posts from "../../components/posts/Posts";

import { useParams } from "react-router-dom";


const UserProfile = () => {

    const { username } = useParams()

    return (
        <div className="flex flex-col ml-40 mr-80 pt-12">

            {/* user details */}
            <div className="flex flex-row gap-12 max-w-5xl w-full">
                <UserDetails username={username} />
            </div>

            {/* divider */}
            <div className="border-b border-gray-700 w-full] mt-10"></div>

            {/* {Posts section} */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Posts</h2>
                <Posts username={username} />
            </div>

        </div>
    );
};

export default UserProfile;

