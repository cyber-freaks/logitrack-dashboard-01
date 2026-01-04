import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiTruck, 
  FiFileText, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/shipments', icon: FiTruck, label: 'Shipments' },
  { to: '/documents', icon: FiFileText, label: 'Documents' },
  { to: '/inventory', icon: FiPackage, label: 'Inventory' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-sidebar-border px-4 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <FiTruck className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="ml-3 text-xl font-bold text-gradient">LogiTrack</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:text-primary'}`} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <button
          onClick={logout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-destructive transition-all w-full ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <FiLogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>

        <button
          onClick={onToggle}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-sidebar-accent transition-all w-full ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          {collapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <>
              <FiChevronLeft className="w-5 h-5" />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
