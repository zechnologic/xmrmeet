import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
    }

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      setIsLoggedIn(!!token && !!userData);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="w-full absolute top-0 left-0 h-[48px] flex items-center justify-between px-4 border-b border-orange-600 bg-[#121212] text-orange-600">
      <Link to="/">
        <div className="font-bold cursor-pointer hover:text-orange-500 transition-colors">
          XMR Meet
        </div>
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/about">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            About
          </button>
        </Link>
        <Link to="/how-it-works">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            How It Works
          </button>
        </Link>
        <Link to="/meet">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            Meet
          </button>
        </Link>
        <Link to="/map">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            Map
          </button>
        </Link>
        {isLoggedIn ? (
          <Link to="/account">
            <button className="px-4 py-2 bg-orange-600 text-[#FAFAFA] hover:bg-orange-700 transition-all rounded-md">
              Account
            </button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <button className="px-4 py-1 hover:text-orange-500 transition-colors">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-2 bg-orange-600 text-[#FAFAFA] hover:bg-orange-700 transition-all rounded-md">
                Sign up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
