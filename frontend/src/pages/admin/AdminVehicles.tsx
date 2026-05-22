import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, Bike, Battery, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import {
  getVehicles,
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "@/api/adminVehicles";
import { getStations } from "@/api/stations";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  price: number;
  battery: number;
  station: string;
  status: string;
  autonomy: string;
  image?: string;
}


const statusBadge: Record<string, "default" | "secondary" | "destructive"> = {
  available: "default",
  reserved: "secondary",
  in_use: "secondary",
  under_maintenance: "destructive",
};

const typeLabels: Record<string, string> = {
  scooter: "Scooter électrique",
  bicycle: "Vélo classique",
  "electric bicycle": "Vélo électrique",
};

const statusLabels: Record<string, string> = {
  available: "Disponible",
  reserved: "Réservé",
  in_use: "En cours",
  under_maintenance: "Maintenance",
};

export default function AdminVehicles() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stations, setStations] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    price: "",
    station: "",
    autonomy: "",
    image: null as File | null
  });
  const [editForm, setEditForm] = useState({ name: "", type: "", price: "", station: "", autonomy: "" });
  const [editOpen, setEditOpen] = useState(false);
  const { toast } = useToast();

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      // adminController returns array directly
      const list = Array.isArray(data) ? data : data.vehicles || [];
      const mapped = list.map((v: any) => ({
        id: String(v.id),
        name: v.code || "",
        type: v.type || "",
        price: v.price || 0,          // real column name
        battery: v.battery_level || 0, // real column name
        station: v.station_name || "",
        status: v.status || "available",
        autonomy: "—",               // not stored in DB
        image: v.image || null,
      }));
      setVehicles(mapped);
    } catch (err) {
      toast({
        title: "Erreur chargement véhicules",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchVehicles();
    // Fetch stations from API
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data.map((s: any) => ({ id: s.id, name: s.name })));
      } catch (err) {
        toast({ title: "Erreur chargement stations", variant: "destructive" });
      }
    };
    fetchStations();
  }, []);

  const filtered = vehicles.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const availableCount = vehicles.filter(v => v.status === "available").length;
  const rentedCount = vehicles.filter(v => v.status === "reserved" || v.status === "in_use").length;
  const maintenanceCount = vehicles.filter(v => v.status === "under_maintenance").length;

  const handleAdd = async () => {
    if (!form.name || !form.type || !form.price || !form.station) {
      toast({ title: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    try {
      await createVehicle({
        code: form.name,
        type: form.type,
        price: Number(form.price),         // real column name
        station_id: Number(form.station),
        battery_level: 100,                // real column name
        status: "available",
        latitude: 0,
        longitude: 0,
      });

      await fetchVehicles();
      setForm({ name: "", type: "", price: "", station: "", autonomy: "", image: null });
      setAddOpen(false);
      toast({ title: "Véhicule ajouté" });
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur ajout véhicule", variant: "destructive" });
    }
  };

  // Open edit dialog and prefill form
  const handleEditOpen = (vehicle: Vehicle) => {
    setEditVehicle(vehicle);
    setEditForm({
      name: vehicle.name,
      type: vehicle.type,
      price: String(vehicle.price),
      station: stations.find(s => s.name === vehicle.station)?.id ? String(stations.find(s => s.name === vehicle.station)!.id) : "",
      autonomy: vehicle.autonomy.replace(" km", "")
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editVehicle) return;

    try {
      await updateVehicle(editVehicle.id, {
        code: editForm.name,
        type: editForm.type,
        price: Number(editForm.price),       // real column name
        station_id: Number(editForm.station),
        battery_level: editVehicle.battery,  // real column name
        status: editVehicle.status,
        latitude: 0,
        longitude: 0,
      });

      await fetchVehicles();
      setEditOpen(false);
      toast({ title: "Véhicule modifié" });
    } catch (err) {
      toast({ title: "Erreur modification véhicule", variant: "destructive" });
    }
  };

  // Delete vehicle
  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      await fetchVehicles();
      toast({ title: "Véhicule supprimé", variant: "destructive" });
    } catch {
      toast({ title: "Erreur suppression", variant: "destructive" });
    }
  };

  // Change status
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) return;
      const station = stations.find(s => s.name === vehicle.station);
      await updateVehicle(id, {
        code: vehicle.name,
        type: vehicle.type,
        price: vehicle.price,            // real column name
        station_id: station?.id,
        battery_level: vehicle.battery,  // real column name
        status: newStatus,
        latitude: 0,
        longitude: 0,
      });
      await fetchVehicles();
      toast({ title: "Statut mis à jour" });
    } catch (err) {
      toast({ title: "Erreur mise à jour", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Véhicules</h1>
          <p className="text-muted-foreground">Gérez les véhicules de la flotte GreenWheels.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Ajouter un véhicule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Ajouter un véhicule</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nom</Label><Input placeholder="Nom du véhicule" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electric bicycle">Vélo électrique</SelectItem>
                    <SelectItem value="bicycle">Vélo classique</SelectItem>
                    <SelectItem value="scooter">Scooter électrique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Prix (DA/h)</Label><Input type="number" placeholder="200" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div className="space-y-2"><Label>Autonomie</Label><Input placeholder="45 km" value={form.autonomy} onChange={e => setForm({ ...form, autonomy: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Station</Label>
                <Select value={form.station} onValueChange={v => setForm({ ...form, station: v })}>
                  <SelectTrigger><SelectValue placeholder="Choisir la station" /></SelectTrigger>
                  <SelectContent>
                    {stations.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.files?.[0] || null
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
              <Button onClick={handleAdd}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Bike className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{vehicles.length}</p><p className="text-xs text-muted-foreground">Total</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Battery className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold">{availableCount}</p><p className="text-xs text-muted-foreground">Disponibles</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center"><MapPin className="h-5 w-5 text-chart-2" /></div>
            <div><p className="text-2xl font-bold">{rentedCount}</p><p className="text-xs text-muted-foreground">Loués</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center"><Edit className="h-5 w-5 text-destructive" /></div>
            <div><p className="text-2xl font-bold">{maintenanceCount}</p><p className="text-xs text-muted-foreground">Maintenance</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un véhicule..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="reserved">Réservé</SelectItem>
            <SelectItem value="in_use">En cours</SelectItem>
            <SelectItem value="under_maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Image</TableHead><TableHead>Nom</TableHead><TableHead>Type</TableHead>
                <TableHead>Prix/h</TableHead><TableHead>Batterie</TableHead><TableHead>Autonomie</TableHead>
                <TableHead>Station</TableHead><TableHead>État</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono text-xs">{v.id}</TableCell>
                  <TableCell>
                    {v.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${v.image}`}
                        alt={v.name}
                        className="w-14 h-14 object-cover rounded-md"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-sm">{typeLabels[v.type]}</TableCell>
                  <TableCell>{v.price} DA</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-2 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full ${v.battery > 50 ? "bg-primary" : v.battery > 20 ? "bg-chart-4" : "bg-destructive"}`} style={{ width: `${v.battery}%` }} />
                      </div>
                      <span className="text-xs">{v.battery}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{v.autonomy}</TableCell>
                  <TableCell>{v.station}</TableCell>
                  <TableCell>
                    <Select value={v.status} onValueChange={(val) => handleStatusChange(v.id, val)}>
                      <SelectTrigger className="h-7 w-[140px]">
                        <Badge variant={statusBadge[v.status] || "secondary"}>
                          {statusLabels[v.status] || v.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="reserved">Réservé</SelectItem>
                        <SelectItem value="in_use">En cours</SelectItem>
                        <SelectItem value="under_maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditOpen(v)}><Edit className="h-4 w-4" /></Button>
                            {/* Edit Vehicle Dialog */}
                            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                              <DialogContent>
                                <DialogHeader><DialogTitle>Modifier le véhicule</DialogTitle></DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2"><Label>Nom</Label><Input placeholder="Nom du véhicule" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                                  <div className="space-y-2"><Label>Type</Label>
                                    <Select value={editForm.type} onValueChange={v => setEditForm({ ...editForm, type: v })}>
                                      <SelectTrigger><SelectValue placeholder="Choisir le type" /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="electric bicycle">Vélo électrique</SelectItem>
                                        <SelectItem value="bicycle">Vélo classique</SelectItem>
                                        <SelectItem value="scooter">Scooter électrique</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label>Prix (DA/h)</Label><Input type="number" placeholder="200" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} /></div>
                                    <div className="space-y-2"><Label>Autonomie</Label><Input placeholder="45 km" value={editForm.autonomy} onChange={e => setEditForm({ ...editForm, autonomy: e.target.value })} /></div>
                                  </div>
                                  <div className="space-y-2"><Label>Station</Label>
                                    <Select value={editForm.station} onValueChange={v => setEditForm({ ...editForm, station: v })}>
                                      <SelectTrigger><SelectValue placeholder="Choisir la station" /></SelectTrigger>
                                      <SelectContent>
                                        {stations.map((s) => (
                                          <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild><Button variant="outline">Annuler</Button></DialogClose>
                                  <Button onClick={handleEditSave}>Enregistrer</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Aucun véhicule trouvé.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}