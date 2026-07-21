export interface NetworkDevice{id:string;name:string;type:'client'|'server'|'workstation'|'switch'|'router'|'accessPoint'|'firewall'|'multifunction';category:'endDevice'|'intermediaryDevice';roles:string[];osiLayers:number[];description:string}
export interface NetworkLink{id:string;fromDeviceId:string;toDeviceId:string;medium:'copper'|'fiber'|'wireless'|'logical';status:'up'|'down'|'degraded'}
export interface NetworkScenario{id:string;title:string;description:string;networkType:'LAN'|'WAN'|'SOHO'|'mixed';topology:string;devices:NetworkDevice[];links:NetworkLink[];sourceDeviceId?:string;destinationDeviceId?:string;expectedPath?:string[]}
export const devices:NetworkDevice[]=[
{id:'pc',name:'Рабочая станция',type:'workstation',category:'endDevice',roles:['клиент','пользовательский узел'],osiLayers:[1,2,3,4,7],description:'Конечный узел пользователя, который обращается к сервисам.'},
{id:'server',name:'Сервер',type:'server',category:'endDevice',roles:['поставщик сервиса'],osiLayers:[1,2,3,4,7],description:'Конечный узел, предоставляющий сервис нескольким клиентам.'},
{id:'switch',name:'Коммутатор',type:'switch',category:'intermediaryDevice',roles:['локальная пересылка кадров'],osiLayers:[1,2],description:'Соединяет устройства локального сегмента и пересылает кадры.'},
{id:'router',name:'Маршрутизатор',type:'router',category:'intermediaryDevice',roles:['соединение IP-сетей','выбор пути'],osiLayers:[1,2,3],description:'Соединяет разные сети и направляет пакеты между ними.'},
{id:'ap',name:'Точка доступа',type:'accessPoint',category:'intermediaryDevice',roles:['доступ Wi‑Fi','мост в проводную сеть'],osiLayers:[1,2],description:'Подключает беспроводные узлы к локальной сети, но не обязана быть маршрутизатором.'},
{id:'firewall',name:'Firewall',type:'firewall',category:'intermediaryDevice',roles:['фильтрация трафика','контроль доступа'],osiLayers:[3,4,7],description:'Разрешает или блокирует трафик по заданной политике.'},
{id:'home-router',name:'Домашний роутер',type:'multifunction',category:'intermediaryDevice',roles:['router','switch','access point','DHCP','NAT','firewall'],osiLayers:[1,2,3,4],description:'Одно физическое устройство, совмещающее несколько логических функций.'}
];
export const osiLayers=[
{n:7,name:'Прикладной',purpose:'Сетевые приложения и пользовательские сервисы',examples:'HTTP, DNS'},
{n:6,name:'Представления',purpose:'Формат, кодирование и шифрование данных',examples:'TLS, UTF‑8'},
{n:5,name:'Сеансовый',purpose:'Управление сеансом взаимодействия',examples:'Сеанс'},
{n:4,name:'Транспортный',purpose:'Доставка между процессами и порты',examples:'TCP, UDP'},
{n:3,name:'Сетевой',purpose:'Адресация и доставка между сетями',examples:'IP, router'},
{n:2,name:'Канальный',purpose:'Локальная доставка по одному сегменту',examples:'Ethernet, switch'},
{n:1,name:'Физический',purpose:'Сигнал, среда и передача битов',examples:'Кабель, радио'}
];
export const tcpIpLayers=[{name:'Прикладной',osi:'7–5',purpose:'Приложения, представление и сеанс'},{name:'Транспортный',osi:'4',purpose:'TCP/UDP, порты и доставка процессам'},{name:'Интернет',osi:'3',purpose:'IP и доставка между сетями'},{name:'Сетевой доступ',osi:'2–1',purpose:'Локальная доставка и физическая передача'}];
export const pdu=['Данные','Сегмент / датаграмма','Пакет','Кадр','Биты'];
const scenarioDevices=[devices[0],devices[2],devices[3],{...devices[1],id:'remote-server'}];
export const scenarios:NetworkScenario[]=[{id:'office-web',title:'Клиент открывает web‑сервис',description:'Рабочая станция обращается к серверу в другой сети.',networkType:'mixed',topology:'расширенная звезда',devices:scenarioDevices,links:[{id:'l1',fromDeviceId:'pc',toDeviceId:'switch',medium:'copper',status:'up'},{id:'l2',fromDeviceId:'switch',toDeviceId:'router',medium:'copper',status:'up'},{id:'l3',fromDeviceId:'router',toDeviceId:'remote-server',medium:'fiber',status:'up'}],sourceDeviceId:'pc',destinationDeviceId:'remote-server',expectedPath:['pc','switch','router','remote-server']}];
export function classifyDevice(id:string){return devices.find(d=>d.id===id)}
export function mapOsiToTcp(layer:number){return layer>=5?'Прикладной':layer===4?'Транспортный':layer===3?'Интернет':'Сетевой доступ'}
export function encapsulate(){return [...pdu]};export function decapsulate(){return [...pdu].reverse()}
export function findPath(s:NetworkScenario,from:string,to:string){const graph=new Map<string,string[]>();for(const l of s.links.filter(x=>x.status!=='down')){graph.set(l.fromDeviceId,[...(graph.get(l.fromDeviceId)||[]),l.toDeviceId]);graph.set(l.toDeviceId,[...(graph.get(l.toDeviceId)||[]),l.fromDeviceId])}const queue:[[string,string[]]]=[[from,[from]]];const seen=new Set([from]);while(queue.length){const [node,path]=queue.shift()!;if(node===to)return path;for(const next of graph.get(node)||[])if(!seen.has(next)){seen.add(next);queue.push([next,[...path,next]])}}return []}
export function validateScenario(s:NetworkScenario){const ids=new Set(s.devices.map(d=>d.id));return s.links.every(l=>ids.has(l.fromDeviceId)&&ids.has(l.toDeviceId))&&(!s.expectedPath||s.expectedPath.every(x=>ids.has(x)))}
export function diagnosticLayer(symptom:string){const x=symptom.toLowerCase();if(/кабел|сигнал|индикатор|link/.test(x))return 1;if(/локальн|кадр|коммут/.test(x))return 2;if(/ip|между сет|маршрут/.test(x))return 3;if(/порт|tcp|udp/.test(x))return 4;if(/прилож|сервис/.test(x))return 7;return 0}
