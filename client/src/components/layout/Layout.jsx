import SideBar from "../side-bar/SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-row bg-primary w-screen min-h-screen gap-1">
      <SideBar />
      <div className="bg-gray-700 w-[calc(9rem+1px)] min-h-screen fixed"></div>
      <div className="flex-grow pl-[calc(6rem+1px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
