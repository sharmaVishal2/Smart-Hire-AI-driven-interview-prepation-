import { BrainCircuit, FileUp, History, LayoutDashboard, LogIn, LogOut, UserPlus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Resume', icon: FileUp },
  { to: '/interview', label: 'Interview', icon: BrainCircuit },
  { to: '/history', label: 'History', icon: History },
];

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-4 py-5 lg:block">
        <div className="mb-8">
          <div className="text-xl font-extrabold text-slate-950">SmartHire</div>
          <div className="text-sm text-slate-500">AI interview platform</div>
        </div>
        <nav className="space-y-1">
          {links.filter((link) => user || !['/dashboard', '/history'].includes(link.to)).map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <button className="absolute bottom-5 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" onClick={() => { logout(); localStorage.removeItem('smarthire_guest_session'); navigate('/'); }}>
            <LogOut size={18} /> Logout
          </button>
        )}
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4">
          <div className="font-bold text-slate-950">SmartHire</div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.name}</span>
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" onClick={() => { logout(); localStorage.removeItem('smarthire_guest_session'); navigate('/'); }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => navigate('/login')}>
                <LogIn size={16} /> Login
              </button>
              <button className="flex items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700" onClick={() => navigate('/register')}>
                <UserPlus size={16} /> Register
              </button>
            </div>
          )}
        </header>
        <div className="mx-auto max-w-6xl px-5 py-6">{children}</div>
      </main>
    </div>
  );
}
