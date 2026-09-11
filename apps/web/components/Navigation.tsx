"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArchiveBoxIcon,
  CalendarDaysIcon,
  CalendarIcon,
  HomeModernIcon,
  SparklesIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const items = [
  { href: "/", label: "Home", icon: HomeModernIcon },
  { href: "/today", label: "Today", icon: SunIcon },
  { href: "/tomorrow", label: "Tomorrow", icon: CalendarIcon },
  { href: "/someday", label: "Someday", icon: CalendarDaysIcon },
  { href: "/focus", label: "Focus", icon: SparklesIcon },
  { href: "/archive", label: "Archive", icon: ArchiveBoxIcon },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация планера" className="sticky bottom-4 z-20 mt-6">
      <div className="mx-auto flex w-full max-w-md items-center justify-between gap-2 rounded-full border border-white/10 bg-slate-900/85 p-2 shadow-2xl shadow-slate-950/60 backdrop-blur">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full px-2 py-2 text-[11px] transition ${
                active
                  ? "bg-sky-500/20 text-sky-200"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
