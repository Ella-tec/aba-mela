import { Link } from 'react-router-dom';
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

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t('home.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              {t('home.heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('home.searchPlaceholder')}
                  className="w-full ps-11 pe-4 py-3.5 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button className="px-6 py-3.5 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-xl transition-colors">
                {t('common.search')}
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/register?type=customer"
                className="px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                {t('home.ctaBook')}
              </Link>
              <Link
                to="/register?type=professional"
                className="px-5 py-2.5 border-2 border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('home.ctaJoin')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('home.popularServices')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {services.map((s) => (
            <Link
              key={s.key}
              to={`/services/${s.key}`}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200 bg-white hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-800 capitalize">{s.key}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-600">{t('home.trustedBy')}</p>
        </div>
      </section>
    </div>
  );
}
