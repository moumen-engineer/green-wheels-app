import React, { useState, useEffect } from 'react';
import { SearchIcon, ChevronDownIcon, EyeIcon, XIcon } from '../AdminDashboard/Icons';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';

const CancelIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const initialReservations = [
  { id: 'R001', utilisateur: 'Karim Benali', vehicule: 'Vélo Urbain Pro', station: 'Alger Centre', date: '2026-03-15', duree: '2h00', montant: '400 DA', statut: 'En cours' },
  { id: 'R002', utilisateur: 'Sarah Meziane', vehicule: 'Scooter City', station: 'Bab El Oued', date: '2026-03-20', duree: '1h15', montant: '500 DA', statut: 'En cours' },
  { id: 'R003', utilisateur: 'Ahmed Khelifi', vehicule: 'E-Bike Sport', station: 'Kouba', date: '2026-02-10', duree: '3h00', montant: '450 DA', statut: 'Terminée' },
  { id: 'R004', utilisateur: 'Amina Rahal', vehicule: 'Vélo Classic', station: 'Hussein Dey', date: '2026-02-22', duree: '0h45', montant: '180 DA', statut: 'Terminée' },
  { id: 'R005', utilisateur: 'Yacine Larbi', vehicule: 'Scooter Express', station: 'El Harrach', date: '2026-01-30', duree: '1h00', montant: '600 DA', statut: 'Annulée' },
  { id: 'R006', utilisateur: 'Kenza Atmani', vehicule: 'Vélo Touring', station: 'Alger Centre', date: '2026-04-06', duree: '1h30', montant: '375 DA', statut: 'En cours' },
];

const AdminReservations = () => {
  const [collapsed] = useSidebar();
  const [reservations, setReservations] = useState(initialReservations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous les statuts');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedResa, setSelectedResa] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filtered = reservations.filter(r => {
    const matchSearch = r.utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vehicule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatut === 'Tous les statuts' || r.statut === filterStatut;
    return matchSearch && matchFilter;
  });

  const handleCancel = (id) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, statut: 'Annulée' } : r));
    setToast('Réservation annulée');
  };

  const total = reservations.length;
  const enCours = reservations.filter(r => r.statut === 'En cours').length;
  const terminees = reservations.filter(r => r.statut === 'Terminée').length;
  const revenus = reservations
    .filter(r => r.statut !== 'Annulée')
    .reduce((acc, r) => acc + parseInt(r.montant.replace(/\D/g, ''), 10), 0);

  const renderBadge = (statut) => {
    const classes = statut === 'En cours'
      ? 'bg-emerald-100 text-emerald-700'
      : statut === 'Terminée'
        ? 'bg-slate-100 text-slate-700'
        : 'bg-rose-100 text-rose-700';
    return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${classes}`}>{statut}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="reservations" />

      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Réservations</h1>
          <p className="mt-2 text-sm text-slate-500">Gérez toutes les réservations de la plateforme.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Total</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{total}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">En cours</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{enCours}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Terminées</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{terminees}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-500">Revenus</p>
            <p className="mt-3 text-3xl font-bold text-emerald-700">{revenus.toLocaleString()} DA</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <SearchIcon className="h-5 w-5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher ..."
                className="w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm"
            >
              {filterStatut}
              <ChevronDownIcon />
            </button>
            {filterOpen && (
              <div className="absolute right-0 z-10 mt-2 w-60 rounded-3xl border border-slate-200 bg-white p-2 shadow-lg">
                {['Tous les statuts', 'En cours', 'Terminée', 'Annulée'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilterStatut(opt); setFilterOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${filterStatut === opt ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span>{filterStatut === opt ? '✓' : ''}</span>{opt}
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
                {['ID', 'Utilisateur', 'Véhicule', 'Station', 'Statut', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{r.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{r.utilisateur}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{r.vehicule}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{r.station}</td>
                  <td className="px-6 py-4">{renderBadge(r.statut)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                        onClick={() => setSelectedResa(r)}
                        title="Voir détails"
                      >
                        <EyeIcon />
                      </button>
                      {r.statut === 'En cours' && (
                        <button
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                          onClick={() => handleCancel(r.id)}
                          title="Annuler"
                        >
                          <CancelIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedResa && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Détails de la réservation {selectedResa.id}</h2>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100"
                  onClick={() => setSelectedResa(null)}
                >
                  <XIcon />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Utilisateur', selectedResa.utilisateur],
                  ['Véhicule', selectedResa.vehicule],
                  ['Station', selectedResa.station],
                  ['Date', selectedResa.date],
                  ['Durée', selectedResa.duree],
                  ['Montant', selectedResa.montant],
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
              <p className="text-sm text-slate-700">{toast}</p>
              <button className="text-slate-500 transition hover:text-slate-900" onClick={() => setToast(null)}><XIcon /></button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReservations;
