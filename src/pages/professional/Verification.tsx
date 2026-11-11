import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_VERIFICATION } from '@/data/mock';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Upload, ShieldCheck, FileCheck2, Camera, Eye, ClipboardCheck, CheckCircle2, LockKeyhole, Info, FileText, X } from 'lucide-react';

type LocalUpload={name:string;url:string;size:number;type:string};
const accepted='.pdf,.png,.jpg,.jpeg,.docx';
const allowed=['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const benefits=['Unlock more jobs','Build customer trust','Get faster approvals','Improve profile ranking','Qualify for premium jobs','Increase booking opportunities'];

export function ProfessionalVerification(){
 const approved=MOCK_VERIFICATION.filter(v=>v.status==='approved').length;
 const total=MOCK_VERIFICATION.length;
 const [uploads,setUploads]=useState<Record<string,LocalUpload>>({});
 const [assessmentStarted,setAssessmentStarted]=useState(false);
 const [notice,setNotice]=useState('');
 const [preview,setPreview]=useState<LocalUpload|null>(null);
 function handleFile(id:string,file?:File){
  if(!file)return;
  const extension=file.name.split('.').pop()?.toLowerCase()||'';
  if(!['pdf','png','jpg','jpeg','docx'].includes(extension)&&!allowed.includes(file.type)){setNotice('Unsupported file. Please choose PDF, PNG, JPG, JPEG or DOCX.');return;}
  if(file.size>15*1024*1024){setNotice('Please choose a file smaller than 15 MB.');return;}
  const url=URL.createObjectURL(file);
  setUploads(current=>{if(current[id])URL.revokeObjectURL(current[id].url);return {...current,[id]:{name:file.name,url,size:file.size,type:file.type}}});
  setNotice(file.name+' is ready in this browser session. It has not been submitted to Mela.');
 }
 const fieldClass='inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-primary-300 hover:bg-primary-50';
 return <div className="space-y-6">
  <div><div className="flex items-center gap-2 text-primary-800"><ShieldCheck className="h-5 w-5"/><span className="text-xs font-semibold uppercase tracking-[.16em]">Trust & safety</span></div><h2 className="mt-2 text-xl font-bold text-gray-900">{t('verification.title')}</h2><p className="mt-1 text-sm text-gray-500">Complete your profile checks to help customers feel confident booking you.</p></div>
  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-gray-700">Verification progress</p><p className="mt-1 text-2xl font-bold text-gray-950">{approved} of {total} requirements approved</p><p className="mt-1 text-sm text-gray-500">{Math.round(approved/total*100)}% complete</p></div><div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-lg font-bold text-primary-800">{Math.round(approved/total*100)}%</div></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-primary-600 transition-all" style={{width:(approved/total*100)+'%'}}/></div><div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500"><span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-green-600"/>Approved</span><span className="inline-flex items-center gap-1"><ClockIcon/>Pending review</span><span className="inline-flex items-center gap-1"><Info className="h-3.5 w-3.5 text-orange-500"/>Action required</span></div></section>
  <section id="verification-documents" className="space-y-3"><div><h3 className="text-lg font-bold text-gray-900">Verification requirements</h3><p className="text-sm text-gray-500">Upload a clear, current document for each requirement. You can replace a file before submitting it.</p></div>
   {MOCK_VERIFICATION.map(item=>{const upload=uploads[item.id];const started=item.id==='VF-3'&&assessmentStarted;const actionNeeded=item.status==='notStarted'||item.status==='rejected'||item.status==='expired';return <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><div className="flex items-center gap-2"><FileCheck2 className="h-5 w-5 shrink-0 text-primary-700"/><h4 className="font-semibold text-gray-900">{item.label}</h4></div>{item.submittedAt&&<p className="mt-1 text-xs text-gray-500">Submitted {new Date(item.submittedAt).toLocaleDateString()}</p>}{item.notes&&<p className="mt-1 text-sm text-gray-500">{item.notes}</p>}{started&&<p className="mt-1 text-xs text-blue-700">Assessment started in this demo. Your progress is not submitted.</p>}{upload&&<p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-800"><FileCheck2 className="h-3.5 w-3.5"/>Selected: {upload.name} · {(upload.size/1024).toFixed(0)} KB</p>}</div><div className="flex items-center gap-2"><VerificationBadge status={item.status}/></div></div>
    <div className="mt-4 flex flex-wrap gap-2">
     <label className={fieldClass}><Upload className="h-4 w-4"/>{upload?'Replace document':'Upload document'}<input type="file" accept={accepted} className="sr-only" onChange={e=>{handleFile(item.id,e.target.files?.[0]);e.currentTarget.value=''}}/></label>
     <label className={fieldClass}><Camera className="h-4 w-4"/>Take photo<input type="file" accept="image/*" capture="environment" className="sr-only" onChange={e=>{handleFile(item.id,e.target.files?.[0]);e.currentTarget.value=''}}/></label>
     {upload&&<><button type="button" onClick={()=>setPreview(upload)} className={fieldClass}><Eye className="h-4 w-4"/>View upload</button><a href={upload.url} download={upload.name} className={fieldClass}><DownloadIcon/>Download</a></>}
     {item.id==='VF-3'&&<button type="button" onClick={()=>{setAssessmentStarted(true);setNotice('Skills assessment started in this browser demo. No result has been submitted.')}} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-800"><ClipboardCheck className="h-4 w-4"/>{started?'Continue assessment':'Start assessment'}</button>}
     {actionNeeded&&!upload&&<span className="self-center text-xs text-orange-700">Action required to complete this item</span>}
    </div>
   </article>})}
  </section>
  <section className="rounded-2xl border border-primary-100 bg-primary-50/70 p-5"><div className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-primary-800"/><h3 className="font-bold text-gray-900">Why complete verification?</h3></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(benefit=><div key={benefit} className="flex items-center gap-2 text-sm font-medium text-gray-700"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-600"/>{benefit}</div>)}</div><Link to="/professional/jobs" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-800">Explore available jobs</Link></section>
  <section className="rounded-xl border border-gray-200 bg-white p-5"><h3 className="font-semibold text-gray-900">Supported verification documents</h3><p className="mt-1 text-sm text-gray-500">You may upload these document types where applicable:</p><div className="mt-3 flex flex-wrap gap-2">{['Driver’s License','Passport','State ID','National ID','Trade License','Business License','Professional Certificate','Insurance Certificate','Background Check Documents'].map(name=><span key={name} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">{name}</span>)}</div><p className="mt-3 text-xs text-gray-500">Accepted formats: PDF, PNG, JPG, JPEG and DOCX · Maximum 15 MB per file.</p></section>
  <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"><Info className="mt-0.5 h-4 w-4 shrink-0"/>Demo mode: files are selected and previewed locally in this browser session only. They are not securely uploaded, stored on Mela’s server, or reviewed by a verification team. Do not upload sensitive identity documents until secure server upload is enabled.</div>
  {notice&&<p role="status" aria-live="polite" className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>}
  {preview&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label="Document preview"><div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><h3 className="font-bold text-gray-900">Current upload</h3><p className="truncate text-sm text-gray-500">{preview.name}</p></div><button type="button" onClick={()=>setPreview(null)} aria-label="Close preview" className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button></div>{preview.type.startsWith('image/')?<img src={preview.url} alt={preview.name} className="mt-4 max-h-[65vh] w-full rounded-lg object-contain"/>:<div className="mt-4 rounded-lg bg-gray-50 p-8 text-center"><FileText className="mx-auto h-10 w-10 text-primary-700"/><p className="mt-2 text-sm text-gray-600">This file type opens in a separate tab.</p><a href={preview.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white">Open document</a></div>}</div></div>}
 </div>;
}

function ClockIcon(){return <span className="inline-block h-3 w-3 rounded-full border-2 border-orange-500"/>}
function DownloadIcon(){return <span className="inline-flex"><DownloadGlyph/></span>}
function DownloadGlyph(){return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></svg>}
