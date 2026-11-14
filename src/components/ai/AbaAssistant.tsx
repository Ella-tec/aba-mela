import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Zap, Loader2, RotateCcw, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAuth } from '@/lib/auth';

type Msg = { role: 'user' | 'assistant'; text: string };
type AiStatus = 'checking' | 'ready' | 'offline';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5018').replace(/\/$/, '');

const SUGGESTIONS = [
  { label: 'Find a service', prompt: 'What service categories can I browse in Mela?' },
  { label: 'How booking works', prompt: 'Explain how to create and manage a booking.' },
  { label: 'For professionals', prompt: 'How can a professional find and respond to jobs on Mela?' },
  { label: 'Safety help', prompt: 'What should I do if there is an urgent safety issue?' },
];



export function AbaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<AiStatus>('checking');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Welcome to Mela. I can help you explore services, understand bookings, find the right workspace, and work through common questions. What would you like to do?' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/api/assistant/health`)
      .then((response) => {
        if (!response.ok) throw new Error('Assistant is unavailable');
        return response.json();
      })
      .then(() => { if (active) setStatus('ready'); })
      .catch(() => { if (active) setStatus('offline'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open, busy]);

  useEffect(() => {
    if (!open) return;
    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !launcherRef.current?.contains(target)) {
        setOpen(false);
        setInput('');
        setMsgs([{ role: 'assistant', text: 'Welcome back to Mela. What would you like help with?' }]);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setInput('');
        setMsgs([{ role: 'assistant', text: 'Welcome back to Mela. What would you like help with?' }]);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointer);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const send = async (rawText: string) => {
    const question = rawText.trim();
    if (!question || busy) return;
    setMsgs((current) => [...current, { role: 'user', text: question }]);
    setInput('');
    setBusy(true);

    try {
      const auth = getAuth();
      if (!auth?.token) throw new Error('Please sign in to use Mela Assistant.');
      const response = await fetch(`${API_BASE}/api/assistant/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ question }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || 'Mela Assistant could not complete the request.');
      const answer = String(result?.answer || '').trim();
      if (!answer) throw new Error('Local AI returned an empty answer');
      setStatus('ready');
      setMsgs((current) => [...current, { role: 'assistant', text: answer }]);
    } catch (error) {
      setStatus('offline');
      const message = error instanceof Error ? error.message : 'Mela Assistant is temporarily unavailable. Please try again.';
      setMsgs((current) => [...current, { role: 'assistant', text: message }]);
    } finally {
      setBusy(false);
    }
  };

  const clearChat = () => {
    setMsgs([{ role: 'assistant', text: 'New conversation started. What can I help you with in Mela?' }]);
  };

  return (
    <>
      <button
        ref={launcherRef}
        onClick={() => {
          if (open) { setOpen(false); setInput(''); setMsgs([{ role: 'assistant', text: 'Welcome back to Mela. What would you like help with?' }]); }
          else setOpen(true);
        }}
        className={cn(
          'fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-xl ring-4 ring-white/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200',
          open ? 'rotate-0' : ''
        )}
        aria-label={open ? 'Close Mela Assistant' : 'Open Mela Assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <section
          ref={panelRef}
          aria-label="Mela Assistant chat"
          className="fixed bottom-24 end-3 z-50 flex h-[min(560px,calc(100dvh-7.5rem))] w-[min(390px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-[0_22px_70px_-24px_rgba(15,45,35,0.38)] sm:end-6"
        >
          <header className="border-b border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-teal-50 px-4 pb-4 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img src="/favicon.svg" alt="Mela" className="h-10 w-10 shrink-0 rounded-xl shadow-sm" />
                <div className="min-w-0">
                  <div className="text-base font-bold tracking-tight text-slate-900">Mela Assistant</div>
                  <div className="mt-0.5 text-xs font-medium text-slate-500">Learn · Ask · Manage</div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button onClick={clearChat} title="Start a new chat" aria-label="Start a new chat" className="rounded-full bg-white p-2.5 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:text-emerald-800">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={() => setOpen(false)} title="Close assistant" aria-label="Close assistant" className="rounded-full bg-white p-2.5 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', status === 'ready' ? 'bg-emerald-500' : status === 'checking' ? 'bg-amber-400' : 'bg-slate-400')} />
              <span className="text-[11px] font-medium text-slate-600">
                {status === 'ready' ? 'Mela Assistant · Here to help' : status === 'checking' ? 'Connecting to Mela Assistant…' : 'Some help may be limited right now'}
              </span>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-emerald-800 ring-1 ring-emerald-100">
                <Zap className="h-3 w-3" /> Mela help
              </span>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#fbfdfc] px-4 py-4">
            {msgs.length === 1 && (
              <div className="mb-2">
                <h2 className="text-lg font-bold text-slate-900">Hi, how can Mela help?</h2>
                <p className="mt-1 text-sm text-slate-500">Ask about home services, bookings, projects, or your account.</p>
              </div>
            )}
            {msgs.map((message, index) => (
              <div key={index} className={cn('flex items-end gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                  <img src="/favicon.svg" alt="" className="mb-0.5 h-7 w-7 shrink-0 rounded-lg" />
                )}
                <div className={cn(
                  'max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-[13px] leading-5 shadow-sm',
                  message.role === 'user'
                    ? 'rounded-br-md bg-emerald-800 text-white'
                    : 'rounded-bl-md border border-emerald-100 bg-white text-slate-700'
                )}>
                  {message.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-end gap-2">
                <img src="/favicon.svg" alt="" className="h-7 w-7 rounded-lg" />
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-emerald-100 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-700" /> Preparing an answer…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {msgs.length <= 1 && (
            <div className="border-t border-slate-100 bg-white px-4 pb-3 pt-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Quick help</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion.label} onClick={() => send(suggestion.prompt)} disabled={busy} className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-50">
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
            onSubmit={(event) => { event.preventDefault(); void send(input); }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Mela anything…"
              aria-label="Message Mela Assistant"
              disabled={busy}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 disabled:opacity-60"
            />
            <button type="submit" disabled={!input.trim() || busy} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 bg-white pb-2 text-[10px] text-slate-400"><Clock3 className="h-3 w-3" /> Mela AI may make mistakes. Check important booking details in the app.</div>
        </section>
      )}
    </>
  );
}
