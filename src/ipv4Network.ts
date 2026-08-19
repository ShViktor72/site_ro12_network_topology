export const ipv4ToInt=(ip:string)=>{const parts=ip.split('.').map(Number);if(parts.length!==4||parts.some(x=>!Number.isInteger(x)||x<0||x>255))throw new Error('Некорректный IPv4');return parts.reduce((n,x)=>(n*256+x)>>>0,0)};
export const prefixMask=(prefix:number)=>{if(!Number.isInteger(prefix)||prefix<0||prefix>32)throw new Error('Некорректный префикс');return prefix===0?0:(0xffffffff<<(32-prefix))>>>0};
export const sameSubnet=(a:string,b:string,prefix:number)=>((ipv4ToInt(a)&prefixMask(prefix))>>>0)===((ipv4ToInt(b)&prefixMask(prefix))>>>0);
export const nextHop=(source:string,destination:string,prefix:number,gateway:string)=>sameSubnet(source,destination,prefix)?destination:gateway;
export interface ArpEntry{ip:string;mac:string;age:number}
export const updateArp=(cache:ArpEntry[],ip:string,mac:string)=>[...cache.filter(x=>x.ip!==ip),{ip,mac:mac.toUpperCase(),age:0}];
export const ageArp=(cache:ArpEntry[],seconds:number,maxAge=120)=>cache.map(x=>({...x,age:x.age+seconds})).filter(x=>x.age<maxAge);
export const decrementTtl=(ttl:number)=>({ttl:Math.max(0,ttl-1),expired:ttl<=1});
