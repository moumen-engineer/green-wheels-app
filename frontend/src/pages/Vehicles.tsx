import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Zap, Battery, MapPin, Star, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import axios from "axios";
import { getVehicleImage, getVehicleIcon, getBatteryColor } from "@/utils/vehicleImages";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: number;
  autonomy: string;
  battery: number;
  station: string;
  available: boolean;
  rating: number;
  code: string;
  status: string;
}

export default function Vehicles() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/vehicles");
      if (response.data.success) {
        setVehicles(response.data.vehicles);
      } else {
        setError("Failed to fetch vehicles");
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      setError("Unable to load vehicles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (vehicleId: string) => {
    setImageErrors(prev => ({ ...prev, [vehicleId]: true }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des véhicules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchVehicles}>Réessayer</Button>
        </div>
      </div>
    );
  }

  const filtered = vehicles.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
                        v.type.toLowerCase().includes(search.toLowerCase()) ||
                        v.code.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || v.type === typeFilter;
    const matchAvail = availFilter === "all" || 
                      (availFilter === "available" ? v.available : !v.available);
    return matchSearch && matchType && matchAvail;
  });

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Nos Véhicules</h1>
          <p className="text-muted-foreground">Trouvez le véhicule parfait pour votre trajet.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par nom, type ou code..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Type de véhicule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Vélo électrique">⚡ Vélo électrique</SelectItem>
              <SelectItem value="Vélo classique">🚲 Vélo classique</SelectItem>
              <SelectItem value="Scooter électrique">🛵 Scooter électrique</SelectItem>
            </SelectContent>
          </Select>

          <Select value={availFilter} onValueChange={setAvailFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Disponibilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les véhicules</SelectItem>
              <SelectItem value="available">✅ Disponibles uniquement</SelectItem>
              <SelectItem value="unavailable">❌ Indisponibles uniquement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="mb-4 text-sm text-muted-foreground">
          {filtered.length} véhicule(s) trouvé(s)
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((v, i) => (
            <motion.div 
              key={v.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full hover:shadow-xl transition-all group overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Section */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {!imageErrors[v.id] ? (
                      <img
                        src={getVehicleImage(v.type)}
                        alt={v.type}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(v.id)}
                      />
                    ) : (
                      // Fallback if image fails to load
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">{getVehicleIcon(v.type)}</span>
                      </div>
                    )}
                    
                    {/* Type Badge Overlay */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm shadow-sm">
                        <span className="mr-1">{getVehicleIcon(v.type)}</span>
                        {v.type}
                      </Badge>
                    </div>
                    
                    {/* Battery Level Badge */}
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="outline" className="bg-white/95 backdrop-blur-sm shadow-sm">
                        <Battery className={`h-3 w-3 mr-1 ${getBatteryColor(v.battery)}`} />
                        <span className={getBatteryColor(v.battery)}>{v.battery}%</span>
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-display font-semibold text-lg">{v.name}</h3>
                        <p className="text-xs text-muted-foreground">Code: {v.code}</p>
                      </div>
                      <Badge variant={v.available ? "default" : "secondary"} className="capitalize">
                        {v.available ? "Disponible" : v.status === "rented" ? "En location" : "Indisponible"}
                      </Badge>
                    </div>
                    
                    {/* Vehicle Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" /> 
                        <span>{v.autonomy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> 
                        <span className="truncate">{v.station}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /> 
                        <span>{v.rating}</span>
                      </div>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-muted-foreground">Tarif horaire</span>
                        <p className="font-display font-bold text-xl text-primary">
                          {v.price} DA
                        </p>
                      </div>
                      <Link to={`/vehicles/${v.id}`}>
                        <Button size="default" disabled={!v.available} className="shadow-sm">
                          {v.available ? "Réserver" : "Indisponible"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground">Aucun véhicule trouvé.</p>
            <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos filtres de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}