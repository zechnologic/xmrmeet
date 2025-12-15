import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('pages');
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
        setError(data.error || t('meetup.errorNetwork'));
      }
    } catch (err) {
      setError(t('meetup.errorNetwork'));
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
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">{t('meetup.title')}</h2>
        <p className="mt-2 text-gray-400 max-w-2xl">
          {t('meetup.subtitle')}
        </p>

        <div className="mt-8 max-w-md space-y-4">
          <div>
            <label htmlFor="countryFilter" className="block mb-2 font-semibold">
              {t('meetup.filterCountry')}
            </label>
            <select
              id="countryFilter"
              value={countryFilter}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">{t('meetup.filterCountryAll')}</option>
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
                {t('meetup.filterState')}
              </label>
              <select
                id="stateFilter"
                value={stateFilter}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">{t('meetup.filterStateAll')}</option>
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
                {t('meetup.filterCity')}
              </label>
              <input
                type="text"
                id="cityFilter"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
                placeholder={t('meetup.filterCityPlaceholder')}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-600 text-red-200 max-w-2xl">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-gray-400">{t('meetup.loading')}</p>
        ) : users.length === 0 ? (
          <div className="mt-8 p-6 bg-[#2a2a2a] border border-orange-600 max-w-2xl">
            <p className="text-gray-400">
              {t('meetup.noUsers')}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4 max-w-2xl">
            <p className="text-gray-400">
              {t('meetup.found')} {users.length} {users.length === 1 ? t('meetup.user') : t('meetup.users')}
            </p>
            {users.map((user) => (
              <div
                key={user.id}
                className="p-6 bg-[#2a2a2a] border border-orange-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/user/${user.username}`}>
                      <h3 className="font-bold text-xl text-orange-500 hover:text-orange-400 cursor-pointer">
                        {user.username}
                      </h3>
                    </Link>
                    {(user.country || user.state || user.city) && (
                      <p className="text-gray-400 mt-1">
                        <span className="text-orange-600">📍</span> {getLocationString(user)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {user.available_sell_xmr === 1 && (
                    <div className="flex items-center text-white">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('meetup.availableSell')}
                    </div>
                  )}
                  {user.available_buy_xmr === 1 && (
                    <div className="flex items-center text-white">
                      <span className="text-green-500 mr-2">✓</span>
                      {t('meetup.availableBuy')}
                    </div>
                  )}
                </div>

                {user.contact_info && (
                  <div className="mt-4 p-3 bg-[#232323] border border-orange-900">
                    <p className="text-xs text-gray-500 uppercase mb-1">
                      {t('meetup.contact')}
                    </p>
                    {isLoggedIn ? (
                      <p className="text-white whitespace-pre-wrap">
                        {user.contact_info}
                      </p>
                    ) : (
                      <div className="relative">
                        <p className="text-white whitespace-pre-wrap blur-sm select-none">
                          {user.contact_info}
                        </p>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <a
                            href="/login"
                            className="px-4 py-2 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
                          >
                            {t('meetup.signInToView')}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Meetup;
