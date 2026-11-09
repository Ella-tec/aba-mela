import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { OrganizationLayout } from '@/components/layout/OrganizationLayout';
import { AbaAssistant } from '@/components/ai/AbaAssistant';
import { HomePage } from '@/pages/public/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { CustomerDashboard } from '@/pages/customer/Dashboard';
import { CustomerBookings } from '@/pages/customer/Bookings';
import { CreateBooking } from '@/pages/customer/CreateBooking';
import { CustomerSupport } from '@/pages/customer/Support';
import { CustomerReviews } from '@/pages/customer/Reviews';
import { CustomerPayments } from '@/pages/customer/Payments';
import { CustomerTrack } from '@/pages/customer/Track';
import { HomePassport } from '@/pages/customer/HomePassport';
import { SmartMatch } from '@/pages/customer/SmartMatch';
import { ProfessionalDashboard } from '@/pages/professional/Dashboard';
import { ProfessionalJobs } from '@/pages/professional/Jobs';
import { ProfessionalVerification } from '@/pages/professional/Verification';
import { ProfessionalReviews } from '@/pages/professional/Reviews';
import { ProfessionalEarnings } from '@/pages/professional/Earnings';
import { ProfessionalMapView } from '@/pages/professional/MapView';
import { DispatchCenter } from '@/pages/professional/Dispatch';
import { OrganizationDashboard } from '@/pages/organization/Dashboard';
import { ProjectsPage } from '@/pages/organization/Projects';
import { ProjectDetail } from '@/pages/organization/ProjectDetail';
import { ForemanDashboard } from '@/pages/organization/Foreman';
import { WorkforcePage } from '@/pages/organization/Workforce';
import { TimesheetsPage } from '@/pages/organization/Timesheets';
import { AnalyticsOverview } from '@/pages/analytics/Overview';
import { SupplierDashboard } from '@/pages/supplier/Dashboard';
import { SupplierCatalog } from '@/pages/supplier/Catalog';
import { SupplierOrders } from '@/pages/supplier/Orders';
import { SupplierRentals } from '@/pages/supplier/Rentals';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
      {title} — coming soon
    </div>
  );
}

function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/customer" element={<PortalLayout type="customer" />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="bookings" element={<CustomerBookings />} />
          <Route path="create-booking" element={<CreateBooking />} />
          <Route path="find-service" element={<CreateBooking />} />
          <Route path="smart-match" element={<SmartMatch />} />
          <Route path="track" element={<CustomerTrack />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="reviews" element={<CustomerReviews />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="home-passport" element={<HomePassport />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>

        <Route path="/professional" element={<PortalLayout type="professional" />}>
          <Route index element={<ProfessionalDashboard />} />
          <Route path="jobs" element={<ProfessionalJobs />} />
          <Route path="hot-jobs" element={<ProfessionalJobs hotOnly />} />
          <Route path="my-jobs" element={<ProfessionalJobs />} />
          <Route path="map" element={<ProfessionalMapView />} />
          <Route path="dispatch" element={<DispatchCenter />} />
          <Route path="earnings" element={<ProfessionalEarnings />} />
          <Route path="calendar" element={<Placeholder title="Calendar" />} />
          <Route path="verification" element={<ProfessionalVerification />} />
          <Route path="reviews" element={<ProfessionalReviews />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>

        <Route path="/organization" element={<OrganizationLayout />}>
          <Route index element={<OrganizationDashboard />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="foreman" element={<ForemanDashboard />} />
          <Route path="workforce" element={<WorkforcePage />} />
          <Route path="timesheets" element={<TimesheetsPage />} />
          <Route path="analytics" element={<AnalyticsOverview />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>

        <Route path="/suppliers" element={<SupplierLayout><SupplierDashboard /></SupplierLayout>} />
        <Route path="/suppliers/catalog" element={<SupplierLayout><SupplierCatalog /></SupplierLayout>} />
        <Route path="/suppliers/orders" element={<SupplierLayout><SupplierOrders /></SupplierLayout>} />
        <Route path="/suppliers/rentals" element={<SupplierLayout><SupplierRentals /></SupplierLayout>} />

        <Route path="/admin/*" element={<PublicLayout><div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-2xl font-bold">Admin Platform</h1></div></PublicLayout>} />

        {/* Keep unknown/deep links from rendering an empty page. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AbaAssistant />
    </BrowserRouter>
  );
}
