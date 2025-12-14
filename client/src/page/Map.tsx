import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";
import "leaflet/dist/leaflet.css";

interface AvailableUser {
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
}

interface UserGroup {
  lat: number;
  lon: number;
  users: AvailableUser[];
}

function Map() {
  const [users, setUsers] = useState<AvailableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meetup`);
      const data = await response.json();

      if (data.success) {
        // Filter users who have coordinates
        const usersWithCoords = data.users.filter(
          (u: AvailableUser) => u.latitude !== null && u.longitude !== null
        );
        setUsers(usersWithCoords);
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

  // Group users by exact coordinates
  const groupByCoordinates = (userList: AvailableUser[]): UserGroup[] => {
    const groups: Record<string, AvailableUser[]> = {};

    userList.forEach((user) => {
      if (user.latitude && user.longitude) {
        const key = `${user.latitude},${user.longitude}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(user);
      }
    });

    return Object.entries(groups).map(([key, groupUsers]) => {
      const [lat, lon] = key.split(",").map(Number);
      return { lat, lon, users: groupUsers };
    });
  };

  const groupedUsers = groupByCoordinates(users);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-[48px] bg-[#232323] flex items-center justify-center">
          <p className="text-orange-600 text-xl">Loading map...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen pt-[48px] bg-[#232323] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-6 py-2 bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-[48px] bg-[#232323]">
        {users.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-48px)]">
            <div className="text-center text-gray-400">
              <p className="text-xl mb-2">No users with locations yet</p>
              <p className="text-sm">Add your location in Account settings to appear on the map</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[39.8283, -98.5795]}
            zoom={4}
            style={{ height: "calc(100vh - 48px)", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MarkerClusterGroup>
              {groupedUsers.map((group) => (
                <Marker key={`${group.lat},${group.lon}`} position={[group.lat, group.lon]}>
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold mb-3 text-gray-900">
                        {group.users.length} {group.users.length === 1 ? "user" : "users"}
                      </h3>
                      {group.users.map((user) => (
                        <div key={user.id} className="mb-3 pb-3 border-b border-gray-200 last:border-b-0">
                          <div className="font-semibold text-gray-900 mb-1">{user.username}</div>
                          <div className="text-sm text-gray-700 space-y-1">
                            {user.available_sell_xmr === 1 && (
                              <div>📤 Available to sell XMR</div>
                            )}
                            {user.available_buy_xmr === 1 && (
                              <div>📥 Available to buy XMR</div>
                            )}
                          </div>
                          {user.contact_info && (
                            <div className="text-xs mt-2">
                              {isLoggedIn ? (
                                <div className="text-gray-600">
                                  <strong>Contact:</strong> {user.contact_info}
                                </div>
                              ) : (
                                <div className="text-orange-600 font-semibold blur-sm select-none">
                                  Sign in to view contact info
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        )}
      </div>
    </Layout>
  );
}

export default Map;
