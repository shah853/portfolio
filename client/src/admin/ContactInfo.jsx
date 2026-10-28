import { useEffect, useState } from 'react';
import { ExternalLink, FileText, Info, Link2, Mail, MapPin, Phone } from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import useSiteSettings from '../hooks/useSiteSettings';
import { resumeFilename } from '../config/siteConfig';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const fields = [
  { key: 'email', label: 'Email', type: 'email', icon: Mail },
  { key: 'phone', label: 'Phone', type: 'tel', icon: Phone },
  { key: 'location', label: 'Location', type: 'text', icon: MapPin },
  { key: 'github', label: 'GitHub', type: 'url', icon: Link2 },
  { key: 'linkedin', label: 'LinkedIn', type: 'url', icon: Link2 },
];

export default function ContactInfo() {
  const { settings, loading } = useSiteSettings();
  if (loading) return <Loader />;
  return <ContactInfoForm settings={settings} />;
}

function ContactInfoForm({ settings }) {
  const [contact, setContact] = useState({
    email: settings.email,
    phone: settings.phone,
    location: settings.location,
    github: settings.github,
    linkedin: settings.linkedin,
    resumeUrl: settings.resumeUrl,
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    if (!banner) return undefined;
    const timeout = window.setTimeout(() => setBanner(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [banner]);

  const updateField = (field, value) => {
    setContact((current) => ({ ...current, [field]: value }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > 10 * 1024 * 1024) {
      setBanner({ type: 'error', message: 'Resume PDF must be 10MB or smaller.' });
      event.target.value = '';
      setResumeFile(null);
      return;
    }
    setBanner(null);
    setResumeFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(contact).forEach(([field, value]) => formData.append(field, value));
    if (resumeFile) formData.append('resume', resumeFile);

    setSaving(true);
    try {
      const response = await api.put('/settings', formData);
      setContact((current) => ({ ...current, resumeUrl: response.data.resumeUrl || current.resumeUrl }));
      setResumeFile(null);
      setBanner({ type: 'success', message: 'Contact information saved successfully.' });
    } catch (error) {
      setBanner({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {banner && (
        <div
          role={banner.type === 'error' ? 'alert' : 'status'}
          className={`fixed right-4 top-20 z-[70] max-w-[calc(100vw-2rem)] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg sm:right-6 ${
            banner.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {banner.message}
        </div>
      )}

      <header>
        <p className="text-sm font-medium text-primary">Website content</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Contact Info</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Update the contact details displayed on your public website.
        </p>
      </header>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        <Info size={19} className="mt-0.5 shrink-0" />
        <p className="text-sm">Contact updates are shown on your public portfolio.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ key, label, type, icon: Icon }) => (
            <label key={key} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Icon size={15} className="text-slate-400" />
                {label}
              </span>
              <input
                type={type}
                value={contact[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className={inputClass}
              />
            </label>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            <span className="inline-flex items-center gap-2">
              <FileText size={15} className="text-slate-400" />
              Resume PDF
            </span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
              className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
            />
          </label>
          {resumeFile && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Selected: {resumeFile.name}
            </p>
          )}
          {contact.resumeUrl && (
            <a
              href={contact.resumeUrl}
              download={resumeFilename}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              View current resume <ExternalLink size={15} />
            </a>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
