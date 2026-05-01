import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { interviewHistory } from '../api/client.js';
import { formatDate } from '../utils/date.js';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { interviewHistory().then(setItems); }, []);

  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold text-slate-950">Interview History</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {items.length === 0 ? <div className="p-5 text-slate-500">No interview history.</div> : items.map((item) => (
          <Link key={item.id} to={`/results/${item.id}`} className="grid gap-2 border-b border-slate-100 px-5 py-4 hover:bg-slate-50 md:grid-cols-4">
            <span className="font-semibold text-slate-900">{formatDate(item.startedAt)}</span>
            <span className="text-slate-600">{item.status}</span>
            <span className="text-slate-600">{item.questionCount} questions</span>
            <span className="font-bold text-teal-700">{item.averageScore ?? 0}%</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
