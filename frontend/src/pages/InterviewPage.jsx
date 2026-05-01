import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Mic, Send } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { interviewDetail, startInterview, submitAnswer } from '../api/client.js';
import { createInterviewSocket } from '../api/socket.js';
import { formatTimer } from '../utils/date.js';

export default function InterviewPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(location.state || null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (session || id) return;
    startInterview().then((data) => {
      setSession(data);
      navigate(`/interview/${data.interviewId}`, { replace: true, state: data });
    });
  }, [session, id, navigate]);

  useEffect(() => {
    if (session || !id) return;
    interviewDetail(id).then((data) => setSession({ interviewId: data.id, questions: data.questions }));
  }, [session, id]);

  useEffect(() => {
    const interviewId = session?.interviewId;
    if (!interviewId) return;
    socketRef.current = createInterviewSocket(interviewId, (updated) => {
      setSession((current) => ({ ...current, questions: current.questions.map((q) => q.id === updated.id ? updated : q) }));
    });
    return () => socketRef.current?.deactivate();
  }, [session?.interviewId]);

  const question = useMemo(() => session?.questions?.[index], [session, index]);
  const complete = session?.questions?.every((q) => q.answer);

  async function submit() {
    if (!answer.trim() || !question) return;
    setLoading(true);
    try {
      const updated = await submitAnswer(session.interviewId, { questionId: question.id, answer });
      setSession({ ...session, questions: session.questions.map((q) => q.id === updated.id ? updated : q) });
      setAnswer('');
      if (index < session.questions.length - 1) setIndex(index + 1);
      else navigate(`/results/${session.interviewId}`);
    } finally {
      setLoading(false);
    }
  }

  function dictate() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => setAnswer((value) => `${value} ${event.results[0][0].transcript}`.trim());
    recognition.start();
  }

  if (!question) return <AppShell><div className="text-slate-600">Preparing resume-driven questions...</div></AppShell>;

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950">Interview Session</h1>
          <p className="text-slate-500">Question {index + 1} of {session.questions.length}</p>
        </div>
        <div className="rounded-md bg-slate-950 px-4 py-2 font-bold text-white">{formatTimer(seconds)}</div>
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <div className="text-sm font-bold uppercase tracking-wide text-teal-700">{question.category}</div>
        <h2 className="mt-3 text-2xl font-extrabold leading-snug text-slate-950">{question.text}</h2>
        {question.answer?.feedback && <div className="mt-4 rounded-md bg-teal-50 p-4 text-sm text-teal-900">{question.answer.feedback}</div>}
        <textarea className="mt-5 min-h-44 w-full rounded-md border border-slate-300 p-3 leading-6" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer..." />
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={dictate} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-3 font-bold text-slate-700"><Mic size={18} /> Speak</button>
          <button onClick={submit} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-3 font-bold text-white disabled:opacity-50"><Send size={18} /> Submit</button>
          <button onClick={() => setIndex(Math.min(index + 1, session.questions.length - 1))} className="rounded-md border border-slate-300 px-4 py-3 font-bold text-slate-700">Next</button>
        </div>
      </section>
      {complete && <button onClick={() => navigate(`/results/${session.interviewId}`)} className="mt-5 rounded-md bg-slate-950 px-4 py-3 font-bold text-white">View Results</button>}
    </AppShell>
  );
}
