import { Bike, Users, Leaf, Lightbulb } from "lucide-react";

export default function Apropos() {
  return (
    <div className="bg-slate-100 min-h-screen px-6 py-12">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900">
          À propos de <span className="text-emerald-500">GreenWheels</span>
        </h1>
        <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
          GreenWheels est né d'une vision simple : rendre la mobilité urbaine plus verte,
          plus accessible et plus intelligente.
        </p>
      </div>

      {/* MISSION */}
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto mb-16">
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Notre Mission</h2>
          <p className="text-slate-600 mb-4">
            Nous croyons que la mobilité durable est la clé d’un avenir meilleur.
            GreenWheels met à disposition des vélos et scooters électriques
            partagés pour réduire la pollution, décongestionner les villes et offrir
            une alternative pratique aux transports traditionnels.
          </p>
          <p className="text-slate-600">
            Avec un réseau de stations stratégiquement placées et une application intuitive,
            nous rendons le transport vert accessible à tous.
          </p>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-emerald-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <Bike className="text-emerald-500 mb-3" size={40} />
          <p className="text-emerald-600 font-medium">
            Mobilité verte intelligente
          </p>
        </div>
      </div>

      {/* VALUES */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-semibold mb-10">
          Nos Valeurs
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* CARD */}
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Lightbulb className="mx-auto text-emerald-500 mb-3" />
            <h3 className="font-semibold">Qualité</h3>
            <p className="text-sm text-slate-500">
              Des véhicules entretenus et un service fiable.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Users className="mx-auto text-emerald-500 mb-3" />
            <h3 className="font-semibold">Communauté</h3>
            <p className="text-sm text-slate-500">
              Construire une communauté de citoyens engagés.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Lightbulb className="mx-auto text-emerald-500 mb-3" />
            <h3 className="font-semibold">Innovation</h3>
            <p className="text-sm text-slate-500">
              Technologies modernes pour une mobilité intelligente.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <Leaf className="mx-auto text-emerald-500 mb-3" />
            <h3 className="font-semibold">Écologie</h3>
            <p className="text-sm text-slate-500">
              Chaque trajet contribue à réduire les émissions de CO2.
            </p>
          </div>

        </div>
      </div>

      {/* CONTACT */}
      <div className="max-w-5xl mx-auto mt-16 border-t pt-8 text-sm text-slate-600">
        <h3 className="font-semibold mb-4">Contact</h3>

        <p>📍 Boumerdès, Algérie</p>
        <p>📞 +213 555 123 456</p>
        <p>✉️ contact@greenwheels.dz</p>

        <p className="text-center text-xs text-slate-400 mt-10">
          © 2026 GreenWheels. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}