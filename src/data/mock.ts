export type BookingStatus =
  | 'requested'
  | 'quoted'
  | 'accepted'
  | 'assigned'
  | 'onTheWay'
  | 'arrived'
  | 'working'
  | 'completed'
  | 'cancelled';

export type TicketStatus = 'new' | 'triaged' | 'assigned' | 'inProgress' | 'resolved' | 'closed';
export type VerificationStatus = 'notStarted' | 'pending' | 'approved' | 'rejected' | 'expired';

export interface Booking {
  id: string;
  service: string;
  serviceKey: string;
  status: BookingStatus;
  professional?: string;
  address: string;
  scheduledAt: string;
  price?: number;
  notes?: string;
}

export interface Job {
  id: string;
  service: string;
  serviceKey: string;
  status: BookingStatus;
  customer: string;
  address: string;
  scheduledAt: string;
  price: number;
  isHot?: boolean;
  distanceMiles?: number;
}

export interface Review {
  id: string;
  bookingId: string;
  service: string;
  professional: string;
  rating: number;
  comment: string;
  createdAt: string;
  from: 'customer' | 'professional';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  lastMessage?: string;
}

export interface VerificationItem {
  id: string;
  type: string;
  label: string;
  status: VerificationStatus;
  submittedAt?: string;
  notes?: string;
}

export const SERVICES = [
  { key: 'plumbing', icon: 'Wrench' },
  { key: 'electrical', icon: 'Zap' },
  { key: 'painting', icon: 'Paintbrush' },
  { key: 'cleaning', icon: 'Sparkles' },
  { key: 'carpentry', icon: 'Hammer' },
  { key: 'hvac', icon: 'Wind' },
  { key: 'masonry', icon: 'BrickWall' },
  { key: 'roofing', icon: 'Home' },
  { key: 'tiling', icon: 'Grid3x3' },
  { key: 'appliance', icon: 'Refrigerator' },
  { key: 'pest', icon: 'Bug' },
  { key: 'landscaping', icon: 'Trees' },
  { key: 'fiber-installation', icon: 'Cable' },
  { key: 'fiber-repair', icon: 'Cable' },
  { key: 'cctv-installation', icon: 'Camera' },
  { key: 'security-camera-installation', icon: 'Camera' },
  { key: 'access-control', icon: 'ShieldCheck' },
  { key: 'alarm-systems', icon: 'Bell' },
  { key: 'structured-cabling', icon: 'Network' },
  { key: 'network-cabling', icon: 'Wifi' },
  { key: 'intercom-systems', icon: 'Monitor' },
  { key: 'audio-video-installation', icon: 'Monitor' },
  { key: 'smart-home-installation', icon: 'ShieldCheck' },
  { key: 'low-voltage-troubleshooting', icon: 'Cable' },
  { key: 'gate-automation', icon: 'Cog' },
  { key: 'flooring', icon: 'Wrench' },
  { key: 'drywall', icon: 'Wrench' },
  { key: 'windows', icon: 'Wrench' },
  { key: 'fencing', icon: 'Wrench' },
  { key: 'insulation', icon: 'Wrench' },
  { key: 'solar', icon: 'Wrench' },
  { key: 'moving', icon: 'Wrench' },
  { key: 'remodeling', icon: 'Wrench' },
  { key: 'welding', icon: 'Wrench' },
  { key: 'concrete', icon: 'Wrench' },
] as const;

// All people, prices, reviews, properties and job records below are fictional demo content.
export const MOCK_CUSTOMER_BOOKINGS: Booking[] = [
  {
    id: 'BK-1001',
    service: 'Plumbing',
    serviceKey: 'plumbing',
    status: 'onTheWay',
    professional: 'Demo Pro One',
    address: 'Brookside, Kansas City, MO',
    scheduledAt: '2026-11-02T14:30:00',
    price: 145,
    notes: 'Kitchen sink leak',
  },
  {
    id: 'BK-1002',
    service: 'Electrical',
    serviceKey: 'electrical',
    status: 'completed',
    professional: 'Demo Pro Two',
    address: 'Crossroads Arts District, Kansas City, MO',
    scheduledAt: '2026-10-28T10:00:00',
    price: 185,
  },
  {
    id: 'BK-1003',
    service: 'Cleaning',
    serviceKey: 'cleaning',
    status: 'requested',
    address: 'Overland Park, KS',
    scheduledAt: '2026-11-05T09:00:00',
    notes: 'Deep clean 3-bedroom apartment',
  },
  {
    id: 'BK-1004',
    service: 'Painting',
    serviceKey: 'painting',
    status: 'quoted',
    professional: 'Demo Pro Three',
    address: 'Waldo, Kansas City, MO',
    scheduledAt: '2026-11-08T08:00:00',
    price: 8.50,
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'JB-2001',
    service: 'Plumbing',
    serviceKey: 'plumbing',
    status: 'requested',
    customer: 'Hanna M.',
    address: 'Brookside, Kansas City, MO',
    scheduledAt: '2026-11-02T15:00:00',
    price: 165,
    isHot: true,
    distanceMiles: 1.5,
  },
  {
    id: 'JB-2002',
    service: 'Electrical',
    serviceKey: 'electrical',
    status: 'requested',
    customer: 'Daniel G.',
    address: 'Crossroads Arts District, Kansas City, MO',
    scheduledAt: '2026-11-02T16:30:00',
    price: 225,
    isHot: true,
    distanceMiles: 3.2,
  },
  {
    id: 'JB-2003',
    service: 'Cleaning',
    serviceKey: 'cleaning',
    status: 'requested',
    customer: 'Marta A.',
    address: 'Lee’s Summit, MO',
    scheduledAt: '2026-11-03T09:00:00',
    price: 125,
    isHot: true,
    distanceMiles: 2.4,
  },
  {
    id: 'JB-2004',
    service: 'HVAC',
    serviceKey: 'hvac',
    status: 'assigned',
    customer: 'Office Park Ltd',
    address: 'Overland Park, KS',
    scheduledAt: '2026-11-02T11:00:00',
    price: 395,
    distanceMiles: 0.7,
  },
  { id: 'JB-2005', service: 'Roofing', serviceKey: 'roofing', status: 'requested', customer: 'Priya S.', address: 'Plaza, Kansas City, MO', scheduledAt: '2026-11-12T08:30:00', price: 680, isHot: true, distanceMiles: 2.1 },
  { id: 'JB-2006', service: 'Carpentry', serviceKey: 'carpentry', status: 'requested', customer: 'Marcus T.', address: 'Waldo, Kansas City, MO', scheduledAt: '2026-11-12T10:00:00', price: 340, isHot: true, distanceMiles: 3.4 },
  { id: 'JB-2007', service: 'Painting', serviceKey: 'painting', status: 'requested', customer: 'Elena R.', address: 'Prairie Village, KS', scheduledAt: '2026-11-13T09:00:00', price: 520, distanceMiles: 4.8 },
  { id: 'JB-2008', service: 'Landscaping', serviceKey: 'landscaping', status: 'requested', customer: 'Jordan B.', address: 'North Kansas City, MO', scheduledAt: '2026-11-13T11:00:00', price: 275, distanceMiles: 5.2 },
  { id: 'JB-2009', service: 'Masonry', serviceKey: 'masonry', status: 'requested', customer: 'Cameron W.', address: 'Independence, MO', scheduledAt: '2026-11-14T08:00:00', price: 890, distanceMiles: 6.1 },
  { id: 'JB-2010', service: 'Appliance Repair', serviceKey: 'appliance', status: 'requested', customer: 'Nadia K.', address: 'River Market, Kansas City, MO', scheduledAt: '2026-11-14T13:30:00', price: 195, distanceMiles: 1.8 },
  { id: 'JB-2011', service: 'Pest Control', serviceKey: 'pest', status: 'requested', customer: 'Samuel D.', address: 'Liberty, MO', scheduledAt: '2026-11-15T09:30:00', price: 160, distanceMiles: 7.3 },
  { id: 'JB-2012', service: 'Tile Installation', serviceKey: 'tiling', status: 'requested', customer: 'Olivia P.', address: 'Lee’s Summit, MO', scheduledAt: '2026-11-15T12:00:00', price: 740, distanceMiles: 8.2 },
  { id: 'JB-2013', service: 'HVAC Maintenance', serviceKey: 'hvac', status: 'requested', customer: 'Heartland Retail (demo)', address: 'Overland Park, KS', scheduledAt: '2026-11-16T08:00:00', price: 310, distanceMiles: 4.5 },
  { id: 'JB-2014', service: 'Deep Cleaning', serviceKey: 'cleaning', status: 'requested', customer: 'Avery L.', address: 'Brookside, Kansas City, MO', scheduledAt: '2026-11-16T14:00:00', price: 225, distanceMiles: 2.6 },
  { id: 'JB-2015', service: 'Emergency Plumbing', serviceKey: 'plumbing', status: 'requested', customer: 'Taylor R.', address: 'Westport, Kansas City, MO', scheduledAt: '2026-11-11T08:00:00', price: 285, isHot: true, distanceMiles: 1.1 },
  { id: 'JB-2016', service: 'Electrical Panel Check', serviceKey: 'electrical', status: 'requested', customer: 'Morgan P.', address: 'Mission Hills, KS', scheduledAt: '2026-11-11T10:30:00', price: 410, isHot: true, distanceMiles: 3.8 },
  { id: 'JB-2017', service: 'Roof Leak Repair', serviceKey: 'roofing', status: 'requested', customer: 'Casey D.', address: 'Roeland Park, KS', scheduledAt: '2026-11-11T13:00:00', price: 560, isHot: true, distanceMiles: 4.2 },
  { id: 'JB-2018', service: 'HVAC Tune-up', serviceKey: 'hvac', status: 'requested', customer: 'Jamie K.', address: 'Downtown Kansas City, MO', scheduledAt: '2026-11-12T09:00:00', price: 195, distanceMiles: 2.0 },
  { id: 'JB-2019', service: 'Fence Repair', serviceKey: 'carpentry', status: 'requested', customer: 'Robin S.', address: 'Gladstone, MO', scheduledAt: '2026-11-12T14:00:00', price: 325, distanceMiles: 6.4 },
  { id: 'JB-2020', service: 'Move-out Cleaning', serviceKey: 'cleaning', status: 'requested', customer: 'Alex N.', address: 'West Plaza, Kansas City, MO', scheduledAt: '2026-11-13T08:30:00', price: 245, distanceMiles: 2.7 },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'RV-01',
    bookingId: 'BK-1002',
    service: 'Electrical',
    professional: 'Demo Pro Two',
    rating: 5,
    comment: 'Excellent work, fixed the issue quickly and cleaned up after.',
    createdAt: '2026-10-28T18:00:00',
    from: 'customer',
  },
  {
    id: 'RV-02',
    bookingId: 'BK-0990',
    service: 'Plumbing',
    professional: 'Demo Pro One',
    rating: 4,
    comment: 'Good service, arrived on time.',
    createdAt: '2026-10-20T12:00:00',
    from: 'customer',
  },
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 'TK-501',
    subject: 'Technician did not arrive',
    category: 'Booking Issue',
    status: 'inProgress',
    priority: 'high',
    createdAt: '2026-11-01T09:15:00',
    updatedAt: '2026-11-02T11:00:00',
    lastMessage: 'We are contacting the technician now.',
  },
  {
    id: 'TK-502',
    subject: 'Request refund for cancelled job',
    category: 'Payment',
    status: 'triaged',
    priority: 'medium',
    createdAt: '2026-10-30T14:20:00',
    updatedAt: '2026-10-31T10:00:00',
    lastMessage: 'Refund request received.',
  },
  {
    id: 'TK-503',
    subject: 'How to update my address',
    category: 'Account',
    status: 'resolved',
    priority: 'low',
    createdAt: '2026-10-25T08:00:00',
    updatedAt: '2026-10-25T16:30:00',
    lastMessage: 'You can update it under Settings → Profile.',
  },
];

export const MOCK_VERIFICATION: VerificationItem[] = [
  {
    id: 'VF-1',
    type: 'identity',
    label: 'National ID / Passport',
    status: 'approved',
    submittedAt: '2026-09-15T10:00:00',
  },
  {
    id: 'VF-2',
    type: 'license',
    label: 'Trade License / Certificate',
    status: 'pending',
    submittedAt: '2026-10-28T14:30:00',
    notes: 'Under review by verification team',
  },
  {
    id: 'VF-3',
    type: 'skills',
    label: 'Skills Assessment',
    status: 'notStarted',
  },
  {
    id: 'VF-4',
    type: 'background',
    label: 'Background Check',
    status: 'notStarted',
  },
];

export const KB_ARTICLES = [
  { id: 'kb-1', title: 'How to book a service', category: 'Getting Started' },
  { id: 'kb-2', title: 'How payments work', category: 'Payments' },
  { id: 'kb-3', title: 'Cancellation and refund policy', category: 'Policies' },
  { id: 'kb-4', title: 'Technician verification process', category: 'Trust & Safety' },
  { id: 'kb-5', title: 'How to leave a review', category: 'Reviews' },
  { id: 'kb-6', title: 'Hot Jobs explained', category: 'Professionals' },
];

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface Quote {
  id: string;
  bookingId: string;
  professional: string;
  amount: number;
  notes?: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface Payment {
  id: string;
  bookingId: string;
  service: string;
  amount: number;
  status: PaymentStatus;
  method?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: PayoutStatus;
  method: string;
  period: string;
  createdAt: string;
  paidAt?: string;
}

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'QT-301',
    bookingId: 'BK-1004',
    professional: 'Demo Pro Three',
    amount: 4500,
    notes: 'Includes materials and 2 days labor',
    validUntil: '2026-11-10T23:59:00',
    status: 'pending',
  },
  {
    id: 'QT-302',
    bookingId: 'BK-1004',
    professional: 'Demo Pro Six',
    amount: 4200,
    notes: 'Labor only, customer supplies paint',
    validUntil: '2026-11-09T23:59:00',
    status: 'pending',
  },
  {
    id: 'QT-303',
    bookingId: 'BK-1001',
    professional: 'Demo Pro One',
    amount: 185,
    status: 'accepted',
    validUntil: '2026-11-03T23:59:00',
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'PAY-401',
    bookingId: 'BK-1002',
    service: 'Electrical',
    amount: 185,
    status: 'paid',
    method: 'Card (demo)',
    createdAt: '2026-10-28T11:00:00',
    paidAt: '2026-10-28T11:05:00',
  },
  {
    id: 'PAY-402',
    bookingId: 'BK-1001',
    service: 'Plumbing',
    amount: 185,
    status: 'pending',
    createdAt: '2026-11-02T14:00:00',
  },
  {
    id: 'PAY-403',
    bookingId: 'BK-0980',
    service: 'Cleaning',
    amount: 120,
    status: 'refunded',
    method: 'Card (demo)',
    createdAt: '2026-10-15T09:00:00',
    paidAt: '2026-10-15T09:10:00',
  },
];

export const MOCK_PAYOUTS: Payout[] = [
  {
    id: 'PO-501',
    amount: 1850,
    status: 'paid',
    method: 'Card (demo)',
    period: 'Oct 2026 (Week 4)',
    createdAt: '2026-10-28T00:00:00',
    paidAt: '2026-10-29T14:00:00',
  },
  {
    id: 'PO-502',
    amount: 1450,
    status: 'processing',
    method: 'Bank Transfer',
    period: 'Nov 2026 (Week 1)',
    createdAt: '2026-11-02T00:00:00',
  },
  {
    id: 'PO-503',
    amount: 750,
    status: 'pending',
    method: 'Card (demo)',
    period: 'Nov 2026 (Week 1)',
    createdAt: '2026-11-02T12:00:00',
  },
];

export const MOCK_EARNINGS_SUMMARY = {
  today: 520,
  thisWeek: 1850,
  thisMonth: 7200,
  pendingPayout: 1900,
  availableBalance: 750,
};

export type TechStatus = 'available' | 'busy' | 'onTheWay' | 'working' | 'offline';

export interface MapTechnician {
  id: string;
  name: string;
  service: string;
  status: TechStatus;
  lat: number;
  lng: number;
  rating: number;
  distanceMiles?: number;
}

export interface MapJob {
  id: string;
  service: string;
  customer: string;
  address: string;
  lat: number;
  lng: number;
  status: BookingStatus;
  isHot?: boolean;
  techId?: string;
}

export interface DemoProfessionalProfile {
  id: string;
  name: string;
  serviceKey: string;
  service: string;
  specialty: string;
  experience: string;
  profileType: 'Sample profile';
}

// Fictional directory examples for layout testing only. These are not verified or bookable providers.
// Fictional directory examples for layout and workflow testing only. These are not verified or bookable providers.
export const MOCK_PROFESSIONAL_DIRECTORY: DemoProfessionalProfile[] = [
  { id:'DP-01', name:"Alejandro Rivera", serviceKey:'plumbing', service:"Plumbing", specialty:"Leak detection, fixtures & drain repairs", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-02', name:"Mei Chen", serviceKey:'plumbing', service:"Plumbing", specialty:"Water heaters & residential pipework", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-03', name:"Priya Nair", serviceKey:'electrical', service:"Electrical", specialty:"Lighting, outlets & troubleshooting", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-04', name:"Luka Petrov", serviceKey:'electrical', service:"Electrical", specialty:"Residential wiring & panel projects", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-05', name:"Amara Okafor", serviceKey:'cleaning', service:"Cleaning", specialty:"Deep cleaning & move-in / move-out", experience:'5 years', profileType:'Sample profile' },
  { id:'DP-06', name:"Sofia Rossi", serviceKey:'cleaning', service:"Cleaning", specialty:"Residential and office maintenance", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-07', name:"Hana Suzuki", serviceKey:'painting', service:"Painting", specialty:"Interior finishes & surface preparation", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-08', name:"Mateusz Kowalski", serviceKey:'painting', service:"Painting", specialty:"Exterior coatings & detailed trim work", experience:'10 years', profileType:'Sample profile' },
  { id:'DP-09', name:"Diego Santos", serviceKey:'carpentry', service:"Carpentry", specialty:"Finish carpentry, doors & custom trim", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-10', name:"Anika Sharma", serviceKey:'carpentry', service:"Carpentry", specialty:"Framing, cabinetry & wood repairs", experience:'10 years', profileType:'Sample profile' },
  { id:'DP-11', name:"Ravi Patel", serviceKey:'hvac', service:"HVAC", specialty:"Heating, cooling & seasonal maintenance", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-12', name:"Ingrid Larsen", serviceKey:'hvac', service:"HVAC", specialty:"Airflow, thermostats & system diagnostics", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-13', name:"Omar Haddad", serviceKey:'roofing', service:"Roofing", specialty:"Shingle systems, flashing & leak repairs", experience:'11 years', profileType:'Sample profile' },
  { id:'DP-14', name:"Claire Dubois", serviceKey:'roofing', service:"Roofing", specialty:"Roof inspections & replacement projects", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-15', name:"Kwame Mensah", serviceKey:'landscaping', service:"Landscaping", specialty:"Planting, garden layouts & lawn care", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-16', name:"Elena Ivanova", serviceKey:'landscaping', service:"Landscaping", specialty:"Outdoor maintenance & landscape installs", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-17', name:"Andres Costa", serviceKey:'masonry', service:"Masonry", specialty:"Brick, block and stone restoration", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-18', name:"Yuki Tanaka", serviceKey:'masonry', service:"Masonry", specialty:"Concrete finishing and masonry repairs", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-19', name:"Fatima Zahra", serviceKey:'tiling', service:"Tile installation", specialty:"Floor and wall tile installation", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-20', name:"Tomasz Nowak", serviceKey:'tiling', service:"Tile installation", specialty:"Grout repair and waterproofing details", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-21', name:"Nikhil Rao", serviceKey:'appliance', service:"Appliance repair", specialty:"Kitchen and laundry appliance diagnostics", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-22', name:"Isabella Romano", serviceKey:'appliance', service:"Appliance repair", specialty:"Washer, dryer and refrigerator repairs", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-23', name:"Chinedu Eze", serviceKey:'pest', service:"Pest control", specialty:"Integrated pest prevention", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-24', name:"Mila Jovanovic", serviceKey:'pest', service:"Pest control", specialty:"Residential pest inspection and treatment", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-25', name:"Gabriel Costa", serviceKey:'fiber-installation', service:"Fiber installation", specialty:"FTTH drops, conduit and fiber deployment", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-26', name:"Linh Nguyen", serviceKey:'fiber-installation', service:"Fiber installation", specialty:"Indoor fiber routing and termination", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-27', name:"Arjun Mehta", serviceKey:'fiber-repair', service:"Fiber optic repair", specialty:"Fiber fault isolation and restoration", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-28', name:"Petra Novak", serviceKey:'fiber-repair', service:"Fiber optic repair", specialty:"OTDR testing and optical loss troubleshooting", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-29', name:"Santiago Morales", serviceKey:'cctv-installation', service:"CCTV camera installation", specialty:"IP cameras, NVR setup and remote viewing", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-30', name:"Zara Ahmed", serviceKey:'cctv-installation', service:"CCTV camera installation", specialty:"Residential and commercial camera layouts", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-31', name:"Emmanuel Diallo", serviceKey:'security-camera-installation', service:"Security camera systems", specialty:"PoE camera systems and recorder configuration", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-32', name:"Chiara Bianchi", serviceKey:'security-camera-installation', service:"Security camera systems", specialty:"Camera positioning and system commissioning", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-33', name:"Viktor Sokolov", serviceKey:'access-control', service:"Access control systems", specialty:"Card readers, keypads and door controllers", experience:'10 years', profileType:'Sample profile' },
  { id:'DP-34', name:"Aisha Bello", serviceKey:'access-control', service:"Access control systems", specialty:"Electronic locks and access permissions", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-35', name:"Rohan Desai", serviceKey:'alarm-systems', service:"Alarm systems", specialty:"Intrusion alarms and sensor installation", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-36', name:"Eva Schneider", serviceKey:'alarm-systems', service:"Alarm systems", specialty:"Alarm panels and system testing", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-37', name:"Darius Johnson", serviceKey:'structured-cabling', service:"Structured cabling", specialty:"Cat6, patch panels and rack organization", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-38', name:"Camila Ferreira", serviceKey:'structured-cabling', service:"Structured cabling", specialty:"Commercial structured cabling", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-39', name:"Wei Zhang", serviceKey:'network-cabling', service:"Network and data cabling", specialty:"Ethernet runs and network cabinet setup", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-40', name:"Marek Zielinski", serviceKey:'network-cabling', service:"Network and data cabling", specialty:"Data cabling certification and repair", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-41', name:"Leila Mansour", serviceKey:'intercom-systems', service:"Intercom systems", specialty:"Video intercoms and entry stations", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-42', name:"Andrei Popescu", serviceKey:'intercom-systems', service:"Intercom systems", specialty:"Multi-unit intercom installation", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-43', name:"Noah Williams", serviceKey:'audio-video-installation', service:"Audio/video installation", specialty:"Conference-room AV and display systems", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-44', name:"Saanvi Kapoor", serviceKey:'audio-video-installation', service:"Audio/video installation", specialty:"Home theater and audio integration", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-45', name:"Theo Martin", serviceKey:'smart-home-installation', service:"Smart-home installation", specialty:"Smart switches, hubs and device integration", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-46', name:"Yara Haddad", serviceKey:'smart-home-installation', service:"Smart-home installation", specialty:"Connected home setup and automation", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-47', name:"Kofi Boateng", serviceKey:'low-voltage-troubleshooting', service:"Low-voltage troubleshooting", specialty:"Low-voltage diagnostics and cable tracing", experience:'10 years', profileType:'Sample profile' },
  { id:'DP-48', name:"Elisa Conti", serviceKey:'low-voltage-troubleshooting', service:"Low-voltage troubleshooting", specialty:"Signal testing and system fault repair", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-49', name:"Matt Wolf", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Fusion splicing, single-mode and multi-mode fiber", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-50', name:"Riley Sims", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"FTTH fusion splicing and fiber closures", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-51', name:"Tylor Smith", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"OSP fiber splicing and restoration", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-52', name:"Taylor Schelstar", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Fiber-optic splicing and termination", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-53', name:"Bradon Ergton", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Fiber joint closures and splice trays", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-54', name:"Lucas Stickny", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Fiber splicing, testing and documentation", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-55', name:"Own Stkeny", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Inside-plant fiber splicing", experience:'6 years', profileType:'Sample profile' },
  { id:'DP-56', name:"John Patric", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Outside-plant fiber splicing", experience:'10 years', profileType:'Sample profile' },
  { id:'DP-57', name:"Nick Stckeney", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Fiber splicing and OTDR troubleshooting", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-58', name:"Jordan Willes", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"Ribbon fiber splicing and cable restoration", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-59', name:"Elias Fiseha", serviceKey:'fiber-installation', service:"Fiber Installation", specialty:"FTTH fiber splicing and optical testing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-60', name:"Youssef Karim", serviceKey:'plumbing', service:"Plumbing", specialty:"Pipe installation, leak diagnosis and drain clearing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-61', name:"Grace Kim", serviceKey:'electrical', service:"Electrical", specialty:"Lighting upgrades, circuits and electrical diagnostics", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-62', name:"Mateo Alvarez", serviceKey:'painting', service:"Painting", specialty:"Interior painting, wall preparation and detailed finishes", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-63', name:"Nia Brooks", serviceKey:'cleaning', service:"Cleaning", specialty:"Deep cleaning, turnover cleaning and office care", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-64', name:"Pavel Dimitrov", serviceKey:'carpentry', service:"Carpentry", specialty:"Cabinet fitting, framing and custom wood repairs", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-65', name:"Samira Yusuf", serviceKey:'hvac', service:"HVAC", specialty:"HVAC diagnostics, heat pumps and seasonal maintenance", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-66', name:"Bruno Costa", serviceKey:'masonry', service:"Masonry", specialty:"Brick repair, stonework and concrete finishing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-67', name:"Amina Diallo", serviceKey:'roofing', service:"Roofing", specialty:"Roof inspections, flashing and shingle repairs", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-68', name:"Omar Farouk", serviceKey:'tiling', service:"Tile installation", specialty:"Tile installation, grout renewal and wet-area finishes", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-69', name:"Jun Park", serviceKey:'appliance', service:"Appliance repair", specialty:"Refrigerator, washer and dryer diagnostics", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-70', name:"Elena Petrova", serviceKey:'pest', service:"Pest control", specialty:"Preventive inspections and integrated pest treatment", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-71', name:"Asha Mwangi", serviceKey:'landscaping', service:"Landscaping", specialty:"Garden installation, planting and lawn maintenance", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-72', name:"Noah Carter", serviceKey:'fiber-repair', service:"Fiber optic repair", specialty:"Fiber fault location, OTDR testing and restoration", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-73', name:"Hana Lee", serviceKey:'cctv-installation', service:"CCTV camera installation", specialty:"IP camera installation, NVR setup and remote viewing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-74', name:"Malik Johnson", serviceKey:'security-camera-installation', service:"Security camera systems", specialty:"PoE camera deployment and security recording", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-75', name:"Sofia Petrov", serviceKey:'access-control', service:"Access control systems", specialty:"Card readers, keypad entry and electronic locks", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-76', name:"Ravi Menon", serviceKey:'alarm-systems', service:"Alarm systems", specialty:"Intrusion sensors, alarm panels and commissioning", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-77', name:"Daniel Kim", serviceKey:'structured-cabling', service:"Structured cabling", specialty:"Cat6 runs, patch panels and rack organization", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-78', name:"Amira Hassan", serviceKey:'network-cabling', service:"Network and data cabling", specialty:"Ethernet installation, cable tracing and testing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-79', name:"Luca Moretti", serviceKey:'intercom-systems', service:"Intercom systems", specialty:"Video intercoms and multi-unit entry systems", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-80', name:"Maya Thompson", serviceKey:'audio-video-installation', service:"Audio/video installation", specialty:"Conference-room AV and home theater setup", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-81', name:"Ethan Chen", serviceKey:'smart-home-installation', service:"Smart-home installation", specialty:"Smart switches, hubs and connected-device setup", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-82', name:"Isabel Garcia", serviceKey:'low-voltage-troubleshooting', service:"Low-voltage troubleshooting", specialty:"Signal tracing, continuity checks and cable testing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-83', name:"Aiden Brooks", serviceKey:'gate-automation', service:"Gate automation", specialty:"Sliding gate motors, safety edges and remote controls", experience:'8 years', profileType:'Sample profile' },
  { id:'DP-84', name:"Mariam Hassan", serviceKey:'gate-automation', service:"Gate automation", specialty:"Swing gate operators, keypad entry and access integration", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-85', name:"Diego Ramirez", serviceKey:'gate-automation', service:"Gate automation", specialty:"Automatic gate installation, loop detectors and maintenance", experience:'9 years', profileType:'Sample profile' },
  { id:'DP-86', name:"Ethan Brooks", serviceKey:'flooring', service:"Flooring", specialty:"Hardwood and luxury vinyl plank installation", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-87', name:"Nora Williams", serviceKey:'drywall', service:"Drywall & finishing", specialty:"Drywall repair, taping and smooth-wall finishing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-88', name:"Caleb Morgan", serviceKey:'windows', service:"Windows & doors", specialty:"Window replacement, door fitting and weather sealing", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-89', name:"Amir Johnson", serviceKey:'fencing', service:"Fencing & gates", specialty:"Wood, vinyl and metal fence installation", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-90', name:"Leah Carter", serviceKey:'insulation', service:"Insulation", specialty:"Attic insulation, air sealing and energy upgrades", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-91', name:"Marcus Reed", serviceKey:'solar', service:"Solar installation", specialty:"Solar panel installation and system commissioning", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-92', name:"Olivia Hayes", serviceKey:'moving', service:"Moving & hauling", specialty:"Residential moving, packing and furniture handling", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-93', name:"Benjamin Clark", serviceKey:'remodeling', service:"Remodeling", specialty:"Kitchen and bathroom renovation coordination", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-94', name:"Isabella Turner", serviceKey:'welding', service:"Welding & metalwork", specialty:"Custom metal fabrication and gate repairs", experience:'7 years', profileType:'Sample profile' },
  { id:'DP-95', name:"Gabriel Price", serviceKey:'concrete', service:"Concrete services", specialty:"Concrete slabs, walkways and surface restoration", experience:'7 years', profileType:'Sample profile' },
];

// Kansas City metro sample coordinates. All pins below are fictional demo records, not live providers.
export const MOCK_TECHNICIANS: MapTechnician[] = [
  { id: 'T1', name: 'Demo Pro One', service: 'Plumbing', status: 'onTheWay', lat: 39.0120, lng: -94.5900, rating: 4.8, distanceMiles: 0.7 },
  { id: 'T2', name: 'Demo Pro Two', service: 'Electrical', status: 'available', lat: 39.0911, lng: -94.4155, rating: 4.9, distanceMiles: 1.6 },
  { id: 'T3', name: 'Demo Pro Three', service: 'Painting', status: 'working', lat: 38.9822, lng: -94.6708, rating: 4.6, distanceMiles: 1.9 },
  { id: 'T4', name: 'Demo Pro Four', service: 'Cleaning', status: 'available', lat: 38.8814, lng: -94.8191, rating: 4.7, distanceMiles: 2.5 },
  { id: 'T5', name: 'Demo Pro Five', service: 'HVAC', status: 'busy', lat: 39.0228, lng: -94.7152, rating: 4.5, distanceMiles: 1.7 },
  { id: 'T6', name: 'Demo Pro Six', service: 'Plumbing', status: 'offline', lat: 39.2461, lng: -94.4191, rating: 4.4, distanceMiles: 3.4 },
  { id: 'T7', name: 'Jordan Ellis', service: 'Roofing', status: 'available', lat: 39.0551, lng: -94.5832, rating: 4.9, distanceMiles: 1.2 },
  { id: 'T8', name: 'Maya Thompson', service: 'Carpentry', status: 'working', lat: 39.0375, lng: -94.5967, rating: 4.8, distanceMiles: 2.0 },
  { id: 'T9', name: 'Noah Williams', service: 'Landscaping', status: 'available', lat: 39.1184, lng: -94.6272, rating: 4.7, distanceMiles: 2.8 },
  { id: 'T10', name: 'Sofia Martinez', service: 'HVAC', status: 'onTheWay', lat: 38.9532, lng: -94.6061, rating: 4.9, distanceMiles: 3.1 },
  { id: 'T11', name: 'Ethan Brooks', service: 'Electrical', status: 'busy', lat: 39.0802, lng: -94.5121, rating: 4.6, distanceMiles: 3.6 },
];

export const MOCK_MAP_JOBS: MapJob[] = [
  { id: 'JB-2001', service: 'Plumbing', customer: 'Hanna M.', address: 'Brookside', lat: 39.0120, lng: -94.5900, status: 'requested', isHot: true },
  { id: 'JB-2002', service: 'Electrical', customer: 'Daniel G.', address: 'Crossroads Arts District', lat: 39.0911, lng: -94.4155, status: 'requested', isHot: true },
  { id: 'JB-2004', service: 'HVAC', customer: 'Office Park Ltd', address: 'Overland Park', lat: 38.9822, lng: -94.6708, status: 'assigned', techId: 'T5' },
  { id: 'BK-1001', service: 'Plumbing', customer: 'You', address: 'Brookside', lat: 39.0997, lng: -94.5786, status: 'onTheWay', techId: 'T1' },
];

export const KANSAS_CITY_CENTER = { lat: 39.0997, lng: -94.5786 };

export type ProjectStatus = 'planning' | 'active' | 'onHold' | 'completed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'inProgress' | 'completed' | 'delayed';

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  foreman?: string;
  workers: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  status: MilestoneStatus;
  dueDate: string;
  progress: number;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'active' | 'onLeave' | 'inactive';
  projectId?: string;
  dailyRate: number;
}

export interface TimesheetEntry {
  id: string;
  workerId: string;
  workerName: string;
  projectId: string;
  projectName: string;
  date: string;
  hours: number;
  status: 'pending' | 'approved' | 'rejected';
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    name: 'Brookside Apartment Renovation',
    client: 'Metro Property Group (demo)',
    location: 'Brookside, Kansas City, MO',
    status: 'active',
    progress: 62,
    budget: 85000,
    spent: 52000,
    startDate: '2026-09-01',
    endDate: '2026-12-15',
    foreman: 'Tesfaye Bekele',
    workers: 12,
  },
  {
    id: 'PRJ-002',
    name: 'Overland Park Office Fit-out',
    client: 'Heartland Business Park (demo)',
    location: 'Overland Park, KS',
    status: 'active',
    progress: 35,
    budget: 120000,
    spent: 38000,
    startDate: '2026-10-01',
    endDate: '2027-01-30',
    foreman: 'Aster Lemma',
    workers: 18,
  },
  {
    id: 'PRJ-003',
    name: 'Crossroads Arts District Villa Extension',
    client: 'Private Client',
    location: 'Crossroads Arts District, Kansas City, MO',
    status: 'planning',
    progress: 10,
    budget: 45000,
    spent: 2500,
    startDate: '2026-11-15',
    endDate: '2027-03-01',
    workers: 0,
  },
  {
    id: 'PRJ-004',
    name: 'Lee’s Summit Warehouse Flooring',
    client: 'Logistics Hub PLC',
    location: 'Lee’s Summit, MO',
    status: 'completed',
    progress: 100,
    budget: 28000,
    spent: 26500,
    startDate: '2026-07-01',
    endDate: '2026-09-20',
    foreman: 'Tesfaye Bekele',
    workers: 8,
  },
  {
    id: 'PRJ-005', name: 'Northland Family Home Restoration', client: 'Northland Residential Partners (demo)',
    location: 'Liberty, MO', status: 'active', progress: 48, budget: 64000, spent: 29800,
    startDate: '2026-10-10', endDate: '2027-01-10', foreman: 'Jordan Ellis', workers: 9,
  },
  {
    id: 'PRJ-006', name: 'River Market Retail Refresh', client: 'River Market Retail Group (demo)',
    location: 'River Market, Kansas City, MO', status: 'planning', progress: 8, budget: 52000, spent: 4200,
    startDate: '2026-11-20', endDate: '2027-02-15', foreman: 'Maya Thompson', workers: 4,
  },
  {
    id: 'PRJ-007', name: 'Prairie Village Exterior Upgrade', client: 'Prairie Village Property Co. (demo)',
    location: 'Prairie Village, KS', status: 'active', progress: 71, budget: 39000, spent: 27400,
    startDate: '2026-09-15', endDate: '2026-12-01', foreman: 'Noah Williams', workers: 6,
  },
];

export const MOCK_MILESTONES: Milestone[] = [
  { id: 'MS-1', projectId: 'PRJ-001', title: 'Demolition & Site Prep', status: 'completed', dueDate: '2026-09-20', progress: 100 },
  { id: 'MS-2', projectId: 'PRJ-001', title: 'Structural Works', status: 'completed', dueDate: '2026-10-15', progress: 100 },
  { id: 'MS-3', projectId: 'PRJ-001', title: 'MEP Installation', status: 'inProgress', dueDate: '2026-11-10', progress: 55 },
  { id: 'MS-4', projectId: 'PRJ-001', title: 'Finishing & Handover', status: 'pending', dueDate: '2026-12-15', progress: 0 },
  { id: 'MS-5', projectId: 'PRJ-002', title: 'Design Approval', status: 'completed', dueDate: '2026-10-10', progress: 100 },
  { id: 'MS-6', projectId: 'PRJ-002', title: 'Partitioning', status: 'inProgress', dueDate: '2026-11-20', progress: 40 },
];

export const MOCK_WORKERS: Worker[] = [
  { id: 'W1', name: 'Demo Worker One', role: 'Mason', phone: '+1-555-0101', status: 'active', projectId: 'PRJ-001', dailyRate: 450 },
  { id: 'W2', name: 'Demo Worker Two', role: 'Electrician', phone: '+1-555-0102', status: 'active', projectId: 'PRJ-001', dailyRate: 550 },
  { id: 'W3', name: 'Demo Worker Three', role: 'Plumber', phone: '+1-555-0103', status: 'active', projectId: 'PRJ-001', dailyRate: 500 },
  { id: 'W4', name: 'Demo Worker Four', role: 'Painter', phone: '+1-555-0104', status: 'active', projectId: 'PRJ-002', dailyRate: 400 },
  { id: 'W5', name: 'Demo Worker Five', role: 'Laborer', phone: '+1-555-0105', status: 'active', projectId: 'PRJ-002', dailyRate: 300 },
  { id: 'W6', name: 'Demo Worker Six', role: 'Site Supervisor', phone: '+1-555-0106', status: 'active', projectId: 'PRJ-002', dailyRate: 700 },
  { id: 'W7', name: 'Demo Worker Seven', role: 'Carpenter', phone: '+1-555-0107', status: 'onLeave', projectId: 'PRJ-001', dailyRate: 480 },
  { id: 'W8', name: 'Demo Worker Eight', role: 'Helper', phone: '+1-555-0108', status: 'inactive', dailyRate: 250 },
  { id: 'W9', name: 'Jordan Ellis', role: 'Roofing Specialist', phone: '+1-555-0109', status: 'active', projectId: 'PRJ-003', dailyRate: 620 },
  { id: 'W10', name: 'Maya Thompson', role: 'Finish Carpenter', phone: '+1-555-0110', status: 'active', projectId: 'PRJ-003', dailyRate: 540 },
  { id: 'W11', name: 'Noah Williams', role: 'Landscape Technician', phone: '+1-555-0111', status: 'active', projectId: 'PRJ-001', dailyRate: 390 },
  { id: 'W12', name: 'Sofia Martinez', role: 'HVAC Technician', phone: '+1-555-0112', status: 'onLeave', projectId: 'PRJ-002', dailyRate: 590 },
];

export const MOCK_TIMESHEETS: TimesheetEntry[] = [
  { id: 'TS-1', workerId: 'W1', workerName: 'Demo Worker One', projectId: 'PRJ-001', projectName: 'Brookside Apartment Renovation', date: '2026-11-01', hours: 8, status: 'approved' },
  { id: 'TS-2', workerId: 'W2', workerName: 'Demo Worker Two', projectId: 'PRJ-001', projectName: 'Brookside Apartment Renovation', date: '2026-11-01', hours: 8, status: 'approved' },
  { id: 'TS-3', workerId: 'W3', workerName: 'Demo Worker Three', projectId: 'PRJ-001', projectName: 'Brookside Apartment Renovation', date: '2026-11-01', hours: 7.5, status: 'pending' },
  { id: 'TS-4', workerId: 'W4', workerName: 'Demo Worker Four', projectId: 'PRJ-002', projectName: 'Overland Park Office Fit-out', date: '2026-11-01', hours: 8, status: 'pending' },
  { id: 'TS-5', workerId: 'W5', workerName: 'Demo Worker Five', projectId: 'PRJ-002', projectName: 'Overland Park Office Fit-out', date: '2026-11-01', hours: 8, status: 'approved' },
  { id: 'TS-6', workerId: 'W1', workerName: 'Demo Worker One', projectId: 'PRJ-001', projectName: 'Brookside Apartment Renovation', date: '2026-11-02', hours: 8, status: 'pending' },
];

// ─── Analytics ───────────────────────────────────────────
export const ANALYTICS_KPIS = {
  todayBookings: 24,
  todayRevenue: 48500,
  activeTechnicians: 86,
  activeProjects: 12,
  openTickets: 7,
  pendingVerifications: 14,
  hotJobs: 5,
  avgRating: 4.7,
};

export const BOOKING_TREND = [
  { date: 'Oct 27', bookings: 18, revenue: 3200 },
  { date: 'Oct 28', bookings: 22, revenue: 4100 },
  { date: 'Oct 29', bookings: 15, revenue: 2800 },
  { date: 'Oct 30', bookings: 28, revenue: 5200 },
  { date: 'Oct 31', bookings: 31, revenue: 5800 },
  { date: 'Nov 1', bookings: 26, revenue: 4700 },
  { date: 'Nov 2', bookings: 24, revenue: 4850 },
];

export const SERVICE_BREAKDOWN = [
  { service: 'Plumbing', count: 42, revenue: 3850 },
  { service: 'Electrical', count: 35, revenue: 4200 },
  { service: 'Cleaning', count: 28, revenue: 1680 },
  { service: 'Painting', count: 15, revenue: 6750 },
  { service: 'HVAC', count: 12, revenue: 2880 },
  { service: 'Other', count: 18, revenue: 2200 },
];

export const TECH_PERFORMANCE = [
  { name: 'Demo Pro Two', jobs: 47, rating: 4.9, revenue: 5200, acceptance: 94 },
  { name: 'Demo Pro One', jobs: 41, rating: 4.8, revenue: 3850, acceptance: 88 },
  { name: 'Demo Pro Three', jobs: 28, rating: 4.6, revenue: 6200, acceptance: 82 },
  { name: 'Demo Pro Four', jobs: 35, rating: 4.7, revenue: 2100, acceptance: 91 },
  { name: 'Demo Pro Five', jobs: 22, rating: 4.5, revenue: 3140, acceptance: 79 },
];

export const PROJECT_ANALYTICS = [
  { name: 'Brookside Apartment Renovation', progress: 62, budget: 85000, spent: 52000, status: 'onTrack' },
  { name: 'Overland Park Office Fit-out', progress: 35, budget: 120000, spent: 38000, status: 'onTrack' },
  { name: 'Crossroads Arts District Villa Extension', progress: 10, budget: 45000, spent: 2500, status: 'planning' },
  { name: 'Lee’s Summit Warehouse Flooring', progress: 100, budget: 28000, spent: 26500, status: 'completed' },
];

export const SUPPORT_METRICS = {
  open: 7,
  escalated: 2,
  avgFirstResponseHrs: 1.4,
  avgResolutionHrs: 18,
  csat: 4.3,
};

// ─── Phase 8: Suppliers, Orders, Rentals, Properties ─────
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type RentalStatus = 'requested' | 'active' | 'returned' | 'overdue';

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  unit: string;
  supplier: string;
}

export interface SupplierOrder {
  id: string;
  productName: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  customer: string;
  createdAt: string;
  deliveryAddress: string;
}

export interface EquipmentRental {
  id: string;
  equipment: string;
  customer: string;
  project?: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  status: RentalStatus;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  size?: string;
  yearBuilt?: number;
  servicesCount: number;
  lastService?: string;
  nextMaintenance?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P1', name: 'Cement (50kg)', category: 'Materials', stock: 240, price: 8.50, unit: 'bag', supplier: 'Metro Building Supply (demo)' },
  { id: 'P2', name: 'Rebar 12mm', category: 'Materials', stock: 80, price: 185, unit: 'bundle', supplier: 'Metro Building Supply (demo)' },
  { id: 'P3', name: 'Paint - Interior White 20L', category: 'Finishing', stock: 45, price: 65, unit: 'bucket', supplier: 'KC Paint & Supply (demo)' },
  { id: 'P4', name: 'Scaffolding Set', category: 'Equipment', stock: 12, price: 125, unit: 'set', supplier: 'SiteGear Rentals' },
  { id: 'P5', name: 'Concrete Mixer', category: 'Rental', stock: 6, price: 85, unit: 'day', supplier: 'SiteGear Rentals' },
  { id: 'P6', name: 'Ceramic Tiles 60x60', category: 'Finishing', stock: 500, price: 4.5, unit: 'sq ft', supplier: 'Tile World' },
  { id: 'P7', name: 'PVC Pipe 1 inch', category: 'Materials', stock: 200, price: 2.5, unit: '10 ft length', supplier: 'PlumbMart' },
  { id: 'P8', name: 'Excavator Mini', category: 'Rental', stock: 2, price: 450, unit: 'day', supplier: 'Metro Equipment Rental (demo)' },
];

export const MOCK_ORDERS: SupplierOrder[] = [
  { id: 'ORD-101', productName: 'Cement (50kg)', quantity: 40, total: 340, status: 'delivered', customer: 'Metro Property Group (demo)', createdAt: '2026-10-28', deliveryAddress: 'Brookside, Kansas City, MO' },
  { id: 'ORD-102', productName: 'Rebar 12mm', quantity: 15, total: 675, status: 'shipped', customer: 'Heartland Business Park (demo)', createdAt: '2026-11-01', deliveryAddress: 'Overland Park, KS' },
  { id: 'ORD-103', productName: 'Paint - Interior White 20L', quantity: 8, total: 520, status: 'confirmed', customer: 'Private Client', createdAt: '2026-11-02', deliveryAddress: 'Crossroads Arts District' },
  { id: 'ORD-104', productName: 'Ceramic Tiles 60x60', quantity: 100, total: 675, status: 'pending', customer: 'Logistics Hub PLC', createdAt: '2026-11-02', deliveryAddress: 'Lee’s Summit' },
];

export const MOCK_RENTALS: EquipmentRental[] = [
  { id: 'RN-01', equipment: 'Concrete Mixer', customer: 'Tesfaye Bekele', project: 'Brookside Apartment Renovation', startDate: '2026-11-01', endDate: '2026-11-08', dailyRate: 85, status: 'active' },
  { id: 'RN-02', equipment: 'Scaffolding Set', customer: 'Aster Lemma', project: 'Overland Park Office Fit-out', startDate: '2026-10-20', endDate: '2026-11-15', dailyRate: 125, status: 'active' },
  { id: 'RN-03', equipment: 'Excavator Mini', customer: 'Site Crew A', project: 'Crossroads Arts District Villa Extension', startDate: '2026-10-10', endDate: '2026-10-25', dailyRate: 450, status: 'returned' },
  { id: 'RN-04', equipment: 'Concrete Mixer', customer: 'Demo Pro Six', startDate: '2026-10-01', endDate: '2026-10-05', dailyRate: 85, status: 'overdue' },
];

export const MOCK_PROPERTIES: Property[] = [
  { id: 'HP-1', name: 'Brookside Apartment 4B', address: 'Brookside, Kansas City, MO', type: 'Apartment', size: '1,300 sq ft', yearBuilt: 2018, servicesCount: 8, lastService: '2026-10-28', nextMaintenance: '2026-12-01' },
  { id: 'HP-2', name: 'Overland Park Office Suite 302', address: 'Overland Park, KS', type: 'Office', size: '915 sq ft', yearBuilt: 2020, servicesCount: 3, lastService: '2026-09-15', nextMaintenance: '2026-11-20' },
  { id: 'HP-3', name: 'Family Home - Waldo', address: 'Waldo, Kansas City, MO', type: 'House', size: '2,150 sq ft', yearBuilt: 2015, servicesCount: 12, lastService: '2026-10-05', nextMaintenance: '2026-11-15' },
];
