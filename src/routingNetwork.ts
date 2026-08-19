import {ipv4ToInt,prefixMask} from './ipv4Network.ts';
export interface Route{network:string;prefix:number;nextHop:string|null;interface:string;metric:number;source:'connected'|'static'|'dynamic'|'default'}
export const routeMatches=(route:Route,destination:string)=>((ipv4ToInt(route.network)&prefixMask(route.prefix))>>>0)===((ipv4ToInt(destination)&prefixMask(route.prefix))>>>0);
export function selectRoute(routes:Route[],destination:string){return routes.filter(x=>routeMatches(x,destination)).sort((a,b)=>b.prefix-a.prefix||a.metric-b.metric)[0]}
export const addStaticRoute=(routes:Route[],network:string,prefix:number,nextHop:string,metric=1):Route[]=>[...routes,{network,prefix,nextHop,interface:'via next hop',metric,source:'static'}];
export function traceRoute(graph:Record<string,string[]>,start:string,end:string){const queue=[[start]],seen=new Set([start]);while(queue.length){const path=queue.shift()!;const last=path.at(-1)!;if(last===end)return path;for(const next of graph[last]||[])if(!seen.has(next)){seen.add(next);queue.push([...path,next])}}return[]}
