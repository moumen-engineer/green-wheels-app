import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {
  DashboardIcon, BikeIcon, UsersIcon, MapPinIcon,
  CalendarIcon, CreditCardIcon, SettingsIcon, MoonIcon, ChevronLeftIcon, SunIcon
} from '../../pages/AdminDashboard/Icons';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useSidebar } from '../../hooks/useSidebar';

const AdminSidebar = ({ activePage }) => {
  const [theme, toggleTheme] = useDarkMode();
  const [collapsed, toggleSidebar] = useSidebar();

  const navItems = [
    { to: '/admin-dashboard', icon: <DashboardIcon />, label: 'Dashboard', key: 'dashboard' },
    { to: '/admin-vehicules', icon: <BikeIcon />, label: 'Véhicules', key: 'vehicules' },
    { to: '/admin-stations', icon: <MapPinIcon />, label: 'Stations', key: 'stations' },
    { to: '/admin-utilisateurs', icon: <UsersIcon />, label: 'Utilisateurs', key: 'utilisateurs' },
    { to: '/admin-reservations', icon: <CalendarIcon />, label: 'Réservations', key: 'reservations' },
    { to: '/admin-paiements', icon: <CreditCardIcon />, label: 'Paiements', key: 'paiements' },
    { to: '/admin-maintenance', icon: <SettingsIcon />, label: 'Maintenance', key: 'maintenance' },
  ];

  return (
    <aside className={`w-[260px] ${collapsed ? 'w-[72px]' : ''} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed top-0 left-0 bottom-0 z-100 transition-all duration-300 overflow-hidden`}>
      <div className="p-5 px-4 flex items-center gap-2.5 border-b border-gray-200 dark:border-gray-700 min-h-[72px] overflow-hidden">
        <img src={logo} alt="GreenWheels Logo" className="h-8 object-contain flex-shrink-0" />
        {!collapsed && <span className="text-base font-bold text-green-500 whitespace-nowrap overflow-hidden opacity-100 transition-opacity duration-150">Admin</span>}
      </div>

      <nav className="flex-1 p-4 px-2.5 flex flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map(item => (
          <Link
            key={item.key}
            to={item.to}
            className={`flex items-center gap-3 p-2.5 px-3 rounded-lg no-underline text-gray-600 dark:text-gray-400 font-medium text-sm transition-all duration-200 whitespace-nowrap overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white ${activePage === item.key ? 'bg-green-500 text-white' : ''}`}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span className="overflow-hidden whitespace-nowrap">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 px-2.5 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-1 overflow-hidden">
        <button className="flex items-center gap-3 p-2.5 px-3 bg-none border-none text-gray-600 dark:text-gray-400 font-medium text-sm cursor-pointer rounded-lg text-left w-full transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white" onClick={toggleTheme} title={collapsed ? (theme === 'light' ? 'Mode sombre' : 'Mode clair') : ''}>
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          {!collapsed && <span>{theme === 'light' ? 'Mode sombre' : 'Mode clair'}</span>}
        </button>
        <button className="flex items-center gap-3 p-2.5 px-3 bg-none border-none text-gray-600 dark:text-gray-400 font-medium text-sm cursor-pointer rounded-lg text-left w-full transition-colors duration-200 whitespace-nowrap overflow-hidden hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white" onClick={toggleSidebar} title={collapsed ? 'Expandre' : 'Réduire'}>
          <span className={`flex items-center transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
            <ChevronLeftIcon />
          </span>
          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
