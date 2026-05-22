import React, { useState, useEffect } from 'react';
import {
  EditIcon, TrashIcon, SearchIcon, ChevronDownIcon, BatteryIcon, PlusIcon, XIcon,
  MapPinIcon, BikeIcon
} from '../AdminDashboard/Icons';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';

const initialVehicles = [
  { id: 'V001', name: 'Vélo Urbain Pro', type: 'Vélo électrique', price: 200, battery: 85, autonomy: '45 km', station: 'Alger Centre', status: 'Disponible' },
  { id: 'V002', name: 'Scooter City', type: 'Scooter électrique', price: 350, battery: 62, autonomy: '60 km', station: 'Bab El Oued', status: 'Indisponible' },
  { id: 'V003', name: 'Vélo Classic', type: 'Vélo Classique', price: 100, battery: 100, autonomy: 'N/A', station: 'Hussein Dey', status: 'Loué' },
  { id: 'V004', name: 'E-Bike Sport', type: 'Vélo électrique', price: 280, battery: 75, autonomy: '30 km', station: 'Kouba', status: 'Disponible' },
  { id: 'V005', name: 'Scooter Express', type: 'Scooter électrique', price: 400, battery: 95, autonomy: '70 km', station: 'El Harrach', status: 'Disponible' },
  { id: 'V006', name: 'Vélo Touring', type: 'Vélo électrique', price: 250, battery: 50, autonomy: '40 km', station: 'Alger Centre', status: 'Loué' },
];

const AdminVehicules = () => {
  const [collapsed] = useSidebar();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState('Tous les status');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterValue === 'Tous les status' || v.status === filterValue;
    return matchesSearch && matchesFilter;
  });

  const [newVehicle, setNewVehicle] = useState({
    name: '', type: 'Vélo électrique', price: '', autonomy: '', station: 'Alger Centre'
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehicle.name) return;

    const newId = `V00${vehicles.length + 1}`;
    setVehicles([...vehicles, {
      ...newVehicle,
      id: newId,
      battery: 100,
      status: 'Disponible'
    }]);

    setIsModalOpen(false);
    setNewVehicle({ name: '', type: 'Vélo électrique', price: '', autonomy: '', station: 'Alger Centre' });
    setToast({ type: 'success', text: 'Véhicule ajouté à la flotte' });
  };

  const handleDelete = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    setToast({ type: 'error', text: 'Véhicule supprimé' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setVehicles(vehicles.map(v => v.id === editVehicle.id ? { ...editVehicle } : v));
    setEditVehicle(null);
    setToast({ type: 'success', text: 'Véhicule mis à jour avec succès' });
  };

  const renderStatusBadge = (status) => {
    const classes = status === 'Disponible'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'Loué'
        ? 'bg-slate-100 text-slate-700'
        : 'bg-rose-100 text-rose-700';
    return <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${classes}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="vehicules" />

      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Véhicules</h1>
            <p className="mt-2 text-sm text-slate-500">Gérez les véhicules de la flotte GreenWheels.</p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon /> Ajouter un véhicule
          </button>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BikeIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Total</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{vehicles.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BatteryIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Disponibles</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{vehicles.filter(v => v.status === 'Disponible').length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <MapPinIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Loués</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{vehicles.filter(v => v.status === 'Loué').length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <EditIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Maintenance</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{vehicles.filter(v => v.status === 'Indisponible').length}</p>
              </div>
            </div>
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
                placeholder="Rechercher un véhicule ..."
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm"
            >
              {filterValue}
              <ChevronDownIcon />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-60 rounded-3xl border border-slate-200 bg-white p-2 shadow-lg">
                {['Tous les status', 'Disponible', 'Loué', 'Indisponible'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilterValue(opt); setFilterOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${filterValue === opt ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span>{filterValue === opt ? '✓' : ''}</span>{opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Nom', 'Type', 'Prix/h', 'Batterie', 'Autonomie', 'Station', 'État', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(v => (
                <tr key={v.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{v.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{v.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{v.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{v.price} DA</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${v.battery}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{v.battery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{v.autonomy}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{v.station}</td>
                  <td className="px-6 py-4">{renderStatusBadge(v.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                        onClick={() => setEditVehicle({ ...v })}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        onClick={() => handleDelete(v.id)}
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

        {(isModalOpen || editVehicle) && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8">
            <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">{isModalOpen ? 'Ajouter un véhicule' : 'Modifier le véhicule'}</h2>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                  onClick={() => { setIsModalOpen(false); setEditVehicle(null); }}
                >
                  <XIcon />
                </button>
              </div>

              <form onSubmit={isModalOpen ? handleAddVehicle : handleSaveEdit} className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Nom
                    <input
                      type="text"
                      value={isModalOpen ? newVehicle.name : editVehicle.name}
                      onChange={(e) => isModalOpen
                        ? setNewVehicle({ ...newVehicle, name: e.target.value })
                        : setEditVehicle({ ...editVehicle, name: e.target.value })}
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Type
                    <div className="relative">
                      <select
                        value={isModalOpen ? newVehicle.type : editVehicle.type}
                        onChange={(e) => isModalOpen
                          ? setNewVehicle({ ...newVehicle, type: e.target.value })
                          : setEditVehicle({ ...editVehicle, type: e.target.value })}
                        className="w-full appearance-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-emerald-500"
                      >
                        <option>Vélo électrique</option>
                        <option>Vélo Classique</option>
                        <option>Scooter électrique</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    </div>
                  </label>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Prix (DA/h)
                    <input
                      type="number"
                      value={isModalOpen ? newVehicle.price : editVehicle.price}
                      onChange={(e) => isModalOpen
                        ? setNewVehicle({ ...newVehicle, price: e.target.value })
                        : setEditVehicle({ ...editVehicle, price: e.target.value })}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Autonomie
                    <input
                      type="text"
                      value={isModalOpen ? newVehicle.autonomy : editVehicle.autonomy}
                      onChange={(e) => isModalOpen
                        ? setNewVehicle({ ...newVehicle, autonomy: e.target.value })
                        : setEditVehicle({ ...editVehicle, autonomy: e.target.value })}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    />
                  </label>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Station
                    <div className="relative">
                      <select
                        value={isModalOpen ? newVehicle.station : editVehicle.station}
                        onChange={(e) => isModalOpen
                          ? setNewVehicle({ ...newVehicle, station: e.target.value })
                          : setEditVehicle({ ...editVehicle, station: e.target.value })}
                        className="w-full appearance-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-emerald-500"
                      >
                        <option>Alger Centre</option>
                        <option>Bab El Oued</option>
                        <option>Hussein Dey</option>
                        <option>Kouba</option>
                        <option>El Harrach</option>
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    </div>
                  </label>
                  {!isModalOpen && (
                    <label className="space-y-2 text-sm font-medium text-slate-700">
                      Statut
                      <div className="relative">
                        <select
                          value={editVehicle.status}
                          onChange={(e) => setEditVehicle({ ...editVehicle, status: e.target.value })}
                          className="w-full appearance-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 outline-none focus:border-emerald-500"
                        >
                          <option value="Disponible">Disponible</option>
                          <option value="Loué">Loué</option>
                          <option value="Indisponible">Indisponible</option>
                        </select>
                        <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                      </div>
                    </label>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    onClick={() => { setIsModalOpen(false); setEditVehicle(null); }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    {isModalOpen ? 'Ajouter' : 'Enregistrer'}
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

export default AdminVehicules;

  