import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title:'Rumah Kedua | POS',description:'Sistem kaunter Rumah Kedua • Coffee, Pasta, Steak',
 applicationName:'Rumah Kedua POS',appleWebApp:{capable:true,title:'Rumah Kedua',statusBarStyle:'black-translucent'},
 icons:{icon:[{url:'/icons/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/icons/icon-192.png',sizes:'192x192',type:'image/png'}],apple:[{url:'/icons/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]}
};
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#2B211C'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ms"><head><link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials"/></head><body>{children}</body></html>}
