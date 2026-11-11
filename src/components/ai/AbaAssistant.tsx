import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Sparkles, MapPin, Bot, Zap, Loader2, ArrowUpRight, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; text: string };
type AiStatus = 'checking' | 'ready' | 'offline';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5018').replace(/\/$/, '');
const OLLAMA_URL = (import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2';

const SUGGESTIONS = [
  { label: 'Find a service', prompt: 'What service categories can I browse in Mela?' },
  { label: 'How booking works', prompt: 'Explain how to create and manage a booking.' },
  { label: 'For professionals', prompt: 'How can a professional find and respond to jobs on Mela?' },
  { label: 'Safety help', prompt: 'What should I do if there is an urgent safety issue?' },
];

const SYSTEM_PROMPT = `You are Mela Assistant, a helpful and practical guide for the Mela home-services and professional-work platform serving the Kansas City metro in Missouri and Kansas.
Answer the user's actual question directly. Be conversational, specific, and vary your wording naturally. Do not repeat a generic introduction.
Use only the app context supplied in the conversation. Never invent provider names, ratings, prices, job availability, booking status, service coverage, or live business data.
If the user asks for a live provider, quote, booking, job, payment, or account status and that data is not supplied, say you cannot verify it here and explain the exact Mela screen or next step to check it.
For bookings, explain the steps clearly. For urgent danger, tell the user to call 911 in the US.
Keep answers clear and concise. Use numbered steps when they help. Respond in the language the user uses when possible.`;

function varied(options: string[], turn: number) {
  return options[Math.abs(turn) % options.length];
}

function fallbackReply(question: string, turn: number, categories: string[]) {
  const q = question.toLowerCase();
  if (/\b(hello|hi|hey|good morning|good afternoon)\b/.test(q)) {
    return varied([
      'Hello! What would you like to get done in Mela today?',
      'Hi there — I can help you navigate services, bookings, professional jobs, and account questions. What are you working on?',
      'Welcome to Mela. Tell me what you need, and I’ll guide you to the right next step.',
    ], turn);
  }
  if (/\b(plumb|electric|clean|paint|hvac|roof|carpent|mason|service|category|categories)\b/.test(q)) {
    const available = categories.length ? categories.join(', ') : 'plumbing, electrical, painting, cleaning, carpentry, HVAC, masonry, and roofing';
    return varied([
      `Mela's service catalogue currently reports these categories: ${available}. Choose the closest match in the Services area to continue. I can help explain what to select, but I cannot confirm which individual professionals are available until live provider listings are connected.`,
      `For service discovery, start with the Services page. The categories available from the connected catalogue are: ${available}. Provider availability and ratings need to be checked in the live listing before you book.`,
      `Here are the service types Mela can currently show: ${available}. Select a category to narrow your request. I won't make up provider names or availability that the app hasn't verified.`,
    ], turn);
  }
  if (/\b(book|booking|schedule|appointment|cancel|reschedule)\b/.test(q)) {
    return varied([
      'To make a booking: 1) Open Create Booking. 2) Select the service you need. 3) Enter the job details, address, and preferred date/time. 4) Review the request and submit it. Check My Bookings for updates. I can explain the steps, but I cannot create or change a booking from this chat yet.',
      'Start in Create Booking, choose a service, describe the work, add the job address and preferred time, then submit. After that, use My Bookings to review its status. Changes and cancellations should be made from the booking itself.',
      'The next step is the Create Booking page. Select a category, describe the task, provide the location and timing, and submit your request. Use My Bookings to track the result; this assistant cannot confirm a booking on your behalf.',
    ], turn);
  }
  if (/\b(job|hot jobs|available work|find work|professional|technician|contractor|foreman)\b/.test(q)) {
    return varied([
      'If you are working as a professional, open Hot Jobs or Available Jobs to review current opportunities. Open a job to read its scope and location before accepting. I cannot verify live job availability from this chat.',
      'For work opportunities, go to the Professional area and check Hot Jobs and Available Jobs. Review the job details before you accept it. The current live list is the source of truth for availability.',
      'Use the Professional portal to find work: check Available Jobs, open a listing for its details, then accept only if the scope and timing suit you. I do not have a live job feed in this chat yet.',
    ], turn);
  }
  if (/\b(price|cost|quote|estimate|pay|payment|invoice|refund)\b/.test(q)) {
    return varied([
      'Pricing depends on the job scope, materials, location, and professional. Request a quote through the relevant booking or job workflow and compare the details before agreeing. I cannot verify a live price or payment status here.',
      'I don’t want to guess at a price. Add the work details in your booking request so a professional can provide a quote. For invoices or payment status, check the relevant transaction or invoice screen.',
      'The safest way to get an accurate amount is to submit the job details and review the quote you receive. Confirm what is included before accepting; no live quote or payment record is available to me in this chat.',
    ], turn);
  }
  if (/\b(safety|danger|emergency|accident|injur|fire|gas leak)\b/.test(q)) {
    return 'If someone is in immediate danger, call 911 now. Move away from the hazard if it is safe to do so. For non-emergency site concerns, open Mela Safety Center to review the demo checklist and reporting guidance. Demo reports are not yet connected to an official emergency-response service.';
  }
  if (/\b(language|translate|amharic|arabic|french|spanish)\b/.test(q)) {
    return 'Mela is designed for a multilingual experience. You can change the app language in Settings when that language is available. I can also try to respond in the language you use, although some app labels may remain in English.';
  }
  if (/\b(where|location|area|kansas|missouri|kansas city|coverage)\b/.test(q)) {
    return 'Mela is positioned for the Kansas City metro across Missouri and Kansas. Exact service coverage depends on the selected service and participating professionals. Enter your job address in the booking flow to check the options available for that location.';
  }
  if (/\b(account|profile|password|sign in|login|register|verification)\b/.test(q)) {
    return 'For profile and account details, open your account menu and go to Settings. Use the sign-in or verification flow for access issues. I cannot view private account information or change credentials from this assistant.';
  }
  return varied([
    `I understand you're asking: “${question.trim()}”. I don't have a verified answer for that from the connected Mela data yet. Is this about finding a service, managing a booking, or using the professional workspace?`,
    `Let me narrow this down rather than guess. “${question.trim()}” isn't covered by the live information available to me. Which part of Mela are you using — Services, Bookings, or the Professional portal?`,
    `I can help, but I don't want to give you an invented answer. I can't verify that detail from the current Mela connection. Tell me which page or task you're referring to, and I'll guide you from there.`,
  ], turn);
}

async function getServiceCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/api/Services`);
    if (!response.ok) return [];
    const data: unknown = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => String(item?.name || item?.key || item?.title || ''))
      .filter(Boolean)
      .map((value: string) => value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()));
  } catch {
    return [];
  }
}

export function AbaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<AiStatus>('checking');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Welcome to Mela. I can help you explore services, understand bookings, find the right workspace, and work through common questions. What would you like to do?' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch(`${OLLAMA_URL}/api/tags`)
      .then((response) => {
        if (!response.ok) throw new Error('Local AI is unavailable');
        return response.json();
      })
      .then(() => { if (active) setStatus('ready'); })
      .catch(() => { if (active) setStatus('offline'); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open, busy]);

  const send = async (rawText: string) => {
    const question = rawText.trim();
    if (!question || busy) return;
    const history = msgs.slice(-8).map((message) => ({ role: message.role, content: message.text }));
    const nextTurn = msgs.filter((message) => message.role === 'user').length;
    setMsgs((current) => [...current, { role: 'user', text: question }]);
    setInput('');
    setBusy(true);

    try {
      const categories = await getServiceCategories();
      const context = categories.length
        ? `Verified service categories returned by the Mela API: ${categories.join(', ')}.`
        : 'The Mela service catalogue could not be reached. Do not claim live catalogue data.';
      const response = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          stream: false,
          messages: [
            { role: 'system', content: `${SYSTEM_PROMPT}\n\nCurrent app context: Kansas City metro (Missouri + Kansas). ${context}` },
            ...history,
            { role: 'user', content: question },
          ],
          options: { temperature: 0.75, top_p: 0.9 },
        }),
      });
      if (!response.ok) throw new Error('Local AI request failed');
      const result = await response.json();
      const answer = String(result?.message?.content || '').trim();
      if (!answer) throw new Error('Local AI returned an empty answer');
      setStatus('ready');
      setMsgs((current) => [...current, { role: 'assistant', text: answer }]);
    } catch {
      setStatus('offline');
      const categories = await getServiceCategories();
      setMsgs((current) => [...current, { role: 'assistant', text: fallbackReply(question, nextTurn, categories) }]);
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
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-5 end-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl ring-4 ring-white/70 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200',
          open ? 'bg-slate-900 text-white' : 'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
        )}
        aria-label={open ? 'Close Mela Assistant' : 'Open Mela Assistant'}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <section
          aria-label="Mela Assistant chat"
          className="fixed bottom-24 end-4 z-50 flex h-[min( min(76vh,650px),calc(100dvh-8rem))] w-[min( calc(100vw-2rem),410px)] flex-col overflow-hidden rounded-[1.65rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.38)] sm:end-6"
        >
          <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 px-5 pb-5 pt-5 text-white">
            <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-orange-400/15 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <div className="text-base font-semibold tracking-tight">Mela Assistant</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="h-3 w-3 text-orange-300" />
                    Kansas City metro <span className="text-slate-500">·</span> MO + KS
                  </div>
                </div>
              </div>
              <button onClick={clearChat} title="Start a new chat" aria-label="Start a new chat" className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-4 flex items-center gap-2">
              <span className={cn('h-2 w-2 rounded-full', status === 'ready' ? 'bg-emerald-400' : status === 'checking' ? 'bg-amber-300' : 'bg-slate-400')} />
              <span className="text-[11px] font-medium text-slate-300">
                {status === 'ready' ? `Local AI connected · ${OLLAMA_MODEL}` : status === 'checking' ? 'Connecting to local AI…' : 'Guided assistant · local AI offline'}
              </span>
              <span className="ms-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                <Zap className="h-3 w-3 text-amber-300" /> Smart help
              </span>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4">
            {msgs.map((message, index) => (
              <div key={index} className={cn('flex items-end gap-2', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                {message.role === 'assistant' && (
                  <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={cn(
                  'max-w-[86%] whitespace-pre-wrap rounded-2xl px-3.5 py-3 text-[13px] leading-5 shadow-sm',
                  message.role === 'user'
                    ? 'rounded-br-md bg-slate-900 text-white'
                    : 'rounded-bl-md border border-slate-100 bg-white text-slate-700'
                )}>
                  {message.text}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-700"><Bot className="h-4 w-4" /></div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-500" /> Thinking through your question…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {msgs.length <= 1 && (
            <div className="border-t border-slate-100 bg-white px-4 pb-3 pt-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Quick start</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion.label} onClick={() => send(suggestion.prompt)} disabled={busy} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800 disabled:opacity-50">
                    {suggestion.label}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                <ArrowUpRight className="h-3 w-3" /> Planned: live provider matching, quote comparison, and voice support
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
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-50 disabled:opacity-60"
            />
            <button type="submit" disabled={!input.trim() || busy} aria-label="Send message" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md shadow-orange-200/60 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="bg-white pb-2 text-center text-[9px] text-slate-400">Mela AI can make mistakes. Verify important booking and payment details in the app.</div>
        </section>
      )}
    </>
  );
}
