import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  { q: "Comment fonctionne la location de vélos ?", a: "Inscrivez-vous, choisissez un vélo sur la carte ou le catalogue, réservez-le et récupérez-le à la station indiquée. Retournez-le à n'importe quelle station du réseau." },
  { q: "Quels types de véhicules sont disponibles ?", a: "Nous proposons des vélos classiques, des vélos électriques et des scooters électriques pour répondre à tous vos besoins de mobilité." },
  { q: "Comment fonctionne le paiement ?", a: "Le paiement se fait en ligne par carte bancaire via notre système sécurisé Stripe. Vous êtes facturé selon la durée de votre location ou votre abonnement." },
  { q: "Puis-je annuler ma réservation ?", a: "Oui, vous pouvez annuler votre réservation gratuitement jusqu'à 30 minutes avant l'heure prévue. Au-delà, des frais d'annulation peuvent s'appliquer." },
  { q: "Que faire en cas de panne ?", a: "Contactez notre support via l'application ou le formulaire de contact. Nous enverrons un technicien ou vous redirigerons vers la station la plus proche." },
  { q: "Y a-t-il une assurance incluse ?", a: "Oui, une assurance de base est incluse dans chaque location. Les abonnements mensuels et annuels incluent une assurance premium." },
  { q: "Comment fonctionne le système d'abonnement ?", a: "Nous proposons 4 formules : Horaire (200 DA), Journalier (750 DA), Mensuel (5 000 DA) et Annuel (40 000 DA). Chaque formule offre des avantages croissants." },
  { q: "Où puis-je trouver les stations ?", a: "Consultez notre carte interactive pour voir toutes les stations, leur emplacement et le nombre de vélos disponibles en temps réel." },
  { q: "Faut-il un permis pour les scooters ?", a: "Oui, un permis de conduire valide est nécessaire pour louer un scooter électrique. Les vélos ne nécessitent pas de permis." },
  { q: "Comment contacter le support ?", a: "Vous pouvez nous joindre par email (contact@greenwheels.dz), par téléphone (+213 555 123 456) ou via le formulaire de contact sur notre site." },
];

export default function FAQ() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">Questions Fréquentes</h1>
          <p className="text-muted-foreground">Trouvez rapidement les réponses à vos questions.</p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <AccordionItem value={`faq-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
