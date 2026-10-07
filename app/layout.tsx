import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Rumah Kedua | POS', description: 'Sistem kaunter Rumah Kedua • Coffee, Pasta, Steak' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ms"><body>{children}</body></html> }
