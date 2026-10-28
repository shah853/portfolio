import { useState } from 'react';
import { ArrowRight, Download, MapPin, UserRound } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import siteConfig, { resumeFilename } from '../../config/siteConfig';
import useSiteSettings from '../../hooks/useSiteSettings';

export default function Hero() {
  const { settings } = useSiteSettings();
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const name = settings.fullName || siteConfig.name;
  const profileImage = settings.profileImage || siteConfig.profileImage;
  const intro = settings.shortIntro || siteConfig.heroIntro;
  const resumeUrl = settings.resumeUrl || siteConfig.resumeUrl;

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : delay, ease: 'easeOut' },
  });

  return (
    <section className="relative isolate overflow-hidden bg-[#fafaff] dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_15%,rgba(99,102,241,0.10),transparent_42%)] dark:bg-[radial-gradient(ellipse_at_15%_15%,rgba(99,102,241,0.16),transparent_42%)]" />
      <div className="mx-auto grid min-h-[min(780px,calc(100svh-4rem))] w-full max-w-6xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[1.1fr_0.9fr] md:gap-10 lg:px-8 lg:py-24">
        <div className="order-2 max-w-2xl text-center md:order-1 md:text-left">
          <motion.div {...reveal(0)} className="flex justify-center md:justify-start">
            <span className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-3.5 py-2 text-center text-[0.7rem] font-semibold tracking-wide text-indigo-700 shadow-sm shadow-indigo-950/[0.03] sm:text-xs dark:border-indigo-400/20 dark:bg-slate-900/80 dark:text-indigo-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              BS CS Student · {settings.role || 'Full Stack Developer'}
            </span>
          </motion.div>

          <motion.h1
            {...reveal(0.08)}
            className="mt-7 text-[2.7rem] font-semibold leading-[1.06] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.5rem] dark:text-white"
          >
            Hi, I&apos;m
            <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-primary to-violet-600 bg-clip-text pb-1 text-transparent dark:from-indigo-300 dark:via-indigo-400 dark:to-violet-400">
              {name}
            </span>
          </motion.h1>

          <motion.p
            {...reveal(0.16)}
            className="mx-auto mt-6 line-clamp-2 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 md:mx-0 dark:text-slate-300"
          >
            {intro}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: shouldReduceMotion ? 0 : 0.24,
                  staggerChildren: shouldReduceMotion ? 0 : 0.07,
                },
              },
            }}
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}>
            <Link
              to="/projects"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-xl hover:shadow-indigo-600/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none dark:focus-visible:ring-offset-slate-950"
            >
              View Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-indigo-400/40 dark:hover:bg-slate-900 dark:focus-visible:ring-offset-slate-950"
            >
              Contact Me
            </Link>
            </motion.div>
            {resumeUrl && (
              <motion.div variants={{ hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}>
                <a
                  href={resumeUrl}
                  download={resumeFilename}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transform-none motion-reduce:transition-none dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              </motion.div>
            )}
          </motion.div>

          <motion.p
            {...reveal(0.32)}
            className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-600 md:justify-start dark:text-slate-300"
          >
            <MapPin size={15} className="text-indigo-500" />
            {settings.location || siteConfig.location}
          </motion.p>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : 0.12, ease: 'easeOut' }}
          className="order-1 mx-auto w-full max-w-[23rem] md:order-2 md:max-w-[26rem]"
        >
          <motion.div
            animate={shouldReduceMotion ? { y: 0 } : { y: [0, -2, 0] }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.015 }}
            transition={shouldReduceMotion ? { duration: 0 } : { y: { duration: 6, repeat: Infinity, ease: 'easeInOut' }, scale: { duration: 0.3, ease: 'easeOut' } }}
            className="relative"
          >
            <div className="aspect-[4/4.65] overflow-hidden rounded-[1.65rem]">
              {profileImage && !imageFailed ? (
                <img
                  src={profileImage}
                  alt={`${name} profile`}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center rounded-[1.65rem] bg-gradient-to-br from-indigo-100 to-violet-200 text-primary dark:from-slate-800 dark:to-indigo-950"
                  aria-label={`${name} profile image placeholder`}
                >
                  {profileImage ? (
                    <span className="text-8xl font-semibold tracking-tight">{name.trim().charAt(0).toUpperCase()}</span>
                  ) : (
                    <UserRound size={88} strokeWidth={1.15} />
                  )}
                </div>
              )}
            </div>
            <div className="mt-5 text-center">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
