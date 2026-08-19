export const portRange=(port:number)=>{if(!Number.isInteger(port)||port<0||port>65535)throw new Error('Некорректный порт');return port<=1023?'well-known':port<=49151?'registered':'dynamic'};
export const socketId=(protocol:'TCP'|'UDP',sourceIp:string,sourcePort:number,destinationIp:string,destinationPort:number)=>`${protocol} ${sourceIp}:${sourcePort} → ${destinationIp}:${destinationPort}`;
export const chooseTransport=(needsReliability:boolean,latencySensitive:boolean)=>needsReliability?'TCP':latencySensitive?'UDP':'UDP';
export type TcpState='CLOSED'|'SYN-SENT'|'SYN-RECEIVED'|'ESTABLISHED';
export function tcpHandshakeStep(state:TcpState,packet:'SYN'|'SYN-ACK'|'ACK'):TcpState{if(state==='CLOSED'&&packet==='SYN')return'SYN-SENT';if(state==='SYN-SENT'&&packet==='SYN-ACK')return'SYN-RECEIVED';if(state==='SYN-RECEIVED'&&packet==='ACK')return'ESTABLISHED';return state}
export const nextAck=(sequence:number,payloadBytes:number)=>sequence+payloadBytes;
export function deliveredSegments(segments:{seq:number;length:number}[]){return[...segments].sort((a,b)=>a.seq-b.seq).reduce((ack,x)=>x.seq===ack?ack+x.length:ack,segments.length?Math.min(...segments.map(x=>x.seq)):0)}
