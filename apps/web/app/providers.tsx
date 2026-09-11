"use client";

import { TaskPlannerProvider } from "@/lib/hooks";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TaskPlannerProvider>{children}</TaskPlannerProvider>;
}
