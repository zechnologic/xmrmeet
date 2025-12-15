import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

interface UserSettings {
  id: string;
  username: string;
  country: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  available_sell_xmr: number;
  available_buy_xmr: number;
  contact_info: string | null;
  created_at: number;
  updated_at: number;
}

interface Country {
  code: string;
  name: string;
  states: Array<{code: string; name: string}>;
}

function Account() {
  const { t } = useTranslation('forms');
  const navigate = useNavigate();
  const [user, setUser] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [locations, setLocations] = useState<Country[]>([]);
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
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
        setPostalCode(data.user.postal_code || "");
        setAvailableSellXmr(!!data.user.available_sell_xmr);
        setAvailableBuyXmr(!!data.user.available_buy_xmr);
        setContactInfo(data.user.contact_info || "");
      } else {
        setError(data.error || t('account.errorGeneric'));
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (err) {
      setError(t('account.errorNetwork'));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
    setPostalCode("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Refresh to update nav
  };

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
          postalCode: postalCode || null,
          availableSellXmr,
          availableBuyXmr,
          contactInfo: contactInfo || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setSuccess(t('account.successMessage'));
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || t('account.errorGeneric'));
      }
    } catch (err) {
      setError(t('account.errorNetwork'));
      console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
          <p>{t('account.loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <div className="flex justify-between items-start max-w-4xl">
          <div>
            <h2 className="font-bold text-4xl uppercase">{t('account.title')}</h2>
            <p className="mt-2 text-gray-400">
              {t('account.loggedInAs')} <span className="text-orange-500">{user?.username}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-colors font-semibold"
          >
            {t('account.logout')}
          </button>
        </div>

        <div className="mt-8 max-w-md">
          <h3 className="font-bold text-2xl uppercase mb-4">{t('account.settingsTitle')}</h3>
          <p className="text-gray-400 mb-6">
            {t('account.settingsSubtitle')}
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
                {t('account.country')}
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">{t('account.countryPlaceholder')}</option>
                {locations.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {country && (
              <div className="mb-6">
                <label htmlFor="postalCode" className="block mb-2 font-semibold">
                  {t('account.postalCode')}
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
                  placeholder={t('account.postalCodePlaceholder')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('account.postalCodeHelp')}
                </p>
              </div>
            )}

            <div className="mb-6 p-4 bg-[#2a2a2a] border border-orange-600">
              <h4 className="font-semibold mb-4">{t('account.availability')}</h4>

              <label className="flex items-center mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableSellXmr}
                  onChange={(e) => setAvailableSellXmr(e.target.checked)}
                  className="w-5 h-5 accent-orange-600 cursor-pointer"
                />
                <span className="ml-3 text-white">
                  {t('account.availableSell')}
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
                  {t('account.availableBuy')}
                </span>
              </label>
            </div>

            <div className="mb-6">
              <label htmlFor="contactInfo" className="block mb-2 font-semibold">
                {t('account.contactInfo')}
              </label>
              <textarea
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
                placeholder={t('account.contactInfoPlaceholder')}
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('account.contactInfoHelp')}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('account.submitting') : t('account.submit')}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Account;
