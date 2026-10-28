import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Database, Server, Sparkles, Wrench } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import useFetch from '../hooks/useFetch';

const categories = {
  frontend: { label: 'Frontend', Icon: Code2 },
  backend: { label: 'Backend', Icon: Server },
  database: { label: 'Database', Icon: Database },
  devops: { label: 'DevOps', Icon: Wrench },
  tools: { label: 'Tools', Icon: Wrench },
  video_editing_ai: { label: 'Video Editing / AI', Icon: Sparkles },
  other: { label: 'Other', Icon: Code2 },
};

export default function Skills() {
  const shouldReduceMotion = useReducedMotion();
  const { data, loading, error, refetch } = useFetch('/skills');
  const groupedSkills = useMemo(() => {
    const seen = new Set();
    const groups = new Map();
    for (const skill of Array.isArray(data) ? data : []) {
      const key = String(skill?.name || '').trim().toLocaleLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const category = categories[skill.category] ? skill.category : 'other';
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(skill);
    }
    return Array.from(groups, ([category, skills]) => ({ category, skills }));
  }, [data]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionTitle title="Skills" subtitle="A growing toolkit of technologies and areas I work with." />
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
          <button type="button" onClick={refetch} className="mt-3 text-sm font-semibold text-primary underline">Try again</button>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">Loading skills…</div>
      ) : groupedSkills.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {groupedSkills.map(({ category, skills }, index) => {
            const { label, Icon } = categories[category];
            return (
              <motion.section
                key={category}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30 sm:p-6"
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <Icon size={19} className="text-primary" aria-hidden="true" /> {label}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill._id || skill.name} className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <p className="font-medium text-slate-900 dark:text-white">No skills are published yet.</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Skills added in the Admin panel will appear here.</p>
        </div>
      )}
    </div>
  );
}
