import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { login } from '@/lib/auth';
import { ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [previousPhrase, setPreviousPhrase] = useState<number | null>(null);

  const loginSlides = [
    {
      phrase: 'Where good work finds the right home.',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1800&q=85',
      alt: 'A plumber working on residential water piping',
    },
    {
      phrase: 'Comfort and care in every season.',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1800&q=85',
      alt: 'Heating and cooling equipment being serviced',
    },
    {
      phrase: 'Skilled work keeps every home running.',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1800&q=85',
      alt: 'An electrician working with residential electrical equipment',
    },
    {
      phrase: 'Better connections. Smarter spaces.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=85',
      alt: 'Close-up of technology and electronic components',
    },
    {
      phrase: 'Built strong, from the top down.',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=85',
      alt: 'Roofing and construction work on a building',
    },
    {
      phrase: 'Fresh finishes make a difference.',
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1800&q=85',
      alt: 'A room being carefully painted',
    },
    {
      phrase: 'Thoughtful details. Beautiful spaces.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
      alt: 'Finished interior with detailed flooring and tile finishes',
    },
    {
      phrase: 'Make your next move feel easier.',
      image: 'https://images.unsplash.com/photo-1600518464441-9306b6a5c6c3?auto=format&fit=crop&w=1800&q=85',
      alt: 'Moving boxes ready for a home move',
    },
    {
      phrase: 'More room for the life you want.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56c0a?auto=format&fit=crop&w=1800&q=85',
      alt: 'A renovated home exterior',
    },
    {
      phrase: 'Bring your outdoor spaces to life.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=85',
      alt: 'Outdoor home improvement and garden work',
    },
    {
      phrase: 'A brighter way to power your home.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1800&q=85',
      alt: 'Solar panels generating clean energy',
    },
    {
      phrase: 'One place for projects of every size.',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
      alt: 'A welcoming, completed home interior',
    },
  ];

  const slideOrderRef = useRef<number[] | null>(null);
  if (slideOrderRef.current === null) {
    slideOrderRef.current = loginSlides.map((_, index) => index);
    for (let i = slideOrderRef.current.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [slideOrderRef.current[i], slideOrderRef.current[j]] = [slideOrderRef.current[j], slideOrderRef.current[i]];
    }
  }
  const [activePhrase, setActivePhrase] = useState(slideOrderRef.current[0]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const currentSlide = activePhrase;
      let nextOrder = slideOrderRef.current!.filter(index => index !== currentSlide);

      if (nextOrder.length === 0) {
        nextOrder = loginSlides.map((_, index) => index).filter(index => index !== currentSlide);
        for (let i = nextOrder.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [nextOrder[i], nextOrder[j]] = [nextOrder[j], nextOrder[i]];
        }
      }

      slideOrderRef.current = nextOrder;
      setPreviousPhrase(currentSlide);
      setActivePhrase(nextOrder[0]);
      window.setTimeout(() => setPreviousPhrase(previous => previous === currentSlide ? null : previous), 1100);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [activePhrase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = await login(email, password);
      const destination = user.role === 'Organization' ? '/organization'
        : user.role === 'Professional' ? '/professional'
        : user.role === 'Admin' ? '/admin' : '/customer';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6f3] lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <section className="mela-login-photo relative flex min-h-[250px] flex-col justify-between overflow-hidden px-7 py-7 text-white sm:px-10 sm:py-9 lg:min-h-screen lg:px-14 lg:py-12">
        <style>{`
          @keyframes melaSlideFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes melaSlideFadeOut { from { opacity: 1; } to { opacity: 0; } }
          .mela-slide-enter { animation: melaSlideFadeIn 1s ease both; }
          .mela-slide-exit { animation: melaSlideFadeOut 1s ease both; }
          @media (prefers-reduced-motion: reduce) {
            .mela-slide-enter, .mela-slide-exit { animation-duration: 0.01ms; }
          }
        `}</style>
        {previousPhrase !== null && (
          <img key={`previous-${previousPhrase}`} src={loginSlides[previousPhrase].image} alt="" aria-hidden="true" className="mela-slide-exit absolute inset-0 h-full w-full object-cover" />
        )}
        <img key={`active-${activePhrase}`} src={loginSlides[activePhrase].image} alt={loginSlides[activePhrase].alt} className="mela-slide-enter absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#102d29]/85 via-[#173b35]/60 to-[#173b35]/35" />
        <div className="relative z-10 flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-11 w-11 rounded-xl bg-white/15 p-1.5" />
          <span className="text-2xl font-bold tracking-tight">{t('common.appName')}</span>
        </div>
        <div className="relative z-10 max-w-xl py-8">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm"><MapPin className="h-3.5 w-3.5" /> KANSAS CITY METRO</span>
          <div className="relative min-h-[5.5rem] max-w-lg sm:min-h-[7rem]" aria-live="polite" aria-atomic="true">
            {previousPhrase !== null && (
              <h1 key={`old-copy-${previousPhrase}`} className="mela-slide-exit absolute inset-0 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {loginSlides[previousPhrase].phrase}
              </h1>
            )}
            <h1 key={`new-copy-${activePhrase}`} className="mela-slide-enter relative text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {loginSlides[activePhrase].phrase}
            </h1>
          </div>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">Find trusted local help, keep projects moving, and manage every detail in one thoughtful place.</p>
          <div className="mt-6 flex items-center gap-2 text-sm text-white/85"><ShieldCheck className="h-4 w-4 shrink-0 text-[#f4c66a]" /> One place for customers, professionals, and project teams</div>
        </div>
        <p className="relative z-10 hidden text-xs text-white/70 lg:block">Mela · Home services and project care, made simpler.</p>
      </section>

      <section className="relative flex min-h-[calc(100vh-250px)] flex-col bg-white px-5 py-6 sm:px-8 lg:min-h-screen lg:px-12">
        <div className="flex justify-end"><LanguageSwitcher /></div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-600">Welcome back</p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">{t('auth.login')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">Sign in to continue to your Mela workspace.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">{t('auth.email')}</label>
                <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100" />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">{t('auth.password')}</label>
                <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 text-gray-900 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100" />
              </div>
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:cursor-not-allowed disabled:opacity-60">
                {busy ? 'Signing in…' : t('auth.login')} {!busy && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-gray-600">{t('auth.noAccount')} <Link to="/register" className="font-semibold text-primary-700 hover:underline">{t('auth.register')}</Link></p>
            <div className="mt-10 border-t border-gray-100 pt-5 text-center text-xs text-gray-400">Secure access to your Mela account</div>
          </div>
        </div>
      </section>
    </div>
  );
}
