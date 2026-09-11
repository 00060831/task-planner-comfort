import type { Metadata } from 'next';
import './globals.css';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? 'Task Planner for Lazy Creative Researchers';

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Comfort-first planner with focus mode, brain dump, and one-click task capture.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
