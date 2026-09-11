import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Task Planner for Lazy Creative Researchers',
  description: 'Comfort-first planner with focus mode, brain dump, and one-click task capture.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
