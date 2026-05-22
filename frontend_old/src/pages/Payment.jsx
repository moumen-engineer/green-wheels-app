import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan } = location.state || {};

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        
        if (!response.ok) {
          console.log("Not authenticated, redirecting to login");
          navigate("/login", { state: { from: "/payment", plan } });
          return;
        }
        
        const data = await response.json();
        console.log("Authenticated user:", data);
        
        // Also check localStorage
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (!localUser && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("Auth check error:", err);
        navigate("/login", { state: { from: "/payment", plan } });
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate, plan]);

  if (!plan) {
    navigate("/abonnements");
    return null;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, "");
    const matches = cleaned.match(/\d{4,16}/g);
    if (matches) {
      return matches[0].replace(/(\d{4})/g, "$1 ").trim();
    }
    return cleaned;
  };

  const formatExpiryDate = (value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length >= 2) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  };

  const handleSubmit = async (e) => {
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

    // Check if expiry date is not expired
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

    // Get current user from localStorage or try session
    let user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      // Try to get user from session
      try {
        const meResponse = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (meResponse.ok) {
          const meData = await meResponse.json();
          user = meData.user;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        console.error("Failed to get user:", err);
      }
    }
    
    if (!user || !user.id) {
      setError("Veuillez vous connecter d'abord");
      setLoading(false);
      setTimeout(() => navigate("/login", { state: { from: "/payment", plan } }), 2000);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subscription_id: plan.id,
          amount: parseFloat(plan.price),
          method: "card",
          status: "completed",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment failed");
      }

      console.log("Payment successful:", data);
      
      // Redirect to success page
      navigate("/payment-success", { state: { plan, payment: data.payment } });
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Une erreur est survenue lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Paiement</h1>
          <p className="text-slate-500 mt-2">
            {plan.title} - {plan.price_display}
          </p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Plan Summary */}
          <div className="mb-6 p-4 bg-emerald-50 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Plan choisi</p>
                <p className="font-semibold text-slate-900">{plan.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Montant</p>
                <p className="font-bold text-emerald-600">{plan.price_display}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Payment Form */}
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
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    setFormData({ ...formData, cardNumber: formatted });
                  }}
                  maxLength="19"
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
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setFormData({ ...formData, expiryDate: formatted });
                    }}
                    maxLength="5"
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
                    maxLength="4"
                    placeholder="123"
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Traitement en cours..." : "Payer maintenant"}
              </button>
            </div>
          </form>

          {/* Secure Payment Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              🔒 Paiement 100% sécurisé (simulation)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Test: Utilisez 4111 1111 1111 1111 comme numéro de carte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}