import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

interface UserSettings {
  id: string;
  username: string;
  country: string | null;
  state: string | null;
  city: string | null;
  available_sell_xmr: number;
  available_buy_xmr: number;
  contact_info: string | null;
  created_at: number;
  updated_at: number;
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

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [locations, setLocations] = useState<Country[]>([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [availableSellXmr, setAvailableSellXmr] = useState(false);
  const [availableBuyXmr, setAvailableBuyXmr] = useState(false);
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchLocations();
    fetchUserData(token);
  }, [navigate]);

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

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setCountry(data.user.country || "");
        setState(data.user.state || "");
        setCity(data.user.city || "");
        setAvailableSellXmr(!!data.user.available_sell_xmr);
        setAvailableBuyXmr(!!data.user.available_buy_xmr);
        setContactInfo(data.user.contact_info || "");
      } else {
        setError(data.error || "Failed to fetch user data");
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setState("");
    setCity("");
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    setCity("");
  };

  const selectedCountryData = locations.find((loc) => loc.code === country);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: country || null,
          state: state || null,
          city: city || null,
          availableSellXmr,
          availableBuyXmr,
          contactInfo: contactInfo || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSuccess("Settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Failed to update settings");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">Account</h2>
        <p className="mt-2 text-gray-400">
          Logged in as <span className="text-orange-500">{user?.username}</span>
        </p>

        <div className="mt-8 max-w-md">
          <h3 className="font-bold text-2xl uppercase mb-4">Meet Settings</h3>
          <p className="text-gray-400 mb-6">
            Configure your availability to meet up for cash-to-XMR trades
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-600 text-green-200">
                {success}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="country" className="block mb-2 font-semibold">
                Country (optional)
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">Select a country</option>
                {locations.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {country && selectedCountryData && (
              <div className="mb-4">
                <label htmlFor="state" className="block mb-2 font-semibold">
                  State/Province (optional)
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select a state/province</option>
                  {selectedCountryData.states.map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {country && (
              <div className="mb-6">
                <label htmlFor="city" className="block mb-2 font-semibold">
                  City (optional)
                </label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
                  placeholder="Enter your city"
                />
              </div>
            )}

            <div className="mb-6 p-4 bg-[#2a2a2a] border border-orange-600">
              <h4 className="font-semibold mb-4">Availability</h4>

              <label className="flex items-center mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableSellXmr}
                  onChange={(e) => setAvailableSellXmr(e.target.checked)}
                  className="w-5 h-5 accent-orange-600 cursor-pointer"
                />
                <span className="ml-3 text-white">
                  I am available to sell XMR for cash
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableBuyXmr}
                  onChange={(e) => setAvailableBuyXmr(e.target.checked)}
                  className="w-5 h-5 accent-orange-600 cursor-pointer"
                />
                <span className="ml-3 text-white">
                  I am available to buy XMR with cash
                </span>
              </label>
            </div>

            <div className="mb-6">
              <label htmlFor="contactInfo" className="block mb-2 font-semibold">
                Contact Info (optional)
              </label>
              <textarea
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
                placeholder="How should people contact you? (e.g., Signal, Telegram, Email)"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be publicly visible if you enable availability
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Account;
