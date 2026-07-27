import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileText, Users, Package, LayoutDashboard,
  Settings, LogOut, Menu, X, Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout, setIsPasswordModalOpen } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const navItems = [
    { name: 'Invoice editor', path: '/', icon: FileText },
    { name: 'Invoices',       path: '/invoices',  icon: LayoutDashboard },
    { name: 'Customers',      path: '/customers', icon: Users },
    { name: 'Products',       path: '/products',  icon: Package },
  ];

  const displayName = user?.name || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handleResize);
    
    // Closer for settings popover
    const handleClick = (e) => {
      if (isSettingsOpen && !e.target.closest('.sb-settings-group')) {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', handleClick);
    };
  }, [isSettingsOpen]);

  const sidebarContent = (
    <div className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      {/* ── Brand / Toggle ── */}
      <div className="brand" onClick={onToggle} title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
        <div className="brand-mark" style={{ background: '#FFFFFF', border: '1px solid rgba(255,255,255,0.1)', padding: 6, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/zephy.png" alt="Zephy Logo" style={{ width: 24, height: 24, objectFit: 'contain' }} />
        </div>
        {isOpen && (
          <div>
            <div className="brand-name">Zephy</div>
            <div className="brand-tier">Invoice Generator</div>
          </div>
        )}
      </div>

      {/* ── Nav ── */}
      {isOpen && <div className="nav-group-label">General</div>}
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={{ justifyContent: !isOpen ? 'center' : 'flex-start' }}
          onClick={() => setMobileOpen(false)}
        >
          <item.icon />
          {isOpen && <span>{item.name}</span>}
        </NavLink>
      ))}

      <div className="sidebar-spacer" />

      {/* ── Settings ── */}
      <div className="sb-settings-group" style={{ position: 'relative' }}>
        <button 
          className="sidebar-btn nav-item" 
          style={{ justifyContent: !isOpen ? 'center' : 'flex-start' }}
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
        >
          <Settings size={16} opacity={isSettingsOpen ? 1 : 0.85} />
          {isOpen && <span>Settings</span>}
        </button>

        {isSettingsOpen && (
          <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: '#2B2E33', padding: 8, borderRadius: 7, marginBottom: 4 }}>
            <button 
              className="sidebar-btn nav-item"
              onClick={() => {
                setIsPasswordModalOpen(true);
                setIsSettingsOpen(false);
                if (!isOpen) onToggle();
              }}
            >
              <Lock size={14} />
              <span>Reset Password</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Sign Out ── */}
      <button
        className="sidebar-btn nav-item"
        style={{ justifyContent: !isOpen ? 'center' : 'flex-start', marginBottom: 16 }}
        onClick={logout}
      >
        <LogOut size={16} opacity={0.85} />
        {isOpen && <span>Sign Out</span>}
      </button>

      {/* ── User ── */}
      <div className="sidebar-user" style={{ justifyContent: !isOpen ? 'center' : 'flex-start' }}>
        <div className="user-avatar">{initials}</div>
        {isOpen && (
          <div>
            <div className="user-name">{displayName}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div data-sidebar-mobile-bar className="sb-mobile-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="sb-menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} color="#1B1D20" />
          </button>
          <span className="brand-name" style={{ fontSize: '16px', color: '#1B1D20' }}>
            InvoGen
          </span>
        </div>
      </div>

      {/* ── Mobile drawer backdrop ── */}
      {mobileOpen && (
        <div className="sb-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Mobile drawer ── */}
      <div data-sidebar-drawer className="sb-mobile-drawer" style={{
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      }}>
        <button className="sb-close-btn" onClick={() => setMobileOpen(false)}>
          <X size={16} />
        </button>
        <div style={{ height: '100%' }}>
          {React.cloneElement(sidebarContent, { isOpen: true })}
        </div>
      </div>

      {/* ── Desktop sidebar ── */}
      <div data-sidebar-desktop className="sb-desktop-wrap">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;