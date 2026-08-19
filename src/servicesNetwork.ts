export type DhcpState='INIT'|'SELECTING'|'REQUESTING'|'BOUND';
export function dhcpStep(state:DhcpState,message:'DISCOVER'|'OFFER'|'REQUEST'|'ACK'):DhcpState{if(state==='INIT'&&message==='DISCOVER')return'SELECTING';if(state==='SELECTING'&&message==='OFFER')return'REQUESTING';if(state==='REQUESTING'&&message==='REQUEST')return'REQUESTING';if(state==='REQUESTING'&&message==='ACK')return'BOUND';return state}
export interface DnsRecord{name:string;type:'A'|'AAAA'|'CNAME'|'MX'|'NS';value:string;ttl:number}
export const findDns=(records:DnsRecord[],name:string,type:DnsRecord['type'])=>records.find(x=>x.name===name&&x.type===type);
export const ageDns=(records:DnsRecord[],seconds:number)=>records.map(x=>({...x,ttl:x.ttl-seconds})).filter(x=>x.ttl>0);
export interface NatEntry{insideIp:string;insidePort:number;publicIp:string;publicPort:number;protocol:'TCP'|'UDP'}
export function addPat(table:NatEntry[],insideIp:string,insidePort:number,publicIp:string,protocol:'TCP'|'UDP'){let publicPort=40000;const used=new Set(table.map(x=>x.publicPort));while(used.has(publicPort))publicPort++;return[...table,{insideIp,insidePort,publicIp,publicPort,protocol}]}
export const reversePat=(table:NatEntry[],publicIp:string,publicPort:number,protocol:'TCP'|'UDP')=>table.find(x=>x.publicIp===publicIp&&x.publicPort===publicPort&&x.protocol===protocol);
