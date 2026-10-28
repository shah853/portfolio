export default function SectionTitle({ title, subtitle, center = false }) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 max-w-2xl text-slate-600 dark:text-slate-300 ${center ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
