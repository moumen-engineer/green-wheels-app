import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bike, MapPin, Shield, Leaf, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroBike from "@/assets/hero-bike.jpg";

const features = [
  { icon: Bike, title: "Vélos écologiques", desc: "Des vélos électriques et classiques pour tous vos trajets urbains." },
  { icon: MapPin, title: "Stations partout", desc: "Un réseau dense de stations pour prendre et déposer votre vélo." },
  { icon: Shield, title: "Sécurisé", desc: "Paiement sécurisé et assurance incluse dans chaque location." },
  { icon: Leaf, title: "100% vert", desc: "Réduisez votre empreinte carbone avec chaque trajet." },
  { icon: Zap, title: "Rapide", desc: "Réservez en quelques secondes depuis votre téléphone." },
  { icon: Clock, title: "24/7", desc: "Accédez aux vélos à toute heure, tous les jours." },
];

const stats = [
  { value: "500+", label: "Vélos disponibles" },
  { value: "50+", label: "Stations" },
  { value: "10K+", label: "Utilisateurs" },
  { value: "50K+", label: "Trajets effectués" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" /> Mobilité verte intelligente
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Roulez <span className="text-gradient">vert</span>, roulez{" "}
                <span className="text-gradient">libre</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Louez un vélo ou un scooter électrique en quelques clics. Explorez votre ville de manière écologique avec GreenWheels.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/vehicles">
                  <Button size="lg" className="gap-2 text-base px-8">
                    Explorer les vélos <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/map">
                  <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                    <MapPin className="h-5 w-5" /> Voir les stations
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <img
                src={heroBike}
                alt="Vélo électrique GreenWheels dans un parc urbain"
                width={1280}
                height={960}
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-primary">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pourquoi GreenWheels ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une solution de mobilité complète, écologique et accessible à tous.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Prêt à rouler vert ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont choisi la mobilité écologique.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2 text-base px-8">
              Créer un compte <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
