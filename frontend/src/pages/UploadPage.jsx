import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import { listResumes, startInterview, uploadResume } from '../api/client.js';
import { formatDate } from '../utils/date.js';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => { listResumes().then(setResumes); }, []);

  async function upload(event) {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage('');
    try {
      const resume = await uploadResume(file);
      setResumes([resume, ...resumes]);
      setMessage('Resume parsed successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function begin() {
    setLoading(true);
    try {
      const session = await startInterview();
      navigate(`/interview/${session.interviewId}`, { state: session });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not start interview');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold text-slate-950">Resume Upload</h1>
      <form onSubmit={upload} className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-4 py-10 text-center hover:border-teal-500">
          <FileUp className="mb-3 text-teal-600" size={34} />
          <span className="font-bold text-slate-800">{file ? file.name : 'Choose PDF resume'}</span>
          <input className="hidden" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} />
        </label>
        <div className="mt-4 flex flex-wrap gap-3">
          <button disabled={!file || loading} className="rounded-md bg-slate-950 px-4 py-3 font-bold text-white disabled:opacity-50">Parse Resume</button>
          <button type="button" disabled={resumes.length === 0 || loading} onClick={begin} className="rounded-md bg-teal-600 px-4 py-3 font-bold text-white disabled:opacity-50">Start Interview</button>
        </div>
        {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
      </form>
      <div className="mt-8 grid gap-4">
        {resumes.map((resume) => (
          <article key={resume.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-slate-950">{resume.fileName}</h2>
              <span className="text-sm text-slate-500">{formatDate(resume.uploadedAt)}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{resume.preview}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
