import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Planner Comfort",
  description: "Minimal fallback-ready task planner app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
