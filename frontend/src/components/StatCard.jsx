export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-slate-950">{value}</div>
    </div>
  );
}
