export type MediumId='utp'|'fiber'|'wifi';
export interface Medium{id:MediumId;name:string;distance:string;speed:string;immune:boolean;use:string}
export const media:Medium[]=[
  {id:'utp',name:'Медная витая пара',distance:'до 100 м',speed:'до 10 Гбит/с',immune:false,use:'рабочие места, телефоны, точки доступа'},
  {id:'fiber',name:'Оптоволокно',distance:'от сотен метров до километров',speed:'10–400+ Гбит/с',immune:true,use:'магистрали, здания, ЦОД'},
  {id:'wifi',name:'Радиоканал Wi‑Fi',distance:'обычно десятки метров',speed:'зависит от стандарта и среды',immune:false,use:'мобильные клиенты и места без кабеля'}
];
export function chooseMedium(distance:number,interference:boolean,mobility:boolean):MediumId{
  if(mobility)return'wifi';
  if(distance>100||interference)return'fiber';
  return'utp';
}
export type LinkSymptom='no-light'|'flapping'|'slow'|'one-way'|'ok';
export function diagnosePhysical(symptom:LinkSymptom){
  const answers={
    'no-light':{cause:'Нет физического соединения или питания',first:'Проверьте питание, посадку разъёмов и замените кабель на заведомо исправный.'},
    flapping:{cause:'Нестабильный контакт или сильные помехи',first:'Осмотрите коннекторы, исключите перегибы и проверьте линию тестером.'},
    slow:{cause:'Согласована низкая скорость или повреждены пары',first:'Проверьте negotiated speed/duplex, категорию и все восемь жил.'},
    'one-way':{cause:'Ошибка распиновки или повреждение передающих пар',first:'Сравните распиновку обоих концов и выполните wiremap-тест.'},
    ok:{cause:'Физический уровень выглядит исправным',first:'Переходите к проверке канального и сетевого уровней.'}
  } as const;
  return answers[symptom];
}
export function linkQuality(length:number,damagedPairs:number,nearPower:boolean){
  let score=100-Math.max(0,length-80)*2-damagedPairs*30-(nearPower?20:0);
  score=Math.max(0,Math.min(100,score));
  return{score,state:score>=80?'Стабильная линия':score>=50?'Риск ошибок':'Линия неисправна'};
}
