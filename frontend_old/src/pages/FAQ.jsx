import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Comment fonctionne la location de vélos ?",
    answer:
      "Inscrivez-vous, choisissez un vélo sur la carte ou le catalogue, réservez-le et récupérez-le à la station indiquée. Retournez-le à n'importe quelle station du réseau.",
  },
  {
    question: "Quels types de véhicules sont disponibles ?",
    answer:
      "Nous proposons des vélos électriques, scooters électriques et vélos urbains adaptés à tous les trajets.",
  },
  {
    question: "Comment fonctionne le paiement ?",
    answer:
      "Le paiement se fait en ligne via carte bancaire ou via votre abonnement actif.",
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer:
      "Oui, vous pouvez annuler gratuitement votre réservation avant le début de la location.",
  },
  {
    question: "Comment fonctionne le système d'abonnement ?",
    answer:
      "Choisissez un plan (journalier, mensuel ou annuel) pour bénéficier d’un accès illimité et de tarifs réduits.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0); // first open

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900">
          Questions Fréquentes
        </h1>
        <p className="text-slate-500 mt-2">
          Trouvez rapidement les réponses à vos questions.
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
          >
            {/* QUESTION */}
            <div
              onClick={() => toggle(index)}
              className="flex justify-between items-center cursor-pointer"
            >
              <h3 className="font-medium text-slate-800">
                {faq.question}
              </h3>

              <ChevronDown
                className={`transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* ANSWER */}
            {openIndex === index && (
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}