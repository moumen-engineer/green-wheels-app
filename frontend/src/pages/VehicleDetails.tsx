import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Battery, Zap, MapPin, Star, Shield, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { getVehicleImage, getVehicleIcon, getBatteryColor } from "@/utils/vehicleImages";

interface VehicleDetails {
  id: string;
  name: string;
  type: string;
  price: number;
  autonomy: string;
  battery: number;
  station: string;
  station_address?: string;
  available: boolean;
  rating: number;
  code: string;
  status: string;
  desc?: string;
  specs?: {
    weight: string;
    maxSpeed: string;
    chargeTime: string;
    gears: string;
  };
}

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/vehicles/${id}`);
      if (response.data.success) {
        const v = response.data.vehicle;
        
        // Add description and specs based on vehicle type
        const enhancedVehicle = {
          ...v,
          desc: getVehicleDescription(v.type, v.name),
          specs: getVehicleSpecs(v.type),
          rating: 4.5 // You can fetch this from a reviews table later
        };
        
        setVehicle(enhancedVehicle);
      } else {
        setError("Vehicle not found");
      }
    } catch (err) {
      console.error("Error fetching vehicle details:", err);
      setError("Unable to load vehicle details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getVehicleDescription = (type: string, name: string): string => {
    if (type === "Vélo électrique") {
      return `Le ${name} est un vélo électrique puissant et écologique, parfait pour vos trajets quotidiens. Avec son moteur silencieux et sa batterie longue durée, vous pouvez vous déplacer facilement en ville sans effort.`;
    } else if (type === "Scooter électrique") {
      return `Le ${name} est un scooter électrique moderne, idéal pour les déplacements urbains rapides. Confortable et économique, il vous permettra de gagner du temps tout en respectant l'environnement.`;
    } else {
      return `Le ${name} est un vélo classique fiable et robuste. Parfait pour les amateurs de vélo traditionnel qui souhaitent faire de l'exercice tout en se déplaçant.`;
    }
  };

  const getVehicleSpecs = (type: string) => {
    if (type === "Vélo électrique") {
      return {
        weight: "22 kg",
        maxSpeed: "25 km/h",
        chargeTime: "3-4 heures",
        gears: "7 vitesses",
        motor: "250W",
        warranty: "2 ans"
      };
    } else if (type === "Scooter électrique") {
      return {
        weight: "45 kg",
        maxSpeed: "45 km/h",
        chargeTime: "4-5 heures",
        gears: "Automatique",
        motor: "1000W",
        warranty: "2 ans"
      };
    } else {
      return {
        weight: "14 kg",
        maxSpeed: "Variable",
        chargeTime: "N/A",
        gears: "21 vitesses",
        motor: "N/A",
        warranty: "1 an"
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Véhicule non trouvé"}</p>
          <Link to="/vehicles">
            <Button>Retour aux véhicules</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Link 
          to="/vehicles" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux véhicules
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-2xl overflow-hidden aspect-square relative"
          >
            <img
              src={getVehicleImage(vehicle.type)}
              alt={vehicle.name}
              width={1200}
              height={1200}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm">
                <span className="mr-1">{getVehicleIcon(vehicle.type)}</span>
                {vehicle.type}
              </Badge>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="font-display text-3xl font-bold">{vehicle.name}</h1>
              <Badge variant={vehicle.available ? "default" : "secondary"} className="capitalize">
                {vehicle.available ? "Disponible" : vehicle.status === "rented" ? "En location" : "Indisponible"}
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-2">Code: {vehicle.code}</p>
            
            <div className="flex items-center gap-1 mb-6">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{vehicle.rating}</span>
              <span className="text-muted-foreground text-sm">(128 avis)</span>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">{vehicle.desc}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Autonomie</div>
                  <div className="font-medium">{vehicle.autonomy}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <Battery className={`h-5 w-5 ${getBatteryColor(vehicle.battery)}`} />
                <div>
                  <div className="text-xs text-muted-foreground">Batterie</div>
                  <div className={`font-medium ${getBatteryColor(vehicle.battery)}`}>
                    {vehicle.battery}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Station</div>
                  <div className="font-medium">{vehicle.station}</div>
                  {vehicle.station_address && (
                    <div className="text-xs text-muted-foreground">{vehicle.station_address}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Assurance</div>
                  <div className="font-medium">Incluse</div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-display font-semibold mb-3">Spécifications techniques</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Poids :</span> {vehicle.specs?.weight}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vitesse max :</span> {vehicle.specs?.maxSpeed}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temps de charge :</span> {vehicle.specs?.chargeTime}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vitesses :</span> {vehicle.specs?.gears}
                  </div>
                  {vehicle.specs?.motor && (
                    <div>
                      <span className="text-muted-foreground">Moteur :</span> {vehicle.specs.motor}
                    </div>
                  )}
                  {vehicle.specs?.warranty && (
                    <div>
                      <span className="text-muted-foreground">Garantie :</span> {vehicle.specs.warranty}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Price and Booking */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-3xl font-display font-bold text-primary">{vehicle.price} DA</span>
                <span className="text-muted-foreground">/heure</span>
                {vehicle.type !== "Vélo classique" && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Charge complète: {vehicle.specs?.chargeTime}
                  </div>
                )}
              </div>
              
              <Link to={`/reservations/new?vehicle=${id}`}>
                <Button 
                  size="lg" 
                  disabled={!vehicle.available} 
                  className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Calendar className="h-5 w-5" /> 
                  {vehicle.available ? "Réserver maintenant" : "Indisponible"}
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Retrait en station</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Retour possible dans toute station</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Assurance incluse</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}