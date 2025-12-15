import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

function Login() {
  const { t } = useTranslation('forms');
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/account");
        window.location.reload(); // Refresh to update nav
      } else {
        setError(data.error || t('login.errorGeneric'));
      }
    } catch (err) {
      setError(t('login.errorNetwork'));
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">{t('login.title')}</h2>
        <p className="mt-4 text-gray-400 max-w-md">
          {t('login.subtitle')}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-semibold">
              {t('login.username')}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              placeholder={t('login.usernamePlaceholder')}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 font-semibold">
              {t('login.password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              placeholder={t('login.passwordPlaceholder')}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('login.submitting') : t('login.submit')}
          </button>
          <div className="mt-4 text-center">
            <span className="text-gray-400">{t('login.noAccount')} </span>
            <Link
              to="/signup"
              className="hover:text-orange-500 transition-colors"
            >
              {t('login.signupLink')}
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Login;
