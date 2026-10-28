import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const initials = (user?.name || 'Admin')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Profile</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your signed-in administrator account details.</p>
      </header>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary" aria-hidden="true">
            {initials || <UserRound size={24} />}
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-slate-900 dark:text-white">{user?.name || 'Administrator'}</h2>
            <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">{user?.email || 'No email available'}</p>
          </div>
        </div>

        <dl className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Account role</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm font-medium capitalize text-slate-900 dark:text-white">
              <ShieldCheck size={16} className="text-primary" /> {user?.role || 'admin'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Account ID</dt>
            <dd className="mt-1 break-all font-mono text-xs text-slate-600 dark:text-slate-300">{user?._id || 'Unavailable'}</dd>
          </div>
        </dl>
      </article>

      <Link
        to="/admin/settings"
        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-primary/40 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70"
      >
        <span className="flex items-center gap-3">
          <span className="rounded-xl bg-primary/10 p-3 text-primary"><KeyRound size={19} /></span>
          <span>
            <span className="block font-semibold text-slate-900 dark:text-white">Account security and preferences</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Change your password or appearance theme.</span>
          </span>
        </span>
        <ArrowRight size={18} className="shrink-0 text-slate-600 dark:text-slate-300" />
      </Link>
    </section>
  );
}
