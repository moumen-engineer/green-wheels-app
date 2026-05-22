import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      
      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-6">
          <img src={Logo} alt="logo" className="mx-auto w-14 mb-3" />
          <h1 className="text-2xl font-bold text-slate-900">
            Mot de passe oublié
          </h1>
          <p className="text-sm text-slate-500">
            Entrez votre email pour réinitialiser
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          
          {/* EMAIL */}
          <label className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 outline-none focus:border-emerald-500"
          />

          {/* BUTTON */}
          <button className="mt-5 w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition">
            Envoyer le lien
          </button>

          {/* BACK */}
          <button
            onClick={() => navigate("/login")}
            className="mt-3 w-full text-sm text-emerald-500 hover:underline"
          >
            Retour à la connexion
          </button>
        </div>

      </div>
    </div>
  );
}