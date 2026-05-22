import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: 1,
    title: "Horaire",
    price: "200",
    price_display: "200 DA",
    period: "/heure",
    description: "Idéal pour les courts trajets",
    features: [
      "1 heure de location",
      "Tous véhicules",
      "Assurance incluse",
      "Annulation gratuite",
    ],
  },
  {
    id: 2,
    title: "Journalier",
    price: "750",
    price_display: "750 DA",
    period: "/jour",
    description: "Parfait pour une journée d'exploration",
    popular: true,
    features: [
      "24 heures de location",
      "Tous véhicules",
      "Assurance incluse",
      "Annulation gratuite",
      "Support prioritaire",
    ],
  },
  {
    id: 3,
    title: "Mensuel",
    price: "5000",
    price_display: "5 000 DA",
    period: "/mois",
    description: "Pour les trajets quotidiens",
    features: [
      "Accès illimité",
      "Tous véhicules",
      "Assurance premium",
      "Annulation gratuite",
      "Support 24/7",
      "Tarifs réduits",
    ],
  },
  {
    id: 4,
    title: "Annuel",
    price: "40000",
    price_display: "40 000 DA",
    period: "/an",
    description: "L'offre la plus avantageuse",
    features: [
      "Accès illimité",
      "Tous véhicules",
      "Assurance premium",
      "Annulation gratuite",
      "Support VIP",
      "Tarifs réduits",
      "2 mois gratuits",
    ],
  },
];

export default function Abonnements() {
  const navigate = useNavigate();

  const handleChoosePlan = (plan) => {
    // Navigate to payment page with plan data
    navigate("/payment", { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900">
          Nos Abonnements
        </h1>
        <p className="text-slate-500 mt-2">
          Choisissez le plan qui correspond à vos besoins de mobilité.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-3xl p-8 bg-white shadow-sm border 
            ${plan.popular ? "border-emerald-500 shadow-md" : "border-slate-200"}`}
          >
            
            {/* POPULAR BADGE */}
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-4 py-1 rounded-full shadow">
                ⭐ Populaire
              </span>
            )}

            {/* TITLE */}
            <h2 className="text-xl font-semibold text-center">
              {plan.title}
            </h2>

            <p className="text-center text-slate-400 text-sm mt-1">
              {plan.description}
            </p>

            {/* PRICE */}
            <p className="text-center text-2xl font-bold text-emerald-500 mt-4">
              {plan.price_display}
              <span className="text-sm text-slate-400">
                {plan.period}
              </span>
            </p>

            {/* FEATURES */}
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-emerald-500">✔</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* BUTTON */}
            <button
              onClick={() => handleChoosePlan(plan)}
              className={`mt-8 w-full rounded-xl py-3 font-medium transition 
              ${
                plan.popular
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "border border-slate-300 hover:bg-slate-100"
              }`}
            >
              Choisir ce plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}