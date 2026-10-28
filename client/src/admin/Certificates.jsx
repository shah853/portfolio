import { useCallback, useEffect, useState } from 'react';
import { Award, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import Button from '../components/common/Button';
import Modal from '../components/admin/Modal';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

function dateValue(value) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function CertificateForm({ certificate, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState({
    title: certificate?.title || '',
    recipientName: certificate?.recipientName || '',
    issuer: certificate?.issuer || '',
    date: dateValue(certificate?.date),
    file: certificate?.file || '',
  });
  const [upload, setUpload] = useState(null);
  const [validationError, setValidationError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setValidationError('');
    if (!form.title.trim()) {
      setValidationError('Certificate title is required.');
      return;
    }
    if (
      upload &&
      !upload.type.startsWith('image/') &&
      upload.type !== 'application/pdf' &&
      !upload.name.toLocaleLowerCase().endsWith('.pdf')
    ) {
      setValidationError('Choose an image or PDF file.');
      return;
    }
    if (upload && upload.size > 50 * 1024 * 1024) {
      setValidationError('The file must be 50 MB or smaller.');
      return;
    }

    const payload = new FormData();
    payload.append('title', form.title.trim());
    payload.append('recipientName', form.recipientName.trim());
    payload.append('issuer', form.issuer.trim());
    payload.append('date', form.date);
    if (upload) payload.append('file', upload);
    else payload.append('file', form.file.trim());
    await onSubmit(payload);
  };

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <form onSubmit={submit} className="space-y-4">
      {(validationError || error) && (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
          {validationError || error}
        </p>
      )}
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Certificate title <span className="text-red-500">*</span>
        <input value={form.title} onChange={update('title')} className={inputClass} maxLength={160} required />
      </label>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Recipient name <span className="text-xs font-normal text-slate-600 dark:text-slate-300">(optional)</span>
        <input value={form.recipientName} onChange={update('recipientName')} className={inputClass} maxLength={120} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Issuer <span className="text-xs font-normal text-slate-600 dark:text-slate-300">(optional)</span>
          <input value={form.issuer} onChange={update('issuer')} className={inputClass} maxLength={160} />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Date <span className="text-xs font-normal text-slate-600 dark:text-slate-300">(optional)</span>
          <input type="date" value={form.date} onChange={update('date')} className={inputClass} />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Certificate image/PDF URL <span className="text-xs font-normal text-slate-600 dark:text-slate-300">(optional)</span>
        <input type="url" value={form.file} onChange={update('file')} className={inputClass} placeholder="https://..." />
      </label>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Or upload image/PDF
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(event) => setUpload(event.target.files?.[0] || null)}
          className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary`}
        />
        <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">
          Uploading a file replaces the URL above. Maximum size: 50 MB.
        </span>
      </label>
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button type="submit" loading={saving}>{saving ? 'Saving…' : 'Save certificate'}</Button>
      </div>
    </form>
  );
}

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formCertificate, setFormCertificate] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [failedFiles, setFailedFiles] = useState(() => new Set());

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/certificates');
      setCertificates(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(fetchCertificates, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchCertificates]);

  const openCreate = () => {
    setError('');
    setFormCertificate(null);
    setFormOpen(true);
  };

  const openEdit = (certificate) => {
    setError('');
    setFormCertificate(certificate);
    setFormOpen(true);
  };

  const saveCertificate = async (payload) => {
    setSaving(true);
    setError('');
    try {
      const response = formCertificate
        ? await api.put(`/certificates/${formCertificate._id}`, payload)
        : await api.post('/certificates', payload);
      setCertificates((current) =>
        formCertificate
          ? current.map((item) => item._id === response.data._id ? response.data : item)
          : [response.data, ...current]
      );
      setFormOpen(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const removeCertificate = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/certificates/${deleteTarget._id}`);
      setCertificates((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Portfolio content</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Certificates</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage certificates shown on your public portfolio. Issuer, date, and file can be added later.</p>
        </div>
        <Button onClick={openCreate}><Plus size={17} /> Add certificate</Button>
      </header>

      {error && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300" role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchCertificates} className="font-semibold underline">Try again</button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">Loading certificates…</div>
      ) : certificates.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
                {certificate.file && !failedFiles.has(certificate._id) ? (
                  <img
                    src={certificate.file}
                    alt={`${certificate.title} certificate`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={() => setFailedFiles((current) => new Set(current).add(certificate._id))}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Award size={38} strokeWidth={1.5} />
                    <span className="text-sm">No certificate file</span>
                  </div>
                )}
              </div>
              <div className="space-y-1 p-5">
                <h2 className="font-semibold text-slate-900 dark:text-white">{certificate.title}</h2>
                {certificate.recipientName && <p className="text-sm text-slate-600 dark:text-slate-300">{certificate.recipientName}</p>}
                {certificate.issuer && <p className="text-sm text-slate-600 dark:text-slate-300">{certificate.issuer}</p>}
                {certificate.date && <p className="text-xs text-slate-600 dark:text-slate-300">{new Date(certificate.date).toLocaleDateString()}</p>}
              </div>
              <div className="flex flex-wrap gap-2 border-t border-slate-200 p-4 dark:border-slate-800">
                {certificate.file && (
                  <a href={certificate.file} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    <ExternalLink size={15} /> View file
                  </a>
                )}
                <Button variant="secondary" onClick={() => openEdit(certificate)}><Pencil size={15} /> Edit</Button>
                <Button variant="danger" onClick={() => setDeleteTarget(certificate)} aria-label={`Delete ${certificate.title}`}><Trash2 size={15} /></Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <Award className="mx-auto text-slate-500 dark:text-slate-400" size={36} />
          <p className="mt-3 font-medium text-slate-900 dark:text-white">No certificates added</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add a title now and fill in the optional details or image whenever they are ready.</p>
        </div>
      )}

      <Modal open={formOpen} onClose={() => !saving && setFormOpen(false)} title={formCertificate ? 'Edit certificate' : 'Add certificate'}>
        <CertificateForm
          key={formCertificate?._id || 'new-certificate'}
          certificate={formCertificate}
          onSubmit={saveCertificate}
          onCancel={() => setFormOpen(false)}
          saving={saving}
          error={error}
        />
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete certificate?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={removeCertificate} loading={deleting}>Delete</Button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">This permanently removes {deleteTarget?.title || 'this certificate'} from your portfolio.</p>
      </Modal>
    </section>
  );
}