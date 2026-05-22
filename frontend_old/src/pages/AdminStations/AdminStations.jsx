import React, { useState, useEffect } from 'react';
import {
  EditIcon, TrashIcon, SearchIcon, PlusIcon, XIcon
} from '../AdminDashboard/Icons';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';

const initialStations = [
  { id: 'S001', name: 'Alger Centre', address: 'Rue Didouche Mourad', velos: 12, emplacements: 20, status: 'Active' },
  { id: 'S002', name: 'Bab El Oued', address: 'Place des Martyrs', velos: 8, emplacements: 15, status: 'Active' },
  { id: 'S003', name: 'Hussein Dey', address: 'Avenue Hassiba Ben Bouali', velos: 5, emplacements: 10, status: 'Active' },
  { id: 'S004', name: 'Bir Mourad Raïs', address: 'Rue Ahmed Zabana', velos: 18, emplacements: 18, status: 'Active' },
  { id: 'S005', name: 'El Harrach', address: 'Boulevard Mohamed V', velos: 7, emplacements: 12, status: 'Inactive' },
];

const AdminStations = () => {
  const [collapsed] = useSidebar();
  const [stations, setStations] = useState(initialStations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStations = stations.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newStation, setNewStation] = useState({
    name: '', address: '', latitude: '', longitude: '', emplacements: ''
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddStation = (e) => {
    e.preventDefault();
    if (!newStation.name || !newStation.address) return;

    const newId = `S00${stations.length + 1}`;
    setStations([...stations, {
      id: newId,
      name: newStation.name,
      address: newStation.address,
      velos: 0,
      emplacements: newStation.emplacements || 0,
      status: 'Active'
    }]);

    setIsModalOpen(false);
    setNewStation({ name: '', address: '', latitude: '', longitude: '', emplacements: '' });
    setToast({ type: 'success', text: 'Nom de la station a été ajouté à la flotte' });
  };

  const handleDelete = (id) => {
    setStations(stations.filter(s => s.id !== id));
    setToast({ type: 'error', text: 'Station supprimée' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setStations(stations.map(s => s.id === editStation.id ? { ...editStation } : s));
    setEditStation(null);
    setToast({ type: 'success', text: 'Station mise à jour avec succès' });
  };

  const renderStatusBadge = (status) => {
    return (
      <span className={`rounded-full px-3 py-1 text-sm font-semibold ${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="stations" />

      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Stations</h1>
            <p className="mt-2 text-sm text-slate-500">Gérez les stations de vélos.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon /> Ajouter une station
          </button>
        </header>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <SearchIcon className="h-5 w-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une station ..."
              className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Nom', 'Adresse', 'Vélos', 'Emplacements', 'Statut', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStations.map(s => (
                <tr key={s.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{s.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{s.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{s.address}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{s.velos}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{s.emplacements}</td>
                  <td className="px-6 py-4">{renderStatusBadge(s.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                        onClick={() => setEditStation({ ...s })}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        onClick={() => handleDelete(s.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(isModalOpen || editStation) && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{isModalOpen ? 'Ajouter une station' : 'Modifier la station'}</h2>
                </div>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                  onClick={() => { setIsModalOpen(false); setEditStation(null); }}
                >
                  <XIcon />
                </button>
              </div>

              <form onSubmit={isModalOpen ? handleAddStation : handleSaveEdit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Nom
                    <input
                      type="text"
                      value={isModalOpen ? newStation.name : editStation.name}
                      onChange={(e) => isModalOpen
                        ? setNewStation({ ...newStation, name: e.target.value })
                        : setEditStation({ ...editStation, name: e.target.value })}
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Adresse
                    <input
                      type="text"
                      value={isModalOpen ? newStation.address : editStation.address}
                      onChange={(e) => isModalOpen
                        ? setNewStation({ ...newStation, address: e.target.value })
                        : setEditStation({ ...editStation, address: e.target.value })}
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Latitude
                    <input
                      type="text"
                      value={isModalOpen ? newStation.latitude : editStation.latitude}
                      onChange={(e) => isModalOpen
                        ? setNewStation({ ...newStation, latitude: e.target.value })
                        : setEditStation({ ...editStation, latitude: e.target.value })}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Longitude
                    <input
                      type="text"
                      value={isModalOpen ? newStation.longitude : editStation.longitude}
                      onChange={(e) => isModalOpen
                        ? setNewStation({ ...newStation, longitude: e.target.value })
                        : setEditStation({ ...editStation, longitude: e.target.value })}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Emplacements
                  <input
                    type="number"
                    value={isModalOpen ? newStation.emplacements : editStation.emplacements}
                    onChange={(e) => isModalOpen
                      ? setNewStation({ ...newStation, emplacements: e.target.value })
                      : setEditStation({ ...editStation, emplacements: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>

                <div className="flex justify-end">
                  <button className="rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                    {isModalOpen ? 'Ajouter la station' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </form>
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

export default AdminStations;
