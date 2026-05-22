import React, { useState, useEffect } from 'react';
import {
  SearchIcon, ChevronDownIcon, EyeIcon, BanIcon, XIcon
} from '../AdminDashboard/Icons';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';

const initialUsers = [
  { id: 'U001', name: 'Karim Benali', role: 'User', status: 'Actif', telephone: '+213 555 111 111', inscription: '2025-10-12', locations: '4 locations' },
  { id: 'U002', name: 'Sarah Meziane', role: 'Admin', status: 'Actif', telephone: '+213 555 222 222', inscription: '2025-01-05', locations: '0 locations' },
  { id: 'U003', name: 'Ahmed Khelifi', role: 'User', status: 'Suspendu', telephone: '+213 555 333 333', inscription: '2025-11-20', locations: '8 locations' },
  { id: 'U004', name: 'Amina Rahal', role: 'Technician', status: 'Actif', telephone: '+213 555 444 444', inscription: '2025-06-15', locations: '1 location' },
  { id: 'U005', name: 'Yacine Larbi', role: 'Manager', status: 'Actif', telephone: '+213 555 555 555', inscription: '2025-02-10', locations: '0 locations' },
  { id: 'U006', name: 'Kenza Atmani', role: 'User', status: 'Actif', telephone: '+213 555 666 666', inscription: '2026-03-01', locations: '15 locations' },
];

const AdminUtilisateurs = () => {
  const [collapsed] = useSidebar();
  const [users, setUsers] = useState(initialUsers);
  const [toast, setToast] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('Tous les rôles');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'Tous les rôles' || u.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Actif' ? 'Suspendu' : 'Actif' } : u));
    setToast({ type: 'success', text: 'Statut utilisateur mis à jour' });
  };

  const handleChangeRole = (id, newRole) => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    setToast({ type: 'success', text: 'Rôle utilisateur mis à jour' });
  };

  const renderStatusBadge = (status) => (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
      {status}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="utilisateurs" />

      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Utilisateurs</h1>
          <p className="mt-2 text-sm text-slate-500">Gérez les utilisateurs de la plateforme.</p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Total</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Actifs</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{users.filter(u => u.status === 'Actif').length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Suspendus</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{users.filter(u => u.status === 'Suspendu').length}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Locations totales</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">43</p>
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <SearchIcon className="h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un utilisateur ..."
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm"
            >
              {filterRole}
              <ChevronDownIcon />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-60 rounded-3xl border border-slate-200 bg-white p-2 shadow-lg">
                {['Tous les rôles', 'User', 'Admin', 'Manager', 'Technician'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilterRole(opt); setFilterOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${filterRole === opt ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span>{filterRole === opt ? '✓' : ''}</span>{opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Nom', 'Rôle', 'Statut', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{u.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Technician">Technician</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">{renderStatusBadge(u.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                        onClick={() => setSelectedUser(u)}
                      >
                        <EyeIcon />
                      </button>
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        <BanIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Profil de {selectedUser.name}</h2>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                  onClick={() => setSelectedUser(null)}
                >
                  <XIcon />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Nom', selectedUser.name],
                  ['Téléphone', selectedUser.telephone],
                  ['Rôle', selectedUser.role],
                  ['Inscription', selectedUser.inscription],
                  ['Locations', selectedUser.locations],
                  ['Statut', selectedUser.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <p className={`text-sm ${toast.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>{toast.text}</p>
              <button className="text-slate-500 transition hover:text-slate-900" onClick={() => setToast(null)}><XIcon /></button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUtilisateurs;
