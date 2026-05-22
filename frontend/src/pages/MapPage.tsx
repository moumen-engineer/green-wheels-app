import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Bike, Clock, Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";
import api from "@/lib/axios";
import { toast } from "sonner";

type Station = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  total_slots: number;
  available_slots: number;
  is_active: number; // 1 or 0 in MySQL
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const mapInstanceRef = useRef<any>(null);

  // Fetch stations from database
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get('/stations');
        // Your backend returns the array directly, not wrapped in success
        const stationsData = Array.isArray(response.data) ? response.data : [];
        setStations(stationsData);
      } catch (error) {
        console.error("Failed to fetch stations:", error);
        toast.error("Impossible de charger les stations");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Initialize map when stations are loaded
  useEffect(() => {
    if (stations.length === 0 || loading) return;

    let map: any;
    const init = async () => {
      const L = await import("leaflet");
      
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (!mapRef.current) return;
      
      // Clean up existing map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
      
      // Center map on first station or default to Algiers
      const centerLat = stations[0]?.latitude || 36.7538;
      const centerLng = stations[0]?.longitude || 3.0588;
      
      map = L.map(mapRef.current).setView([centerLat, centerLng], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);

      mapInstanceRef.current = map;

      // Create custom icons based on availability
      stations.forEach((station) => {
        // Only show active stations
        if (!station.is_active) return;
        
        const bikesAvailable = station.total_slots - station.available_slots;
        const availability = station.available_slots / station.total_slots;
        let iconColor = "green";
        
        if (bikesAvailable === 0) {
          iconColor = "red"; // No bikes available
        } else if (availability < 0.3) {
          iconColor = "orange"; // Few slots available
        }
        
        const iconUrl = `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${iconColor}.png`;
        
        const customIcon = new L.Icon({
          iconUrl: iconUrl,
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([station.latitude, station.longitude], { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:Inter,sans-serif; min-width:220px">
              <strong style="font-size:16px">${station.name}</strong><br/>
              <div style="margin-top:8px">
                📍 ${station.address}<br/>
                🚲 <strong>${bikesAvailable}</strong> vélos disponibles<br/>
                📍 <strong>${station.available_slots}</strong> emplacements libres sur ${station.total_slots}
              </div>
              <div style="margin-top:8px">
                <div style="background:#e2e8f0; border-radius:4px; height:6px; overflow:hidden">
                  <div style="background:${bikesAvailable > 0 ? '#22c55e' : '#ef4444'}; width:${(bikesAvailable / station.total_slots) * 100}%; height:100%"></div>
                </div>
                <p style="font-size:12px; margin-top:4px; color:#64748b">
                  Taux de disponibilité: ${Math.round((bikesAvailable / station.total_slots) * 100)}%
                </p>
              </div>
            </div>
          `);
      });
    };
    
    init();
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [stations, loading]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Carte des Stations</h1>
          <p className="text-muted-foreground">Trouvez la station la plus proche de vous.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div 
              ref={mapRef} 
              className="h-[500px] rounded-xl border border-border overflow-hidden" 
            />
          </div>
          
          {/* Stations List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {stations.filter(s => s.is_active).map((station, idx) => {
              const bikesAvailable = station.total_slots - station.available_slots;
              const availabilityPercentage = (bikesAvailable / station.total_slots) * 100;
              
              return (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([station.latitude, station.longitude], 15);
                    }
                  }}
                >
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> {station.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{station.address}</p>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bike className="h-3 w-3" /> 
                      <span className={`font-medium ${bikesAvailable === 0 ? 'text-red-500' : 'text-foreground'}`}>
                        {bikesAvailable}
                      </span> vélos
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 
                      <span className="font-medium text-foreground">{station.available_slots}</span> places libres
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          bikesAvailable === 0 ? 'bg-red-500' : 'bg-primary'
                        }`}
                        style={{ width: `${availabilityPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(availabilityPercentage)}% des vélos sont disponibles
                    </p>
                  </div>
                  
                  {bikesAvailable === 0 && (
                    <div className="mt-2 text-xs text-red-500">
                      ⚠️ Aucun vélo disponible pour le moment
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}