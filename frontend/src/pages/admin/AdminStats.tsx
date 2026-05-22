import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const monthlyData = [
  { month: "Jan", locations: 120, revenue: 85000 },
  { month: "Fév", locations: 150, revenue: 102000 },
  { month: "Mar", locations: 200, revenue: 140000 },
  { month: "Avr", locations: 180, revenue: 125000 },
  { month: "Mai", locations: 250, revenue: 175000 },
  { month: "Jun", locations: 300, revenue: 210000 },
];

const vehicleTypes = [
  { name: "Vélo électrique", value: 65 },
  { name: "Vélo classique", value: 20 },
  { name: "Scooter", value: 15 },
];

const topStations = [
  { name: "Alger Centre", locations: 450 },
  { name: "Bab El Oued", locations: 320 },
  { name: "Kouba", locations: 280 },
  { name: "Hussein Dey", locations: 200 },
  { name: "El Harrach", locations: 180 },
];

const COLORS = ["hsl(142,71%,45%)", "hsl(142,50%,60%)", "hsl(142,30%,75%)"];

export default function AdminStats() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground">Analyse détaillée de l'activité de la plateforme.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Locations par mois</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,88%)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="locations" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenus mensuels (DA)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,88%)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={{ fill: "hsl(142,71%,45%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Types de véhicules</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={vehicleTypes} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {vehicleTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Stations</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topStations} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,88%)" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="locations" fill="hsl(142,71%,45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
