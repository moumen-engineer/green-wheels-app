import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, Shield, UserPlus, Eye, Ban, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { getUsers, toggleUserStatus, changeUserRole, deleteUser } from "@/api/adminUsers";

interface User {
  id: string; name: string; email: string; phone: string;
  role: string; status: string; joined: string; rentals: number;
}


const roleColors: Record<string, string> = {
  admin: "bg-destructive/10 text-destructive",
  user: "bg-primary/10 text-primary",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [detail, setDetail] = useState<User | null>(null);
  const { toast } = useToast();

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleSuspend = async (id: string) => {
    try {
      await toggleUserStatus(id);
      await fetchUsers(); // refresh data
      toast({ title: "Statut utilisateur mis à jour" });
    } catch (err) {
      toast({ title: "Erreur serveur", variant: "destructive" });
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      await fetchUsers();
      toast({ title: "Utilisateur supprimé", variant: "destructive" });
    } catch (err) {
      toast({ title: "Erreur serveur", variant: "destructive" });
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await changeUserRole(id, role);
      await fetchUsers();
      toast({ title: "Rôle mis à jour" });
    } catch (err) {
      toast({ title: "Erreur serveur", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();

      const mapped = data.map((u: any) => ({
        id: u.id,
        name: u.full_name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.is_active ? "active" : "suspended",
        joined: u.created_at,
        rentals: 0
      }));

      setUsers(mapped);
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur lors du chargement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Utilisateurs</h1>
        <p className="text-muted-foreground">Gérez les utilisateurs de la plateforme.</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{users.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Actifs</p><p className="text-2xl font-bold text-primary">{users.filter(u => u.status === "active").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Suspendus</p><p className="text-2xl font-bold text-destructive">{users.filter(u => u.status === "suspended").length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Locations totales</p><p className="text-2xl font-bold">{users.reduce((s, u) => s + u.rentals, 0)}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un utilisateur..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">Utilisateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Nom</TableHead><TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead><TableHead>Rôle</TableHead><TableHead>Statut</TableHead>
                <TableHead>Locations</TableHead><TableHead>Inscription</TableHead><TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v)}>
                      <SelectTrigger className="h-7 w-[120px]">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>{u.role}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === "active" ? "default" : "destructive"}>
                      {u.status === "active" ? "Actif" : "Suspendu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{u.rentals}</TableCell>
                  <TableCell className="text-sm">{u.joined}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setDetail(u)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleSuspend(u.id)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
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

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Profil de {detail?.name}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Email</span><p className="font-medium">{detail.email}</p></div>
                <div><span className="text-muted-foreground">Téléphone</span><p className="font-medium">{detail.phone}</p></div>
                <div><span className="text-muted-foreground">Rôle</span><p className="font-medium capitalize">{detail.role}</p></div>
                <div><span className="text-muted-foreground">Inscription</span><p className="font-medium">{detail.joined}</p></div>
                <div><span className="text-muted-foreground">Locations</span><p className="font-medium">{detail.rentals} locations</p></div>
                <div><span className="text-muted-foreground">Statut</span>
                  <Badge variant={detail.status === "active" ? "default" : "destructive"} className="mt-1">
                    {detail.status === "active" ? "Actif" : "Suspendu"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
