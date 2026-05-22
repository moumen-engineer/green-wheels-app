import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { getMaintenance, createMaintenance, deleteMaintenance, updateMaintenanceStatus } from "@/api/adminMaintenance";
import { getVehicles } from "@/api/adminVehicles";

type Maintenance = any;
type Vehicle = any;

const priorityLabels: Record<string, string> = { basse: "Basse", moyenne: "Moyenne", haute: "Haute", urgente: "Urgente" };
const priorityColors: Record<string, string> = { basse: "bg-muted text-muted-foreground", moyenne: "bg-accent text-accent-foreground", haute: "bg-destructive/10 text-destructive", urgente: "bg-destructive text-destructive-foreground" };
const statusLabels: Record<string, string> = { pending: "En attente", in_progress: "En cours", completed: "Terminée" };
const statusColors: Record<string, string> = { pending: "bg-accent text-accent-foreground", in_progress: "bg-primary/10 text-primary", completed: "bg-muted text-muted-foreground" };
const maintenanceTypeLabels: Record<string, string> = {
  repair: "Réparation",
  cleaning: "Nettoyage",
  battery: "Batterie",
  other: "Autre"
};

export default function AdminMaintenance() {
  const [tasks, setTasks] = useState<(Maintenance & { vehicle_name?: string })[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [vehicleId, setVehicleId] = useState("");
  const [type, setType] = useState("repair");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("moyenne");
  const [scheduledDate, setScheduledDate] = useState("");

  const fetchData = async () => {
    setLoading(true);

    try {
      const data = await getMaintenance();

      const mapped = data.map((m: any) => ({
        ...m,
        vehicle_name: m.vehicle_type || "Inconnu"
      }));

      setTasks(mapped);
    } catch (err) {
      toast.error("Erreur lors du chargement");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();

      setVehicles(
        data.map((v: any) => ({
          id: String(v.id),
          name: v.code,
          type: v.type
        }))
      );
    } catch (err) {
      toast.error("Erreur chargement véhicules");
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    setUpdatingStatusId(taskId);

    try {
      await updateMaintenanceStatus(taskId, status);

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );

      toast.success("Statut mis à jour");
    } catch (err: any) {
      toast.error("Impossible de changer le statut");
    }

    setUpdatingStatusId(null);
  };

  const handleSubmit = async () => {

    if (!vehicleId) {
      toast.error("Veuillez sélectionner un véhicule");
      return;
    }

    setSubmitting(true);

    try {
      await createMaintenance({
        vehicle_id: vehicleId,
        type,
        description: description || null,
        priorite: priority,
        status: "pending",
        scheduled_date: scheduledDate || null,
      });

      toast.success("Tâche créée !");
      setOpen(false);

      setVehicleId("");
      setDescription("");
      setPriority("moyenne");
      setScheduledDate("");

      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMaintenance(id);
      setTasks(tasks.filter(t => t.id !== id));
      toast.success("Supprimé");
    } catch (err) {
      toast.error("Erreur suppression");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">Suivi de la maintenance des véhicules.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Wrench className="h-4 w-4" /> Nouvelle tâche</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle tâche de maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Véhicule *</Label>
                <Select value={vehicleId} onValueChange={setVehicleId}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un véhicule" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>{v.name} ({v.type})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repair">Réparation</SelectItem>
                    <SelectItem value="cleaning">Nettoyage</SelectItem>
                    <SelectItem value="battery">Batterie</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez le problème..." />
              </div>
              <div className="space-y-2">
                <Label>Date planifiée</Label>
                <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer la tâche
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : tasks.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">Aucune tâche de maintenance.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Véhicule</TableHead><TableHead>Type</TableHead><TableHead>Description</TableHead>
                  <TableHead>Priorité</TableHead><TableHead>Date</TableHead><TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.vehicle_name}</TableCell>
                    <TableCell>
                      {maintenanceTypeLabels[m.type] || m.type}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{m.description || "-"}</TableCell>
                    <TableCell><span className={`text-xs px-2 py-1 rounded-full ${priorityColors[m.priorite] || ""}`}>{priorityLabels[m.priorite] || m.priorite}</span></TableCell>
                    <TableCell>{m.scheduled_date ? new Date(m.scheduled_date).toLocaleDateString("fr-FR") : "-"}</TableCell>
                    <TableCell>
                      <Select value={m.status} onValueChange={(value) => handleStatusChange(m.id, value)} disabled={updatingStatusId === m.id}>
                        <SelectTrigger className={`h-8 min-w-[140px] ${statusColors[m.status] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="in_progress">En cours</SelectItem>
                          <SelectItem value="completed">Terminée</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
