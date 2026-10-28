import { useCallback, useEffect, useState } from 'react';
import {
  Award,
  BriefcaseBusiness,
  FileText,
  Info,
  Mail,
  MessageSquare,
  MessageSquareWarning,
  Plus,
  Upload,
  Wrench,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/admin/DataTable';
import StatCard from '../components/admin/StatCard';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const statItems = [
  { key: 'totalProjects', label: 'Projects', icon: BriefcaseBusiness, color: 'blue', gradient: 'from-blue-500 to-indigo-500' },
  { key: 'totalSkills', label: 'Skills', icon: Wrench, color: 'green', gradient: 'from-emerald-500 to-teal-500' },
  { key: 'totalCertificates', label: 'Certificates', icon: Award, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
  { key: 'totalMessages', label: 'Messages', icon: MessageSquare, color: 'primary', gradient: 'from-indigo-500 to-violet-500' },
  { key: 'unreadMessages', label: 'Pending / unread', icon: MessageSquareWarning, color: 'rose', gradient: 'from-rose-500 to-pink-500' },
  { key: 'readMessages', label: 'Read messages', icon: Mail, color: 'blue', gradient: 'from-sky-500 to-cyan-500' },
];

const contentCards = [
  { title: 'About', description: 'Update your profile and introduction.', to: '/admin/about', icon: Info, tone: 'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300' },
  { title: 'Skills', description: 'Organize your skills and expertise.', to: '/admin/skills', icon: Wrench, tone: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300' },
  { title: 'Projects', description: 'Showcase and manage your work.', to: '/admin/projects', icon: BriefcaseBusiness, tone: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300' },
  { title: 'Certificates', description: 'Manage your credentials and awards.', to: '/admin/certificates', icon: Award, tone: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300' },
  { title: 'Messages', description: 'Read and manage contact form submissions.', to: '/admin/messages', icon: MessageSquare, tone: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300' },
  { title: 'Contact Info', description: 'Update the contact details shown publicly.', to: '/admin/contact-info', icon: Mail, tone: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300' },
];

const quickActions = [
  { title: 'Add Project', to: '/admin/projects', icon: Plus },
  { title: 'Add Skill', to: '/admin/skills', icon: Wrench },
  { title: 'Upload Certificate', to: '/admin/certificates', icon: Upload },
  { title: 'Review Messages', to: '/admin/messages', icon: MessageSquare },
];

const messageColumns = [
  { key: 'name', label: 'From' },
  { key: 'subject', label: 'Subject', render: (value) => value || 'No subject' },
  {
    key: 'createdAt',
    label: 'Received',
    render: (value) => (value ? new Date(value).toLocaleDateString() : '—'),
  },
  { key: 'read', label: 'Status', render: (value) => value ? 'Read' : 'Pending / unread' },
];

const projectColumns = [
  { key: 'title', label: 'Project' },
  { key: 'status', label: 'Status', render: (value) => value?.replace('_', ' ') || '—' },
  {
    key: 'createdAt',
    label: 'Added',
    render: (value) => (value ? new Date(value).toLocaleDateString() : '—'),
  },
];

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Loading dashboard" role="status">
      <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {statItems.map((item) => (
          <div key={item.key} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contentCards.map((item) => (
          <div key={item.title} className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
      <span className="sr-only">Loading dashboard content</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (signal) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/dashboard', { signal });
      if (signal?.aborted) return;
      setDashboard(response.data);
    } catch (requestError) {
      if (signal?.aborted) return;
      setError(getErrorMessage(requestError));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => loadDashboard(controller.signal), 0);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [loadDashboard]);

  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-medium text-primary">Portfolio overview</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <CalendarDays size={16} /> {today}
          </p>
        </div>
        <Link
          to="/admin/projects"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus size={17} /> New project
        </Link>
      </header>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
          <button
            type="button"
            onClick={loadDashboard}
            className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50 dark:bg-slate-900 dark:text-red-300 dark:ring-red-900"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6" aria-label="Portfolio statistics">
            {statItems.map((item) => (
              <div
                key={item.key}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-[1px] shadow-sm`}
              >
                <div className="h-full rounded-[15px] bg-white p-1 dark:bg-slate-900">
                  <StatCard
                    icon={item.icon}
                    label={item.label}
                    value={dashboard?.[item.key] ?? 0}
                    color={item.color}
                  />
                </div>
              </div>
            ))}
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Manage Content</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Quick access to your portfolio sections.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contentCards.map(({ title, description, to, icon: Icon, tone }) => (
                <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-4">
                    <span className={`rounded-xl p-3 ${tone}`}><Icon size={21} /></span>
                    <Link
                      to={to}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
                    >
                      Manage <ArrowRight size={15} />
                    </Link>
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              {quickActions.map(({ title, to, icon: Icon }) => (
                <Link
                  key={title}
                  to={to}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Icon size={17} /> {title}
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText size={19} className="text-primary" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Messages</h2>
              </div>
              <Link to="/admin/messages" className="text-sm font-semibold text-primary hover:text-primary-dark">Open inbox</Link>
            </div>
            <DataTable
              columns={messageColumns}
              data={dashboard?.recentMessages || []}
              emptyText="No recent messages."
            />
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <BriefcaseBusiness size={19} className="text-primary" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Projects</h2>
            </div>
            <DataTable
              columns={projectColumns}
              data={dashboard?.recentProjects || []}
              emptyText="No recent projects."
            />
          </section>
        </>
      )}
    </div>
  );
}
