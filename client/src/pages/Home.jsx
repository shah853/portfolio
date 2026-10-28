import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AboutPreview from '../components/home/AboutPreview';
import FeaturedProjects from '../components/home/FeaturedProjects';
import Hero from '../components/home/Hero';
import SkillsPreview from '../components/home/SkillsPreview';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <Hero />
      <AboutPreview />
      <SkillsPreview />
      <FeaturedProjects />
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
          className="relative w-full overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 px-6 py-12 text-center text-white shadow-xl shadow-indigo-950/10 sm:px-10 sm:py-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-44 left-1/4 h-80 w-80 rounded-full border border-white/[0.08]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">Let&apos;s work together</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Have a project in mind?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
              Let&apos;s talk about how we can build something useful together.
            </p>
            <Link
              to="/contact"
              className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-700 motion-reduce:transform-none motion-reduce:transition-none"
            >
              Get in touch
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
