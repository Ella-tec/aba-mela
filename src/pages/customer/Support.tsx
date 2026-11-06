import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_TICKETS, KB_ARTICLES } from '@/data/mock';
import { TicketStatusBadge } from '@/components/ui/TicketStatusBadge';
import { Plus, BookOpen, Search } from 'lucide-react';
import { useState } from 'react';

export function CustomerSupport() {
  const { t } = useTranslation();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">{t('support.title')}</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          {t('support.createTicket')}
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('support.subject')}</label>
            <input type="text" className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('support.category')}</label>
              <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Booking Issue</option>
                <option>Payment</option>
                <option>Account</option>
                <option>Technical</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('support.priority')}</label>
              <select className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('support.description')}</label>
            <textarea rows={4} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
              {t('support.submit')}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* My Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{t('support.myTickets')}</h3>
        </div>
        {MOCK_TICKETS.length === 0 ? (
          <div className="p-8 text-center text-gray-500">{t('support.noTickets')}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {MOCK_TICKETS.map((tk) => (
              <Link
                key={tk.id}
                to={`/customer/support/${tk.id}`}
                className="block px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-gray-900">{tk.subject}</div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {tk.category} · {tk.id}
                    </div>
                    {tk.lastMessage && (
                      <div className="text-sm text-gray-400 mt-1 line-clamp-1">{tk.lastMessage}</div>
                    )}
                  </div>
                  <TicketStatusBadge status={tk.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Knowledge Base */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <h3 className="font-semibold text-gray-900">{t('support.knowledgeBase')}</h3>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('support.searchHelp')}
              className="w-full ps-10 pe-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {KB_ARTICLES.map((a) => (
              <Link
                key={a.id}
                to={`/customer/help/${a.id}`}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
