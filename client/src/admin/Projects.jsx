import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import Button from '../components/common/Button';
import DataTable from '../components/admin/DataTable';
import Loader from '../components/common/Loader';
import Modal from '../components/admin/Modal';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const emptyForm = {
  title: '',
  description: '',
  stack: '',
  github: '',
  live: '',
  status: 'completed',
  featured: false,
};

const statusStyles = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  planned: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

function ProjectImage({ src, title }) {
  return src ? (
    <img src={src} alt={`${title} thumbnail`} className="h-11 w-14 rounded-lg object-cover" />
  ) : (
    <span
      className="flex h-11 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
      aria-label="No project image"
    >
      <ImageIcon size={20} />
    </span>
  );
}

function ProjectForm({ project, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    title: project?.title || '',
    description: project?.description || '',
    stack: Array.isArray(project?.stack) ? project.stack.join(', ') : '',
    github: project?.links?.github || '',
    live: project?.links?.live || '',
    status: project?.status || 'completed',
    featured: Boolean(project?.featured),
  }));
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(project?.image || '');
  const imagePreviewUrl = useRef('');
  const [validationError, setValidationError] = useState('');

  useEffect(
    () => () => {
      if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    },
    []
  );

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (imagePreviewUrl.current) URL.revokeObjectURL(imagePreviewUrl.current);
    imagePreviewUrl.current = file ? URL.createObjectURL(file) : '';
    setImagePreview(imagePreviewUrl.current || project?.image || '');
    setImageFile(file);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > 50 * 1024 * 1024) {
      setValidationError('Video file must be 50MB or smaller.');
      event.target.value = '';
      setVideoFile(null);
      return;
    }
    setValidationError('');
    setVideoFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    const stack = form.stack.split(',').map((item) => item.trim()).filter(Boolean);
    if (!form.title.trim()) {
      setValidationError('Title is required.');
      return;
    }
    if (!form.description.trim()) {
      setValidationError('Description is required.');
      return;
    }
    if (!stack.length) {
      setValidationError('Add at least one technology to the stack.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title.trim());
    formData.append('description', form.description.trim());
    formData.append('stack', JSON.stringify(stack));
    formData.append('github', form.github.trim());
    formData.append('live', form.live.trim());
    formData.append('status', form.status);
    formData.append('featured', String(form.featured));
    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    await onSubmit(formData);
  };

  const displayedError = validationError || error;
  const inputClass =
    'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {displayedError && (
        <p
          className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          role="alert"
        >
          {displayedError}
        </p>
      )}

      <label className={labelClass}>
        Title <span className="text-red-500">*</span>
        <input
          value={form.title}
          onChange={(event) => setField('title', event.target.value)}
          className={inputClass}
          required
          maxLength={160}
        />
      </label>

      <label className={labelClass}>
        Description <span className="text-red-500">*</span>
        <textarea
          value={form.description}
          onChange={(event) => setField('description', event.target.value)}
          className={`${inputClass} min-h-28 resize-y`}
          required
          rows={4}
        />
      </label>

      <label className={labelClass}>
        Tech stack <span className="text-red-500">*</span>
        <input
          value={form.stack}
          onChange={(event) => setField('stack', event.target.value)}
          className={inputClass}
          placeholder="React, Node.js, MongoDB"
          required
        />
        <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
          Separate technologies with commas.
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          GitHub URL
          <input
            type="url"
            value={form.github}
            onChange={(event) => setField('github', event.target.value)}
            className={inputClass}
            placeholder="https://github.com/..."
          />
        </label>
        <label className={labelClass}>
          Live URL
          <input
            type="url"
            value={form.live}
            onChange={(event) => setField('live', event.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </label>
      </div>

      <label className={labelClass}>
        Status
        <select
          value={form.status}
          onChange={(event) => setField('status', event.target.value)}
          className={inputClass}
        >
          <option value="completed">Completed</option>
          <option value="in_progress">In progress</option>
          <option value="planned">Planned</option>
        </select>
      </label>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(event) => setField('featured', event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
        Feature this project
      </label>

      <div className="space-y-2">
        <label className={labelClass}>
          Project image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
          />
        </label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Project image preview"
            className="h-36 w-full rounded-lg object-cover sm:w-56"
          />
        )}
      </div>

      <label className={labelClass}>
        Project video (optional, max 50MB)
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary`}
        />
        {videoFile && (
          <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
            Selected: {videoFile.name}
          </span>
        )}
      </label>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {saving ? 'Saving...' : 'Save project'}
        </Button>
      </div>
    </form>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formProject, setFormProject] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteProject, setDeleteProject] = useState(null);
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

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await api.get('/projects');
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setFetchError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(fetchProjects, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchProjects]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesSearch = project.title?.toLowerCase().includes(search.trim().toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [projects, search, statusFilter]
  );

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setFormProject(null);
    setFormError('');
  };

  const openCreateForm = () => {
    setFormProject(null);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (project) => {
    setFormProject(project);
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setFormError('');
    try {
      if (formProject) {
        await api.put(`/projects/${formProject._id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      setFormOpen(false);
      setFormProject(null);
      showBanner('success', formProject ? 'Project updated successfully.' : 'Project created successfully.');
      await fetchProjects();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteProject._id}`);
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project._id !== deleteProject._id)
      );
      showBanner('success', 'Project deleted successfully.');
      setDeleteProject(null);
    } catch (error) {
      showBanner('error', getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (image, project) => <ProjectImage src={image} title={project.title} />,
    },
    {
      key: 'title',
      label: 'Title',
      render: (title) => <span className="font-semibold">{title}</span>,
    },
    {
      key: 'stack',
      label: 'Stack',
      render: (stack) => {
        const technologies = Array.isArray(stack) ? stack : [];
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {technologies.slice(0, 3).map((technology, index) => (
              <span
                key={`${technology}-${index}`}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {technology}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (status) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
            statusStyles[status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {status?.replace('_', ' ') || 'Unknown'}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (featured) => (
        <span className={featured ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}>
          <Star size={18} fill={featured ? 'currentColor' : 'none'} aria-label={featured ? 'Featured' : 'Not featured'} />
        </span>
      ),
    },
  ];

  return (
    <section className="space-y-6">
      {banner && (
        <div
          role="status"
          className={`fixed right-4 top-20 z-[70] max-w-[calc(100vw-2rem)] rounded-xl px-4 py-3 text-sm font-medium shadow-lg sm:right-6 ${
            banner.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Create and manage your portfolio projects.
          </p>
        </div>
        <Button onClick={openCreateForm} className="w-full sm:w-auto">
          <Plus size={18} />
          Add Project
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
            placeholder="Search projects by title..."
            aria-label="Search projects by title"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter projects by status"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In progress</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : fetchError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">{fetchError}</p>
          <Button variant="secondary" onClick={fetchProjects} className="mt-4">
            Retry
          </Button>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredProjects}
          emptyText={search || statusFilter !== 'all' ? 'No projects match these filters.' : 'No projects yet. Add your first project.'}
          actions={(project) => (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => openEditForm(project)}
                className="px-3 py-2"
                aria-label={`Edit ${project.title}`}
              >
                <Pencil size={16} />
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button
                variant="danger"
                onClick={() => setDeleteProject(project)}
                className="px-3 py-2"
                aria-label={`Delete ${project.title}`}
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
        title={formProject ? 'Edit project' : 'Add project'}
      >
        <ProjectForm
          key={formProject?._id || 'new-project'}
          project={formProject}
          onSubmit={handleSave}
          onCancel={closeForm}
          saving={saving}
          error={formError}
        />
      </Modal>

      <Modal
        open={Boolean(deleteProject)}
        onClose={() => {
          if (!deleting) setDeleteProject(null);
        }}
        title="Delete project"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Delete <span className="font-semibold text-slate-900 dark:text-white">{deleteProject?.title}</span>?
          This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => setDeleteProject(null)}
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
