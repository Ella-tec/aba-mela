import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Wrench, Zap, Paintbrush, Home, HardHat, Sparkles } from 'lucide-react';

const services = [
  { icon: Wrench, key: 'plumbing', color: 'bg-blue-100 text-blue-700' },
  { icon: Zap, key: 'electrical', color: 'bg-yellow-100 text-yellow-700' },
  { icon: Paintbrush, key: 'painting', color: 'bg-purple-100 text-purple-700' },
  { icon: Home, key: 'cleaning', color: 'bg-green-100 text-green-700' },
  { icon: HardHat, key: 'construction', color: 'bg-orange-100 text-orange-700' },
  { icon: Sparkles, key: 'hvac', color: 'bg-cyan-100 text-cyan-700' },
];

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [service, setService] = useState('');
  const [zip, setZip] = useState('');

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (service.trim()) params.set('service', service.trim());
    if (zip.trim()) params.set('zip', zip.trim());
    navigate(`/register?type=customer&${params.toString()}`);
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#173b35] via-[#24564c] to-[#102d29] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-[#f8dfaa] mb-6">
              <span className="h-2 w-2 rounded-full bg-[#f4c66a]" />
              Kansas City metro · Missouri + Kansas
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Find the right local pro. Make home feel taken care of.
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
              One thoughtful place for home repairs, property care, renovations, and construction across the Kansas City metro.
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-5 rounded-2xl bg-white/10 p-2 backdrop-blur-sm border border-white/15">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  placeholder="What do you need help with?"
                  className="w-full ps-11 pe-4 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f4c66a]"
                />
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                pattern="[0-9]{5}"
                value={zip}
                onChange={(event) => setZip(event.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="ZIP code"
                aria-label="ZIP code"
                className="sm:w-32 px-4 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f4c66a]"
              />
              <button type="submit" className="px-6 py-3.5 bg-[#f4c66a] hover:bg-[#e9b94f] text-[#173b35] font-semibold rounded-xl transition-colors">
                Find a pro
              </button>
            </form>
            <p className="text-sm text-white/70 mb-7">ZIP-based coverage is being rolled out. Availability is confirmed when a provider accepts your request.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register?type=customer" className="px-5 py-2.5 bg-white text-[#173b35] font-semibold rounded-lg hover:bg-[#f7f4eb] transition-colors">
                {t('home.ctaBook')}
              </Link>
              <Link to="/register?type=professional" className="px-5 py-2.5 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                {t('home.ctaJoin')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#a8792b] mb-2">Mela marketplace</p>
            <h2 className="text-2xl font-bold text-gray-900">{t('home.popularServices')}</h2>
          </div>
          <p className="text-sm text-gray-500">Home care, repairs, and project support</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((s) => (
            <Link key={s.key} to={`/services/${s.key}`} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200 bg-white hover:border-[#9bb9ad] hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800 capitalize">{s.key}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f3f5f1] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold text-[#173b35]">A better way to care for your place.</p>
          <p className="mt-2 text-sm text-gray-600">Kansas City, MO · Northland · Independence · Lee’s Summit · Overland Park · Olathe · Shawnee</p>
          <p className="mt-2 text-xs text-gray-500">Service-area availability is subject to launch and provider verification.</p>
        </div>
      </section>
    </div>
  );
}
