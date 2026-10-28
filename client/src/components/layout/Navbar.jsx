import { useState } from 'react';
import { Download, LayoutDashboard, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import siteConfig, { resumeFilename } from '../../config/siteConfig';
import { useAuth } from '../../context/AuthContext';
import useSiteSettings from '../../hooks/useSiteSettings';
import DarkModeToggle from './DarkModeToggle';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificates', to: '/certificates' },
  { label: 'Contact', to: '/contact' },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300'
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-950 active:scale-[0.98] dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white'
  }`;

const adminClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300/80 px-3 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-700 dark:text-slate-200 dark:hover:border-primary/50 dark:hover:text-primary';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useSiteSettings();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const resumeUrl = settings.resumeUrl || siteConfig.resumeUrl;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 shadow-[0_4px_24px_-18px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85">
      <nav className="mx-auto flex h-[4.25rem] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="shrink-0 text-base font-semibold tracking-tight text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-lg dark:text-white"
        >
          {settings.fullName || siteConfig.name}
        </Link>

        <div className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link to="/admin" className={`${adminClass} ml-1`}>
              <LayoutDashboard size={16} />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {resumeUrl && (
            <a
              href={resumeUrl}
              download={resumeFilename}
              className="hidden items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:inline-flex"
            >
              <Download size={16} />
              Resume
            </a>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden dark:border-slate-700 dark:text-slate-200"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white py-3 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 sm:px-6 lg:px-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={`${adminClass} mt-1 w-full`}
              >
                <LayoutDashboard size={16} />
                Admin
              </Link>
            )}
            {resumeUrl && (
              <a
                href={resumeUrl}
                download={resumeFilename}
                onClick={() => setMenuOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white sm:hidden"
              >
                <Download size={16} />
                Resume
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
