import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; text: string };

const SUGGESTIONS = [
  'Find me a plumber in Kansas City',
  'How do I book a service?',
  'Show hot jobs',
  'Find a plumber in Kansas City',
];

const REPLIES: Record<string, string> = {
  default:
    "I'm the Mela assistant. I can help you find services, match professionals, explain bookings, or answer in English, Amharic, Arabic, or French.",
  plumber:
    'I found 3 plumbers shown in demo data near Kansas City:\n• Demo Provider One ★4.8 — 1.2 km\n• Demo Provider Two ★4.6 — 2.1 km\n• Demo Plumbing Co. ★4.5 — 3.0 km\n\nWould you like to book one?',
  book:
    'To book: go to Create Booking, choose a service, pick date/time and address, then submit. Professionals will send quotes you can compare.',
  hot: 'Demo mode shows 2 example hot jobs: Plumbing in Brookside Medhanialem (P1) and Electrical in Crossroads Arts District (P1). Open Hot Jobs in the Professional portal to accept.',
};

function replyFor(input: string): string {
  const t = input.toLowerCase();
  if (t.includes('plumb') || t.includes('ቧንቧ') || t.includes('سباك')) return REPLIES.plumber;
  if (t.includes('book') || t.includes('how')) return REPLIES.book;
  if (t.includes('hot')) return REPLIES.hot;
  return REPLIES.default;
}

export function AbaAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', text: 'Hello! I\'m Mela AI. Ask me to find a service, match a professional, or help with your booking.' },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: 'user', text }, { role: 'assistant', text: replyFor(text) }]);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed bottom-5 end-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all',
          open ? 'bg-gray-800 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'
        )}
        aria-label="Mela Assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 end-5 z-50 w-[min(100vw-2rem,380px)] h-[min(70vh,520px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-primary-600 text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <div>
              <div className="font-semibold text-sm">Mela Assistant</div>
              <div className="text-xs text-primary-100">Kansas City metro · MO + KS</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'ms-auto bg-primary-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                )}
              >
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {msgs.length < 3 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="p-3 border-t border-gray-100 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="p-2 rounded-xl bg-primary-600 text-white hover:bg-primary-700">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
