import { motion } from "framer-motion";
import { Leaf, Users, Target, Award, Bike, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  { icon: Leaf, title: "Écologie", desc: "Chaque trajet contribue à réduire les émissions de CO2." },
  { icon: Users, title: "Communauté", desc: "Construire une communauté de citoyens engagés." },
  { icon: Target, title: "Innovation", desc: "Technologies modernes pour une mobilité intelligente." },
  { icon: Award, title: "Qualité", desc: "Des véhicules entretenus et un service fiable." },
];


export default function About() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            À propos de <span className="text-gradient">GreenWheels</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            GreenWheels est née d'une vision simple : rendre la mobilité urbaine plus verte, plus accessible et plus intelligente.
          </p>
        </motion.div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold mb-4">Notre Mission</h2>
            <p className="text-muted-foreground mb-4">
              Nous croyons que la mobilité durable est la clé d'un avenir meilleur. GreenWheels met à disposition des vélos et scooters électriques partagés pour réduire la pollution, décongestionner les villes et offrir une alternative pratique aux transports traditionnels.
            </p>
            <p className="text-muted-foreground">
              Avec un réseau de stations stratégiquement placées et une application intuitive, nous rendons le transport vert accessible à tous.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/20 to-accent/30 rounded-2xl p-12 flex items-center justify-center"
          >
            <div className="text-center">
              <Bike className="h-24 w-24 text-primary mx-auto mb-4" />
              <p className="font-display text-2xl font-bold text-gradient">Mobilité verte intelligente</p>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-display text-3xl font-bold mb-8 text-center">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <v.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
