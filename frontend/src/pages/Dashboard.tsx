import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Bike, Calendar, CreditCard, Clock, Loader2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/axios";

type Ride = {
  id: number;
  user_id: number;
  vehicle_id: number;
  start_station_id: number;
  end_station_id: number | null;
  started_at: string;
  ended_at: string | null;
  duration_min: number | null;
  base_price: number | null;
  final_price: number | null;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  vehicle_code?: string;
  vehicle_type?: string;
  station_name?: string;
};

type RideStats = {
  total_rides: number;
  active_rides: number;
  upcoming_rides: number;
  total_spent: number;
};

const statusColors: Record<string, string> = {
  not_started: "secondary",
  in_progress: "default",
  completed: "secondary",
  cancelled: "destructive",
};

const statusLabels: Record<string, string> = {
  not_started: "À venir",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
};

export default function Dashboard() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [stats, setStats] = useState<RideStats>({
    total_rides: 0,
    active_rides: 0,
    upcoming_rides: 0,
    total_spent: 0
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate("/admin", { replace: true });
      return;
    }

    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchRides = async () => {
  if (!user) return;
  
  try {
    const response = await api.get('/rides/me');
    console.log("API Response:", response.data); // Debug log
    
    if (response.data.success) {
      setRides(response.data.rides || []);
      if (response.data.stats) {
        // Match the property names from your API
        setStats({
          total_rides: response.data.stats.total || 0,
          active_rides: response.data.stats.active || 0,
          upcoming_rides: response.data.stats.upcoming || 0,
          total_spent: response.data.stats.totalSpent || 0
        });
      }
    } else {
      toast.error(response.data.message || "Erreur de chargement");
    }
  } catch (error: any) {
    console.error("Failed to fetch rides:", error);
    toast.error(error.response?.data?.message || "Impossible de charger vos réservations");
  } finally {
    setLoadingData(false);
  }
};

  useEffect(() => { 
    if (user) {
      fetchRides();
    }
  }, [user]);

  const handleCancel = async (id: number) => {
    try {
      const response = await api.put(`/rides/${id}/cancel`);
      if (response.data.success) {
        toast.success("Réservation annulée avec succès");
        fetchRides(); // Refresh the list
      } else {
        toast.error(response.data.message || "Erreur lors de l'annulation");
      }
    } catch (error: any) {
      console.error("Failed to cancel ride:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  // Show loading state
  if (authLoading) {
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

  // Redirect if no user
  if (!user) {
    return null;
  }

  // Safe values with fallbacks
  const totalRides = stats?.total_rides ?? 0;
  const activeRides = stats?.active_rides ?? 0;
  const totalSpent = stats?.total_spent ?? 0;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl font-bold mb-2">Mon Espace</h1>
          <p className="text-muted-foreground">Gérez votre profil et vos trajets.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Mon Profil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-display font-semibold text-lg">
                  {profile?.full_name || user?.full_name || "Utilisateur"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.email || user?.email || ""}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span>{profile?.phone || user?.phone || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Adresse</span>
                  <span>{profile?.address || "—"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Rides Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Bike className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-display font-bold text-xl">{totalRides}</div>
                  <div className="text-xs text-muted-foreground">Trajets</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-display font-bold text-xl">{activeRides}</div>
                  <div className="text-xs text-muted-foreground">En cours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="font-display font-bold text-xl">{totalSpent.toLocaleString()} DA</div>
                  <div className="text-xs text-muted-foreground">Dépensé</div>
                </CardContent>
              </Card>
            </div>

            {/* Rides List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Mes Trajets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : rides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bike className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun trajet pour le moment.</p>
                    <Button variant="outline" className="mt-3" onClick={() => navigate("/vehicles")}>
                      Louer un vélo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rides.map((ride) => (
                      <div 
                        key={ride.id} 
                        className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <div className="font-medium">
                            {ride.duration_min 
                              ? `${Math.floor(ride.duration_min / 60)}h ${ride.duration_min % 60}min` 
                              : "Trajet"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(ride.started_at).toLocaleDateString("fr-FR")} à{" "}
                            {new Date(ride.started_at).toLocaleTimeString("fr-FR", { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          {ride.station_name && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Station: {ride.station_name}
                            </div>
                          )}
                          {ride.status === "completed" && ride.duration_min && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Durée: {ride.duration_min} minutes
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <Badge variant={statusColors[ride.status] as any}>
                              {statusLabels[ride.status]}
                            </Badge>
                            {ride.final_price && (
                              <div className="text-sm font-medium mt-1">
                                {ride.final_price.toLocaleString()} DA
                              </div>
                            )}
                          </div>
                          {(ride.status === "not_started") && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-destructive hover:text-destructive"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Annuler ce trajet ?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible. Le trajet sera définitivement annulé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Non, garder</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleCancel(ride.id)} 
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Oui, annuler
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}