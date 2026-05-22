import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, XCircle, Calendar, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string; user: string; vehicle: string; station: string;
  date: string; duration: string; status: string; amount: number;
}

const initialReservations: Reservation[] = [
  { id: "R001", user: "Karim Benali", vehicle: "Vélo Urbain Pro", station: "Alger Centre", date: "2026-04-06", duration: "2h", status: "active", amount: 400 },
  { id: "R002", user: "Sarah Meziane", vehicle: "Scooter City", station: "Bab El Oued", date: "2026-04-06", duration: "3h", status: "active", amount: 1050 },
  { id: "R003", user: "Ahmed Khelifi", vehicle: "E-Bike Sport", station: "Kouba", date: "2026-04-05", duration: "1h", status: "completed", amount: 280 },
  { id: "R004", user: "Amina Rahal", vehicle: "Vélo Classic", station: "Hussein Dey", date: "2026-04-04", duration: "4h", status: "completed", amount: 400 },
  { id: "R005", user: "Yacine Larbi", vehicle: "Scooter Express", station: "El Harrach", date: "2026-04-03", duration: "2h", status: "cancelled", amount: 800 },
  { id: "R006", user: "Fatima Z.", vehicle: "Vélo Touring", station: "Alger Centre", date: "2026-04-06", duration: "1h30", status: "active", amount: 375 },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive"; icon: typeof Clock }> = {
  active: { label: "En cours", variant: "default", icon: Clock },
  completed: { label: "Terminée", variant: "secondary", icon: CheckCircle },
  cancelled: { label: "Annulée", variant: "destructive", icon: XCircle },
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState<Reservation | null>(null);
  const { toast } = useToast();

  const filtered = reservations.filter((r) => {
    const matchSearch = r.user.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = reservations.filter(r => r.status === "active").length;
  const totalRevenue = reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.amount, 0);

  const handleCancel = (id: string) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
    toast({ title: "Réservation annulée", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Réservations</h1>
        <p className="text-muted-foreground">Gérez toutes les réservations de la plateforme.</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{reservations.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">En cours</p><p className="text-2xl font-bold text-primary">{activeCount}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Terminées</p><p className="text-2xl font-bold">{reservations.filter(r => r.status === "completed").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Revenus</p><p className="text-2xl font-bold">{totalRevenue.toLocaleString()} DA</p></CardContent></Card>
      </div>

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
            <SelectItem value="active">En cours</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Utilisateur</TableHead><TableHead>Véhicule</TableHead>
                <TableHead>Station</TableHead><TableHead>Date</TableHead><TableHead>Durée</TableHead>
                <TableHead>Montant</TableHead><TableHead>Statut</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const st = statusMap[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.user}</TableCell>
                    <TableCell>{r.vehicle}</TableCell>
                    <TableCell>{r.station}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.duration}</TableCell>
                    <TableCell className="font-medium">{r.amount} DA</TableCell>
                    <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setDetail(r)}><Eye className="h-4 w-4" /></Button>
                        {r.status === "active" && (
                          <Button variant="ghost" size="icon" onClick={() => handleCancel(r.id)}><XCircle className="h-4 w-4 text-destructive" /></Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Détails de la réservation {detail?.id}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Utilisateur</span><p className="font-medium">{detail.user}</p></div>
                <div><span className="text-muted-foreground">Véhicule</span><p className="font-medium">{detail.vehicle}</p></div>
                <div><span className="text-muted-foreground">Station</span><p className="font-medium">{detail.station}</p></div>
                <div><span className="text-muted-foreground">Date</span><p className="font-medium">{detail.date}</p></div>
                <div><span className="text-muted-foreground">Durée</span><p className="font-medium">{detail.duration}</p></div>
                <div><span className="text-muted-foreground">Montant</span><p className="font-medium">{detail.amount} DA</p></div>
              </div>
              <div><span className="text-muted-foreground">Statut</span><div className="mt-1"><Badge variant={statusMap[detail.status].variant}>{statusMap[detail.status].label}</Badge></div></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
