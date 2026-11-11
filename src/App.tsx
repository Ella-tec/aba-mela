import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
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
import { RecordDetailPage } from '@/pages/customer/RecordDetail';
import { ProfessionalDashboard } from '@/pages/professional/Dashboard';
import { ProfessionalJobs } from '@/pages/professional/Jobs';
import { BusinessCenter } from '@/pages/professional/BusinessCenter';
import { ProfessionalVerification } from '@/pages/professional/Verification';
import { ProfessionalReviews } from '@/pages/professional/Reviews';
import { ProfessionalEarnings } from '@/pages/professional/Earnings';
import { ProfessionalMapView } from '@/pages/professional/MapView';
import { DispatchCenter } from '@/pages/professional/Dispatch';
import { CalendarPage } from '@/pages/professional/Calendar';
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
import { SettingsPage } from '@/pages/common/SettingsPage';
import { RecycleBinPage } from '@/pages/common/RecycleBin';
import { BusinessCommandCenter } from '@/pages/common/BusinessCommandCenter';
import { getAuth } from '@/lib/auth';

function PublicLayout({children}:{children:React.ReactNode}) {
 return <div className="flex min-h-screen flex-col"><a href="#main-content" className="sr-only z-50 rounded bg-white p-3 text-primary-800 focus:not-sr-only focus:absolute focus:start-4 focus:top-4">Skip to main content</a><Header/><main id="main-content" className="flex-1 mela-page-backdrop">{children}</main></div>;
}
function SupplierLayout({children}:{children:React.ReactNode}) {
 return <PublicLayout><div className="mx-auto max-w-6xl px-4 py-8">{children}</div></PublicLayout>;
}
function AdminLanding() {
 const auth=getAuth();
 if(!auth)return <Navigate to="/login" replace/>;
 if(auth.role!=='Admin')return <Navigate to={auth.role==='Organization'?'/organization':auth.role==='Professional'?'/professional':'/customer'} replace/>;
 return <PublicLayout><div className="mx-auto max-w-7xl space-y-5 px-4 py-10"><div><h1 className="text-2xl font-bold text-gray-900">Mela administration</h1><p className="mt-1 text-sm text-gray-500">Platform oversight and operational reports.</p></div><AnalyticsOverview/></div></PublicLayout>;
}
function NotFoundPage() {
 return <PublicLayout><div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-3xl font-bold text-gray-900">Page not found</h1><p className="mt-2 text-gray-600">This Mela page does not exist or may have moved.</p><Link to="/" className="mt-6 inline-flex rounded-lg bg-primary-700 px-5 py-2.5 font-semibold text-white hover:bg-primary-800">Return home</Link></div></PublicLayout>;
}
export default function App() {
 useEffect(() => {
  const root = document.documentElement;
  root.dataset.reduceMotion = localStorage.getItem('mela-pref-motion') === 'true' ? 'true' : 'false';
  root.dataset.theme = localStorage.getItem('mela-pref-dark') === 'true' ? 'dark' : 'light';
  root.dataset.highContrast = localStorage.getItem('mela-pref-contrast') === 'true' ? 'true' : 'false';
  root.dataset.fontSize = localStorage.getItem('mela-pref-font') || 'medium';
 }, []);
 return <BrowserRouter><Routes>
  <Route path="/" element={<PublicLayout><HomePage/></PublicLayout>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/services/:service" element={<RegisterPage/>}/>
  <Route path="/professionals" element={<Navigate to="/register?type=professional" replace/>}/>
  <Route path="/how-it-works" element={<Navigate to="/#how-it-works" replace/>}/>
  <Route path="/customer" element={<PortalLayout type="customer"/>}>
   <Route index element={<CustomerDashboard/>}/>
   <Route path="bookings" element={<CustomerBookings/>}/>
   <Route path="bookings/:id" element={<RecordDetailPage kind="booking"/>}/>
   <Route path="create-booking" element={<CreateBooking/>}/>
   <Route path="find-service" element={<CreateBooking/>}/>
   <Route path="smart-match" element={<SmartMatch/>}/>
   <Route path="track" element={<CustomerTrack/>}/>
   <Route path="payments" element={<CustomerPayments/>}/>
   <Route path="reviews" element={<CustomerReviews/>}/>
   <Route path="support" element={<CustomerSupport/>}/>
   <Route path="support/:id" element={<RecordDetailPage kind="ticket"/>}/>
   <Route path="help/:id" element={<RecordDetailPage kind="article"/>}/>
   <Route path="home-passport" element={<HomePassport/>}/>
   <Route path="settings" element={<SettingsPage/>}/>
   <Route path="recycle-bin" element={<RecycleBinPage/>}/>
  </Route>
  <Route path="/professional" element={<PortalLayout type="professional"/>}>
   <Route index element={<ProfessionalDashboard/>}/>
   <Route path="jobs" element={<ProfessionalJobs/>}/>
   <Route path="hot-jobs" element={<ProfessionalJobs hotOnly/>}/>
   <Route path="my-jobs" element={<ProfessionalJobs myJobs/>}/>
   <Route path="map" element={<ProfessionalMapView/>}/>
   <Route path="dispatch" element={<DispatchCenter/>}/>
   <Route path="earnings" element={<ProfessionalEarnings/>}/>
   <Route path="business-center" element={<BusinessCenter/>}/>
   <Route path="calendar" element={<CalendarPage/>}/>
   <Route path="verification" element={<ProfessionalVerification/>}/>
   <Route path="reviews" element={<ProfessionalReviews/>}/>
   <Route path="settings" element={<SettingsPage/>}/>
   <Route path="recycle-bin" element={<RecycleBinPage/>}/>
  </Route>
  <Route path="/organization" element={<OrganizationLayout/>}>
   <Route index element={<OrganizationDashboard/>}/>
   <Route path="projects" element={<ProjectsPage/>}/>
   <Route path="projects/:id" element={<ProjectDetail/>}/>
   <Route path="foreman" element={<ForemanDashboard/>}/>
   <Route path="workforce" element={<WorkforcePage/>}/>
   <Route path="timesheets" element={<TimesheetsPage/>}/>
   <Route path="analytics" element={<AnalyticsOverview/>}/>
   <Route path="settings" element={<SettingsPage/>}/>
   <Route path="recycle-bin" element={<RecycleBinPage/>}/>
  </Route>
  <Route path="/business-center" element={<BusinessCommandCenter/>}/>
  <Route path="/business-center/projects" element={<BusinessCommandCenter initialSection="projects"/>}/>
  <Route path="/business-center/finance" element={<BusinessCommandCenter initialSection="finance"/>}/>
  <Route path="/business-center/equipment" element={<BusinessCommandCenter initialSection="equipment"/>}/>
  <Route path="/business-center/documents" element={<BusinessCommandCenter initialSection="documents"/>}/>
  <Route path="/business-center/safety" element={<BusinessCommandCenter initialSection="safety"/>}/>
  <Route path="/business-center/scheduling" element={<BusinessCommandCenter initialSection="scheduling"/>}/>
  <Route path="/business-center/ai" element={<BusinessCommandCenter initialSection="ai"/>}/>
  <Route path="/suppliers" element={<SupplierLayout><SupplierDashboard/></SupplierLayout>}/>
  <Route path="/suppliers/catalog" element={<SupplierLayout><SupplierCatalog/></SupplierLayout>}/>
  <Route path="/suppliers/orders" element={<SupplierLayout><SupplierOrders/></SupplierLayout>}/>
  <Route path="/suppliers/rentals" element={<SupplierLayout><SupplierRentals/></SupplierLayout>}/>
  <Route path="/admin/*" element={<AdminLanding/>}/>
  <Route path="*" element={<NotFoundPage/>}/>
 </Routes><AbaAssistant/></BrowserRouter>;
}
