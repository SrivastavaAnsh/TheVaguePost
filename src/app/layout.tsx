import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'The VaguePost · Thoughts & Fragments by Ansh',
  description: 'Raw thoughts, midnight ideas, visual fragments & vague musings from Ansh. Comment anonymously as User #1, #2...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23101318'/%3E%3Cstop offset='50%25' stop-color='%23B600A8'/%3E%3Cstop offset='100%25' stop-color='%234E8CF9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='16' fill='url(%23g)'/%3E%3Ctext x='32' y='44' font-family='Kanit,sans-serif' font-size='34' font-weight='900' fill='%23D7E2EA' text-anchor='middle'%3EV%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body className="bg-[#0C0C0C] text-frost font-kanit antialiased selection:bg-accent/30 selection:text-frost min-h-screen relative overflow-x-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
