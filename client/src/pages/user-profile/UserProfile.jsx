import UserDetails from "../../components/user-details/UserDetails";

import { useParams } from "react-router-dom";


const UserProfile = () => {

    const { username } = useParams()

    return (
        <div className="flex flex-col ml-40 mr-80 pt-12">
            <div className="flex flex-row gap-12 max-w-5xl w-full">
                <UserDetails username={username} />
            </div>
            <div className="border-b border-gray-700 w-full] mt-10"></div>
        </div>
    );
};

export default UserProfile;

