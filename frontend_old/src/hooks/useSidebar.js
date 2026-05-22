import { useState, useEffect } from 'react';

export const useSidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(prev => !prev);

  return [collapsed, toggleSidebar];
};
