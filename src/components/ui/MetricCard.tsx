import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  to: string;
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  tone?: string;
  detail?: string;
}

export function MetricCard({ to, label, value, icon: Icon, tone = 'text-primary-600', detail = 'View details' }: MetricCardProps) {
  return (
    <Link
      to={to}
      aria-label={`View ${label}: ${typeof value === 'string' || typeof value === 'number' ? value : label}`}
      className="group block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-500">
            <Icon className={`h-4 w-4 shrink-0 ${tone}`} aria-hidden="true" />
            <span>{label}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600" aria-hidden="true" />
      </div>
      <span className="mt-3 inline-flex text-xs font-medium text-primary-700">{detail}</span>
    </Link>
  );
}
