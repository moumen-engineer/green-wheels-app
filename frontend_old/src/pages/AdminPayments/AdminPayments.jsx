import React, { useState } from 'react';
import {
  SearchIcon, ChevronDownIcon
} from '../AdminDashboard/Icons';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';

const RevenueIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const ArrowUpIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const RefundIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.52"/>
  </svg>
);

const initialPayments = [
  { id: 'P001', utilisateur: 'Karim Benali', type: 'Location', montant: 400, methode: 'Carte bancaire', date: '2026-04-06', statut: 'Payé' },
  { id: 'P002', utilisateur: 'Sarah Meziane', type: 'Abonnement', montant: 5000, methode: 'Carte bancaire', date: '2026-04-07', statut: 'Payé' },
  { id: 'P003', utilisateur: 'Ahmed Khelifi', type: 'Location', montant: 280, methode: 'Carte bancaire', date: '2026-04-05', statut: 'En attente' },
  { id: 'P004', utilisateur: 'Amina Rahal', type: 'Location', montant: 400, methode: 'Carte bancaire', date: '2026-04-09', statut: 'Remboursé' },
  { id: 'P005', utilisateur: 'Yacine Larbi', type: 'Abonnement', montant: 40000, methode: 'Carte bancaire', date: '2026-04-03', statut: 'Payé' },
  { id: 'P006', utilisateur: 'Kenza Atmani', type: 'Location', montant: 750, methode: 'Carte bancaire', date: '2026-04-06', statut: 'Payé' },
];

const weekData = [
  { day: 'Lun', value: 30000 },
  { day: 'Mar', value: 18000 },
  { day: 'Mer', value: 22000 },
  { day: 'Jeu', value: 48000 },
  { day: 'Ven', value: 38000 },
  { day: 'Sam', value: 28000 },
  { day: 'Dim', value: 20000 },
];

const AdminPayments = () => {
  const [collapsed] = useSidebar();
  const [payments] = useState(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous les statuts');
  const [filterOpen, setFilterOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);

  const filtered = payments.filter(p => {
    const matchSearch = p.utilisateur.toLowerCase().includes(searchTerm.toLowerCase())
      || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatut === 'Tous les statuts' || p.statut === filterStatut;
    return matchSearch && matchFilter;
  });

  const totalRevenu = payments.filter(p => p.statut === 'Payé').reduce((a, p) => a + p.montant, 0);
  const enAttente = payments.filter(p => p.statut === 'En attente').reduce((a, p) => a + p.montant, 0);
  const enAttenteCount = payments.filter(p => p.statut === 'En attente').length;
  const remboursements = payments.filter(p => p.statut === 'Remboursé').reduce((a, p) => a + p.montant, 0);
  const remboursementsCount = payments.filter(p => p.statut === 'Remboursé').length;

  const renderBadge = (statut) => {
    if (statut === 'Payé') return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Payé</span>;
    if (statut === 'En attente') return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">En attente</span>;
    return <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Remboursé</span>;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="paiements" />

      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Paiements</h1>
          <p className="mt-2 text-sm text-slate-500">Historique des paiements et revenus de la plateforme.</p>
        </header>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Revenus totaux</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{totalRevenu.toLocaleString()} DA</p>
                <span className="text-sm text-slate-500">+65% vs mois dernier</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                <RevenueIcon />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">En attente</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{enAttente.toLocaleString()} DA</p>
                <span className="text-sm text-slate-500">{enAttenteCount} paiement(s)</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-600">
                <ArrowUpIcon />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Remboursements</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{remboursements.toLocaleString()} DA</p>
                <span className="text-sm text-slate-500">{remboursementsCount} remboursement(s)</span>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-600">
                <RefundIcon />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Revenus cette semaine</h3>
            <p className="mt-2 text-sm text-slate-500">Revenus quotidiens en DA</p>
            <div className="mt-6 flex gap-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '60%' }} />
                <span className="text-xs text-slate-500">Lun</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '50%' }} />
                <span className="text-xs text-slate-500">Mar</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '80%' }} />
                <span className="text-xs text-slate-500">Mer</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '90%' }} />
                <span className="text-xs text-slate-500">Jeu</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '55%' }} />
                <span className="text-xs text-slate-500">Ven</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '45%' }} />
                <span className="text-xs text-slate-500">Sam</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="h-44 w-6 rounded-full bg-emerald-500" style={{ height: '40%' }} />
                <span className="text-xs text-slate-500">Dim</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:max-w-xl">
            <div className="flex items-center gap-3">
              <SearchIcon className="h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher ..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-3xl border border-slate-200 bg-white p-2 shadow-lg">
                {['Tous les statuts', 'Payé', 'En attente', 'Remboursé'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setFilterStatut(opt); setFilterOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm ${filterStatut === opt ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    <span>{filterStatut === opt ? '✓' : ''}</span>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50">
              <tr>
                {['ID', 'Utilisateur', 'Type', 'Montant', 'Méthode', 'Date', 'Statut'].map(label => (
                  <th key={label} className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{p.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{p.utilisateur}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{p.type}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{p.montant.toLocaleString()} DA</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{p.methode}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{p.date}</td>
                  <td className="px-6 py-4">{renderBadge(p.statut)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminPayments;
