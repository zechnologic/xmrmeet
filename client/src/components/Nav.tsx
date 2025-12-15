import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <>
      <div className="w-full absolute top-0 left-0 h-[56px] flex items-center justify-between px-4 border-b border-orange-600 bg-[#121212] text-orange-600">
        <Link to="/">
          <div className="font-bold cursor-pointer hover:text-orange-500 transition-colors">
            XMR Meet
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-4 items-center">
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

        {/* Mobile Nav - Only Meet/Map and Auth buttons */}
        <div className="flex md:hidden gap-2 items-center">
          <Link to="/meet">
            <button className="px-3 py-1 hover:text-orange-500 transition-colors text-sm">
              Meet
            </button>
          </Link>
          <Link to="/map">
            <button className="px-3 py-1 hover:text-orange-500 transition-colors text-sm">
              Map
            </button>
          </Link>
          {isLoggedIn ? (
            <Link to="/account">
              <button className="px-3 py-1.5 bg-orange-600 text-[#FAFAFA] hover:bg-orange-700 transition-all rounded-md text-sm">
                Account
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="px-3 py-1.5 bg-orange-600 text-[#FAFAFA] hover:bg-orange-700 transition-all rounded-md text-sm">
                Login
              </button>
            </Link>
          )}

          {/* Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2 p-1 hover:text-orange-500 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[48px] left-0 w-full bg-[#121212] border-b border-orange-600 z-50">
          <div className="flex flex-col py-2">
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full text-left px-4 py-3 text-orange-600 hover:bg-[#171717] hover:text-orange-500 transition-all">
                About
              </button>
            </Link>
            <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)}>
              <button className="w-full text-left px-4 py-3 text-orange-600 hover:bg-[#171717] hover:text-orange-500 transition-all">
                How It Works
              </button>
            </Link>
            {!isLoggedIn && (
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full text-left px-4 py-3 text-orange-600 hover:bg-[#171717] hover:text-orange-500 transition-all">
                  Sign up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
