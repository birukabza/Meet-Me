import SideBarIcons from "../side-bar-icons/SideBarIcons";

import logo from "../../assets/Meet-Me-Logo.png";

import { IoPersonCircleSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";

import { Link } from "react-router-dom";

import { useContext } from "react";

import AuthContext from "../../contexts/AuthContext";

const SideBar = () => {

  const {isAuthenticated, currentUsername} = useContext(AuthContext);
  const redirectTo = isAuthenticated ?  `profile/${currentUsername}`  : "/signin"

  return (
    
    <div className="flex flex-col fixed top-0 left-0 h-screen w-36 text-white bg-primary shadow-xl p-4 z-10 items-center gap-6  pt-8">
      <Link to="/">
      <img src={logo} alt="Company Logo" className="size-16 shadow-sm shadow-gray-700 rounded-lg mb-4"/>
      </Link>
      <Link to="/">
        <SideBarIcons icon={<FaHome size="25" />} text="Home" />
      </Link>
      <Link>
      <SideBarIcons icon={<FaSearch size="25" />} text="Search" />
      </Link>
      <Link>
      <SideBarIcons icon={<IoIosPeople size="25" />} text="Friends" />
      </Link>
      <Link to={redirectTo}>
        <SideBarIcons icon={<IoPersonCircleSharp size="30" />} text="Profile" />
      </Link>
    </div>
  );
};

export default SideBar;
