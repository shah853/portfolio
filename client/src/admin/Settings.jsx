import { useState } from 'react';
import { KeyRound, Moon, ShieldCheck, Sun } from 'lucide-react';
import Button from '../components/common/Button';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

export default function Settings() {
  const { dark, toggle } = useTheme();
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const updatePasswordField = (field) => (event) => {
    setPasswords((current) => ({ ...current, [field]: event.target.value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (passwords.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (passwords.currentPassword === passwords.newPassword) {
      setPasswordError('Choose a new password different from your current password.');
      return;
    }

    setSaving(true);
    try {
      const response = await api.patch('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess(response.data?.message || 'Password updated successfully.');
    } catch (requestError) {
      setPasswordError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const themeButtonClass = (selected) =>
    `inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      selected
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
    }`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-sm font-medium text-primary">Preferences</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Appearance and administrator account security.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <span className="rounded-xl bg-primary/10 p-3 text-primary">{dark ? <Moon size={21} /> : <Sun size={21} />}</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">Theme</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Choose the appearance used across the public portfolio and Admin panel on this device.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" aria-pressed={!dark} onClick={() => dark && toggle()} className={themeButtonClass(!dark)}>
                <Sun size={16} /> Light
              </button>
              <button type="button" aria-pressed={dark} onClick={() => !dark && toggle()} className={themeButtonClass(dark)}>
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4">
          <span className="rounded-xl bg-primary/10 p-3 text-primary"><KeyRound size={21} /></span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">Change password</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Verify your current password before setting a new one.</p>
            <form onSubmit={changePassword} className="mt-5 space-y-4">
              {passwordError && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">{passwordError}</p>}
              {passwordSuccess && <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" role="status">{passwordSuccess}</p>}
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Current password
                <input type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={updatePasswordField('currentPassword')} className={inputClass} required />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  New password
                  <input type="password" autoComplete="new-password" value={passwords.newPassword} onChange={updatePasswordField('newPassword')} className={inputClass} minLength={8} required />
                </label>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm new password
                  <input type="password" autoComplete="new-password" value={passwords.confirmPassword} onChange={updatePasswordField('confirmPassword')} className={inputClass} minLength={8} required />
                </label>
              </div>
              <Button type="submit" loading={saving}><ShieldCheck size={16} /> Update password</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
