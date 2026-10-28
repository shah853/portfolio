const colorStyles = {
  primary: 'bg-primary/10 text-primary',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400',
};

export default function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value ?? 0}</p>
        </div>
        {Icon && (
          <span className={`rounded-xl p-3 ${colorStyles[color] || colorStyles.primary}`}>
            <Icon size={23} />
          </span>
        )}
      </div>
    </article>
  );
}
