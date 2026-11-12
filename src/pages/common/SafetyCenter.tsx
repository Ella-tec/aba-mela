import { useMemo, useState, type ReactNode } from 'react';
import {
  ShieldCheck, Siren, MapPin, HeartPulse, BellRing, CloudLightning, HardHat,
  ClipboardCheck, Scale, BadgeCheck, LockKeyhole, CarFront, GraduationCap,
  Headset, Users, Hospital, Phone, ExternalLink, Search, Plus,
  CheckCircle2, AlertTriangle, FileText, Navigation, ShieldAlert,
  Stethoscope, Zap, Trees
} from 'lucide-react';

type SafetyTab =
  | 'overview' | 'emergency' | 'nearby' | 'medical' | 'location' | 'alerts'
  | 'weather' | 'jobsite' | 'inspections' | 'regulations' | 'certifications'
  | 'security' | 'vehicle' | 'driving' | 'electrical' | 'animals' | 'plants' | 'ergonomics' | 'physical' | 'protection' | 'learning' | 'support' | 'contacts';

const tabs: { id: SafetyTab; label: string; icon: typeof ShieldCheck; group: string }[] = [
  { id: 'overview', label: 'Overview', icon: ShieldCheck, group: 'Start here' },
  { id: 'emergency', label: 'Emergency SOS', icon: Siren, group: 'Emergency' },
  { id: 'nearby', label: 'Nearby services', icon: Hospital, group: 'Emergency' },
  { id: 'medical', label: 'Medical & first aid', icon: HeartPulse, group: 'Emergency' },
  { id: 'location', label: 'Location & check-in', icon: MapPin, group: 'Emergency' },
  { id: 'alerts', label: 'Community alerts', icon: BellRing, group: 'Awareness' },
  { id: 'weather', label: 'Weather safety', icon: CloudLightning, group: 'Awareness' },
  { id: 'jobsite', label: 'Job site safety', icon: HardHat, group: 'Work safety' },
  { id: 'inspections', label: 'Inspections & hazards', icon: ClipboardCheck, group: 'Work safety' },
  { id: 'regulations', label: 'Rules & regulations', icon: Scale, group: 'Compliance' },
  { id: 'certifications', label: 'Certifications & documents', icon: BadgeCheck, group: 'Compliance' },
  { id: 'security', label: 'Security & identity', icon: LockKeyhole, group: 'Protection' },
  { id: 'vehicle', label: 'Vehicle safety', icon: CarFront, group: 'Protection' },
  { id: 'driving', label: 'Driving & road safety', icon: CarFront, group: 'Work safety' },
  { id: 'electrical', label: 'Electrical safety', icon: Zap, group: 'Work safety' },
  { id: 'animals', label: 'Dog & animal safety', icon: HeartPulse, group: 'Work safety' },
  { id: 'plants', label: 'Plant & chemical hazards', icon: Trees, group: 'Work safety' },
  { id: 'ergonomics', label: 'Back & shoulder care', icon: Stethoscope, group: 'Health & ergonomics' },
  { id: 'physical', label: 'Physical safety by trade', icon: HardHat, group: 'Health & ergonomics' },
  { id: 'protection', label: 'Payment protection', icon: ShieldAlert, group: 'Protection' },
  { id: 'learning', label: 'Safety videos & OSHA', icon: GraduationCap, group: 'Resources' },
  { id: 'support', label: 'Support center', icon: Headset, group: 'Resources' },
  { id: 'contacts', label: 'Emergency contacts', icon: Users, group: 'Resources' }
];

const checklist = [
  'Review the work order and identify site-specific hazards',
  'Wear required PPE: boots, eye protection, gloves and hard hat',
  'Inspect tools, ladders and electrical equipment before use',
  'Confirm the work area is ventilated and access is clear',
  'Locate first-aid supplies and the nearest exit',
  'Explain the stop-work and emergency procedure to the crew'
];

const learningItems = [
  { title: 'OSHA construction safety videos', detail: 'Video lessons about common construction hazards and prevention.', url: 'https://www.youtube.com/results?search_query=OSHA+construction+safety+training+videos' },
  { title: 'OSHA fall protection videos', detail: 'Learn about fall hazards, ladders and fall-protection concepts.', url: 'https://www.youtube.com/results?search_query=OSHA+fall+protection+training+videos' },
  { title: 'OSHA electrical safety videos', detail: 'Electrical hazard awareness and safe-work training videos.', url: 'https://www.youtube.com/results?search_query=OSHA+electrical+safety+training+videos' },
  { title: 'OSHA heat illness prevention', detail: 'Recognize heat illness risks and review prevention guidance.', url: 'https://www.youtube.com/results?search_query=OSHA+heat+illness+prevention+training+video' },
  { title: 'OSHA training and outreach', detail: 'Official OSHA training, education and outreach information.', url: 'https://www.osha.gov/training' },
  { title: 'OSHA construction standards', detail: 'Official construction safety topics, standards and worker resources.', url: 'https://www.osha.gov/construction' },
  { title: 'OSHA personal protective equipment', detail: 'Official guidance on selecting and using workplace PPE.', url: 'https://www.osha.gov/personal-protective-equipment' },
  { title: 'OSHA hazard communication', detail: 'Official information about chemical labels and safety data sheets.', url: 'https://www.osha.gov/hazcom' }
,
  { title: 'Fiber installation and repair safety videos', detail: 'Laser awareness, fiber shards, eye protection, cable handling and work-area controls. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=fiber%20optic%20installation%20repair%20laser%20eye%20safety%20fiber%20shards%20training' },
  { title: 'CCTV camera installation safety videos', detail: 'Ladder setup, overhead work, drilling, electrical awareness and privacy. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=CCTV%20camera%20installation%20ladder%20drilling%20electrical%20safety%20training' },
  { title: 'Security camera system safety videos', detail: 'Safe mounting, cable routing, electrical hazards and responsible video privacy. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=security%20camera%20system%20installation%20safety%20ladder%20electrical%20privacy' },
  { title: 'Access control installation safety videos', detail: 'Door egress, fire-door awareness, lockout/tagout and electrical hazards. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=access%20control%20door%20hardware%20installation%20egress%20electrical%20safety' },
  { title: 'Alarm system installation safety videos', detail: 'Battery handling, panel isolation, sensor placement and safe testing. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=intrusion%20alarm%20system%20installation%20battery%20electrical%20safety%20training' },
  { title: 'Structured cabling safety videos', detail: 'Ceiling access, ladder use, cable pulling, firestopping and PPE. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=structured%20cabling%20ladder%20ceiling%20cable%20pulling%20firestop%20safety' },
  { title: 'Network and data cabling safety videos', detail: 'Cable pathways, drilling checks, overhead work and electrical separation. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=network%20data%20cabling%20installation%20ladder%20drilling%20electrical%20safety' },
  { title: 'Intercom installation safety videos', detail: 'Entry hardware, safe mounting, egress and low-voltage wiring hazards. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=intercom%20installation%20door%20entry%20low%20voltage%20safety%20training' },
  { title: 'Audio/video installation safety videos', detail: 'Display lifting, wall mounting, overhead work and electrical isolation. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=audio%20video%20installation%20TV%20mounting%20lifting%20electrical%20safety' },
  { title: 'Smart-home installation safety videos', detail: 'Electrical isolation, device security, privacy and safe commissioning. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=smart%20home%20installation%20electrical%20safety%20cybersecurity%20privacy' },
  { title: 'Low-voltage troubleshooting safety videos', detail: 'Test equipment, isolation, stored energy, PPE and stop-work practices. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=low%20voltage%20troubleshooting%20electrical%20testing%20safety%20training' },
  { title: 'Gate automation safety videos', detail: 'Entrapment zones, guarding, photo eyes, emergency release and safe testing. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=automatic%20gate%20operator%20entrapment%20protection%20photo%20eye%20safety%20training' },
  { title: 'Fiber optic laser and glass-shard safety', detail: 'Trade-specific awareness for optical sources, broken fiber and safe disposal. Video search resources for awareness; use qualified instruction for hands-on work.', url: 'https://www.youtube.com/results?search_query=fiber%20optic%20laser%20safety%20broken%20glass%20shard%20handling%20training' }];

const regulationLinks = [
  { title: 'OSHA – Construction', detail: 'Federal construction safety standards and guidance', url: 'https://www.osha.gov/construction' },
  { title: 'OSHA – Standards', detail: 'Official occupational safety and health regulations', url: 'https://www.osha.gov/laws-regs' },
  { title: 'Missouri Department of Labor', detail: 'Missouri workplace and labor information', url: 'https://labor.mo.gov/' },
  { title: 'Missouri Division of Professional Registration', detail: 'Professional licensing information and boards', url: 'https://pr.mo.gov/' },
  { title: 'ADA.gov', detail: 'Official accessibility requirements and guidance', url: 'https://www.ada.gov/' },
  { title: 'FTC – Consumer Advice', detail: 'Consumer protection and fraud-prevention guidance', url: 'https://consumer.ftc.gov/' }
];

const serviceTypes = [
  { title: 'Hospitals & emergency departments', detail: 'Find emergency departments and hospital care', query: 'emergency hospitals near me' },
  { title: 'Urgent care', detail: 'Find nearby urgent care clinics', query: 'urgent care near me' },
  { title: 'Pharmacies', detail: 'Find nearby pharmacies', query: 'pharmacies near me' },
  { title: 'Police stations', detail: 'Find local police stations', query: 'police stations near me' },
  { title: 'Fire departments', detail: 'Find local fire stations', query: 'fire stations near me' },
  { title: 'Towing & roadside assistance', detail: 'Find towing and roadside help', query: 'towing roadside assistance near me' }
];

function Panel({ children }: { children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{children}</section>;
}
function SectionTitle({ title, detail }: { title: string; detail: string }) {
  return <div className="mb-4"><h3 className="text-lg font-bold text-slate-900">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p></div>;
}
function ExternalResource({ title, detail, url }: { title: string; detail: string; url: string }) {
  return <a href={url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-orange-300 hover:bg-orange-50/50">
    <span><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span></span>
    <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover:text-orange-700"/>
  </a>;
}

export function SafetyCenter() {
  const [active, setActive] = useState<SafetyTab>('overview');
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const [hazard, setHazard] = useState('');
  const [hazards, setHazards] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([]);
  const [medicalNote, setMedicalNote] = useState('');
  const [showMedicalNote, setShowMedicalNote] = useState(false);

  const filteredTabs = useMemo(
    () => tabs.filter(tab => (tab.label + ' ' + tab.group).toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const current = tabs.find(tab => tab.id === active) ?? tabs[0];
  const progress = Math.round((checked.length / checklist.length) * 100);

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Location is not available in this browser. You can still open a map search.');
      return;
    }
    setLocationMessage('Requesting location permission…');
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocationMessage('Location permission granted for this demo session. No location has been sent to anyone.');
        window.open('https://www.google.com/maps/search/?api=1&query=' + latitude + ',' + longitude, '_blank', 'noopener,noreferrer');
      },
      () => setLocationMessage('Location permission was not granted. You can use the nearby-services map search instead.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const addHazard = () => {
    const value = hazard.trim();
    if (!value) return;
    setHazards(items => [value, ...items]);
    setHazard('');
  };

  const addContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    setContacts(items => [...items, { name: contactName.trim(), phone: contactPhone.trim() }]);
    setContactName('');
    setContactPhone('');
  };

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-lg sm:p-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100"><ShieldCheck className="h-4 w-4"/> MELA SAFETY & PROTECTION</div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Safety Center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">Emergency resources, job-site safety, compliance, training and personal protection in one place.</p>
          <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-amber-300/15 px-3 py-1 text-xs font-semibold text-amber-100">DEMO MODE</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">Future integration ready</span></div>
        </div>
        <a href="tel:911" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><Siren className="h-6 w-6"/> Call 911 <span className="text-xs font-medium text-red-100">Emergency only</span></a>
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-5 text-slate-300">If someone is in immediate danger or needs urgent medical help, call 911. Mela is not an emergency dispatch service and this demo does not send emergency alerts.</p>
    </header>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <button onClick={() => setActive('emergency')} className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-left transition hover:bg-red-100"><Siren className="h-6 w-6 text-red-700"/><span><span className="block text-sm font-bold text-red-900">Emergency SOS</span><span className="text-xs text-red-700">Emergency actions</span></span></button>
      <button onClick={() => setActive('nearby')} className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:bg-blue-100"><Hospital className="h-6 w-6 text-blue-700"/><span><span className="block text-sm font-bold text-blue-900">Nearby services</span><span className="text-xs text-blue-700">Hospitals and help</span></span></button>
      <button onClick={() => setActive('jobsite')} className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left transition hover:bg-amber-100"><HardHat className="h-6 w-6 text-amber-800"/><span><span className="block text-sm font-bold text-amber-950">Job-site checklist</span><span className="text-xs text-amber-800">Before work begins</span></span></button>
      <button onClick={() => setActive('regulations')} className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left transition hover:bg-emerald-100"><Scale className="h-6 w-6 text-emerald-800"/><span><span className="block text-sm font-bold text-emerald-950">Rules & regulations</span><span className="text-xs text-emerald-800">Official resources</span></span></button>
    </div>

    <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
      <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-4">
        <label className="relative mb-3 block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Find a safety topic…" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"/>
        </label>
        <nav aria-label="Safety Center sections" className="max-h-[65vh] space-y-1 overflow-y-auto">
          {filteredTabs.map(tab => {
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActive(tab.id)} aria-current={active === tab.id ? 'page' : undefined} className={'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ' + (active === tab.id ? 'bg-slate-900 font-semibold text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950')}>
              <Icon className="h-4 w-4 shrink-0"/><span className="min-w-0 flex-1">{tab.label}</span>
            </button>;
          })}
          {filteredTabs.length === 0 && <p className="p-3 text-sm text-slate-500">No matching safety topics.</p>}
        </nav>
        <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900"><AlertTriangle className="mb-1 inline h-4 w-4"/> Demo information only. Verify current requirements with official sources and qualified professionals.</div>
      </aside>

      <main className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-orange-700">Safety Center / {current.group}</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{current.label}</h2></div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Demo data</span>
        </div>

        {active === 'overview' && <>
          <Panel><SectionTitle title="Your safety dashboard" detail="A quick view of the tools available in this demonstration."/>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-700"/><p className="mt-2 text-2xl font-bold text-slate-900">{progress}%</p><p className="text-xs text-slate-600">Job-site checklist complete</p></div>
              <div className="rounded-xl bg-blue-50 p-4"><MapPin className="h-5 w-5 text-blue-700"/><p className="mt-2 text-2xl font-bold text-slate-900">{checkIn ? 'Checked in' : 'Not checked in'}</p><p className="text-xs text-slate-600">This browser session</p></div>
              <div className="rounded-xl bg-amber-50 p-4"><FileText className="h-5 w-5 text-amber-700"/><p className="mt-2 text-2xl font-bold text-slate-900">{hazards.length}</p><p className="text-xs text-slate-600">Demo hazard notes created</p></div>
            </div>
          </Panel>
          <Panel><SectionTitle title="Important emergency guidance" detail="These actions open your phone dialer or official external resources. Mela does not dispatch responders."/>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href="tel:911" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"><Phone className="h-5 w-5"/><span><b className="block text-sm">Call 911</b><small>Immediate danger or medical emergency</small></span></a>
              <a href="https://www.poison.org/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"><Stethoscope className="h-5 w-5 text-slate-600"/><span><b className="block text-sm">Poison Control</b><small className="text-xs text-slate-500">Official poison help resource</small></span><ExternalLink className="ml-auto h-4 w-4"/></a>
            </div>
          </Panel>
          <Panel><SectionTitle title="Explore safety topics" detail="Choose a section from the menu or start with these frequently used tools."/>
            <div className="grid gap-2 sm:grid-cols-2">{tabs.filter(t => ['nearby','jobsite','inspections','regulations','learning','weather'].includes(t.id)).map(tab => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActive(tab.id)} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left text-sm font-semibold text-slate-700 hover:border-orange-300 hover:bg-orange-50"><Icon className="h-5 w-5 text-orange-700"/>{tab.label}</button>; })}</div>
          </Panel>
        </>}

        {active === 'emergency' && <Panel><SectionTitle title="Emergency SOS & response" detail="For an immediate threat, call 911. These demo controls do not contact dispatch or trusted contacts automatically."/>
          <a href="tel:911" className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"><Phone className="h-5 w-5"/> Call 911 now</a>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><b className="text-sm">When calling</b><p className="mt-1 text-sm text-slate-600">Give your location, explain what happened, describe immediate hazards and follow the dispatcher's instructions.</p></div><div className="rounded-xl bg-slate-50 p-4"><b className="text-sm">Work-site response</b><p className="mt-1 text-sm text-slate-600">Stop work, do not put yourself at risk, keep access clear and use trained responders for first aid.</p></div></div>
        </Panel>}

        {active === 'nearby' && <><Panel><SectionTitle title="Find emergency and support services" detail="Open a live map search for services near your current device location. Mela does not yet have a verified local provider directory."/>
          <button onClick={shareLocation} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Navigation className="h-4 w-4"/> Use my location for map search</button>
          {locationMessage && <p role="status" className="mt-3 text-sm text-slate-600">{locationMessage}</p>}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{serviceTypes.map(service => <a key={service.title} href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(service.query)} target="_blank" rel="noreferrer" className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 hover:border-orange-300 hover:bg-orange-50/50"><span><b className="block text-sm text-slate-900">{service.title}</b><small className="mt-1 block text-xs text-slate-500">{service.detail}</small></span><ExternalLink className="h-4 w-4 shrink-0 text-slate-400"/></a>)}</div>
        </Panel><p className="text-xs leading-5 text-slate-500">Always call 911 for emergencies. Confirm the facility is open and able to provide the care you need before traveling when it is safe to do so.</p></>}

        {active === 'medical' && <><Panel><SectionTitle title="Personal emergency medical profile" detail="Optional demo-only fields. This information stays in this page's memory and is not saved or transmitted. Do not enter sensitive medical details on a shared device."/>
          <button onClick={() => setShowMedicalNote(value => !value)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{showMedicalNote ? 'Hide' : 'Open'} optional demo note</button>
          {showMedicalNote && <div className="mt-3"><textarea value={medicalNote} onChange={event => setMedicalNote(event.target.value)} rows={3} placeholder="Optional emergency note (demo only; do not enter sensitive information)" className="w-full rounded-xl border border-slate-300 p-3 text-sm"/><p className="mt-1 text-xs text-slate-500">This note is not saved, shared with responders or a substitute for a medical record.</p></div>}
        </Panel><Panel><SectionTitle title="First-aid learning resources" detail="Educational links only. Get emergency help first and follow instructions from qualified responders."/>
          <div className="grid gap-3 sm:grid-cols-2"><ExternalResource title="American Red Cross first aid" detail="Courses and first-aid learning" url="https://www.redcross.org/take-a-class/first-aid"/><ExternalResource title="American Heart Association CPR" detail="CPR and emergency cardiovascular care information" url="https://cpr.heart.org/"/></div>
          <p className="mt-3 text-sm text-slate-600">For severe bleeding, burns, choking, suspected spinal injury or unconsciousness, call 911 and follow the dispatcher's instructions. This page is not a treatment protocol.</p>
        </Panel></>}

        {active === 'location' && <Panel><SectionTitle title="Check-in and location sharing" detail="A local demo check-in toggle. No live tracking or automatic sharing is active."/>
          <div className="flex flex-wrap items-center gap-3"><button onClick={() => setCheckIn(value => !value)} className={'rounded-xl px-4 py-2.5 text-sm font-semibold text-white '+(checkIn ? 'bg-slate-700 hover:bg-slate-800' : 'bg-emerald-700 hover:bg-emerald-800')}>{checkIn ? 'End demo check-in' : 'Start demo check-in'}</button><span className="text-sm text-slate-600">Status: <b>{checkIn ? 'Checked in locally' : 'Not checked in'}</b></span></div>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Future connection: opt-in location sharing, selected trusted recipients, time limits, visible sharing status, revocation, audit logs and secure server-side delivery.</div>
          <button onClick={shareLocation} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><MapPin className="h-4 w-4"/> Open map with my location</button>
          {locationMessage && <p className="mt-2 text-xs text-slate-500">{locationMessage}</p>}
        </Panel>}

        {active === 'alerts' && <Panel><SectionTitle title="Community safety alerts" detail="Use official alert services for current emergencies. These are resource links, not a live Mela alert feed."/>
          <div className="grid gap-3 sm:grid-cols-2"><ExternalResource title="Missouri emergency management" detail="State emergency preparedness and incident information" url="https://sema.dps.mo.gov/"/><ExternalResource title="National Weather Service alerts" detail="Official watches, warnings and advisories" url="https://www.weather.gov/alerts"/><ExternalResource title="MoDOT traveler information" detail="Road conditions, closures and travel information" url="https://traveler.modot.org/map/"/><ExternalResource title="Ready.gov" detail="Emergency preparedness and public safety guidance" url="https://www.ready.gov/"/></div>
        </Panel>}

        {active === 'weather' && <Panel><SectionTitle title="Weather and environmental safety" detail="Check official local alerts before outdoor work and follow employer/site emergency procedures."/>
          <div className="grid gap-3 sm:grid-cols-2"><ExternalResource title="NWS local forecast and alerts" detail="Forecasts, severe weather watches and warnings" url="https://www.weather.gov/"/><ExternalResource title="AirNow air quality" detail="Current air quality and health guidance" url="https://www.airnow.gov/"/><ExternalResource title="Heat safety" detail="Heat illness prevention and worker guidance" url="https://www.osha.gov/heat-exposure"/><ExternalResource title="Flood safety" detail="Flood preparedness and safety information" url="https://www.ready.gov/floods"/></div>
        </Panel>}

        {active === 'jobsite' && <Panel><SectionTitle title="Pre-work job-site safety checklist" detail="A sample checklist for planning and discussion. Requirements vary by task, site, employer and applicable standards."/>
          <div className="mb-3 flex items-center justify-between text-sm"><span className="font-semibold text-slate-700">Completion</span><span className="font-bold text-emerald-700">{checked.length} of {checklist.length} · {progress}%</span></div>
          <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{width: progress+'%'}}/></div>
          <div className="space-y-2">{checklist.map(item => <label key={item} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={checked.includes(item)} onChange={event => setChecked(old => event.target.checked ? [...old,item] : old.filter(value => value !== item))} className="mt-0.5 h-4 w-4 accent-emerald-700"/><span className={checked.includes(item) ? 'text-slate-400 line-through' : ''}>{item}</span></label>)}</div>
          <button onClick={() => setChecked([])} className="mt-3 text-sm font-semibold text-orange-700 hover:underline">Reset checklist</button>
        </Panel>}

        {active === 'inspections' && <Panel><SectionTitle title="Hazard and incident notes" detail="Create local sample notes for the demo. These do not notify a supervisor or create an official incident report."/>
          <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="hazard-note">Describe a hazard or observation</label>
          <textarea id="hazard-note" value={hazard} onChange={event => setHazard(event.target.value)} rows={3} placeholder="Example: extension cord across the main walkway…" className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-orange-400 focus:outline-none"/>
          <button onClick={addHazard} className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Plus className="h-4 w-4"/> Add demo note</button>
          <div className="mt-4 space-y-2">{hazards.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No demo notes yet.</p> : hazards.map((item,index) => <div key={index} className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"><AlertTriangle className="h-4 w-4 shrink-0"/>{item}</div>)}</div>
          <p className="mt-3 text-xs text-slate-500">For immediate danger, stop work if safe and contact the appropriate supervisor or emergency services. Do not rely on this demo form.</p>
        </Panel>}

        {active === 'regulations' && <Panel><SectionTitle title="Rules, regulations and official guidance" detail="Starting points for research. Always verify the current rule, jurisdiction, effective date and applicability with the issuing authority or a qualified compliance professional."/>
          <div className="grid gap-3 sm:grid-cols-2">{regulationLinks.map(item => <ExternalResource key={item.title} {...item}/>)}</div>
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><b>Compliance reminder:</b> A link library is not a compliance determination. Mela does not certify that a company, worker or job site meets any regulation.</div>
        </Panel>}

        {active === 'certifications' && <Panel><SectionTitle title="Certification and document register" detail="Sample categories for a future secure document vault. No certificate files are uploaded or verified in this demo."/>
          <div className="grid gap-3 sm:grid-cols-2">{['OSHA 10 / OSHA 30 cards','Trade and professional licenses','General liability insurance','Workers’ compensation insurance','Business registration','Background-check status','First-aid and CPR certificates','Equipment operator qualifications'].map(item => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><FileText className="h-5 w-5 text-slate-500"/><span className="text-sm font-semibold text-slate-800">{item}</span><span className="ml-auto rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">Not verified</span></div>)}</div>
          <p className="mt-3 text-xs text-slate-500">Future integration: private object storage, encryption, role-based access, document expiry reminders, audit history and authorized verification workflows.</p>
        </Panel>}

        {active === 'security' && <Panel><SectionTitle title="Account security and identity" detail="Use the existing Mela account settings for available account controls. Advanced security actions need backend authentication support."/>
          <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><b className="block text-sm text-slate-900">Mela account settings</b><span className="mt-1 block text-xs text-slate-500">Open Settings from your account menu for available profile and security options.</span></div><ExternalResource title="FTC identity theft guidance" detail="Recognize, report and recover from identity theft" url="https://identitytheft.gov/"/></div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600"><li>Two-factor authentication and recovery codes</li><li>Device and active-session management</li><li>Login history and suspicious sign-in alerts</li><li>Secure password reset and account recovery</li><li>Fraud and impersonation reporting</li></ul>
          <p className="mt-3 text-xs text-slate-500">The demo does not claim to enable 2FA, biometric login or revoke sessions.</p>
        </Panel>}

        {active === 'vehicle' && <Panel><SectionTitle title="Service vehicle safety" detail="A planning register for future vehicle records. No inspections or maintenance are submitted to an insurer or authority."/>
          <div className="grid gap-3 sm:grid-cols-2">{['Pre-trip walkaround','Tires, lights and mirrors','Brakes and warning indicators','First-aid kit and emergency supplies','Registration and insurance expiry','Maintenance and mileage log','Fuel and charging records','Roadside assistance plan'].map(item => <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><CarFront className="h-4 w-4 text-slate-500"/><span className="text-sm text-slate-700">{item}</span></div>)}</div>
        </Panel>}

        {active === 'protection' && <Panel><SectionTitle title="Payment and customer protection" detail="Information and future workflow placeholders. Payment holds, escrow, refunds and claims are not activated by this demo."/>
          <div className="grid gap-3 sm:grid-cols-2"><ExternalResource title="FTC – Avoid scams" detail="Recognize payment and service scams" url="https://consumer.ftc.gov/scams"/><ExternalResource title="Consumer complaint guidance" detail="Learn how to report a consumer issue" url="https://www.ftc.gov/about-ftc/bureaus-offices/bureau-consumer-protection"/></div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600"><li>Payment status and transaction history</li><li>Dispute and refund request tracking</li><li>Fraud reporting and investigation workflow</li><li>Insurance claim document checklist</li><li>Clear customer and technician protection policies</li></ul>
        </Panel>}

        {(active === 'driving' || active === 'electrical' || active === 'animals' || active === 'plants' || active === 'ergonomics' || active === 'physical') && <Panel>
          <SectionTitle title={current.label} detail="Free official safety guidance and learning resources. Follow your employer's safety plan, applicable regulations and qualified training."/>
          <div className="grid gap-3 sm:grid-cols-2">
            {active === 'driving' && <>
              <ExternalResource title="OSHA – Motor vehicle safety" detail="Work-related driving hazards, fleet safety and prevention guidance" url="https://www.osha.gov/motor-vehicle-safety"/>
              <ExternalResource title="NHTSA – Safe driving" detail="Federal road-safety information, vehicle recalls and safe-driving resources" url="https://www.nhtsa.gov/road-safety"/>
              <ExternalResource title="Distracted driving" detail="Understand distraction risks and safer driving practices" url="https://www.nhtsa.gov/risky-driving/distracted-driving"/>
            </>}
            {active === 'electrical' && <>
              <ExternalResource title="OSHA – Electrical safety" detail="Electrical hazards, safe work practices and standards" url="https://www.osha.gov/electrical"/>
              <ExternalResource title="OSHA – Lockout / tagout" detail="Control hazardous energy before servicing equipment" url="https://www.osha.gov/control-hazardous-energy"/>
              <ExternalResource title="Electrical safety videos" detail="Free electrical safety demonstrations and training video search" url="https://www.youtube.com/results?search_query=electrical+safety+training+OSHA"/>
            </>}
            {active === 'animals' && <>
              <ExternalResource title="CDC – Healthy pets and animal safety" detail="Guidance for preventing bites, scratches and animal-related illness" url="https://www.cdc.gov/healthy-pets/about/index.html"/>
              <ExternalResource title="CDC – Dog bites" detail="Prevention information for working around dogs" url="https://www.cdc.gov/dog-bites/about/index.html"/>
              <ExternalResource title="Working around animals" detail="Free animal-safety training video search" url="https://www.youtube.com/results?search_query=worker+safety+working+around+dogs+animals"/>
            </>}
            {active === 'plants' && <>
              <ExternalResource title="Poison Control – Plants" detail="Identify and respond to possible poisonous plant exposures" url="https://www.poison.org/articles/plant"/>
              <ExternalResource title="OSHA – Pesticides" detail="Worker protection and pesticide exposure guidance" url="https://www.osha.gov/pesticides"/>
              <ExternalResource title="CDC – Outdoor workers" detail="Outdoor work hazards, including plants, insects, heat and exposure" url="https://www.cdc.gov/niosh/outdoor-workers/about/index.html"/>
            </>}
            {active === 'ergonomics' && <>
              <ExternalResource title="OSHA – Ergonomics" detail="Prevent work-related musculoskeletal disorders" url="https://www.osha.gov/ergonomics"/>
              <ExternalResource title="NIOSH – Safe lifting" detail="Research and guidance for reducing lifting-related injuries" url="https://www.cdc.gov/niosh/topics/ergonomics/"/>
              <ExternalResource title="Back and shoulder care videos" detail="Free workplace ergonomics and safe-lifting video search" url="https://www.youtube.com/results?search_query=OSHA+ergonomics+safe+lifting+back+shoulder"/>
            </>}
            {active === 'physical' && <>
              <ExternalResource title="OSHA – Personal protective equipment" detail="PPE selection, use and workplace protection guidance" url="https://www.osha.gov/personal-protective-equipment"/>
              <ExternalResource title="OSHA – Fall protection" detail="Prevent falls when working at heights and on ladders" url="https://www.osha.gov/fall-protection"/>
              <ExternalResource title="NIOSH – Construction safety" detail="Research-based information for construction and trade workers" url="https://www.cdc.gov/niosh/construction/"/>
            </>}
          </div>
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">Training links support awareness; they do not replace hands-on instruction, required certification, site-specific hazard assessments or emergency procedures. For immediate danger, stop work when safe and contact emergency services or your supervisor.</p>
        </Panel>}

        {active === 'learning' && <Panel><SectionTitle title="Safety videos & OSHA learning" detail="Workplace safety awareness, video lessons and official OSHA references. Use the separate Mela Learning Center for practical trade skills and projects."/>
          <div className="grid gap-3 sm:grid-cols-2">{learningItems.map(item => <ExternalResource key={item.title} {...item}/>)}</div>
          <div className="mt-4 rounded-xl bg-slate-50 p-4"><b className="text-sm text-slate-900">Suggested learning tracks</b><p className="mt-1 text-sm leading-6 text-slate-600">Construction safety · OSHA awareness · First aid and CPR · Customer service · Small-business operations · Digital and AWS skills · Trade-specific continuing education.</p></div>
        </Panel>}

        {active === 'support' && <Panel><SectionTitle title="Help and support" detail="Use existing support channels and official emergency resources. Live chat and ticket submission require the support backend."/>
          <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 p-4"><b className="block text-sm text-slate-900">Mela support</b><span className="mt-1 block text-xs text-slate-500">Use the Support option available in your account menu.</span></div><ExternalResource title="Ready.gov emergency resources" detail="Preparedness information for households and workplaces" url="https://www.ready.gov/"/></div>
          <div className="mt-4 rounded-xl border border-slate-200 p-4"><b className="text-sm">Future support tools</b><p className="mt-1 text-sm text-slate-600">Support tickets, file attachments, issue tracking, response status, service-level targets, feedback and emergency escalation guidance.</p></div>
        </Panel>}

        {active === 'contacts' && <Panel><SectionTitle title="Trusted and emergency contacts" detail="Add temporary demo contacts in this page session. They are not saved, notified or called by Mela."/>
          <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Contact name<input value={contactName} onChange={event => setContactName(event.target.value)} placeholder="Name" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-normal"/></label><label className="text-sm font-semibold text-slate-700">Phone number<input value={contactPhone} onChange={event => setContactPhone(event.target.value)} placeholder="Phone number" className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-normal"/></label></div>
          <button onClick={addContact} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Plus className="h-4 w-4"/> Add demo contact</button>
          <div className="mt-4 space-y-2">{contacts.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No demo contacts added.</p> : contacts.map((contact,index) => <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 p-3"><span><b className="block text-sm">{contact.name}</b><span className="text-xs text-slate-500">{contact.phone}</span></span><a href={'tel:'+contact.phone} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">Call</a></div>)}</div>
        </Panel>}
        <p className="text-xs leading-5 text-slate-500">Mela Safety Center demo · Sample interactions reset when the page is refreshed. Emergency calling, provider listings, alerts, secure storage, account security and official compliance verification require production integrations and testing.</p>
      </main>
    </div>
  </div>;
}
