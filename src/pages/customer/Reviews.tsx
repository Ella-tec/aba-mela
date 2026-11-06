import { useTranslation } from 'react-i18next';
import { MOCK_REVIEWS } from '@/data/mock';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function CustomerReviews() {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">{t('reviews.title')}</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
        >
          {t('reviews.leaveReview')}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('reviews.rating')}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  <Star
                    className={cn(
                      'w-8 h-8 transition-colors',
                      n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('reviews.comment')}</label>
            <textarea
              rows={3}
              placeholder="Share your experience..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
              {t('reviews.submit')}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{t('reviews.yourReviews')}</h3>
        </div>
        {MOCK_REVIEWS.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('reviews.noReviews')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {MOCK_REVIEWS.map((r) => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium text-gray-900">{r.service} · {r.professional}</div>
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
                  {new Date(r.createdAt).toLocaleDateString()} · {r.bookingId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
