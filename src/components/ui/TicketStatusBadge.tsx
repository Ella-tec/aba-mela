import { cn } from '@/lib/utils';
import type { TicketStatus } from '@/data/mock';
import { useTranslation } from 'react-i18next';

const styles: Record<TicketStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  triaged: 'bg-indigo-100 text-indigo-700',
  assigned: 'bg-purple-100 text-purple-700',
  inProgress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-600',
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { t } = useTranslation();
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', styles[status])}>
      {t(`support.status.${status}`)}
    </span>
  );
}
