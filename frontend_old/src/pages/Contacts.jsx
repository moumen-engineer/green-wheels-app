import { useState } from "react";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function Contacts() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Contactez-nous</h1>
        <p className="text-slate-500 mt-2">
          Une question ? N'hésitez pas à nous écrire, notre équipe vous répondra dans les plus brefs délais.
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* LEFT SIDE */}
        <div className="space-y-6">
          
          {/* CARD */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <MapPin className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold">Adresse</h3>
              <p className="text-sm text-slate-500">Boumerdès, Algérie</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Phone className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold">Téléphone</h3>
              <p className="text-sm text-slate-500">+213 555 123 456</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Mail className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-sm text-slate-500">contact@greenwheels.dz</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
        >
          
          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-600">Nom</label>
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          {/* SUBJECT */}
          <div className="mt-4">
            <label className="text-sm text-slate-600">Sujet</label>
            <input className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:border-emerald-500" />
          </div>

          {/* MESSAGE */}
          <div className="mt-4">
            <label className="text-sm text-slate-600">Message</label>
            <textarea
              rows="4"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 transition"
          >
            <Send size={18} />
            Envoyer
          </button>
        </form>
      </div>

      {/* SUCCESS MESSAGE */}
      {sent && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-200 shadow-lg px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle className="text-emerald-500" size={18} />
          <span className="text-sm">Message envoyé avec succès !</span>
        </div>
      )}
    </div>
  );
}