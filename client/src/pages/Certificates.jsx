import { useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import SectionTitle from '../components/common/SectionTitle';
import useFetch from '../hooks/useFetch';

export default function Certificates() {
  const [failedImages, setFailedImages] = useState(() => new Set());
  const { data, loading, error, refetch } = useFetch('/certificates');
  const certificates = Array.isArray(data) ? data : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <SectionTitle title="Certificates" subtitle="Professional learning and development." />
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
          <button type="button" onClick={refetch} className="mt-3 text-sm font-semibold text-primary underline">Try again</button>
        </div>
      ) : loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300" role="status">Loading certificates…</div>
      ) : certificates.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900">
              <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800">
                {certificate.file && !failedImages.has(certificate._id) ? (
                  <img
                    src={certificate.file}
                    alt={`${certificate.title} certificate`}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    onError={() => setFailedImages((current) => new Set(current).add(certificate._id))}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Award size={42} strokeWidth={1.5} />
                    <span className="text-sm font-medium">Certificate image placeholder</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{certificate.title}</h2>
                {certificate.recipientName && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{certificate.recipientName}</p>}
                {certificate.issuer && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{certificate.issuer}</p>}
                {certificate.date && <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{new Date(certificate.date).toLocaleDateString()}</p>}
                {certificate.file && (
                  <a href={certificate.file} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark">
                    View certificate <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <Award className="mx-auto text-slate-500 dark:text-slate-400" size={36} />
          <p className="mt-3 font-medium text-slate-900 dark:text-white">No certificates published yet.</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Certificates added in the Admin panel will appear here.</p>
        </div>
      )}
    </div>
  );
}
