import { useNavigate } from "react-router-dom";
import scooter from "../assets/scooter2.png";

export default function VehicleDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-8">

      {/* BACK */}
      <button
        onClick={() => navigate("/vehicules")}
        className="text-sm text-slate-500 mb-6 hover:text-emerald-500"
      >
        ← Retour aux véhicules
      </button>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-start">

        {/* LEFT IMAGE */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <img
            src={scooter}
            alt="vehicle"
            className="w-full object-contain"
          />
        </div>

        {/* RIGHT */}
        <div>

          {/* TITLE */}
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Scooter city</h1>
            <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full">
              Disponible
            </span>
          </div>

          <p className="text-slate-500 mt-2">Vélo électrique</p>

          {/* RATING */}
          <div className="flex items-center gap-2 mt-3 text-sm">
            <span className="text-yellow-400">★</span>
            <span className="font-medium">4.6</span>
            <span className="text-slate-400">(128 avis)</span>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-4 text-slate-500 max-w-md">
            Le Vélo Urbain Pro est parfait pour les trajets quotidiens.
            Moteur puissant, batterie longue durée et design élégant.
          </p>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-4 mt-6">

            <div className="border rounded-xl p-3">
              <p className="text-sm text-slate-400">⚡ Autonomie</p>
              <p className="font-medium">60 km</p>
            </div>

            <div className="border rounded-xl p-3">
              <p className="text-sm text-slate-400">🔋 Batterie</p>
              <p className="font-medium">92 %</p>
            </div>

            <div className="border rounded-xl p-3">
              <p className="text-sm text-slate-400">📍 Station</p>
              <p className="font-medium">Bab El Oued</p>
            </div>

            <div className="border rounded-xl p-3">
              <p className="text-sm text-slate-400">🛡️ Assurance</p>
              <p className="font-medium">Incluse</p>
            </div>

          </div>

          {/* SPECS */}
          <div className="mt-6 border rounded-xl p-4">
            <h3 className="font-semibold mb-2">Spécifications</h3>

            <div className="grid grid-cols-2 text-sm text-slate-500 gap-2">
              <p>Poids : 22 kg</p>
              <p>Vitesse max : 25 km/h</p>
              <p>Temps de charge : 3h</p>
              <p>Vitesses : 7 vitesses</p>
            </div>
          </div>

          {/* PRICE + BUTTON */}
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-2xl font-bold text-emerald-500">
              350 DA/h
            </h2>

            <button className="bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600">
              Réserver maintenant
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}