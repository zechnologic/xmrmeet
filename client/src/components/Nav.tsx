import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Nav() {
  const { t } = useTranslation('common');
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
    <div className="w-full absolute top-0 left-0 h-[48px] flex items-center justify-between px-4 border-b border-orange-600 bg-[#232323] text-orange-600">
      <Link to="/">
        <div className="font-bold cursor-pointer hover:text-orange-500 transition-colors">
          {t('nav.brand')}
        </div>
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/about">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            {t('nav.about')}
          </button>
        </Link>
        <Link to="/how-it-works">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            {t('nav.howItWorks')}
          </button>
        </Link>
        <Link to="/meet">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            {t('nav.meet')}
          </button>
        </Link>
        <Link to="/map">
          <button className="px-4 py-1 hover:text-orange-500 transition-colors">
            {t('nav.map')}
          </button>
        </Link>
        <LanguageSwitcher />
        {isLoggedIn ? (
          <Link to="/account">
            <button className="px-4 py-1 bg-orange-600 text-white hover:bg-orange-700 transition-colors">
              {t('nav.account')}
            </button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <button className="px-4 py-1 hover:text-orange-500 transition-colors">
                {t('nav.login')}
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-4 py-1 bg-orange-600 text-white hover:bg-orange-700 transition-colors">
                {t('nav.signup')}
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
