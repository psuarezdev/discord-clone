import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/providers';

const openSans = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord Clone',
  description: 'Discord Clone developed with Next.js and Tailwind CSS'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${openSans.className} bg-[#313338]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
