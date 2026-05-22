import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Test if session is working
      const testResponse = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });
      const testData = await testResponse.json();
      console.log("Session check:", testData);
      
      // Role-based redirect
      if (data.user.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/abonnements");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="logo" className="mx-auto w-14 mb-3" />
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-slate-500">
            Connectez-vous à votre compte
          </p>
        </div>

        <div className="flex rounded-xl bg-slate-200 p-1">
          <button className="flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-slate-900 shadow">
            Connexion
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleLogin} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          <label className="mt-4 text-sm font-medium text-slate-700 block">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          <button
            type="button"
            className="mt-3 text-sm text-emerald-500 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Mot de passe oublié ?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm hover:bg-slate-100 transition"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="google"
              className="w-5"
            />
            Se connecter avec Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;