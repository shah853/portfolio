import { Link } from 'react-router-dom';
import ProjectCard from '../components/projects/ProjectCard';
import SectionTitle from '../components/common/SectionTitle';
import useFetch from '../hooks/useFetch';

export default function Projects() {
  const { data, loading, error, refetch } = useFetch('/projects');
  const projects = Array.isArray(data) ? data : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionTitle title="Projects" subtitle="Selected projects." />
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
          <button type="button" onClick={refetch} className="mt-3 text-sm font-semibold text-primary underline">Try again</button>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">Loading projects…</div>
      ) : projects.length ? (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-medium text-slate-900 dark:text-white">No projects are published yet.</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Projects added in the Admin panel will appear here.</p>
        </div>
      )}
      <Link to="/contact" className="mt-8 inline-flex font-semibold text-primary hover:text-primary-dark">
        Interested in working together? Get in touch <span aria-hidden="true" className="ml-1">→</span>
      </Link>
    </div>
  );
}
