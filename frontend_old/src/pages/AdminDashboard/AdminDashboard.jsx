import React from 'react';
import {
  CarIcon, ActivityIcon, ArrowUpRightIcon, CheckIcon, XIcon, ClockIcon,
  BikeIcon, UsersIcon, MapPinIcon, CalendarIcon, CreditCardIcon
} from './Icons';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useSidebar } from '../../hooks/useSidebar';

const AdminDashboard = () => {
  const [collapsed] = useSidebar();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminSidebar activePage="dashboard" />

      {/* MAIN CONTENT */}
      <main className="min-h-screen transition-all duration-300 px-6 py-8" style={{ marginLeft: collapsed ? '72px' : '260px' }}>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Tableau de bord</h1>
          <p className="mt-2 text-sm text-slate-600">Vue d'ensemble de la plateforme GreenWheels.</p>
        </header>

        {/* KPI CARDS */}
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-slate-600">Véhicules totaux</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">156</p>
              <span className="text-sm text-slate-500">+12 ce mois</span>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <BikeIcon />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-slate-600">Véhicules disponibles</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">98</p>
              <span className="text-sm text-slate-500">+5 actuellement</span>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <ActivityIcon />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-slate-600">Locations actives</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">78</p>
              <span className="text-sm text-slate-500">+5 en cours</span>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <CalendarIcon />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-slate-600">Utilisateurs</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">2,430</p>
              <span className="text-sm text-slate-500">+80 inscrits</span>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <UsersIcon />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-slate-600">Revenus du mois</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">850K DA</p>
              <span className="text-sm text-slate-500">+15% vs mois dernier</span>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <CreditCardIcon />
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-slate-600">Taux d'utilisation</h3>
              <p className="mt-3 text-3xl font-bold text-slate-900">72 %</p>
              <span className="text-sm text-slate-500">-5% cette semaine</span>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700">
              <ArrowUpRightIcon />
            </div>
          </div>
        </section>

        {/* CHARTS */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Revenus mensuels</h3>
            <p className="mt-2 text-sm text-slate-500">Évolution des revenus sur 6 mois</p>
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M0 160 Q 50 150, 100 130 T 200 120 T 300 70 T 400 50 L 400 200 L 0 200 Z" fill="#e8f8f0" />
                <path d="M0 160 Q 50 150, 100 130 T 200 120 T 300 70 T 400 50" fill="none" stroke="#2ad367" strokeWidth="4" />
                <circle cx="150" cy="125" r="4" fill="#2ad367" />
                <rect x="120" y="140" width="60" height="25" rx="4" fill="white" stroke="#eaeaea" />
                <text x="150" y="156" fontSize="10" fill="#666" textAnchor="middle">Mai: 140K DA</text>
              </svg>
              <div className="mt-4 flex justify-between text-xs text-slate-500">
                <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Jun</span><span>Jul</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Revenus cette semaine</h3>
            <p className="mt-2 text-sm text-slate-500">Revenus quotidiens en DA</p>
            <div className="mt-6 flex h-52 items-end gap-4 border-b border-slate-200 pb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '60%' }} />
                <span className="text-xs text-slate-500">Lun</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '50%' }} />
                <span className="text-xs text-slate-500">Mar</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '80%' }} />
                <span className="text-xs text-slate-500">Mer</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '90%' }} />
                <span className="text-xs text-slate-500">Jeu</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '55%' }} />
                <span className="text-xs text-slate-500">Ven</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '45%' }} />
                <span className="text-xs text-slate-500">Sam</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="h-36 w-6 rounded-full bg-emerald-500" style={{ height: '40%' }} />
                <span className="text-xs text-slate-500">Dim</span>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">État des véhicules</h3>
            <p className="mt-2 text-sm text-slate-500">Répartition par statut</p>
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Disponible</span>
                <strong className="text-slate-900">98 <span className="text-sm font-normal text-slate-500">véhicules</span></strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">Loué</span>
                <strong className="text-slate-900">45 <span className="text-sm font-normal text-slate-500">véhicules</span></strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-600">Indisponible</span>
                <strong className="text-slate-900">13 <span className="text-sm font-normal text-slate-500">véhicules</span></strong>
              </div>
              <div className="mt-6 rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Total Flotte</span>
                  <strong className="text-slate-900">156 véhicules</strong>
                </div>
                <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-3/5 bg-emerald-500" />
                  <div className="h-full w-3/10 bg-slate-400" />
                  <div className="h-full w-1/10 bg-rose-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Types de véhicules</h3>
            <p className="mt-2 text-sm text-slate-500">Distribution de la flotte</p>
            <div className="mt-6 flex items-center justify-center">
              <svg width="120" height="120" viewBox="0 0 36 36" className="rounded-full">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#b6d9e8" strokeWidth="6" strokeDasharray="45 55" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ab90ed" strokeWidth="6" strokeDasharray="23 77" strokeDashoffset="-20" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2ad367" strokeWidth="6" strokeDasharray="32 68" strokeDashoffset="57" />
              </svg>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3">
                <span className="h-3 w-3 rounded-full bg-[#b6d9e8]" />
                <span className="text-sm text-slate-700">Vélo électrique</span>
                <strong className="text-slate-900">45%</strong>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3">
                <span className="h-3 w-3 rounded-full bg-[#2ad367]" />
                <span className="text-sm text-slate-700">Vélo classique</span>
                <strong className="text-slate-900">32%</strong>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-3">
                <span className="h-3 w-3 rounded-full bg-[#ab90ed]" />
                <span className="text-sm text-slate-700">Scooter</span>
                <strong className="text-slate-900">23%</strong>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Top Stations</h3>
            <p className="mt-2 text-sm text-slate-500">Les plus actives</p>
            <div className="mt-6 space-y-4">
              {[
                ['#1', 'Alger Centre', '90%', '#2ad367'],
                ['#2', 'Bab El Oued', '70%', '#2ad367'],
                ['#3', 'Kouba', '60%', '#2ad367'],
                ['#4', 'Hussein Dey', '45%', '#d0d0d0'],
                ['#5', 'El Harrach', '30%', '#d0d0d0'],
              ].map(([rank, name, width, color]) => (
                <div key={name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>{rank}</span>
                    <span>{name}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RECENT ACTIVITIES */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Locations récentes</h3>
          <p className="mt-2 text-sm text-slate-500">Dernières activités de location</p>
          <div className="mt-6 space-y-4">
            {[
              { icon: <ClockIcon />, color: 'bg-emerald-100 text-emerald-600', title: 'Karim B', subtitle: 'Vélo Urbain Pro', detail: 'Alger Centre — il y a 5 min', amount: '400 DA', badge: 'En cours', badgeClass: 'bg-emerald-100 text-emerald-700' },
              { icon: <ClockIcon />, color: 'bg-emerald-100 text-emerald-600', title: 'Sarah M', subtitle: 'Scooter City', detail: 'Bab El Oued — il y a 15 min', amount: '1,500 DA', badge: 'En cours', badgeClass: 'bg-emerald-100 text-emerald-700' },
              { icon: <CheckIcon />, color: 'bg-slate-100 text-slate-700', title: 'Ahmed K', subtitle: 'E-Bike Sport', detail: 'Kouba — il y a 2h', amount: '800 DA', badge: 'Terminée', badgeClass: 'bg-slate-100 text-slate-700' },
              { icon: <XIcon />, color: 'bg-rose-100 text-rose-600', title: 'Amina R', subtitle: 'Vélo Classic', detail: 'Hussein Dey — il y a 45 min', amount: '280 DA', badge: 'Annulée', badgeClass: 'bg-rose-100 text-rose-600' },
            ].map(item => (
              <div key={item.title} className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${item.color}`}>
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900">{item.title} <span className="font-normal text-slate-500">— {item.subtitle}</span></h4>
                  <p className="text-sm text-slate-500 flex items-center gap-2"><MapPinIcon /> {item.detail}</p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <strong className="text-base font-bold text-slate-900">{item.amount}</strong>
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${item.badgeClass}`}>{item.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
