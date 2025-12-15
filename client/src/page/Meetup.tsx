import { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

interface AvailableUser {
  id: string;
  username: string;
  country: string | null;
  state: string | null;
  city: string | null;
  available_sell_xmr: number;
  available_buy_xmr: number;
  contact_info: string | null;
  created_at: number;
}

interface Country {
  code: string;
  name: string;
  states: State[];
}

interface State {
  code: string;
  name: string;
}

function Meetup() {
  const [users, setUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [locations, setLocations] = useState<Country[]>([]);
  const [countryFilter, setCountryFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchAvailableUsers();
  }, [countryFilter, stateFilter, cityFilter]);

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations`);
      const data = await response.json();
      if (data.success) {
        setLocations(data.locations);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    }
  };

  const fetchAvailableUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (countryFilter) params.append("country", countryFilter);
      if (stateFilter) params.append("state", stateFilter);
      if (cityFilter) params.append("city", cityFilter);

      const url = `${API_BASE_URL}/api/meetup${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountryFilter(newCountry);
    setStateFilter("");
    setCityFilter("");
  };

  const handleStateChange = (newState: string) => {
    setStateFilter(newState);
    setCityFilter("");
  };

  const selectedCountryData = locations.find((loc) => loc.code === countryFilter);

  const getLocationString = (user: AvailableUser): string => {
    const parts: string[] = [];
    if (user.city) parts.push(user.city);
    if (user.state) {
      const country = locations.find((c) => c.code === user.country);
      const state = country?.states.find((s) => s.code === user.state);
      if (state) parts.push(state.name);
    }
    if (user.country) {
      const country = locations.find((c) => c.code === user.country);
      if (country) parts.push(country.name);
    }
    return parts.join(", ");
  };

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">Meetup</h2>
        <p className="mt-2 text-[#FAFAFA] max-w-2xl">
          Connect with people in your area who want to trade XMR for cash
        </p>

        <div className="mt-8 max-w-md space-y-4">
          <div>
            <label htmlFor="countryFilter" className="block mb-2 font-semibold">
              Filter by Country
            </label>
            <select
              id="countryFilter"
              value={countryFilter}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
            >
              <option value="">All countries</option>
              {locations.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {countryFilter && selectedCountryData && (
            <div>
              <label htmlFor="stateFilter" className="block mb-2 font-semibold">
                Filter by State/Province
              </label>
              <select
                id="stateFilter"
                value={stateFilter}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
              >
                <option value="">All states/provinces</option>
                {selectedCountryData.states.map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {countryFilter && (
            <div>
              <label htmlFor="cityFilter" className="block mb-2 font-semibold">
                Filter by City
              </label>
              <input
                type="text"
                id="cityFilter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
                placeholder="Enter city name"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-600 text-red-200 max-w-2xl rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-[#FAFAFA]">Loading...</p>
        ) : users.length === 0 ? (
          <div className="mt-8 p-6 bg-[#171717] border border-orange-600 max-w-2xl rounded-md">
            <p className="text-[#FAFAFA]">
              No users are currently available for meetups with the selected filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 max-w-7xl">
            <p className="text-[#FAFAFA] mb-4">
              Found {users.length} {users.length === 1 ? "user" : "users"}
            </p>
            <div className="overflow-x-auto border border-orange-600 rounded-md">
              <table className="w-full bg-[#171717]">
                <thead>
                  <tr className="border-b border-orange-600">
                    <th className="px-4 py-3 text-left text-orange-500 font-semibold">Username</th>
                    <th className="px-4 py-3 text-left text-orange-500 font-semibold">Location</th>
                    <th className="px-4 py-3 text-center text-orange-500 font-semibold">Sell XMR</th>
                    <th className="px-4 py-3 text-center text-orange-500 font-semibold">Buy XMR</th>
                    <th className="px-4 py-3 text-left text-orange-500 font-semibold">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-orange-900 hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/user/${user.username}`}>
                          <span className="text-orange-500 hover:text-orange-400 font-semibold cursor-pointer">
                            {user.username}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[#FAFAFA] text-sm">
                        {(user.country || user.state || user.city) ? getLocationString(user) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.available_sell_xmr === 1 ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {user.available_buy_xmr === 1 ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#FAFAFA] text-sm">
                        {user.contact_info ? (
                          isLoggedIn ? (
                            <span className="whitespace-pre-wrap break-all">{user.contact_info}</span>
                          ) : (
                            <a
                              href="/login"
                              className="text-orange-500 hover:text-orange-400 underline text-xs"
                            >
                              Sign in to view
                            </a>
                          )
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Meetup;
