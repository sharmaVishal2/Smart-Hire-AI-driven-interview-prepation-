import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export default function LoginPage({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login({ email: form.email, password: form.password });
      else await register(form);
      localStorage.setItem('smarthire_mode', 'auth');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-[1fr_440px]">
      <section className="flex min-h-[360px] flex-col justify-between bg-slate-950 p-8 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xl font-extrabold"><BrainCircuit /> SmartHire</div>
          <button className="rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10" onClick={() => navigate('/upload')}>
            Use without login
          </button>
        </div>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">AI Resume Driven Interview Platform</h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">Upload a resume, generate contextual questions, run a live interview, and review scored feedback.</p>
        </div>
        <div className="grid max-w-xl grid-cols-3 gap-3 text-sm text-slate-300">
          <span>JWT Auth</span><span>RAG Prompts</span><span>Live Q&A</span>
        </div>
      </section>
      <section className="flex items-center px-6 py-10">
        <form onSubmit={submit} className="mx-auto w-full max-w-sm">
          <h2 className="text-2xl font-extrabold text-slate-950">{mode === 'login' ? 'Login' : 'Create account'}</h2>
          <div className="mt-6 space-y-4">
            {mode === 'register' && <input className="w-full rounded-md border border-slate-300 px-3 py-3" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
            <input className="w-full rounded-md border border-slate-300 px-3 py-3" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="w-full rounded-md border border-slate-300 px-3 py-3" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          {error && <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          <button disabled={loading} className="mt-6 w-full rounded-md bg-teal-600 px-4 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60">
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
          <button type="button" className="mt-4 text-sm font-semibold text-teal-700" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Need an account?' : 'Already registered?'}
          </button>
        </form>
      </section>
    </main>
  );
}
