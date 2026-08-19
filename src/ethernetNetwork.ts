export interface MacEntry{mac:string;port:number;age:number}
export const normalizeMac=(mac:string)=>mac.trim().toUpperCase().replaceAll('-',':');
export function macKind(mac:string){const value=normalizeMac(mac);if(value==='FF:FF:FF:FF:FF:FF')return'broadcast';const first=Number.parseInt(value.slice(0,2),16);return Number.isFinite(first)&&Boolean(first&1)?'multicast':'unicast'}
export function learn(table:MacEntry[],sourceMac:string,port:number){const mac=normalizeMac(sourceMac),rest=table.filter(x=>x.mac!==mac);return[...rest,{mac,port,age:0}]}
export function forwardingPorts(table:MacEntry[],destinationMac:string,inPort:number,ports:number[]){const kind=macKind(destinationMac);if(kind!=='unicast')return ports.filter(x=>x!==inPort);const entry=table.find(x=>x.mac===normalizeMac(destinationMac));if(!entry)return ports.filter(x=>x!==inPort);return entry.port===inPort?[]:[entry.port]}
export function ageTable(table:MacEntry[],seconds:number,maxAge=300){return table.map(x=>({...x,age:x.age+seconds})).filter(x=>x.age<maxAge)}
