import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '@/lib/auth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  ClipboardList,
  HardHat,
  Settings,
  LogOut,
  Menu,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/organization', labelKey: 'nav.overview', icon: LayoutDashboard },
  { to: '/organization/projects', labelKey: 'nav.projects', icon: FolderKanban },
  { to: '/organization/foreman', labelKey: 'nav.foreman', icon: HardHat },
  { to: '/organization/workforce', labelKey: 'nav.workforce', icon: Users },
  { to: '/organization/timesheets', labelKey: 'nav.timesheets', icon: ClipboardList },
  { to: '/organization/analytics', labelKey: 'nav.analytics', icon: BarChart3 },
];

export function OrganizationLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = getAuth();
  if (!auth) return <Navigate to='/login' replace />;
  if (auth.role !== 'Organization' && auth.role !== 'Admin') return <Navigate to={auth.role === 'Professional' ? '/professional' : '/customer'} replace />;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">{t('common.appName')}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">Construction</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {nav.map((item) => {
              const active =
                location.pathname === item.to ||
                (item.to !== '/organization' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-orange-50 text-orange-700'
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
              to="/organization/settings"
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
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {t('construction.dashboard')}
            </h1>
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
