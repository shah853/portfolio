import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import DataTable from '../components/admin/DataTable';
import Loader from '../components/common/Loader';
import Modal from '../components/admin/Modal';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const categories = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'devops', label: 'DevOps' },
  { value: 'tools', label: 'Tools' },
  { value: 'video_editing_ai', label: 'Video Editing / AI' },
  { value: 'other', label: 'Other' },
];

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const categoryStyles = {
  frontend: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  backend: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  database: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  devops: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  tools: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  video_editing_ai: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300',
  other: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
};

const levelStyles = {
  beginner: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  advanced: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  expert: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
};

const emptyForm = { name: '', category: 'frontend', level: 'beginner' };

function SkillForm({ skill, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(() => ({
    name: skill?.name || '',
    category: skill?.category || emptyForm.category,
    level: skill?.level || emptyForm.level,
  }));
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');
    if (!form.name.trim()) {
      setValidationError('Skill name is required.');
      return;
    }
    if (!form.category || !form.level) {
      setValidationError('Please select a category and level.');
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      category: form.category,
      level: form.level,
    });
  };

  const inputClass =
    'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(validationError || error) && (
        <p
          className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {validationError || error}
        </p>
      )}

      <label className={labelClass}>
        Skill name <span className="text-red-500">*</span>
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className={inputClass}
          placeholder="e.g. React"
          required
          maxLength={100}
        />
      </label>

      <label className={labelClass}>
        Category <span className="text-red-500">*</span>
        <select
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({ ...current, category: event.target.value }))
          }
          className={inputClass}
          required
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Level <span className="text-red-500">*</span>
        <select
          value={form.level}
          onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))}
          className={inputClass}
          required
        >
          {levels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {saving ? 'Saving...' : 'Save skill'}
        </Button>
      </div>
    </form>
  );
}

function LevelIndicator({ level }) {
  const levelIndex = levels.findIndex((item) => item.value === level);
  const segments = levelIndex + 1;
  const styles = levelStyles[level] || levelStyles.beginner;
  const label = levels[levelIndex]?.label || 'Unknown';

  return (
    <div className="flex flex-col gap-1.5">
      <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
        {label}
      </span>
      <span className="flex w-16 gap-1" aria-label={`${label} skill level`}>
        {levels.map((item, index) => (
          <span
            key={item.value}
            className={`h-1.5 flex-1 rounded-full ${
              index < segments
                ? 'bg-primary'
                : 'bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </span>
    </div>
  );
}

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formSkill, setFormSkill] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteSkill, setDeleteSkill] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null);

  const showBanner = useCallback((type, message) => {
    setBanner({ type, message });
  }, []);

  useEffect(() => {
    if (!banner) return undefined;
    const timeout = window.setTimeout(() => setBanner(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [banner]);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await api.get('/skills');
      setSkills(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFetchError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(fetchSkills, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchSkills]);

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) => {
        const matchesSearch = skill.name?.toLowerCase().includes(search.trim().toLowerCase());
        const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [skills, search, categoryFilter]
  );

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setFormSkill(null);
    setFormError('');
  };

  const openCreateForm = () => {
    setFormSkill(null);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (skill) => {
    setFormSkill(skill);
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setFormError('');
    try {
      if (formSkill) {
        await api.put(`/skills/${formSkill._id}`, payload);
      } else {
        await api.post('/skills', payload);
      }
      setFormOpen(false);
      setFormSkill(null);
      showBanner('success', formSkill ? 'Skill updated successfully.' : 'Skill created successfully.');
      await fetchSkills();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteSkill) return;
    setDeleting(true);
    try {
      await api.delete(`/skills/${deleteSkill._id}`);
      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill._id !== deleteSkill._id)
      );
      showBanner('success', 'Skill deleted successfully.');
      setDeleteSkill(null);
    } catch (error) {
      showBanner('error', getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (name) => <span className="font-semibold">{name}</span>,
    },
    {
      key: 'category',
      label: 'Category',
      render: (category) => {
        const categoryInfo = categories.find((item) => item.value === category);
        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              categoryStyles[category] ||
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {categoryInfo?.label || category}
          </span>
        );
      },
    },
    {
      key: 'level',
      label: 'Level',
      render: (level) => <LevelIndicator level={level} />,
    },
  ];

  return (
    <section className="space-y-6">
      {banner && (
        <div
          role="status"
          className={`fixed right-4 top-20 z-[70] max-w-[calc(100vw-2rem)] rounded-xl px-4 py-3 text-sm font-medium shadow-lg sm:right-6 ${
            banner.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Skills</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage your skills.
          </p>
        </div>
        <Button onClick={openCreateForm} className="w-full sm:w-auto">
          <Plus size={18} />
          Add Skill
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search skills by name..."
            aria-label="Search skills by name"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Filter skills by category"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : fetchError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">
            {fetchError}
          </p>
          <Button variant="secondary" onClick={fetchSkills} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSkills}
          emptyText={
            search || categoryFilter !== 'all'
              ? 'No skills match these filters.'
              : 'No skills yet. Add your first skill.'
          }
          actions={(skill) => (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => openEditForm(skill)}
                className="px-3 py-2"
                aria-label={`Edit ${skill.name}`}
              >
                <Pencil size={16} />
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteSkill(skill)}
                className="px-3 py-2"
                aria-label={`Delete ${skill.name}`}
              >
                <Trash2 size={16} />
                <span className="sm:hidden">Delete</span>
              </Button>
            </div>
          )}
        />
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={formSkill ? 'Edit skill' : 'Add skill'}
      >
        <SkillForm
          key={formSkill?._id || 'new-skill'}
          skill={formSkill}
          onSubmit={handleSave}
          onCancel={closeForm}
          saving={saving}
          error={formError}
        />
      </Modal>

      <Modal
        open={Boolean(deleteSkill)}
        onClose={() => {
          if (!deleting) setDeleteSkill(null);
        }}
        title="Delete skill"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete{' '}
          <span className="font-semibold text-slate-900 dark:text-white">
            {deleteSkill?.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteSkill(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </section>
  );
}
