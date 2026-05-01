import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import StatCard from '../components/StatCard.jsx';
import { dashboardStats, interviewHistory } from '../api/client.js';
import { formatDate } from '../utils/date.js';

export default function DashboardPage() {
  const [stats, setStats] = useState({ interviews: 0, completed: 0, averageScore: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([dashboardStats(), interviewHistory()]).then(([s, h]) => {
      setStats(s);
      setRecent(h.slice(0, 4));
    });
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">Dashboard</h1>
          <p className="mt-1 text-slate-500">Track interview readiness from resume-specific sessions.</p>
        </div>
        <Link to="/upload" className="rounded-md bg-teal-600 px-4 py-3 text-center font-bold text-white hover:bg-teal-700">Upload Resume</Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Total interviews" value={stats.interviews} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Average score" value={`${stats.averageScore || 0}%`} />
      </div>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4 font-bold text-slate-950">Recent interviews</div>
        {recent.length === 0 ? <div className="p-5 text-slate-500">No interviews yet.</div> : recent.map((item) => (
          <Link key={item.id} to={`/results/${item.id}`} className="flex items-center justify-between border-b border-slate-100 px-5 py-4 hover:bg-slate-50">
            <span className="font-semibold text-slate-800">{formatDate(item.startedAt)}</span>
            <span className="text-sm text-slate-500">{item.averageScore ?? 0}%</span>
          </Link>
        ))}
      </section>
    </AppShell>
  );
}
