import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

export const metadata: Metadata = {
  title: 'The VaguePost · Thoughts & Ideas by Ansh',
  description: 'Raw thoughts, ideas & visual fragments from Ansh. Comment anonymously as User #1, #2...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%230F172A'/%3E%3Cpath d='M32 14 C32 23, 37 28, 46 28 C37 28, 32 33, 32 42 C32 33, 27 28, 18 28 C27 28, 32 23, 32 14 Z' fill='%23818CF8'/%3E%3C/svg%3E"
        />
      </head>
      <body className="bg-[#FEF7F0] text-ink font-kanit antialiased selection:bg-amber-200 selection:text-ink min-h-screen relative overflow-x-hidden">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
