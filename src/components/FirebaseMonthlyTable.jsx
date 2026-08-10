const FirebaseMonthlyTable = ({ data, month, year }) => {
  const columns = data?.columns || [];
  const rows = data?.rows || [];

  return (
    <section className="mt-8 px-2 md:px-4" aria-labelledby="firebase-results-heading">
      <div className="rounded-t-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700 py-5 text-center">
        <h2
          id="firebase-results-heading"
          className="text-xl font-bold text-white sm:text-2xl lg:text-3xl"
        >
          EXTERNAL RESULT MONTH CHART {month} {year}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-b-2xl border border-slate-700 bg-slate-900 shadow-sm">
        {rows.length > 0 && columns.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-800">
                <th className="sticky left-0 z-10 border border-slate-700 bg-slate-800 px-3 py-3 text-sm font-bold text-green-400">
                  S.No
                </th>
                {columns.map((column) => (
                  <th
                    key={column.name}
                    className="whitespace-nowrap border border-slate-700 px-3 py-3 text-xs font-semibold uppercase text-slate-300"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.date}
                  className="bg-slate-800/50 transition-colors duration-200 hover:bg-slate-700/50"
                >
                  <td className="sticky left-0 z-10 border border-slate-700 bg-slate-800 px-3 py-2.5 text-center text-sm font-bold text-amber-500">
                    {row.day}
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.name}
                      className="border border-slate-700 px-3 py-2.5 text-center text-sm font-semibold text-green-400 transition-colors hover:bg-green-900/20"
                    >
                      {row.results[column.name] || "--"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No external results are available for this month.
          </p>
        )}
      </div>
    </section>
  );
};

export default FirebaseMonthlyTable;
