import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_REVIEWS } from '@/data/mock';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfessionalReviews() {
  const { t } = useTranslation();
  const reviews = MOCK_REVIEWS; // in real app filter by current professional

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{t('reviews.title')}</h2>
        <Link to="/professional/reviews#reviews-list" aria-label="Jump to customer reviews" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 hover:border-primary-300">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="text-lg font-bold">{avg}</span>
          <span className="text-sm text-gray-500">({reviews.length})</span>
        </div>
      </div>

      <div id="reviews-list" className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('reviews.noReviews')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reviews.map((r) => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{r.service}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{r.comment}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
