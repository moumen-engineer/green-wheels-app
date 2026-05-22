import { motion } from "framer-motion";
import { Check, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: 1,
    name: "Horaire",
    price: "200",
    price_display: "200 DA/heure",
    period: "heure",
    desc: "Idéal pour les courts trajets",
    features: ["1 heure de location", "Tous véhicules", "Assurance incluse", "Annulation gratuite"],
    popular: false,
  },
  {
    id: 2,
    name: "Journalier",
    price: "750",
    price_display: "750 DA/jour",
    period: "jour",
    desc: "Parfait pour une journée d'exploration",
    features: ["24 heures de location", "Tous véhicules", "Assurance incluse", "Annulation gratuite", "Support prioritaire"],
    popular: true,
  },
  {
    id: 3,
    name: "Mensuel",
    price: "5000",
    price_display: "5 000 DA/mois",
    period: "mois",
    desc: "Pour les trajets quotidiens",
    features: ["Accès illimité", "Tous véhicules", "Assurance premium", "Annulation gratuite", "Support 24/7", "Tarifs réduits"],
    popular: false,
  },
  {
    id: 4,
    name: "Annuel",
    price: "40000",
    price_display: "40 000 DA/an",
    period: "an",
    desc: "L'offre la plus avantageuse",
    features: ["Accès illimité", "Tous véhicules", "Assurance premium", "Annulation gratuite", "Support VIP", "Tarifs réduits", "2 mois gratuits"],
    popular: false,
  },
];

export default function Subscriptions() {
  const navigate = useNavigate();

  const handleChoosePlan = (plan: typeof plans[0]) => {
    // Navigate to payment page with plan data
    navigate("/payment", {
      state: {
        plan: {
          id: plan.id,
          title: plan.name,
          price: plan.price,
          price_display: plan.price_display,
        }
      }
    });
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Nos Abonnements</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins de mobilité.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="flex">
              <Card className={`flex flex-col w-full relative ${p.popular ? "border-primary shadow-lg shadow-primary/20" : ""}`}>
                {p.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
                    <Star className="h-3 w-3" /> Populaire
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="font-display text-xl">{p.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-display font-bold text-primary">{p.price_display}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={p.popular ? "default" : "outline"}
                    onClick={() => handleChoosePlan(p)}
                  >
                    Choisir ce plan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}