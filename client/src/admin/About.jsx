import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Info } from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import useSiteSettings from '../hooks/useSiteSettings';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

export default function About() {
  const { settings, loading } = useSiteSettings();
  if (loading) return <Loader />;
  return <AboutForm settings={settings} />;
}

function AboutForm({ settings }) {
  const [form, setForm] = useState({
    fullName: settings.fullName,
    role: settings.role,
    shortIntro: settings.shortIntro,
    aboutDescription: settings.aboutDescription,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(settings.profileImage);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState(null);
  const imageUrl = useRef('');

  useEffect(() => {
    if (!banner) return undefined;
    const timeout = window.setTimeout(() => setBanner(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [banner]);

  useEffect(
    () => () => {
      if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);
    },
    []
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);
    imageUrl.current = file ? URL.createObjectURL(file) : '';
    setImageFile(file);
    setImagePreview(imageUrl.current || settings.profileImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([field, value]) => formData.append(field, value));
    if (imageFile) formData.append('profileImage', imageFile);

    setSaving(true);
    try {
      const response = await api.put('/settings', formData);
      setForm({
        fullName: response.data.fullName || settings.fullName,
        role: response.data.role || settings.role,
        shortIntro: response.data.shortIntro || settings.shortIntro,
        aboutDescription: response.data.aboutDescription || settings.aboutDescription,
      });
      setImageFile(null);
      setImagePreview(response.data.profileImage || settings.profileImage);
      setBanner({ type: 'success', message: 'About information saved successfully.' });
    } catch (error) {
      setBanner({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

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
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">About</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Update your public profile and introduction.
        </p>
      </header>

      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        <Info size={19} className="mt-0.5 shrink-0" />
        <p className="text-sm">Profile updates are shown on your public portfolio.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-900"
      >
        <label className={labelClass}>
          Full Name
          <input
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </label>
        <label className={labelClass}>
          Role / Title
          <input
            value={form.role}
            onChange={(event) => updateField('role', event.target.value)}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Short Intro
          <textarea
            rows={2}
            value={form.shortIntro}
            onChange={(event) => updateField('shortIntro', event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </label>
        <label className={labelClass}>
          About Description
          <textarea
            rows={7}
            value={form.aboutDescription}
            onChange={(event) => updateField('aboutDescription', event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </label>
        <div>
          <span className={labelClass}>Profile Image</span>
          <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-primary dark:border-slate-700 dark:bg-slate-950">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <ImagePlus size={25} className="text-slate-400" />
            )}
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {imageFile ? imageFile.name : 'Choose a profile image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>
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
