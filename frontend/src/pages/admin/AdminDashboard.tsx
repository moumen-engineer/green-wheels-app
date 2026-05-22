import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bike, Users, Calendar, CreditCard, TrendingUp, MapPin, Activity,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const typeLabels: Record<string, string> = {
  scooter: "Scooter",
  bicycle: "Vélo classique",
  "electric bicycle": "Vélo électrique",
};

interface DashboardStats {
  vehicles: {
    total: number;
    available: number;
    reserved: number;
    in_use: number;
    under_maintenance: number;
  };
  users: number;
  revenue: {
    monthly_revenue: number;
    total_revenue: number;
  };
  rides: {
    total: number;
    not_started: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  recentRides: Array<{
    id: number;
    user_name: string;
    vehicle_code: string;
    vehicle_type: string;
    station_name: string;
    status: string;
    started_at: string;
    final_price: number | null;
  }>;
  stations: Array<{
    id: number;
    name: string;
    vehicle_count: number;
    available_vehicles: number;
  }>;
  monthlyRevenue: Array<{ month: string; revenue: number; count: number }>;
  vehicleTypes: Array<{ type: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/dashboard/stats`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Build stats cards from real data
  const statCards = [
    {
      icon: Bike,
      label: "Véhicules totaux",
      value: String(stats?.vehicles?.total ?? "—"),
      change: `${stats?.vehicles?.available ?? 0} dispo`,
      up: true,
      desc: "actuellement",
      color: "text-primary",
    },
    {
      icon: Activity,
      label: "Véhicules disponibles",
      value: String(stats?.vehicles?.available ?? "—"),
      change: `${stats?.vehicles?.reserved ?? 0} réservés`,
      up: true,
      desc: "actuellement",
      color: "text-primary",
    },
    {
      icon: Calendar,
      label: "Locations actives",
      value: String((stats?.rides?.not_started ?? 0) + (stats?.rides?.in_progress ?? 0)),
      change: `${stats?.rides?.completed ?? 0} terminées`,
      up: true,
      desc: "au total",
      color: "text-chart-2",
    },
    {
      icon: Users,
      label: "Utilisateurs",
      value: String(stats?.users ?? "—"),
      change: "inscrits",
      up: true,
      desc: "total",
      color: "text-chart-3",
    },
    {
      icon: CreditCard,
      label: "Revenus du mois",
      value: `${Number(stats?.revenue?.monthly_revenue ?? 0).toLocaleString()} DA`,
      change: `${Number(stats?.revenue?.total_revenue ?? 0).toLocaleString()} DA`,
      up: true,
      desc: "total",
      color: "text-chart-4",
    },
    {
      icon: TrendingUp,
      label: "Maintenance",
      value: String(stats?.vehicles?.under_maintenance ?? "—"),
      change: `${stats?.vehicles?.in_use ?? 0} en cours`,
      up: false,
      desc: "véhicules",
      color: "text-chart-5",
    },
  ];

  const vehicleStatusData = [
    { status: "Disponible", count: stats?.vehicles?.available ?? 0, color: "bg-primary/20 text-primary" },
    { status: "Réservé", count: stats?.vehicles?.reserved ?? 0, color: "bg-chart-2/20 text-chart-2" },
    { status: "En cours", count: stats?.vehicles?.in_use ?? 0, color: "bg-chart-3/20 text-chart-3" },
    { status: "Maintenance", count: stats?.vehicles?.under_maintenance ?? 0, color: "bg-destructive/20 text-destructive" },
  ];

  const vehicleTypeData = (stats?.vehicleTypes ?? []).map((vt, i) => ({
    name: typeLabels[vt.type] || vt.type,
    value: vt.count,
  }));

  const totalVehicles = stats?.vehicles?.total ?? 1;

  // Monthly revenue chart data — use real data or fallback empty
  const revenueChartData = stats?.monthlyRevenue?.length
    ? stats.monthlyRevenue.map((m) => ({ month: m.month, revenue: Number(m.revenue) }))
    : [];

  // Top stations
  const topStations = (stats?.stations ?? []).slice(0, 5);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "in_progress":
        return { label: "En cours", icon: <Clock className="h-4 w-4 text-primary" />, bg: "bg-primary/10" };
      case "not_started":
        return { label: "Réservée", icon: <Clock className="h-4 w-4 text-chart-2" />, bg: "bg-chart-2/10" };
      case "completed":
        return { label: "Terminée", icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />, bg: "bg-muted" };
      case "cancelled":
        return { label: "Annulée", icon: <XCircle className="h-4 w-4 text-destructive" />, bg: "bg-destructive/10" };
      default:
        return { label: status, icon: null, bg: "bg-muted" };
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `Il y a ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `Il y a ${h}h`;
    return `Il y a ${Math.floor(h / 24)}j`;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de la plateforme GreenWheels.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-display font-bold mt-1">{s.value}</p>
                    <p className={`text-xs flex items-center gap-1 mt-1 ${s.up ? "text-primary" : "text-destructive"}`}>
                      {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {s.change} <span className="text-muted-foreground">{s.desc}</span>
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Revenus mensuels</CardTitle>
              <CardDescription>
                {revenueChartData.length ? "Évolution des revenus (6 derniers mois)" : "Aucun paiement enregistré pour le moment"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                      formatter={(value: number) => [`${value.toLocaleString()} DA`, "Revenus"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                  Pas encore de données de revenus
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ride Status Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle>Statuts des trajets</CardTitle>
              <CardDescription>Répartition des {stats?.rides?.total ?? 0} trajets enregistrés</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[
                  { name: "Réservées", value: stats?.rides?.not_started ?? 0 },
                  { name: "En cours", value: stats?.rides?.in_progress ?? 0 },
                  { name: "Terminées", value: stats?.rides?.completed ?? 0 },
                  { name: "Annulées", value: stats?.rides?.cancelled ?? 0 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                    formatter={(value: number) => [value, "Trajets"]}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Vehicle Status + Type + Top Stations */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Vehicle Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>État des véhicules</CardTitle>
              <CardDescription>Répartition par statut</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehicleStatusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${item.color}`}>
                    {item.status}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{item.count}</span>
                    <span className="text-sm text-muted-foreground ml-1">véhicules</span>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total flotte</span>
                  <span className="font-bold">{totalVehicles} véhicules</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-muted overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: `${((stats?.vehicles?.available ?? 0) / totalVehicles) * 100}%` }} />
                  <div className="bg-chart-2 h-full" style={{ width: `${((stats?.vehicles?.reserved ?? 0) / totalVehicles) * 100}%` }} />
                  <div className="bg-chart-3 h-full" style={{ width: `${((stats?.vehicles?.in_use ?? 0) / totalVehicles) * 100}%` }} />
                  <div className="bg-destructive h-full" style={{ width: `${((stats?.vehicles?.under_maintenance ?? 0) / totalVehicles) * 100}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicle Type Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Types de véhicules</CardTitle>
              <CardDescription>Distribution de la flotte</CardDescription>
            </CardHeader>
            <CardContent>
              {vehicleTypeData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={vehicleTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {vehicleTypeData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {vehicleTypeData.map((item, i) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  Aucun véhicule
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Stations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Stations</CardTitle>
              <CardDescription>Véhicules disponibles par station</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topStations.length > 0 ? topStations.map((station, i) => (
                <div key={station.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{station.name}</span>
                      <span className="text-xs text-muted-foreground">{station.vehicle_count} véh.</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: station.vehicle_count > 0 ? `${((station.available_vehicles || 0) / station.vehicle_count) * 100}%` : "0%" }}
                        />
                      </div>
                      <span className="text-xs text-primary font-medium">{station.available_vehicles ?? 0}/{station.vehicle_count}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Aucune station</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Rides */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <Card>
          <CardHeader>
            <CardTitle>Trajets récents</CardTitle>
            <CardDescription>Dernières activités</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recentRides?.length ? (
              <div className="space-y-3">
                {stats.recentRides.map((r) => {
                  const si = getStatusInfo(r.status);
                  return (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${si.bg}`}>
                          {si.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{r.user_name}</span>
                            <span className="text-muted-foreground text-sm">— {typeLabels[r.vehicle_type] || r.vehicle_type} {r.vehicle_code}</span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {r.station_name ?? "—"} · {formatTimeAgo(r.started_at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{r.final_price ? `${r.final_price} DA` : "—"}</span>
                        <div>
                          <Badge
                            variant={r.status === "in_progress" || r.status === "not_started" ? "default" : r.status === "completed" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {si.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Aucun trajet enregistré.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
