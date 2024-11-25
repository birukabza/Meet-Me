import SideBarIcons from "../side-bar-icons/SideBarIcons"

import logo from '../../assets/Meet-Me-Logo.png'

import { IoPersonCircleSharp } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";



const SideBar = () => {
  return (
    <div className="flex flex-col fixed top-0 left-0 h-screen w-24 text-white bg-primary shadow-xl p-4">
        <SideBarIcons icon={logo} logo />
        <SideBarIcons icon={<IoPersonCircleSharp size="50"/>} text="Profile"/>
        <SideBarIcons icon={<FaSearch size="40"/>} text="Search"/>
        
      
    </div>
  )
}

export default SideBar
