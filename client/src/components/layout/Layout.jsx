import SideBar from "../side-bar/SideBar";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-primaryLight2 w-full h-screen">
      <SideBar/>
      <div className="border-r border-gray-700 h-full w-[calc(6rem+1px)]"></div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
