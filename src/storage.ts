const KEY='sysadmin-lab-progress-v1';
export interface Progress{visited:string[];completed:string[];lastRoute:string}
const empty:Progress={visited:[],completed:[],lastRoute:'/sections/network-architecture'};
export function loadProgress():Progress{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&Array.isArray(v.visited)&&Array.isArray(v.completed)?{...empty,...v}:empty}catch{return empty}}
export function visit(id:string,route:string){const p=loadProgress();p.visited=[...new Set([...p.visited,id])];p.lastRoute=route.startsWith('/sections')?route:`/sections/${id}`;localStorage.setItem(KEY,JSON.stringify(p))}
export function resetProgress(){localStorage.removeItem(KEY)}
export interface SectionProgress{visited:string[];completed:string[];answers:number;correct:number;bestScore:number;attempts:number;hints:number;streak:number;bestStreak:number;errors:Record<string,number>}
const blank=():SectionProgress=>({visited:[],completed:[],answers:0,correct:0,bestScore:0,attempts:0,hints:0,streak:0,bestStreak:0,errors:{}});const sectionKey=(id:string)=>`sysadmin-lab-section-${id}-v1`;
export function loadSectionProgress(id:string):SectionProgress{try{const v=JSON.parse(localStorage.getItem(sectionKey(id))||'null');return v&&Array.isArray(v.visited)&&Array.isArray(v.completed)?{...blank(),...v,errors:{...(v.errors||{})}}:blank()}catch{return blank()}}
export function saveSectionProgress(id:string,p:SectionProgress){localStorage.setItem(sectionKey(id),JSON.stringify(p))}
export function visitStep(id:string,step:string,route:string){const p=loadSectionProgress(id);p.visited=[...new Set([...p.visited,step])];saveSectionProgress(id,p);visit(id,route)}
export function completeStep(id:string,step:string){const p=loadSectionProgress(id);p.completed=[...new Set([...p.completed,step])];saveSectionProgress(id,p)}
export function recordAnswer(id:string,topic:string,ok:boolean){const p=loadSectionProgress(id);p.answers++;if(ok){p.correct++;p.streak++;p.bestStreak=Math.max(p.bestStreak,p.streak)}else{p.streak=0;p.errors[topic]=(p.errors[topic]||0)+1}saveSectionProgress(id,p)}
export function recordAttempt(id:string,score:number){const p=loadSectionProgress(id);p.attempts++;p.bestScore=Math.max(p.bestScore,score);saveSectionProgress(id,p)}
export type Theme='light'|'dark'|'system';export function getTheme():Theme{const t=localStorage.getItem('sysadmin-lab-theme');return t==='light'||t==='dark'||t==='system'?t:'system'}
export function setTheme(t:Theme){localStorage.setItem('sysadmin-lab-theme',t);applyTheme()}
export function applyTheme(){const t=getTheme();document.documentElement.dataset.theme=t==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t}
