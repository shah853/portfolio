import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Database, Server, Sparkles, Wrench } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import SectionTitle from '../common/SectionTitle';
import Loader from '../common/Loader';

const categoryIcons = {
  frontend: { label: 'Frontend', Icon: Code2 },
  backend: { label: 'Backend', Icon: Server },
  database: { label: 'Database', Icon: Database },
  devops: { label: 'DevOps', Icon: Wrench },
  tools: { label: 'Tools', Icon: Wrench },
  video_editing_ai: { label: 'Video Editing / AI', Icon: Sparkles },
  other: { label: 'Other', Icon: Code2 },
};

function getSkillGroups(skills) {
  const uniqueSkills = [];
  const seenNames = new Set();

  for (const skill of skills) {
    const name = typeof skill?.name === 'string' ? skill.name.trim() : '';
    const normalizedName = name.toLocaleLowerCase();
    if (!name || seenNames.has(normalizedName)) continue;
    seenNames.add(normalizedName);
    uniqueSkills.push({ ...skill, name });
  }

  const grouped = new Map();
  for (const skill of uniqueSkills) {
    const categoryKey = String(skill.category || 'other').toLocaleLowerCase();
    const category = categoryIcons[categoryKey] || {
      label: categoryKey.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase()),
      Icon: Code2,
    };
    const items = grouped.get(category.label) || [];
    items.push(skill);
    grouped.set(category.label, items);
  }

  const regularGroups = [];
  const otherSkills = [];
  for (const [label, items] of grouped) {
    if (label === 'Other' || items.length < 2) {
      otherSkills.push(...items);
    } else {
      const Icon = categoryIcons[String(items[0].category || '').toLocaleLowerCase()]?.Icon || Code2;
      regularGroups.push({ label, items, Icon });
    }
  }

  const visibleGroups = regularGroups.slice(0, 3);
  for (const group of regularGroups.slice(3)) {
    otherSkills.push(...group.items);
  }
  if (otherSkills.length) {
    visibleGroups.push({ label: 'Other', items: otherSkills, Icon: Code2 });
  }

  return visibleGroups.slice(0, 4);
}

export default function SkillsPreview() {
  const shouldReduceMotion = useReducedMotion();
  const { data, loading, error, refetch } = useFetch('/skills');
  const skills = Array.isArray(data) ? data : [];
  const groups = getSkillGroups(skills);

  return (
    <section className="border-y border-slate-200/70 bg-slate-50/80 py-20 dark:border-slate-800/70 dark:bg-slate-900/35 sm:py-24">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
        className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <SectionTitle title="Skills & tools" subtitle="Technologies I use to bring ideas to life." />
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            <p role="alert">{error}</p>
            <button type="button" onClick={refetch} className="mt-2 font-semibold underline">Try again</button>
          </div>
        ) : groups.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {groups.map((category, categoryIndex) => {
              const Icon = category.Icon;
              const visibleSkills = category.items.slice(0, 6);
              const remainingCount = category.items.length - visibleSkills.length;

              return (
                <motion.div
                  key={category.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.42, delay: shouldReduceMotion ? 0 : categoryIndex * 0.06, ease: 'easeOut' }}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-950/[0.02] transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30"
                >
                  <h3 className="flex items-center gap-2 font-semibold tracking-tight text-slate-900 dark:text-white">
                    <Icon size={17} className="shrink-0 text-primary" aria-hidden="true" />
                    {category.label === 'Other' ? 'Skills' : category.label}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {visibleSkills.map((skill) => (
                      <span
                        key={skill.name.toLocaleLowerCase()}
                        title={skill.name}
                        className="max-w-36 truncate rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50/70 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-400/[0.06] dark:hover:text-indigo-200"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {remainingCount > 0 && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        +{remainingCount} more
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Skills will appear here when added.
          </p>
        )}
        <div className="mt-7">
          <Link to="/skills" className="text-sm font-semibold text-primary hover:text-primary-dark">
            View All Skills <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
