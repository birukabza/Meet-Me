import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SideBarIcons from "../side-bar-icons/SideBarIcons";
import logo from "../../assets/Meet-Me-Logo.png";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaSearch, FaHome } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { SearchUserApi } from "../../api/userApi";
import AuthContext from "../../contexts/AuthContext";
import { CLOUDINARY_BASE_URL } from "../../constants/constants";

const SideBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const searchIconRef = useRef(null);
  const { isAuthenticated, isAuthLoading, currentUsername} = useContext(AuthContext);
  const redirectTo = isAuthenticated ? `profile/${currentUsername}` : "/signin";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !searchIconRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSearchResults = async (query) => {
    try {
      const data = await SearchUserApi(query);
      setSearchResults(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      fetchSearchResults(query);
    } else {
      setSearchResults([]);
    }
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      handleClose();
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsClosing(true);
    setTimeout(() => {
      setIsSearchOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <>
      {isSearchOpen && (
        <div className="fixed inset-0 bg-primary bg-opacity-0 z-10">
          <div
            ref={searchRef}
            className={`fixed left-24 top-0 w-[400px] h-screen bg-primary text-white p-4 shadow-xl ${isClosing ? "animate-slide-out" : "animate-slide-in"
              }`}
          >
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold mb-4">Search</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-700 rounded-lg py-2 px-4 pr-10 focus:outline-none"
                  autoFocus
                />
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={() => {setSearchQuery(""); setSearchResults("")}}
                >
                  <FaTimes size="20" />
                </button>
              </div>
              <div className="mt-6">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((user) => (
                      <li key={user.user_id} className="py-2">
                        <Link
                          to={`/profile/${user.username}`}
                          className="text-white cursor-pointer "
                          onClick={handleClose}
                        >
                          <div className="flex items-end">
                            {user.avatar ?
                          <img src={`${CLOUDINARY_BASE_URL}${user.avatar}`} alt="" className="size-7 rounded-full"/>
                          :
                          <IoPersonCircleSharp size={32}/>
                             }

                          <div className="flex flex-col pl-2">
                            <h3 className="text-md font-semibold">
                              {user.first_name} {user.last_name }
                            </h3>

                            <p className="text-zinc-400">
                              @{user.username}
                            </p>
                          </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No results found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col fixed top-0 left-0 h-screen text-white bg-primary shadow-xl p-4 z-10 items-center gap-6 pt-8 ${isSearchOpen ? "w-24" : "w-36"}`}>
        <Link to="/">
          <img
            src={logo}
            alt="Company Logo"
            className="size-16 shadow-sm shadow-secondary rounded-lg mb-4"
          />
        </Link>
        <Link to="/">
          <SideBarIcons
            icon={<FaHome size="25" />}
            text={!isSearchOpen ? "Home" : ""}
          />
        </Link>
        <button onClick={toggleSearch} ref={searchIconRef}>
          <SideBarIcons
            icon={<FaSearch size="25" />}
            text={!isSearchOpen ? "Search" : ""}
          />
        </button>
        <Link>
          <SideBarIcons
            icon={<IoIosPeople size="25" />}
            text={!isSearchOpen ? "Friends" : ""}
          />
        </Link>
        <Link to={redirectTo}>
          <SideBarIcons
            icon={<IoPersonCircleSharp size="30" />}
            text={!isSearchOpen ? "Profile" : ""}
          />
        </Link>
        {!isAuthLoading && !isAuthenticated && (
          <Link to="/signin">
            <div className="bg-red-600 w-28 mt-8 h-10 rounded-lg flex justify-center items-center hover:bg-red-500">
              <span className="text-center">Sign in</span>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default SideBar;
