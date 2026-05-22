import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// --- Interfaces ---
interface Plan {
  id: string | number;
  title: string;
  price: string | number;
  price_display: string;
}

interface Reservation {
  vehicle_id?: string;
  vehicle_name: string;
  duration_hours: number;
  total_price: number;
  start_date: string;
  end_date: string;
}

interface PaymentData {
  id?: string | number;
  paid_at?: string;
  amount?: number;
  method?: string;
  status?: string;
}

interface LocationState {
  plan?: Plan;
  reservation?: Reservation;
  payment?: PaymentData;
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedPayment, setSavedPayment] = useState<PaymentData | null>(null);

  const state = location.state as LocationState;
  const plan = state?.plan;
  const reservation = state?.reservation;
  const payment = state?.payment;

  useEffect(() => {
    // If someone tries to access this page directly without payment info
    if (!plan && !reservation) {
      navigate("/vehicles");
    }
  }, [plan, reservation, navigate]);

  // Fetch the actual payment from backend if we have an ID
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (payment?.id && user) {
        try {
          const response = await fetch(`/api/payments/${payment.id}`, {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setSavedPayment(data.payment);
          }
        } catch (err) {
          console.error("Failed to fetch payment details:", err);
        }
      }
    };
    fetchPaymentDetails();
  }, [payment?.id, user]);

  const formatDate = (dateString?: string) => {
    if (dateString) {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatAmount = (amount?: number) => {
    if (amount) {
      return `${amount.toLocaleString()} DA`;
    }
    return plan ? plan.price_display : `${reservation?.total_price} DA`;
  };

  if (!plan && !reservation) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon with Animation */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
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
          Paiement réussi ! 🎉
        </h1>
        
        <p className="text-slate-500 mb-6">
          {plan ? (
            <>Merci pour votre achat. Votre abonnement <span className="font-semibold text-slate-700">{plan.title}</span> est maintenant actif.</>
          ) : (
            <>Merci pour votre réservation. Votre véhicule <span className="font-semibold text-slate-700">{reservation?.vehicle_name}</span> est réservé.</>
          )}
        </p>

        {/* Payment Details Card */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-slate-600 mb-3 font-semibold border-b border-slate-200 pb-2">
            📋 Détails du paiement :
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">{plan ? "Plan souscrit" : "Véhicule réservé"} :</span>
              <span className="font-medium text-slate-900">{plan ? plan.title : reservation?.vehicle_name}</span>
            </div>
            
            {reservation && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Durée :</span>
                  <span className="font-medium text-slate-900">{reservation.duration_hours} heures</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Période :</span>
                  <span className="font-medium text-slate-900 text-xs">
                    {formatDate(reservation.start_date)} - {formatDate(reservation.end_date)}
                  </span>
                </div>
              </>
            )}
            
            <div className="flex justify-between">
              <span className="text-slate-500">Montant payé :</span>
              <span className="font-bold text-emerald-600 text-base">
                {formatAmount(savedPayment?.amount || payment?.amount)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-500">Date du paiement :</span>
              <span className="font-medium text-slate-900">
                {formatDate(savedPayment?.paid_at || payment?.paid_at)}
              </span>
            </div>
            
            {savedPayment?.method && (
              <div className="flex justify-between">
                <span className="text-slate-500">Méthode :</span>
                <span className="font-medium text-slate-900 capitalize">{savedPayment.method}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-slate-500">Statut :</span>
              <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ✓ Confirmé
              </span>
            </div>
            
            {payment?.id && (
              <div className="flex justify-between pt-2 mt-1 border-t border-slate-200">
                <span className="text-xs text-slate-400">Transaction ID:</span>
                <span className="text-xs font-mono text-slate-500">#{payment.id}</span>
              </div>
            )}
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-blue-50 rounded-xl p-3 mb-6 text-left">
          <p className="text-xs text-blue-700">
            {plan ? (
              "✅ Votre abonnement est maintenant actif. Vous pouvez réserver des véhicules sans frais supplémentaires selon les conditions de votre forfait."
            ) : (
              "✅ Votre réservation a été confirmée. Vous recevrez un email de confirmation avec les détails de votre location."
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            📊 Aller au tableau de bord
          </button>
          
          <button
            onClick={() => navigate(plan ? "/subscriptions" : "/vehicles")}
            className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
          >
            {plan ? "🔍 Voir d'autres abonnements" : "🚗 Voir d'autres véhicules"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-slate-500 py-2 text-sm hover:text-slate-700 transition"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}