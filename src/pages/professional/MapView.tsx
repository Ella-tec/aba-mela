import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LiveMap } from '@/components/maps/LiveMap';
import { MOCK_TECHNICIANS, MOCK_MAP_JOBS } from '@/data/mock';
import { Flame, MapPin } from 'lucide-react';

export function ProfessionalMapView(){
 const {t}=useTranslation();const myJobs=MOCK_MAP_JOBS.filter(j=>j.techId==='T1'||j.status==='requested');const hotJobs=MOCK_MAP_JOBS.filter(j=>j.isHot);const techs=MOCK_TECHNICIANS.filter(person=>person.id==='T1'||person.status==='available');
 return <div className="space-y-6"><h2 className="text-xl font-bold text-gray-900">{t('maps.title')}</h2><p className="text-xs text-amber-700">Map pins are illustrative demo data, not live provider locations.</p><LiveMap technicians={techs} jobs={myJobs} height="420px"/>
  {hotJobs.length>0&&<section className="overflow-hidden rounded-xl border border-orange-200 bg-white"><div className="flex items-center gap-2 border-b border-orange-100 bg-orange-50 px-5 py-3 font-semibold text-orange-800"><Flame className="h-5 w-5"/>{t('professional.hotJobs')} on map</div><div className="divide-y divide-gray-100">{hotJobs.map(j=><div key={j.id} className="flex items-center justify-between gap-3 px-5 py-3"><div><div className="font-medium text-gray-900">{j.service}</div><div className="flex items-center gap-1 text-sm text-gray-500"><MapPin className="h-3.5 w-3.5"/>{j.address}</div></div><Link to="/professional/hot-jobs" className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700">Review job</Link></div>)}</div></section>}
 </div>;
}