import { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "../components/Layout";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-7xl mx-auto">
          <div className="flex-1">
            <h2 className="font-bold text-4xl uppercase">
              Connect with Monero enthusiasts
            </h2>
            <h3 className="font-semibold text-xl mt-4 text-[#FAFAFA] max-w-2xl">
              XMR Meet is a community directory for Monero enthusiasts looking
              to connect in person. Find like-minded people in your area for
              casual meetups and XMR/cash exchanges.
            </h3>
            <div className="mt-8 flex gap-4">
              <Link to="/meet">
                <button className="text-white bg-orange-600 hover:bg-orange-700 transition-all px-6 h-12 cursor-pointer font-semibold rounded-md">
                  Browse Meetups
                </button>
              </Link>
              {!isLoggedIn && (
                <Link to="/signup">
                  <button className="text-orange-600 border border-orange-600 hover:bg-orange-600/10 transition-all px-6 h-12 cursor-pointer font-semibold rounded-md">
                    Sign up
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 w-full lg:w-auto max-w-160">
            <img
              src="/meeting2.png"
              alt="Monero meetup"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
