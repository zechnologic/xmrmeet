import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Layout from "../components/Layout";
import { API_BASE_URL } from "../config/api";

function Signup() {
  const { t } = useTranslation('forms');
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
      setError(t('validation.passwordsMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('validation.passwordTooShort'));
      return;
    }

    if (username.length < 3) {
      setError(t('validation.usernameTooShort'));
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
        setError(data.error || t('signup.errorGeneric'));
      }
    } catch (err) {
      setError(t('signup.errorNetwork'));
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase">{t('signup.title')}</h2>
        <p className="mt-4 text-gray-400 max-w-md">
          {t('signup.subtitle')}
        </p>
        <form onSubmit={handleSubmit} className="mt-8 max-w-md">
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-600 text-red-200">
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
              {t('signup.username')}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              placeholder={t('signup.usernamePlaceholder')}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-semibold">
              {t('signup.password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              placeholder={t('signup.passwordPlaceholder')}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
              {t('signup.confirmPassword')}
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] border border-orange-600 text-white focus:outline-none focus:border-orange-500"
              placeholder={t('signup.confirmPasswordPlaceholder')}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-orange-600 hover:bg-orange-700 transition-colors cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('signup.submitting') : t('signup.submit')}
          </button>
          <div className="mt-4 text-center">
            <span className="text-gray-400">{t('signup.haveAccount')} </span>
            <Link
              to="/login"
              className="hover:text-orange-500 transition-colors"
            >
              {t('signup.loginLink')}
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default Signup;
