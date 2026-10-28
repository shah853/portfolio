import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SectionTitle from '../common/SectionTitle';
import ProjectCard from '../projects/ProjectCard';
import useFetch from '../../hooks/useFetch';

export default function FeaturedProjects() {
  const shouldReduceMotion = useReducedMotion();
  const { data, loading, error, refetch } = useFetch('/projects');
  const projects = (Array.isArray(data) ? data : [])
    .filter((project) => project.featured || ['carepoint', 'navacart'].includes(project.title?.trim().toLocaleLowerCase()))
    .sort((first, second) => {
      const preferredOrder = ['carepoint', 'navacart'];
      const firstIndex = preferredOrder.indexOf(first.title?.trim().toLocaleLowerCase());
      const secondIndex = preferredOrder.indexOf(second.title?.trim().toLocaleLowerCase());
      if (firstIndex !== -1 || secondIndex !== -1) {
        return (firstIndex === -1 ? preferredOrder.length : firstIndex) -
          (secondIndex === -1 ? preferredOrder.length : secondIndex);
      }
      return 0;
    })
    .slice(0, 2);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
      >
        <SectionTitle
          title="Featured projects"
          subtitle="Selected work managed from the Admin dashboard."
        />
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p role="alert">{error}</p>
            <button type="button" onClick={refetch} className="mt-2 font-semibold underline">Try again</button>
          </div>
        ) : loading ? (
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">
            Loading featured projects…
          </p>
        ) : projects.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : index * 0.07, ease: 'easeOut' }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Add CarePoint and NavaCart in Admin → Projects to feature them here.
          </p>
        )}
        <div className="mt-8">
          <Link to="/projects" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View All Projects <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
