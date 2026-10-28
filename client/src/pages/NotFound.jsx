import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">404 error</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">Page not found</h1>
      <p className="mt-5 max-w-md text-slate-600 dark:text-slate-400">
        The page you are looking for may have moved or does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowLeft size={17} /> Back home
      </Link>
    </main>
  );
}
