import {
  Award,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ExternalLink,
  FileText,
  Info,
  LogOut,
  Mail,
  Settings,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';
import { useAuth } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';

const links = [
  { label: 'Dashboard', to: '/admin', icon: ChartNoAxesCombined, end: true },
  { label: 'About', to: '/admin/about', icon: Info },
  { label: 'Skills', to: '/admin/skills', icon: Wrench },
  { label: 'Projects', to: '/admin/projects', icon: BriefcaseBusiness },
  { label: 'Certificates', to: '/admin/certificates', icon: Award },
  { label: 'Messages', to: '/admin/messages', icon: FileText },
  { label: 'Contact Info', to: '/admin/contact-info', icon: Mail },
  { label: 'Profile', to: '/admin/profile', icon: UserRound },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

export default function Sidebar({ open = false, onClose = () => {}, unreadMessages }) {
  const { logout } = useAuth();
  const { data } = useFetch('/admin/dashboard');
  const unreadCount = unreadMessages ?? data?.unreadMessages ?? 0;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        aria-label="Admin navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <Link to="/admin" className="min-w-0" onClick={onClose}>
            <span className="block truncate text-base font-bold text-slate-900 dark:text-white">
              {siteConfig.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Portfolio Admin</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {links.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/10'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={19} />
              <span className="flex-1">{label}</span>
              {label === 'Messages' && unreadCount > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-slate-200 p-4 dark:border-slate-800">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ExternalLink size={19} />
            View Website
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
