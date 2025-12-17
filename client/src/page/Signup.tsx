import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/account");
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (username.length < 4) {
      setError("Username must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, website: "" }),
      });

      const data = await response.json();

      if (data.success) {
        // Auto-login after successful signup
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const loginData = await loginResponse.json();

        if (loginData.success) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify(loginData.user));
          navigate("/account");
          window.location.reload();
        } else {
          navigate("/login");
        }
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">Sign Up</h2>
        <p className="mt-4 text-[#FAFAFA] max-w-md">
          Create an anonymous account to start connecting with the Monero community.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200 rounded-md">
              {error}
            </div>
          )}
          {/* Honeypot field - hidden from users, catches bots */}
          <input
            type="text"
            name="website"
            autoComplete="off"
            tabIndex={-1}
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
            }}
            aria-hidden="true"
          />
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-semibold">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
              placeholder="Choose a username (min 4 characters)"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
              placeholder="Choose a password (min 8 characters)"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#171717] border border-orange-600 text-[#FAFAFA] focus:outline-none focus:border-orange-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
          <div className="mt-4 text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              to="/login"
              className="hover:text-orange-500 transition-all"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Signup;
