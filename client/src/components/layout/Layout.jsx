import SideBar from "../side-bar/SideBar";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex bg-primaryLight2 w-full h-screen">
      <SideBar/>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
