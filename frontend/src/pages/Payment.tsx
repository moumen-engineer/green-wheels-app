import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
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
  ride_id?: number;
  vehicle_id: string | number;
  vehicle_name: string;
  duration_hours: number;
  total_price: number;
  start_date: string;
  end_date: string;
}

interface LocationState {
  plan?: Plan;
  reservation?: Reservation;
  from?: string;
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Cast location state to our interface
  const state = location.state as LocationState;
  const plan = state?.plan;
  const reservation = state?.reservation;
  const paymentData = plan || reservation;

  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/auth");

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      setRedirectPath("/auth");
      setShouldRedirect(true);
    }
  }, [authLoading, user]);

  // Handle missing payment data
  useEffect(() => {
    if (!paymentData && !authLoading) {
      setRedirectPath("/vehicles");
      setShouldRedirect(true);
    }
  }, [paymentData, authLoading]);

  // Handle redirects
  useEffect(() => {
    if (shouldRedirect) {
      navigate(redirectPath, { state: { from: "/payment", plan, reservation } });
    }
  }, [shouldRedirect, redirectPath, navigate, plan, reservation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, "");
    const matches = cleaned.match(/\d{4,16}/g);
    if (matches) {
      return matches[0].replace(/(\d{4})/g, "$1 ").trim();
    }
    return cleaned;
  };

  const formatExpiryDate = (value: string): string => {
    const clean = value.replace(/\D/g, "");
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "");
    if (!cardNumberClean.match(/^\d{16}$/)) {
      setError("Numéro de carte invalide (16 chiffres)");
      setLoading(false);
      return;
    }

    if (!formData.cardName.trim()) {
      setError("Nom sur la carte requis");
      setLoading(false);
      return;
    }

    if (!formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError("Date d'expiration invalide (MM/AA)");
      setLoading(false);
      return;
    }

    const [month, year] = formData.expiryDate.split("/");
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    if (expiryDate < today) {
      setError("Carte expirée");
      setLoading(false);
      return;
    }

    if (!formData.cvv.match(/^\d{3,4}$/)) {
      setError("CVV invalide (3 ou 4 chiffres)");
      setLoading(false);
      return;
    }

    if (!user || !user.id) {
      setError("Veuillez vous connecter d'abord");
      setLoading(false);
      setTimeout(() => navigate("/auth", { state: { from: "/payment", plan, reservation } }), 2000);
      return;
    }

    try {
      // Determine the amount and related IDs based on what we're paying for
      let amount: number;
      let subscription_id: number | null = null;
      let ride_id: number | null = null;

      if (plan) {
        // Payment for a subscription plan
        amount = typeof plan.price === 'string' ? parseFloat(plan.price) : Number(plan.price);
        subscription_id = typeof plan.id === 'string' ? parseInt(plan.id) : Number(plan.id);
      } else if (reservation) {
        // Payment for a ride reservation
        amount = reservation.total_price;
        ride_id = reservation.ride_id ?? null;
      } else {
        setError("Impossible de déterminer le montant du paiement");
        setLoading(false);
        return;
      }

      // Call backend API to create the payment
      const response = await fetch("http://localhost:5000/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subscription_id,
          ride_id,
          amount,
          method: "card",
          status: "completed",
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = "Erreur lors du traitement du paiement";
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const responseData = await response.json();
            errorMessage = responseData.message || errorMessage;
          } catch (e) {
            console.error("Failed to parse error response:", e);
          }
        }
        
        setError(`${errorMessage} (${response.status})`);
        setLoading(false);
        return;
      }

      const responseData = await response.json();

      // Navigate to success page with the created payment
      setLoading(false);
      navigate("/payment-success", { 
        state: { 
          plan, 
          reservation, 
          payment: responseData.payment 
        } 
      });
    } catch (err) {
      console.error("Payment error:", err);
      setError(`Erreur: ${err instanceof Error ? err.message : 'Erreur réseau'}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Paiement</h1>
          {paymentData && (
            <p className="text-slate-500 mt-2">
              {plan ? `${plan.title} - ${plan.price_display}` : `${reservation?.vehicle_name} - ${reservation?.total_price} DA`}
            </p>
          )}
        </div>

        {!paymentData ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <p className="text-slate-600 mb-4">Aucune information de paiement disponible</p>
            <button
              onClick={() => navigate("/vehicles")}
              className="w-full px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
            >
              Retour aux véhicules
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6 p-4 bg-emerald-50 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-600">{plan ? "Plan choisi" : "Véhicule réservé"}</p>
                  <p className="font-semibold text-slate-900">{plan ? plan.title : reservation?.vehicle_name}</p>
                  {reservation && (
                    <p className="text-xs text-slate-500 mt-1">{reservation.duration_hours}h</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Montant</p>
                  <p className="font-bold text-emerald-600">{plan ? plan.price_display : `${reservation?.total_price} DA`}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const formatted = formatCardNumber(e.target.value);
                    setFormData({ ...formData, cardNumber: formatted });
                  }}
                  maxLength={19}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom sur la carte
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="JEAN DUPONT"
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setFormData({ ...formData, expiryDate: formatted });
                    }}
                    maxLength={5}
                    placeholder="MM/AA"
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    maxLength={4}
                    placeholder="123"
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Traitement en cours..." : "Payer maintenant"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">🔒 Paiement 100% sécurisé (simulation)</p>
            <p className="text-xs text-slate-400 mt-1">
              Test: Utilisez 4111 1111 1111 1111 comme numéro de carte
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}