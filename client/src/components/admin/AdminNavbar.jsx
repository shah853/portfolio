import { Menu, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminNavbar({ onMenuClick }) {
  const { user } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>
        <p className="truncate text-sm text-slate-600 dark:text-slate-300">
          Welcome, <span className="font-semibold text-slate-900 dark:text-white">{user?.name || 'Admin'}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
