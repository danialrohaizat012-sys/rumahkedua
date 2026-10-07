import { env } from 'cloudflare:workers';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Akses tidak sah.'},{status:403});
 try{const form=await request.formData(),file=form.get('file');if(!(file instanceof File)||file.size>5*1024*1024||file.size===0)return Response.json({error:'Pilih gambar JPG, PNG atau WebP maksimum 5 MB.'},{status:400});
 const bytes=await file.arrayBuffer(),b=new Uint8Array(bytes);const png=b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71;const jpeg=b[0]===255&&b[1]===216&&b[2]===255;const webp=new TextDecoder().decode(b.slice(0,4))==='RIFF'&&new TextDecoder().decode(b.slice(8,12))==='WEBP';if(!png&&!jpeg&&!webp)return Response.json({error:'Format gambar tidak disokong.'},{status:400});
 const key=crypto.randomUUID();await env.BUCKET!.put(key,bytes,{httpMetadata:{contentType:png?'image/png':jpeg?'image/jpeg':'image/webp'}});return Response.json({url:'/api/images/'+key});
 }catch{return Response.json({error:'Gambar tidak dapat dimuat naik. Cuba lagi.'},{status:503})}
}
