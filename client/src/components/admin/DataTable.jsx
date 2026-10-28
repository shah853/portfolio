import Loader from '../common/Loader';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyText = 'No data available.',
  actions,
}) {
  if (loading) return <Loader />;

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        {emptyText}
      </div>
    );
  }

  const renderCell = (column, row) =>
    column.render ? column.render(row[column.key], row) : row[column.key];

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 md:block">
        <table className="w-full min-w-[640px] divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-5 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
              {actions && <th scope="col" className="px-5 py-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {data.map((row) => (
              <tr key={row._id || row.id} className="text-slate-700 dark:text-slate-300">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4">
                    {renderCell(column, row)}
                  </td>
                ))}
                {actions && <td className="px-5 py-4">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {data.map((row) => (
          <article
            key={row._id || row.id}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            {columns.map((column) => (
              <div key={column.key} className="flex items-start justify-between gap-4">
                <span className="shrink-0 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                  {column.label}
                </span>
                <span className="min-w-0 text-right text-sm text-slate-800 dark:text-slate-200">
                  {renderCell(column, row)}
                </span>
              </div>
            ))}
            {actions && (
              <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
                {actions(row)}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
