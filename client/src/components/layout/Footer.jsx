import { BriefcaseBusiness, Code2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';
import useSiteSettings from '../../hooks/useSiteSettings';

const quickLinks = [
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Certificates', to: '/certificates' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const name = settings.fullName || siteConfig.name;
  const role = settings.role || siteConfig.role;
  const email = settings.email || siteConfig.email;
  const github = settings.github || siteConfig.github;
  const linkedin = settings.linkedin || siteConfig.linkedin;
  const hasContactLinks = Boolean(email || github || linkedin);

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className={`mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 ${hasContactLinks ? 'md:grid-cols-3' : 'md:grid-cols-2'} lg:px-8`}>
        <div>
          <Link to="/" className="text-lg font-bold text-slate-900 dark:text-white">
            {name}
          </Link>
          <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-300">{role}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Quick links</h2>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-slate-600 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-slate-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {hasContactLinks && (
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Connect</h2>
            <div className="mt-3 flex gap-3">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                >
                  <Code2 size={18} />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                >
                  <BriefcaseBusiness size={18} />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label="Send email"
                  className="rounded-lg border border-slate-200 p-2.5 text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                >
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-slate-600 sm:px-6 lg:px-8 dark:text-slate-300">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
