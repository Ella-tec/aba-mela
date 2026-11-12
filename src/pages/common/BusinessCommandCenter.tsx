import { Link, Navigate } from 'react-router-dom';
import {
  FolderKanban,
  HardHat,
  Clock3,
  DollarSign,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { getAuth } from '@/lib/auth';
import {
  MOCK_PROJECTS,
  MOCK_WORKERS,
  MOCK_TIMESHEETS,
} from '@/data/mock';

type HubSection =
  | 'overview'
  | 'projects'
  | 'workforce'
  | 'finance'
  | 'equipment'
  | 'documents'
  | 'safety'
  | 'scheduling'
  | 'analytics'
  | 'ai'
  | 'settings';

type BusinessCommandCenterProps = {
  initialSection?: HubSection;
};

function SummaryCard({
  label,
  value,
  detail,
  icon: Icon,
  href,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof FolderKanban;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="flex min-w-0 items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-orange-300 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:p-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-gray-500 sm:text-sm">
          {label}
        </span>
        <span className="mt-0.5 block text-xl font-bold tabular-nums text-gray-900 sm:text-2xl">
          {value}
        </span>
        <span className="block truncate text-xs text-gray-500">{detail}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
    </Link>
  );
}

export function BusinessCommandCenter({
  initialSection = 'overview',
}: BusinessCommandCenterProps) {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const isOrganization =
    auth.role === 'Organization' || auth.role === 'Admin';

  const base = isOrganization ? '/organization' : '/business-center';

  const activeProjects = MOCK_PROJECTS.filter(
    (project) => project.status === 'active'
  );
  const activeWorkers = MOCK_WORKERS.filter(
    (worker) => worker.status === 'active'
  );
  const pendingTimesheets = MOCK_TIMESHEETS.filter(
    (timesheet) => timesheet.status === 'pending'
  );

  const totalBudget = activeProjects.reduce(
    (total, project) => total + project.budget,
    0
  );
  const totalSpent = activeProjects.reduce(
    (total, project) => total + project.spent,
    0
  );
  const budgetUsed = totalBudget
    ? Math.round((totalSpent / totalBudget) * 100)
    : 0;

  const workspaceDetails: Record<
    Exclude<HubSection, 'overview'>,
    { title: string; description: string; href: string }
  > = {
    projects: {
      title: 'Projects',
      description: 'View projects, milestones, progress and budgets.',
      href: isOrganization ? '/organization/projects' : '/business-center/projects',
    },
    workforce: {
      title: 'Workforce',
      description: 'Manage workers, foremen, crews and certifications.',
      href: isOrganization ? '/organization/workforce' : '/business-center/workforce',
    },
    finance: {
      title: 'Finance',
      description: 'Review project budgets, costs, invoices and payments.',
      href: '/business-center/finance',
    },
    equipment: {
      title: 'Equipment',
      description: 'Manage equipment, rentals, tools and maintenance.',
      href: '/business-center/equipment',
    },
    documents: {
      title: 'Documents',
      description: 'Access project files, permits, contracts and reports.',
      href: '/business-center/documents',
    },
    safety: {
      title: 'Safety',
      description: 'Manage site safety, inspections and incident records.',
      href: '/business-center/safety',
    },
    scheduling: {
      title: 'Scheduling',
      description: 'Review crew plans, project dates and inspections.',
      href: '/business-center/scheduling',
    },
    analytics: {
      title: 'Analytics',
      description: 'Review project performance, budgets and utilization.',
      href: isOrganization ? '/organization/analytics' : '/business-center/analytics',
    },
    ai: {
      title: 'Mela AI',
      description: 'Get assistance with your Mela construction workspace.',
      href: '/business-center/ai',
    },
    settings: {
      title: 'Settings',
      description: 'Manage workspace preferences and administration.',
      href: isOrganization ? '/organization/settings' : '/customer/settings',
    },
  };

  if (initialSection !== 'overview') {
    const workspace = workspaceDetails[initialSection];

    return (
      <main className="mx-auto w-full min-w-0 max-w-6xl p-3 sm:p-5 lg:p-6">
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Mela workspace
          </p>
          <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
            {workspace.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            {workspace.description}
          </p>
          <Link
            to={workspace.href}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Open {workspace.title}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl space-y-4 p-3 sm:space-y-5 sm:p-5 lg:p-6">
      <header className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
            Mela Construction
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Construction Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            A quick view of your current construction operations.
          </p>
        </div>
        <Link
          to={isOrganization ? '/organization/projects' : '/business-center/projects'}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          View Projects
        </Link>
      </header>

      <section aria-label="Construction summary">
        <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Active projects"
            value={activeProjects.length}
            detail="Current project register"
            icon={FolderKanban}
            href={isOrganization ? '/organization/projects' : '/business-center/projects'}
          />
          <SummaryCard
            label="Workers on site"
            value={activeWorkers.length}
            detail="Active workforce records"
            icon={HardHat}
            href={isOrganization ? '/organization/workforce' : '/business-center/workforce'}
          />
          <SummaryCard
            label="Pending timesheets"
            value={pendingTimesheets.length}
            detail="Awaiting review"
            icon={Clock3}
            href={isOrganization ? '/organization/timesheets' : '/business-center/scheduling'}
          />
          <SummaryCard
            label="Budget used"
            value={`${budgetUsed}%`}
            detail="Active project budgets · demo data"
            icon={DollarSign}
            href={isOrganization ? '/organization/analytics' : '/business-center/analytics'}
          />
        </div>
      </section>

      <p className="px-1 text-xs text-gray-400">
        Sample dashboard figures are for demonstration and are not live production records.
      </p>
    </main>
  );
}
