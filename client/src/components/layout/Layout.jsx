import SideBar from "../side-bar/SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-row bg-primary w-screen min-h-screen gap-1">
      <SideBar />
      <div className="bg-gray-700 min-h-screen fixed w-[1px] left-[9rem]"></div>
      <hr />
      <div className="flex-grow pl-[calc(6rem+1px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
