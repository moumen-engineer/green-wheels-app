import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';
import { SearchIcon, ChevronDownIcon } from '../AdminDashboard/Icons';

const initialTasks = [
  { id: 'M001', vehicule: 'Vélo Classic', probleme: 'Pneu crevé', priorite: 'Haute', technicien: 'Amina R.', date: '2026-04-06', statut: 'En cours' },
  { id: 'M002', vehicule: 'Scooter City', probleme: 'Batterie faible', priorite: 'Moyenne', technicien: 'Kenza A.', date: '2026-04-06', statut: 'Planifiée' },
  { id: 'M003', vehicule: 'E-Bike Sport', probleme: 'Frein défectueux', priorite: 'Haute', technicien: 'Amine L.', date: '2026-04-05', statut: 'Terminée' },
  { id: 'M004', vehicule: 'Vélo Cargo', probleme: 'Chaîne usée', priorite: 'Basse', technicien: 'Chaima B.', date: '2026-04-09', statut: 'Planifiée' },
];

const AdminMaintenance = () => {
  const [collapsed] = useSidebar();
  const [tasks] = useState(initialTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous les statuts');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = tasks.filter(t => {
    const matchSearch = t.vehicule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.probleme.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatut === 'Tous les statuts' || t.statut === filterStatut;
    return matchSearch && matchFilter;
  });

  const renderPriority = (p) => {
    const classes = p === 'Haute'
      ? 'bg-rose-100 text-rose-700'
      : p === 'Moyenne'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';
    return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${classes}`}>{p}</span>;
  };

  const renderStatut = (s) => {
    const classes = s === 'En cours'
      ? 'bg-emerald-100 text-emerald-700'
      : s === 'Planifiée'
        ? 'bg-sky-100 text-sky-700'
        : 'bg-slate-100 text-slate-700';
    return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${classes}`}>{s}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="maintenance" />

      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Maintenance</h1>
          <p className="mt-2 text-sm text-slate-500">Suivi de la maintenance des véhicules.</p>
        </header>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                {['Tous les statuts', 'En cours', 'Planifiée', 'Terminée'].map(opt => (
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

        <section className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Véhicule', 'Problème', 'Priorité', 'Technicien', 'Date', 'Statut'].map(header => (
                  <th key={header} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.vehicule}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.probleme}</td>
                  <td className="px-6 py-4">{renderPriority(t.priorite)}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.technicien}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{t.date}</td>
                  <td className="px-6 py-4">{renderStatut(t.statut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminMaintenance;
