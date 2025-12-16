import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
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
  available_meetup: number;
  on_break: number;
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
  const [availableMeetup, setAvailableMeetup] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [contactInfo, setContactInfo] = useState("");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        setAvailableMeetup(!!data.user.available_meetup);
        setOnBreak(!!data.user.on_break);
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

    // Validate required fields when availability is checked
    if ((availableSellXmr || availableBuyXmr || availableMeetup) && !postalCode) {
      setError("Zip/Postal Code is required when availability is enabled");
      setSaving(false);
      return;
    }

    if ((availableSellXmr || availableBuyXmr || availableMeetup) && !contactInfo) {
      setError("Contact Info is required when availability is enabled");
      setSaving(false);
      return;
    }

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
          availableMeetup,
          onBreak,
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

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setChangingPassword(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordSuccess(""), 3000);
      } else {
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (err) {
      setPasswordError("Network error. Please try again.");
      console.error("Password change error:", err);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault();
    setDeleteError("");
    setDeleting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      } else {
        setDeleteError(data.error || "Failed to delete account");
      }
    } catch (err) {
      setDeleteError("Network error. Please try again.");
      console.error("Delete account error:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
        <div className="flex justify-between items-start max-w-4xl">
          <div>
            <h2 className="font-bold text-4xl uppercase">Account</h2>
            <p className="mt-2 text-[#FAFAFA]">
              Logged in as <span className="text-orange-500">{user?.username}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all font-semibold rounded-md"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 max-w-md">
          <h3 className="font-bold text-2xl uppercase mb-4">Meet Settings</h3>
          <p className="text-[#FAFAFA] mb-6">
            Configure your availability to meet up for cash-to-XMR trades
          </p>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-600 text-green-200 rounded-md">
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
                className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
              >
                <option value="">Select a country</option>
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
                  Zip/Postal Code {(availableSellXmr || availableBuyXmr || availableMeetup) ? "(required)" : "(optional)"}
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
                  placeholder="e.g., 94102, M5H 2N2, 03810"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your zip/postal code helps others find meetups near you
                </p>
              </div>
            )}

            <div className="mb-6 p-4 bg-[#171717] border border-orange-600 rounded-md">
              <h4 className="font-semibold mb-4">Availability</h4>

              <label className={`flex items-center mb-3 ${onBreak ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={availableSellXmr}
                  onChange={(e) => setAvailableSellXmr(e.target.checked)}
                  disabled={onBreak}
                  className="w-5 h-5 accent-orange-600 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="ml-3 text-white">
                  I am available to sell XMR for cash
                </span>
              </label>

              <label className={`flex items-center mb-3 ${onBreak ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={availableBuyXmr}
                  onChange={(e) => setAvailableBuyXmr(e.target.checked)}
                  disabled={onBreak}
                  className="w-5 h-5 accent-orange-600 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="ml-3 text-white">
                  I am available to buy XMR with cash
                </span>
              </label>

              <label className={`flex items-center mb-3 ${onBreak ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={availableMeetup}
                  onChange={(e) => setAvailableMeetup(e.target.checked)}
                  disabled={onBreak}
                  className="w-5 h-5 accent-orange-600 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="ml-3 text-white">
                  I am available to meet up and hang out
                </span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={onBreak}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setOnBreak(isChecked);
                    if (isChecked) {
                      setAvailableSellXmr(false);
                      setAvailableBuyXmr(false);
                      setAvailableMeetup(false);
                    }
                  }}
                  className="w-5 h-5 accent-yellow-500 cursor-pointer"
                />
                <span className="ml-3 text-white">
                  I'm currently on break (still show on map)
                </span>
              </label>
            </div>

            <div className="mb-6">
              <label htmlFor="contactInfo" className="block mb-2 font-semibold">
                Contact Info {(availableSellXmr || availableBuyXmr || availableMeetup) ? "(required)" : "(optional)"}
              </label>
              <textarea
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                maxLength={64}
                className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
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
              className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>

          {/* Change Password Section */}
          <div className="mt-12">
            <h3 className="font-bold text-2xl uppercase mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange}>
              {passwordError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-600 text-green-200 rounded-md">
                  {passwordSuccess}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="currentPassword" className="block mb-2 font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="newPassword" className="block mb-2 font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500 rounded-md"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500 rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
              >
                {changingPassword ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Delete Account Section */}
          <div className="mt-12 pb-12">
            <h3 className="font-bold text-2xl uppercase mb-4 text-red-600">Danger Zone</h3>
            <div className="p-4 bg-[#171717] border border-red-600 rounded-md">
              <h4 className="font-semibold mb-2 text-red-500">Delete Account</h4>
              <p className="text-[#FAFAFA] text-sm mb-4">
                This will permanently delete your account. Your reviews will be anonymized but preserved.
              </p>

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all font-semibold rounded-md"
                >
                  Delete My Account
                </button>
              ) : (
                <form onSubmit={handleDeleteAccount}>
                  {deleteError && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md">
                      {deleteError}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="deletePassword" className="block mb-2 font-semibold text-[#FAFAFA]">
                      Confirm your password to delete account
                    </label>
                    <input
                      type="password"
                      id="deletePassword"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full px-4 py-2 bg-[#121212] border border-red-600 text-[#FAFAFA] focus:outline-none focus:border-red-500 rounded-md"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={deleting}
                      className="flex-1 py-2 bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                    >
                      {deleting ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="flex-1 py-2 bg-transparent border border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white transition-all font-semibold rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Account;
