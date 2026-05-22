import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan, payment } = location.state || {};

  useEffect(() => {
    if (!plan) {
      navigate("/abonnements");
    }
  }, [plan, navigate]);

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Paiement réussi !
        </h1>
        
        <p className="text-slate-500 mb-6">
          Merci pour votre achat. Votre abonnement {plan.title} est maintenant actif.
        </p>

        {/* Payment Details */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-slate-600 mb-2">Détails du paiement :</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Plan :</span>
              <span className="font-medium">{plan.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Montant :</span>
              <span className="font-medium text-emerald-600">{plan.price_display}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date :</span>
              <span className="font-medium">
                {payment?.paid_at ? new Date(payment.paid_at).toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Statut :</span>
              <span className="font-medium text-emerald-600">Confirmé</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
          >
            Aller au tableau de bord
          </button>
          
          <button
            onClick={() => navigate("/abonnements")}
            className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
          >
            Voir d'autres abonnements
          </button>
        </div>
      </div>
    </div>
  );
}