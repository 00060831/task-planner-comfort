import { PlannerSnapshot } from "@/lib/types";

const STORAGE_KEY = "task-planner-comfort:v1";

export const emptySnapshot: PlannerSnapshot = {
  tasks: [],
  brainDumpDraft: "",
};

export function loadSnapshot(): PlannerSnapshot {
  if (typeof window === "undefined") {
    return emptySnapshot;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return emptySnapshot;
  }

  try {
    return JSON.parse(raw) as PlannerSnapshot;
  } catch {
    return emptySnapshot;
  }
}

export function saveSnapshot(snapshot: PlannerSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
