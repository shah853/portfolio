import { ArrowRight, Code2, GraduationCap, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useSiteSettings from '../../hooks/useSiteSettings';
import SectionTitle from '../common/SectionTitle';

const highlights = [
  { label: 'BS CS Student', Icon: GraduationCap },
  { label: 'Web Developer', Icon: Code2 },
  { label: 'AI', Icon: Sparkles },
];

export default function AboutPreview() {
  const shouldReduceMotion = useReducedMotion();
  const { settings } = useSiteSettings();
  const summary = settings.shortIntro;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
      >
        <SectionTitle title="A little about me" />
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_60px_-42px_rgba(15,23,42,0.25)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-42px_rgba(79,70,229,0.25)] motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_0.8fr] md:gap-10 lg:p-10">
            <div className="flex flex-col items-start">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
                <Sparkles size={14} />
                Building for the web
              </div>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                {summary}
              </p>
              <Link
                to="/about"
                className="group mt-6 inline-flex items-center gap-2 rounded-lg py-1 text-sm font-semibold text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 dark:focus-visible:ring-offset-slate-900"
              >
                Read more
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
              {highlights.map(({ label, Icon }, index) => (
                <motion.article
                  key={label}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : index * 0.07, ease: 'easeOut' }}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700/80 dark:bg-slate-950/60 dark:hover:border-indigo-400/30 dark:hover:bg-indigo-400/[0.04]"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <Icon size={16} className="text-primary" aria-hidden="true" />
                    {label}
                  </span>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
