import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStations,
  createStation,
  updateStation,
  deleteStation,
  toggleStationStatus
} from "@/api/stations";

/* ================= TYPES ================= */
type Station = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  total_slots: number;
  is_active: boolean;
};

/* ================= COMPONENT ================= */
export default function AdminStations() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  /* ---------- GET ---------- */
  const { data: stations = [] } = useQuery<Station[]>({
    queryKey: ["stations"],
    queryFn: getStations,
  });

  /* ---------- FORM ---------- */
  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    total_slots: "",
    is_active: true,
  });

  /* ---------- CREATE ---------- */
  const createMutation = useMutation<unknown, unknown, typeof form>({
    mutationFn: (data) => createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      resetForm();
      setOpen(false);
    },
  });

  /* ---------- UPDATE ---------- */
  const updateMutation = useMutation<unknown, unknown, { id: number; data: typeof form }>({
    mutationFn: ({ id, data }) => updateStation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      resetForm();
      setOpen(false);
    },
  });

  /* ---------- DELETE ---------- */
  const deleteMutation = useMutation<unknown, unknown, number>({
    mutationFn: (id) => deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
  });

  /* ---------- TOGGLE STATUS ---------- */
  const toggleMutation = useMutation<unknown, unknown, number>({
    mutationFn: (id) => toggleStationStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },
  });

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      total_slots: "",
      is_active: true,
    });
    setEditId(null);
  };

  const handleCreate = () => {
    createMutation.mutate(form);
  };

  const handleEdit = (station: Station) => {
    setForm({
      name: station.name,
      address: station.address,
      latitude: String(station.latitude),
      longitude: String(station.longitude),
      total_slots: String(station.total_slots),
      is_active: station.is_active,
    });
    setEditId(station.id);
    setOpen(true);
  };

  const handleUpdate = () => {
    if (!editId) return;

    updateMutation.mutate({
      id: editId,
      data: form,
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  /* ================= FILTER (FIXED) ================= */
  const filtered = (stations ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <motion.div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Stations</h1>
          <p className="text-muted-foreground">Gérez les stations de vélos.</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="gap-2"
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editId ? "Modifier station" : "Ajouter une station"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input
                    value={form.latitude}
                    onChange={(e) =>
                      setForm({ ...form, latitude: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Longitude</Label>
                  <Input
                    value={form.longitude}
                    onChange={(e) =>
                      setForm({ ...form, longitude: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Emplacements</Label>
                <Input
                  value={form.total_slots}
                  onChange={(e) =>
                    setForm({ ...form, total_slots: e.target.value })
                  }
                />
              </div>

              <Button
                className="w-full"
                onClick={editId ? handleUpdate : handleCreate}
              >
                {editId ? "Update" : "Ajouter la station"}
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>

                  <TableCell className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    {s.name}
                  </TableCell>

                  <TableCell>{s.address}</TableCell>

                  <TableCell>{s.total_slots}</TableCell>

                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleMutation.mutate(s.id)}
                    >
                      {s.is_active ? "ON" : "OFF"}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1">

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(s)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>

                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
}