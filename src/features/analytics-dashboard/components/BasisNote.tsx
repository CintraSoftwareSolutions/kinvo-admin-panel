/** The server's statement of what a series counts. Not debug text: it stops a chart being misread. */
export function BasisNote({ basis }: { basis: string }) {
  return (
    <p className="mt-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
      <span className="font-semibold text-slate-600">What this counts: </span>
      {basis}
    </p>
  )
}
