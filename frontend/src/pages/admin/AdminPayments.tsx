import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, CreditCard, TrendingUp, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockPayments = [
  { id: "P001", user: "Karim Benali", amount: 400, method: "Carte bancaire", date: "2026-04-06", status: "completed", type: "Location" },
  { id: "P002", user: "Sarah Meziane", amount: 5000, method: "Carte bancaire", date: "2026-04-06", status: "completed", type: "Abonnement" },
  { id: "P003", user: "Ahmed Khelifi", amount: 280, method: "Carte bancaire", date: "2026-04-05", status: "pending", type: "Location" },
  { id: "P004", user: "Amina Rahal", amount: 400, method: "Carte bancaire", date: "2026-04-04", status: "refunded", type: "Location" },
  { id: "P005", user: "Yacine Larbi", amount: 40000, method: "Carte bancaire", date: "2026-04-03", status: "completed", type: "Abonnement" },
  { id: "P006", user: "Fatima Z.", amount: 750, method: "Carte bancaire", date: "2026-04-06", status: "completed", type: "Location" },
];

const revenueByDay = [
  { day: "Lun", revenue: 32000 },
  { day: "Mar", revenue: 28000 },
  { day: "Mer", revenue: 35000 },
  { day: "Jeu", revenue: 42000 },
  { day: "Ven", revenue: 38000 },
  { day: "Sam", revenue: 55000 },
  { day: "Dim", revenue: 48000 },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  completed: { label: "Payé", variant: "default" },
  pending: { label: "En attente", variant: "secondary" },
  refunded: { label: "Remboursé", variant: "destructive" },
};

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = mockPayments.filter((p) => {
    const matchSearch = p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = mockPayments.filter(p => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = mockPayments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Paiements</h1>
        <p className="text-muted-foreground">Historique des paiements et revenus de la plateforme.</p>
      </motion.div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenus totaux</p>
              <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} DA</p>
              <p className="text-xs text-primary flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +15% vs mois dernier</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-chart-4/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold">{pendingAmount.toLocaleString()} DA</p>
              <p className="text-xs text-muted-foreground">{mockPayments.filter(p => p.status === "pending").length} paiement(s)</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Download className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Remboursements</p>
              <p className="text-2xl font-bold">{mockPayments.filter(p => p.status === "refunded").reduce((s, p) => s + p.amount, 0).toLocaleString()} DA</p>
              <p className="text-xs text-muted-foreground">{mockPayments.filter(p => p.status === "refunded").length} remboursement(s)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus cette semaine</CardTitle>
          <CardDescription>Revenus quotidiens en DA</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                formatter={(value: number) => [`${value.toLocaleString()} DA`, "Revenus"]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="completed">Payé</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="refunded">Remboursé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Utilisateur</TableHead><TableHead>Type</TableHead>
                <TableHead>Montant</TableHead><TableHead>Méthode</TableHead><TableHead>Date</TableHead><TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.user}</TableCell>
                  <TableCell><Badge variant="outline">{p.type}</Badge></TableCell>
                  <TableCell className="font-semibold">{p.amount.toLocaleString()} DA</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell><Badge variant={statusMap[p.status].variant}>{statusMap[p.status].label}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
