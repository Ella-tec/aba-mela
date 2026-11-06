import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/data/mock';
import { useTranslation } from 'react-i18next';

const statusStyles: Record<BookingStatus, string> = {
  requested: 'bg-gray-100 text-gray-700',
  quoted: 'bg-purple-100 text-purple-700',
  accepted: 'bg-blue-100 text-blue-700',
  assigned: 'bg-indigo-100 text-indigo-700',
  onTheWay: 'bg-cyan-100 text-cyan-700',
  arrived: 'bg-teal-100 text-teal-700',
  working: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {t(`booking.status.${status}`)}
    </span>
  );
}
