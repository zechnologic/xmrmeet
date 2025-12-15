import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";

function Home() {
  const { t } = useTranslation('pages');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">
          {t('home.hero.title')}
        </h2>
        <h3 className="font-semibold text-xl mt-4 text-gray-300 max-w-2xl">
          {t('home.hero.subtitle')}
        </h3>
        <div className="mt-8 flex gap-4">
          <Link to="/meet">
            <button className="text-white bg-orange-600 hover:bg-orange-700 transition-colors px-6 h-12 cursor-pointer font-semibold">
              {t('home.hero.browseCta')}
            </button>
          </Link>
          {!isLoggedIn && (
            <Link to="/signup">
              <button className="text-orange-600 border border-orange-600 hover:bg-orange-600/10 transition-colors px-6 h-12 cursor-pointer font-semibold">
                {t('home.hero.signupCta')}
              </button>
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
