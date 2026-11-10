import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_REVIEWS } from '@/data/mock';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfessionalReviews(){
 const {t}=useTranslation();const reviews=MOCK_REVIEWS;
 const avg=reviews.length>0?(reviews.reduce((sum,review)=>sum+review.rating,0)/reviews.length).toFixed(1):'—';
 return <div className="space-y-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900">{t('reviews.title')}</h2><Link to="/professional/reviews#reviews-list" aria-label="Jump to customer reviews" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 hover:border-primary-300"><Star className="h-5 w-5 fill-amber-400 text-amber-400"/><span className="text-lg font-bold">{avg}</span><span className="text-sm text-gray-500">({reviews.length})</span></Link></div>
  <section id="reviews-list" className="overflow-hidden rounded-xl border border-gray-200 bg-white">{reviews.length===0?<div className="p-8 text-center text-gray-500">{t('reviews.noReviews')}</div>:<div className="divide-y divide-gray-100">{reviews.map(r=><article key={r.id} className="px-5 py-4"><div className="flex items-center justify-between"><div className="font-medium text-gray-900">{r.service}</div><div className="flex items-center gap-0.5" aria-label={r.rating+' out of 5 stars'}>{Array.from({length:5}).map((_,i)=><Star key={i} aria-hidden="true" className={cn('h-4 w-4',i<r.rating?'fill-amber-400 text-amber-400':'text-gray-200')}/>)}</div></div><p className="mt-2 text-sm text-gray-600">{r.comment}</p><div className="mt-2 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div></article>)}</div>}</section>
 </div>;
}