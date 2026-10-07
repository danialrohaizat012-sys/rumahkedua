export type Product={id:string,name:string,category:string,price:number,image:string,available:boolean,archived?:boolean};
export type Member={id:string,name:string,phone:string,points:number};
export type Order={id:string,created:string,items:{name:string,price:number,qty:number}[],subtotal:number,discount:number,total:number,memberId:string|null,earned:number,spent:number,method:string,type:string,table:string,note:string,status:string,cash:number,kitchenStatus?:'New'|'Preparing'|'Ready'|'Served',kitchenUpdated?:string};
export type Store={products:Product[],members:Member[],orders:Order[],ledger:{id:string,memberId:string,orderId:string,delta:number,reason:string,date:string}[],settings:{pointsPerRM:number,rewardPoints:number,rewardCents:number,operator:string,logo:string}};
export const initial:Store={products:[['Iced Latte','Coffee',900],['Americano','Coffee',700],['Caramel Latte','Coffee',1100],['Creamy Carbonara','Pasta',1800],['Chicken Chop','Steak',2000],['Grilled Steak','Steak',3500]].map((p,i)=>({id:'p'+i,name:p[0] as string,category:p[1] as string,price:p[2] as number,image:'/menu/'+i+'.webp',available:true})),members:[],orders:[],ledger:[],settings:{pointsPerRM:1,rewardPoints:200,rewardCents:500,operator:'Iyyad',logo:'/logo.png'}};
export const money=(c:number)=>'RM'+(c/100).toFixed(2);
export const day=(s:string)=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kuala_Lumpur',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(s));
export function applyAction(s:Store,b:any):Store {
 if(b.action==='member') {const phone=String(b.phone||'').replace(/\D/g,'').replace(/^0/,'60'); if(!String(b.name||'').trim()||!/^\d{9,15}$/.test(phone))throw Error('Nama dan nombor telefon sah diperlukan.'); if(s.members.some(m=>m.phone===phone))throw Error('Nombor telefon ini sudah berdaftar.'); s.members.push({id:crypto.randomUUID(),name:String(b.name).trim().slice(0,100),phone,points:0});}
 else if(b.action==='checkout') {
 if(s.orders.some(o=>o.id===b.id))return s;
 if(!Array.isArray(b.items)||!b.items.length||b.items.length>100)throw Error('Pesanan kosong.');
 if(!['Tunai','QR','Kad'].includes(b.method)||!['Dine-in','Takeaway'].includes(b.type))throw Error('Pilihan bayaran tidak sah.');
 if(b.type==='Dine-in'&&!b.table)throw Error('Pilih meja.');
 const items=b.items.map((x:any)=>{const p=s.products.find(p=>p.id===x.id&&p.available&&!p.archived);if(!p||!Number.isInteger(x.qty)||x.qty<1||x.qty>99)throw Error('Menu atau kuantiti tidak sah.');return {name:p.name,price:p.price,qty:x.qty}});
 const subtotal=items.reduce((a:number,x:any)=>a+x.price*x.qty,0);const member=s.members.find(m=>m.id===b.memberId); if(b.memberId&&!member)throw Error('Ahli tidak dijumpai.');
 const spent=b.redeem?s.settings.rewardPoints:0;if(spent&&(!member||member.points<spent))throw Error('Mata tidak mencukupi.');
 const discount=spent?Math.min(subtotal,s.settings.rewardCents):0,total=subtotal-discount,earned=member?Math.floor(total/100*s.settings.pointsPerRM):0;
 if(b.method==='Tunai'&&(!Number.isInteger(b.cash)||b.cash<total))throw Error('Tunai diterima tidak mencukupi.');
 const o:Order={id:String(b.id),created:new Date().toISOString(),items,subtotal,discount,total,memberId:member?.id||null,earned,spent,method:b.method,type:b.type,table:String(b.table||''),note:String(b.note||'').slice(0,500),status:'Paid',kitchenStatus:'New',cash:b.method==='Tunai'?b.cash:total}; s.orders.unshift(o);
 if(member){member.points+=earned-spent; for(const [delta,reason] of [[-spent,'Tebus ganjaran'],[earned,'Mata pembelian']] as [number,string][]){if(delta)s.ledger.unshift({id:crypto.randomUUID(),memberId:member.id,orderId:o.id,delta,reason,date:o.created});}}
 }
 else if(b.action==='refund'){const o=s.orders.find(o=>o.id===b.id);if(!o||o.status==='Refunded')throw Error('Pesanan tidak boleh direfund.');const m=s.members.find(m=>m.id===o.memberId);if(m){m.points+=o.spent-o.earned;s.ledger.unshift({id:crypto.randomUUID(),memberId:m.id,orderId:o.id,delta:o.spent-o.earned,reason:'Refund penuh',date:new Date().toISOString()});}o.status='Refunded';}
 else if(b.action==='product'){const p=b.product;if(!p||!String(p.name).trim()||!Number.isInteger(p.price)||p.price<0||p.price>1000000||!['Coffee','Pasta','Steak','Non-Coffee'].includes(p.category))throw Error('Maklumat menu tidak sah.');if(p.image&&!/^\/menu\/|^\/api\/images\/[a-f0-9-]+$|^https:\/\//.test(p.image))throw Error('Pautan gambar perlu HTTPS.');const clean={id:p.id||crypto.randomUUID(),name:String(p.name).trim().slice(0,100),price:p.price,category:p.category,image:p.image||'/menu/0.webp',available:!!p.available,archived:false}; const idx=s.products.findIndex(x=>x.id===clean.id);if(idx>=0)s.products[idx]=clean;else s.products.push(clean);}
 else if(b.action==='archive'){const p=s.products.find(p=>p.id===b.id);if(!p)throw Error('Menu tidak dijumpai.');p.archived=true;p.available=false;}
 else if(b.action==='availability'){const p=s.products.find(p=>p.id===b.id&&!p.archived);if(!p)throw Error('Menu tidak dijumpai.');p.available=!!b.available;}
 else if(b.action==='kitchen'){const o=s.orders.find(o=>o.id===b.id);if(!o||o.status!=='Paid')throw Error('Pesanan tidak aktif.');const current=o.kitchenStatus||'New';const stages=['New','Preparing','Ready','Served'];if(b.expected!==current||stages.indexOf(b.status)!==stages.indexOf(current)+1)throw Error('Status dapur berubah. Muat semula sebelum cuba lagi.');o.kitchenStatus=b.status;o.kitchenUpdated=new Date().toISOString();}
 else if(b.action==='settings'){const v=b.settings; if(!Number.isFinite(v.pointsPerRM)||v.pointsPerRM<0||v.pointsPerRM>100||!Number.isInteger(v.rewardPoints)||v.rewardPoints<1||!Number.isInteger(v.rewardCents)||v.rewardCents<1)throw Error('Aturan loyalty tidak sah.');s.settings={...s.settings,pointsPerRM:v.pointsPerRM,rewardPoints:v.rewardPoints,rewardCents:v.rewardCents,operator:String(v.operator||'Iyyad').slice(0,50)};}
 else throw Error('Tindakan tidak dikenali.');return s;
}
