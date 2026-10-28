import { ArrowDownToLine, MapPin, Sparkles } from 'lucide-react';
import siteConfig, { resumeFilename } from '../config/siteConfig';
import useSiteSettings from '../hooks/useSiteSettings';
import SectionTitle from '../components/common/SectionTitle';

export default function About() {
  const { settings } = useSiteSettings();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionTitle
        title={`About ${settings.fullName || siteConfig.name}`}
        subtitle={`BS Computer Science Student · ${settings.role || siteConfig.role} · Interested in AI`}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} /> {settings.location || siteConfig.location}
          </span>
          <span aria-hidden="true">•</span>
          <span className="inline-flex items-center gap-2">
            <Sparkles size={16} /> {siteConfig.role}
          </span>
        </div>
        {(settings.profileImage || siteConfig.profileImage) && (
          <img
            src={settings.profileImage || siteConfig.profileImage}
            alt={`${settings.fullName || siteConfig.name} profile`}
            className="mb-6 h-32 w-32 rounded-2xl object-cover"
          />
        )}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              My Introduction
            </h2>
            <div className="mt-3 space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
              {settings.about.map((paragraph, index) => (
                <p key={`${index}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>
        {(settings.resumeUrl || siteConfig.resumeUrl) && (
          <a
            href={settings.resumeUrl || siteConfig.resumeUrl}
            download={resumeFilename}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowDownToLine size={17} /> Download resume
          </a>
        )}
      </div>
    </div>
  );
}
