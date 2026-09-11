"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dayOffset, extractMeaningfulWords, parseTaskInput } from "@/lib/parser";
import { emptySnapshot, loadSnapshot, saveSnapshot } from "@/lib/storage";
import { BrainDumpNote, DisplayTask, Task, TaskBucket } from "@/lib/types";

type SourceKind = "quick-add" | "brain-dump";

interface TaskPlannerContextValue {
  loaded: boolean;
  tasks: DisplayTask[];
  archive: DisplayTask[];
  brainDumpDraft: string;
  brainDumpNotes: BrainDumpNote[];
  addTask: (input: string, source?: SourceKind) => void;
  updateBrainDumpDraft: (value: string) => void;
  importBrainDump: () => number;
  completeTask: (id: string) => void;
  snoozeTask: (id: string) => void;
  moveToSomeday: (id: string) => void;
  restoreTask: (id: string) => void;
  setBucket: (id: string, bucket: TaskBucket) => void;
  getFocusTask: () => DisplayTask | undefined;
  getCurrentProject: () => string;
  getZenReminder: () => string;
  getContextHint: () => string;
}

const TaskPlannerContext = createContext<TaskPlannerContextValue | null>(null);

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function priorityScore(priority: Task["priority"]) {
  if (priority === "urgent") {
    return 0;
  }

  if (priority === "important") {
    return 1;
  }

  return 2;
}

function isAwakeAt(task: Task, nowTimestamp: number) {
  if (!task.snoozedUntil) {
    return true;
  }

  return Date.parse(task.snoozedUntil) <= nowTimestamp;
}

function sortTasks(tasks: DisplayTask[]) {
  return [...tasks].sort((left, right) => {
    const leftDay = left.scheduledFor ?? "9999-99-99";
    const rightDay = right.scheduledFor ?? "9999-99-99";

    if (leftDay !== rightDay) {
      return leftDay.localeCompare(rightDay);
    }

    if (priorityScore(left.priority) !== priorityScore(right.priority)) {
      return priorityScore(left.priority) - priorityScore(right.priority);
    }

    return right.createdAt.localeCompare(left.createdAt);
  });
}

function enrichTasks(tasks: Task[], brainDumpDraft: string) {
  const frequencies = new Map<string, number>();

  for (const task of tasks) {
    for (const word of extractMeaningfulWords(task.title)) {
      frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
    }
  }

  for (const word of extractMeaningfulWords(brainDumpDraft)) {
    frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  }

  return tasks.map<DisplayTask>((task) => ({
    ...task,
    smartTags: [
      ...new Set([
        ...task.tags,
        ...extractMeaningfulWords(task.title).filter((word) => (frequencies.get(word) ?? 0) > 1),
      ]),
    ],
  }));
}

export function TaskPlannerProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(emptySnapshot.tasks);
  const [brainDumpDraft, setBrainDumpDraft] = useState(emptySnapshot.brainDumpDraft);
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const snapshot = loadSnapshot();

      if (cancelled) {
        return;
      }

      setTasks(snapshot.tasks ?? []);
      setBrainDumpDraft(snapshot.brainDumpDraft ?? "");
      setLoaded(true);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTimestamp(Date.now()), 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    saveSnapshot({
      tasks,
      brainDumpDraft,
    });
  }, [brainDumpDraft, loaded, tasks]);

  const displayTasks = useMemo(() => sortTasks(enrichTasks(tasks, brainDumpDraft)), [brainDumpDraft, tasks]);

  const archive = useMemo(
    () =>
      [...displayTasks]
        .filter((task) => task.archived)
        .sort((left, right) => (right.completedAt ?? "").localeCompare(left.completedAt ?? "")),
    [displayTasks],
  );

  const activeTasks = useMemo(() => displayTasks.filter((task) => !task.archived), [displayTasks]);
  const awakeTasks = useMemo(
    () => activeTasks.filter((task) => isAwakeAt(task, nowTimestamp)),
    [activeTasks, nowTimestamp],
  );

  const brainDumpNotes = useMemo<BrainDumpNote[]>(
    () =>
      brainDumpDraft
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((text, index) => ({
          id: `${index}-${text}`,
          text,
          createdAt: `${index}`,
        })),
    [brainDumpDraft],
  );

  const addTask = (input: string, source: SourceKind = "quick-add") => {
    const raw = input.trim();

    if (!raw) {
      return;
    }

    const parsed = parseTaskInput(raw);

    setTasks((current) => [
      {
        id: createId(),
        title: parsed.title || "Новая идея",
        bucket: parsed.bucket,
        priority: parsed.priority,
        tags: parsed.tags,
        archived: false,
        createdAt: new Date().toISOString(),
        scheduledFor: parsed.scheduledFor,
        recurring: parsed.recurring,
        source,
      },
      ...current,
    ]);
  };

  const completeTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              archived: true,
              completedAt: new Date().toISOString(),
              snoozedUntil: undefined,
            }
          : task,
      ),
    );
  };

  const snoozeTask = (id: string) => {
    const snoozedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, snoozedUntil } : task)),
    );
  };

  const moveToSomeday = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              bucket: "someday",
              priority: "gentle",
              scheduledFor: undefined,
              snoozedUntil: undefined,
            }
          : task,
      ),
    );
  };

  const restoreTask = (id: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              archived: false,
              completedAt: undefined,
              snoozedUntil: undefined,
            }
          : task,
      ),
    );
  };

  const setBucket = (id: string, bucket: TaskBucket) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              bucket,
              snoozedUntil: undefined,
              scheduledFor: bucket === "today" ? dayOffset(0) : bucket === "tomorrow" ? dayOffset(1) : undefined,
            }
          : task,
      ),
    );
  };

  const importBrainDump = () => {
    const lines = brainDumpDraft
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return 0;
    }

    setTasks((current) => [
      ...lines.map((line) => {
        const parsed = parseTaskInput(line);

        return {
          id: createId(),
          title: parsed.title || "Новая идея",
          bucket: parsed.bucket,
          priority: parsed.priority,
          tags: parsed.tags,
          archived: false,
          createdAt: new Date().toISOString(),
          scheduledFor: parsed.scheduledFor,
          recurring: parsed.recurring,
          source: "brain-dump" as const,
        };
      }),
      ...current,
    ]);
    setBrainDumpDraft("");

    return lines.length;
  };

  const getFocusTask = () =>
    awakeTasks.find((task) => task.bucket === "today") ??
    awakeTasks.find((task) => task.bucket === "tomorrow") ??
    awakeTasks.find((task) => task.bucket === "someday");

  const getCurrentProject = () => {
    const counters = new Map<string, number>();

    for (const task of awakeTasks) {
      for (const tag of task.smartTags) {
        counters.set(tag, (counters.get(tag) ?? 0) + 1);
      }
    }

    const winner = [...counters.entries()].sort((left, right) => right[1] - left[1])[0];
    return winner ? `#${winner[0]}` : "Свободный поток";
  };

  const getZenReminder = () => {
    const urgentToday = awakeTasks.filter((task) => task.bucket === "today" && task.priority === "urgent").length;

    if (urgentToday > 1) {
      return "Сделай только один красный пункт — остальное подождёт.";
    }

    if (!awakeTasks.length) {
      return "Тишина — можно добавить одну маленькую мысль и выдохнуть.";
    }

    return "Мягкий режим: одно действие сейчас лучше идеального плана потом.";
  };

  const getContextHint = () => {
    const hour = new Date(nowTimestamp).getHours();
    const nearby = archive.filter((task) => {
      if (!task.completedAt) {
        return false;
      }

      return Math.abs(new Date(task.completedAt).getHours() - hour) <= 1;
    });

    const remembered = nearby.flatMap((task) => task.smartTags)[0] ?? nearby[0]?.title.split(" ")[0];

    return remembered
      ? `Обычно в это время ты возвращаешься к: ${remembered}.`
      : "Контекст запомнится сам, как только появится первая завершённая задача.";
  };

  return (
    <TaskPlannerContext.Provider
      value={{
        loaded,
        tasks: activeTasks,
        archive,
        brainDumpDraft,
        brainDumpNotes,
        addTask,
        updateBrainDumpDraft: setBrainDumpDraft,
        importBrainDump,
        completeTask,
        snoozeTask,
        moveToSomeday,
        restoreTask,
        setBucket,
        getFocusTask,
        getCurrentProject,
        getZenReminder,
        getContextHint,
      }}
    >
      {children}
    </TaskPlannerContext.Provider>
  );
}

export function useTaskPlanner() {
  const context = useContext(TaskPlannerContext);

  if (!context) {
    throw new Error("useTaskPlanner must be used within TaskPlannerProvider");
  }

  return context;
}
