import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    // Validation matching backend requirements
    if (!formData.full_name || formData.full_name.trim().length < 2) {
      setLocalError("Le nom doit contenir au moins 2 caractères");
      return;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Email valide requis");
      return;
    }

    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      setLocalError("Le numéro de téléphone doit contenir exactement 10 chiffres");
      return;
    }

    if (!formData.password || formData.password.length < 8) {
      setLocalError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await signup({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      // Get updated user from localStorage to check role
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/abonnements");
      }
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-6">
          <img src={Logo} alt="logo" className="mx-auto w-14 mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">Inscription</h1>
          <p className="text-sm text-slate-500">Créez votre compte</p>
        </div>

        {/* TABS */}
        <div className="flex rounded-xl bg-slate-200 p-1">
          <button
            onClick={() => navigate("/login")}
            className="flex-1 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Connexion
          </button>

          <button className="flex-1 rounded-lg bg-white py-2 text-sm font-semibold text-slate-900 shadow">
            Inscription
          </button>
        </div>

        {/* CARD */}
        <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          {/* ERROR MESSAGE */}
          {(localError || error) && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {localError || error}
            </div>
          )}

          {/* FULL NAME */}
          <label className="text-sm font-medium text-slate-700">
            Nom complet
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          {/* EMAIL */}
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          {/* PHONE */}
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Téléphone (10 chiffres)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="0612345678"
            maxLength="10"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          {/* PASSWORD */}
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Mot de passe (min. 8 caractères)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          {/* CONFIRM PASSWORD */}
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>

          {/* GOOGLE */}
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm hover:bg-slate-100 transition"
          >
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
              alt="google"
              className="w-5"
            />
            S'inscrire avec Google
          </button>
        </form>
      </div>
    </div>
  );
}