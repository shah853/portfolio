import { useState } from 'react';
import { BriefcaseBusiness, Code2, Mail, MapPin, Send } from 'lucide-react';
import Button from '../components/common/Button';
import SectionTitle from '../components/common/SectionTitle';
import siteConfig from '../config/siteConfig';
import useSiteSettings from '../hooks/useSiteSettings';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { settings } = useSiteSettings();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please complete your name, email, and message.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/messages', {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website || '',
      });
      setForm(initialForm);
      setSuccess('Thanks for reaching out. Your message has been sent.');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
  const email = settings.email || siteConfig.email;
  const location = settings.location || siteConfig.location;
  const github = settings.github || siteConfig.github;
  const linkedin = settings.linkedin || siteConfig.linkedin;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionTitle title="Let’s connect" subtitle="Have a question, opportunity, or idea? Send me a message." />
      <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900"
        >
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">
              {success}
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name <span className="text-red-500">*</span>
              <input
                required
                autoComplete="name"
                maxLength={120}
                value={form.name}
                onChange={(event) => setField('name', event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email <span className="text-red-500">*</span>
              <input
                required
                type="email"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                onChange={(event) => setField('email', event.target.value)}
                className={inputClass}
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Subject
            <input
              maxLength={200}
              value={form.subject}
              onChange={(event) => setField('subject', event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Message <span className="text-red-500">*</span>
            <textarea
              required
              rows={6}
              maxLength={5000}
              value={form.message}
              onChange={(event) => setField('message', event.target.value)}
              className={`${inputClass} resize-y`}
            />
          </label>
          <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website || ''}
              onChange={(event) => setField('website', event.target.value)}
            />
          </div>
          <Button type="submit" loading={loading} disabled={loading}>
            <Send size={16} />
            {loading ? 'Sending...' : 'Send message'}
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contact details</h2>
            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-5 flex items-center gap-3 text-sm text-slate-600 hover:text-primary dark:text-slate-300"
              >
                <Mail size={18} className="text-primary" /> {email}
              </a>
            )}
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="mt-4 flex items-center gap-3 text-sm text-slate-600 hover:text-primary dark:text-slate-300"
              >
                <span className="text-primary">☎</span> {settings.phone}
              </a>
            )}
            <p className="mt-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <MapPin size={18} className="text-primary" /> {location}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Find me online</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                >
                  <Code2 size={17} /> GitHub
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
                >
                  <BriefcaseBusiness size={17} /> LinkedIn
                </a>
              )}
            </div>
            {!github && !linkedin && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Online profile links will appear here when added.</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
