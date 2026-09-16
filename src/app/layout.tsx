import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BCAS Results Submission Progress Report System',
  description:
    'Official academic reporting system for BCAS Campus Board of Examiners - Progression of Results Submission Monthly Wise.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
