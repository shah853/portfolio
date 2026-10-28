import { useState } from 'react';
import { ArrowUpRight, Code2, Image, Play, Video } from 'lucide-react';

const statusStyles = {
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  planned: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

export default function ProjectCard({ project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const status = project.status;
  const statusLabel = status?.replace('_', ' ');

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-indigo-500 via-primary to-violet-500">
        {project.image && !imageFailed ? (
          <img
            src={project.image}
            alt={`${project.title} project preview`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-indigo-500 via-primary to-violet-500 text-white/75">
            <Image size={34} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-xs font-medium">Project image placeholder</span>
          </div>
        )}
        {status && (
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              statusStyles[status] || 'bg-white/90 text-slate-700'
            }`}
          >
            {statusLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{project.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {project.description?.trim() || 'Project details will be added soon.'}
        </p>
        <div className="mt-4 flex min-h-7 flex-wrap gap-2">
          {Array.isArray(project.stack) && project.stack.length > 0 ? (
            project.stack.slice(0, 5).map((technology, index) => (
              <span
                key={`${technology}-${index}`}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {technology}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">Technology details will be added.</span>
          )}
        </div>
        {(project.links?.github || project.links?.live || project.video) && (
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Code2 size={15} /> Source Code <ArrowUpRight size={13} />
              </a>
            )}
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Play size={14} /> Live Demo <ArrowUpRight size={13} />
              </a>
            )}
            {project.video && (
              <a
                href={project.video}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
              >
                <Video size={15} /> Watch demo <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
