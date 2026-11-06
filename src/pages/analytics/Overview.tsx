import { useTranslation } from 'react-i18next';
import {
  ANALYTICS_KPIS,
  BOOKING_TREND,
  SERVICE_BREAKDOWN,
  TECH_PERFORMANCE,
  PROJECT_ANALYTICS,
  SUPPORT_METRICS,
} from '@/data/mock';
import {
  Calendar,
  DollarSign,
  Users,
  FolderKanban,
  HeadphonesIcon,
  ShieldCheck,
  Flame,
  Star,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnalyticsOverview() {
  const { t } = useTranslation();
  const k = ANALYTICS_KPIS;
  const maxBookings = Math.max(...BOOKING_TREND.map((d) => d.bookings));
  const maxService = Math.max(...SERVICE_BREAKDOWN.map((s) => s.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('analytics.title')}</h2>
          <p className="text-sm text-gray-500">{t('analytics.last7Days')}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
          <Download className="w-4 h-4" />
          {t('analytics.export')}
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t('analytics.todayBookings'), value: k.todayBookings, icon: Calendar, color: 'text-blue-600' },
          { label: t('analytics.todayRevenue'), value: `ETB ${(k.todayRevenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-green-600' },
          { label: t('analytics.activeTechnicians'), value: k.activeTechnicians, icon: Users, color: 'text-indigo-600' },
          { label: t('analytics.activeProjects'), value: k.activeProjects, icon: FolderKanban, color: 'text-orange-600' },
          { label: t('analytics.openTickets'), value: k.openTickets, icon: HeadphonesIcon, color: 'text-amber-600' },
          { label: t('analytics.pendingVerifications'), value: k.pendingVerifications, icon: ShieldCheck, color: 'text-purple-600' },
          { label: t('analytics.hotJobs'), value: k.hotJobs, icon: Flame, color: 'text-red-600' },
          { label: t('analytics.avgRating'), value: k.avgRating, icon: Star, color: 'text-yellow-600' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
              <item.icon className={cn('w-4 h-4', item.color)} />
              {item.label}
            </div>
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Booking trend - simple bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 mb-4">{t('analytics.bookingTrend')}</h3>
        <div className="flex items-end gap-2 h-40">
          {BOOKING_TREND.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-xs font-medium text-gray-700">{d.bookings}</div>
              <div
                className="w-full bg-primary-500 rounded-t-md min-h-[4px] transition-all"
                style={{ height: `${(d.bookings / maxBookings) * 100}%` }}
              />
              <div className="text-[10px] text-gray-400 mt-1">{d.date.replace('2026-', '').slice(0, 6)}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>Bookings</span>
          <span>
            Revenue peak: ETB {Math.max(...BOOKING_TREND.map((d) => d.revenue)).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Service breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">{t('analytics.serviceBreakdown')}</h3>
          <div className="space-y-3">
            {SERVICE_BREAKDOWN.map((s) => (
              <div key={s.service}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{s.service}</span>
                  <span className="text-gray-500">
                    {s.count} · ETB {(s.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(s.count / maxService) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">{t('analytics.supportMetrics')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Open</div>
              <div className="text-2xl font-bold text-gray-900">{SUPPORT_METRICS.open}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Escalated</div>
              <div className="text-2xl font-bold text-amber-600">{SUPPORT_METRICS.escalated}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg first response</div>
              <div className="text-xl font-bold text-gray-900">{SUPPORT_METRICS.avgFirstResponseHrs}h</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg resolution</div>
              <div className="text-xl font-bold text-gray-900">{SUPPORT_METRICS.avgResolutionHrs}h</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-gray-500">{t('analytics.csat')}</div>
              <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {SUPPORT_METRICS.csat}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top technicians */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('analytics.topTechnicians')}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-2.5 font-medium">Name</th>
                <th className="px-5 py-2.5 font-medium">{t('analytics.jobs')}</th>
                <th className="px-5 py-2.5 font-medium">Rating</th>
                <th className="px-5 py-2.5 font-medium">Revenue</th>
                <th className="px-5 py-2.5 font-medium">{t('analytics.acceptance')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TECH_PERFORMANCE.map((tech) => (
                <tr key={tech.name} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{tech.name}</td>
                  <td className="px-5 py-3 text-gray-600">{tech.jobs}</td>
                  <td className="px-5 py-3 text-gray-600">★ {tech.rating}</td>
                  <td className="px-5 py-3 text-gray-600">ETB {tech.revenue.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600">{tech.acceptance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project performance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 font-semibold text-gray-900">
          {t('analytics.projectPerformance')}
        </div>
        <div className="divide-y divide-gray-100">
          {PROJECT_ANALYTICS.map((p) => (
            <div key={p.name} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">{p.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  ETB {(p.spent / 1000).toFixed(0)}k / {(p.budget / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      p.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                    )}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-10 text-end">{p.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
