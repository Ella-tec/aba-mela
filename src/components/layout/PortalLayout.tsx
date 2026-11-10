import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Wallet,
  Settings,
  LogOut,
  Menu,
  Wrench,
  Flame,
  ClipboardList,
  Search,
  MessageSquare,
  Star,
  ShieldCheck,
  HeadphonesIcon,
  Map,
  Radio,
  Home,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type PortalType = 'customer' | 'professional';

interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const customerNav: NavItem[] = [
  { to: '/customer', labelKey: 'nav.overview', icon: LayoutDashboard },
  { to: '/customer/find-service', labelKey: 'nav.findService', icon: Search },
  { to: '/customer/smart-match', labelKey: 'nav.findProfessionals', icon: Sparkles },
  { to: '/customer/bookings', labelKey: 'nav.myBookings', icon: ClipboardList },
  { to: '/customer/create-booking', labelKey: 'nav.createBooking', icon: Calendar },
  { to: '/customer/track', labelKey: 'nav.liveMap', icon: Map },
  { to: '/customer/payments', labelKey: 'nav.payments', icon: Wallet },
  { to: '/customer/reviews', labelKey: 'nav.reviews', icon: Star },
  { to: '/customer/support', labelKey: 'nav.support', icon: HeadphonesIcon },
  { to: '/customer/home-passport', labelKey: 'nav.home', icon: Home },
];

const professionalNav: NavItem[] = [
  { to: '/professional', labelKey: 'nav.overview', icon: LayoutDashboard },
  { to: '/professional/jobs', labelKey: 'nav.availableJobs', icon: Briefcase },
  { to: '/professional/hot-jobs', labelKey: 'nav.hotJobs', icon: Flame },
  { to: '/professional/my-jobs', labelKey: 'nav.myJobs', icon: Wrench },
  { to: '/professional/map', labelKey: 'nav.liveMap', icon: Map },
  { to: '/professional/dispatch', labelKey: 'nav.dispatch', icon: Radio },
  { to: '/professional/earnings', labelKey: 'nav.earnings', icon: Wallet },
  { to: '/professional/calendar', labelKey: 'nav.calendar', icon: Calendar },
  { to: '/professional/verification', labelKey: 'nav.verification', icon: ShieldCheck },
  { to: '/professional/reviews', labelKey: 'nav.reviews', icon: Star },
];

export function PortalLayout({ type }: { type: PortalType }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = getAuth();
  const expectedRole = type === 'customer' ? 'Customer' : 'Professional';

  if (!auth) return <Navigate to='/login' replace />;

  // Existing local developer accounts are not a separate customer type in
  // the API yet. Give them the customer portal rather than redirecting
  // /customer back to /customer indefinitely and rendering a blank screen.
  const developerUsesCustomerPortal =
    type === 'customer' && auth.role === 'Developer';

  if (
    auth.role !== expectedRole &&
    auth.role !== 'Admin' &&
    !developerUsesCustomerPortal
  ) {
    const destination =
      auth.role === 'Organization' ? '/organization'
        : auth.role === 'Professional' ? '/professional'
        : '/customer';

    if (destination === location.pathname) {
      return <Navigate to='/login' replace />;
    }

    return <Navigate to={destination} replace />;
  }

  const nav = type === 'customer' ? customerNav : professionalNav;
  const title =
    type === 'customer' ? t('customer.dashboard') : t('professional.dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-30 w-64 bg-white border-e border-gray-200 transform transition-transform duration-200 lg:translate-x-0 lg:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-5 h-16 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-bold text-lg">{t('common.appName')}</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {nav.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to !== `/${type}` && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-100 p-3 space-y-1">
            <Link
              to={`/${type}/settings`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
              {t('common.settings')}
            </Link>
            <button type="button" onClick={() => { logout(); navigate('/login', { replace: true }); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              <LogOut className="w-5 h-5" />{t('common.logout')}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
