import SideBarIcons from "../side-bar-icons/SideBarIcons";

import logo from "../../assets/Meet-Me-Logo.png";

import { IoPersonCircleSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

import { Link } from "react-router-dom";

import { useContext } from "react";

import AuthContext from "../../contexts/AuthContext";

const SideBar = () => {

  const {isAuthenticated, currentUsername} = useContext(AuthContext);
  const redirectTo = isAuthenticated ?  `profile/${currentUsername}`  : "/signin"

  return (
    <div className="flex flex-col fixed top-0 left-0 h-screen w-24 text-white bg-primary shadow-xl p-4 z-10">
      <Link to="/">
        <SideBarIcons icon={logo} logo />
      </Link>
      <Link to={redirectTo}>
        <SideBarIcons icon={<IoPersonCircleSharp size="50" />} text="Profile" />
      </Link>
      <SideBarIcons icon={<FaSearch size="40" />} text="Search" />
    </div>
  );
};

export default SideBar;
