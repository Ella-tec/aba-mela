export type RecycleItem={id:string;source:string;kind:string;name:string;deletedAt:string;payload:unknown};
const RECYCLE_KEY='mela-global-recycle-bin-v1';
export function getRecycleBin():RecycleItem[]{try{return JSON.parse(localStorage.getItem(RECYCLE_KEY)||'[]') as RecycleItem[]}catch{return []}}
export function addToRecycleBin(item:Omit<RecycleItem,'deletedAt'>){const current=getRecycleBin();localStorage.setItem(RECYCLE_KEY,JSON.stringify([{...item,deletedAt:new Date().toISOString()},...current]));}
export function removeFromRecycleBin(id:string){localStorage.setItem(RECYCLE_KEY,JSON.stringify(getRecycleBin().filter(x=>x.id!==id)));}
export function clearRecycleBin(){localStorage.setItem(RECYCLE_KEY,'[]');}
