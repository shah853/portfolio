import { useState } from 'react';
import { AtSign, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import getErrorMessage from '../utils/getErrorMessage';

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <Loader fullScreen />;
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck size={28} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin sign in</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to manage your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</span>
            <span className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 focus-within:border-primary dark:border-slate-700">
              <AtSign size={18} className="shrink-0 text-slate-400" />
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-900 outline-none dark:text-white"
                placeholder="admin@example.com"
              />
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</span>
            <span className="flex items-center gap-3 rounded-lg border border-slate-300 px-3 focus-within:border-primary dark:border-slate-700">
              <LockKeyhole size={18} className="shrink-0 text-slate-400" />
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-900 outline-none dark:text-white"
                placeholder="Your password"
              />
            </span>
          </label>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" loading={submitting} className="w-full">
            Sign in
          </Button>
        </form>
      </section>
    </main>
  );
}