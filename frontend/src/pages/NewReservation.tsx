import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Bike, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Vehicle {
  id: number;
  code: string;
  type: string;
  price: number;
  battery_level: number;
  status: string;
  station_id: number;
  station_name?: string;
  station_address?: string;
  latitude?: number;
  longitude?: number;
}

interface Station {
  id: number;
  name: string;
  address: string;
  available_slots: number;
}

const typeLabels: Record<string, string> = {
  scooter: "Scooter électrique",
  bicycle: "Vélo classique",
  "electric bicycle": "Vélo électrique",
};

export default function NewReservation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedVehicleId = searchParams.get("vehicle");
  const { user, loading: authLoading } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(preselectedVehicleId || "");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState("1");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, sRes] = await Promise.all([
          fetch(`${API_URL}/vehicles?status=available`, { credentials: "include" }),
          fetch(`${API_URL}/stations`, { credentials: "include" }),
        ]);

        if (vRes.ok) {
          const vData = await vRes.json();
          // Backend returns { success, vehicles } from vehicleController
          const list: Vehicle[] = (vData.vehicles || vData || []).filter(
            (v: Vehicle) => v.status === "available"
          );
          setVehicles(list);
        }

        if (sRes.ok) {
          const sData = await sRes.json();
          setStations(Array.isArray(sData) ? sData : sData.stations || []);
        }
      } catch (err) {
        toast.error("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const vehicle = vehicles.find((v) => String(v.id) === selectedVehicleId);
  const station = vehicle
    ? stations.find((s) => s.id === vehicle.station_id)
    : null;

  const durationHours = parseInt(duration) || 1;
  const pricePerHour = vehicle ? Number(vehicle.price) : 0;
  const totalPrice = pricePerHour * durationHours;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vehicle || !startDate) return;

    setSubmitting(true);
    try {
      const startDatetime = new Date(`${startDate}T${startTime}`);

      // Create the ride in DB — this also marks vehicle as 'reserved'
      const response = await fetch(`${API_URL}/rides`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          start_station_id: vehicle.station_id,
          started_at: startDatetime.toISOString(),
          duration_min: durationHours * 60,
          base_price: totalPrice,
          final_price: totalPrice,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        toast.error(err.message || "Erreur lors de la réservation");
        setSubmitting(false);
        return;
      }

      const { ride } = await response.json();

      // Navigate to payment page exactly like Subscriptions does
      navigate("/payment", {
        state: {
          reservation: {
            ride_id: ride.id,
            vehicle_id: vehicle.id,
            vehicle_name: `${typeLabels[vehicle.type] || vehicle.type} — ${vehicle.code}`,
            duration_hours: durationHours,
            total_price: totalPrice,
            start_date: startDatetime.toISOString(),
            end_date: new Date(startDatetime.getTime() + durationHours * 3600000).toISOString(),
          },
        },
      });
    } catch (err) {
      toast.error("Erreur réseau. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux véhicules
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-8">Nouvelle réservation</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bike className="h-5 w-5 text-primary" /> Véhicule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicles.length === 0 ? (
                  <p className="text-muted-foreground">Aucun véhicule disponible pour le moment.</p>
                ) : (
                  <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.id} value={String(v.id)}>
                          {typeLabels[v.type] || v.type} — {v.code} — {Number(v.price)} DA/h
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {vehicle && (
                  <div className="mt-4 space-y-2">
                    {station && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Station : {station.name} — {station.address}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Batterie :</span>
                      {vehicle.battery_level}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-primary" /> Date &amp; Heure
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Heure de début</Label>
                  <Input
                    id="time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Duration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-primary" /> Durée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 6, 8, 12, 24].map((h) => (
                      <SelectItem key={h} value={String(h)}>
                        {h} heure{h > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Summary */}
            {vehicle && startDate && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold mb-3">Récapitulatif</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Véhicule</span>
                      <span className="font-medium">
                        {typeLabels[vehicle.type] || vehicle.type} — {vehicle.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {startDate} à {startTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée</span>
                      <span className="font-medium">{durationHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tarif</span>
                      <span className="font-medium">
                        {pricePerHour} DA × {durationHours}h
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-display font-bold text-primary text-lg">
                        {totalPrice} DA
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={!selectedVehicleId || !startDate || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Réservation en cours...
                </>
              ) : (
                `Confirmer la réservation — ${totalPrice} DA`
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
