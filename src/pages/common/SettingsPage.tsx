import { useState } from 'react';
import { Bell, Globe, Monitor, ShieldCheck } from 'lucide-react';

export function SettingsPage() {
 const [emailUpdates,setEmailUpdates]=useState(()=>localStorage.getItem('mela-pref-email')!=='false');
 const [serviceAlerts,setServiceAlerts]=useState(()=>localStorage.getItem('mela-pref-alerts')!=='false');
 const [reducedMotion,setReducedMotion]=useState(()=>localStorage.getItem('mela-pref-motion')==='true');
 const [saved,setSaved]=useState(false);
 function save(key:string,value:boolean,setter:(value:boolean)=>void){setter(value);localStorage.setItem(key,String(value));setSaved(true)}
 return <div className="mx-auto max-w-3xl space-y-6"><div><h2 className="text-xl font-bold text-gray-900">Settings & preferences</h2><p className="mt-1 text-sm text-gray-500">Manage how Mela behaves on this device.</p></div>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4"><Bell className="h-5 w-5 text-primary-700"/><div><h3 className="font-semibold text-gray-900">Notifications</h3><p className="text-xs text-gray-500">Local demo preferences only</p></div></div>
   <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-gray-100 px-5 py-4"><span><span className="block text-sm font-medium text-gray-800">Email updates</span><span className="block text-xs text-gray-500">Receive service and account update preferences</span></span><input type="checkbox" checked={emailUpdates} onChange={e=>save('mela-pref-email',e.target.checked,setEmailUpdates)} className="h-5 w-5 accent-[#2f624f]"/></label>
   <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"><span><span className="block text-sm font-medium text-gray-800">Service alerts</span><span className="block text-xs text-gray-500">Show booking and workflow alert preferences</span></span><input type="checkbox" checked={serviceAlerts} onChange={e=>save('mela-pref-alerts',e.target.checked,setServiceAlerts)} className="h-5 w-5 accent-[#2f624f]"/></label>
  </section>
  <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4"><Monitor className="h-5 w-5 text-primary-700"/><div><h3 className="font-semibold text-gray-900">Display</h3><p className="text-xs text-gray-500">Accessibility preferences</p></div></div>
   <label className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"><span><span className="block text-sm font-medium text-gray-800">Reduce motion preference</span><span className="block text-xs text-gray-500">Remember your preference for reduced animation</span></span><input type="checkbox" checked={reducedMotion} onChange={e=>save('mela-pref-motion',e.target.checked,setReducedMotion)} className="h-5 w-5 accent-[#2f624f]"/></label>
  </section>
  <div className="flex items-center gap-2 text-xs text-gray-500"><Globe className="h-4 w-4"/>Language can be changed from the language selector in the page header.</div>
  {saved&&<p role="status" aria-live="polite" className="text-sm font-medium text-green-700"><ShieldCheck className="mr-1 inline h-4 w-4"/>Preferences saved on this device.</p>}
  <p className="text-xs text-gray-500">These settings are stored in this browser only. They are not yet synchronized with your Mela account.</p>
 </div>;
}