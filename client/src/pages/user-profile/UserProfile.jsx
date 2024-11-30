import UserDetails from "../../components/user-details/UserDetails";

import { useParams } from "react-router-dom";


const UserProfile = () => {

    const {username} = useParams()

    return (
        <div className="ml-40 p-6 flex flex-row gap-12 max-w-5xl w-full">
            <UserDetails username={username}/>
        </div>
    );
};

export default UserProfile;

