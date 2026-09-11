"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

type Lane = "today" | "tomorrow" | "someday";

type Task = {
  id: string;
  title: string;
  lane: Lane;
  done: boolean;
};

const STORAGE_KEY = "task-planner-comfort:data";

const laneOrder: Lane[] = ["today", "tomorrow", "someday"];

const laneLabels: Record<Lane, string> = {
  today: "Сегодня",
  tomorrow: "Завтра",
  someday: "Когда-нибудь",
};

const seedTasks: Task[] = [
  { id: "seed-1", title: "Собрать мысли в Brain Dump", lane: "today", done: false },
  { id: "seed-2", title: "Выбрать одну задачу для глубокого фокуса", lane: "today", done: false },
  { id: "seed-3", title: "Подготовить список идей на завтра", lane: "tomorrow", done: false },
  { id: "seed-4", title: "Запланировать ленивый творческий спринт", lane: "someday", done: false },
];

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Partial<Task>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    (task.lane === "today" || task.lane === "tomorrow" || task.lane === "someday") &&
    typeof task.done === "boolean"
  );
}

function parseLane(value: string, fallback: Lane): { title: string; lane: Lane } {
  const normalized = value.trim();

  if (/^(tomorrow|завтра)\s*:/i.test(normalized)) {
    return { title: normalized.replace(/^(tomorrow|завтра)\s*:/i, "").trim(), lane: "tomorrow" };
  }

  if (/^(someday|потом|когда-нибудь)\s*:/i.test(normalized)) {
    return { title: normalized.replace(/^(someday|потом|когда-нибудь)\s*:/i, "").trim(), lane: "someday" };
  }

  if (/^(today|сегодня)\s*:/i.test(normalized)) {
    return { title: normalized.replace(/^(today|сегодня)\s*:/i, "").trim(), lane: "today" };
  }

  return { title: normalized, lane: fallback };
}

function nextLane(current: Lane): Lane {
  const index = laneOrder.indexOf(current);
  return laneOrder[(index + 1) % laneOrder.length];
}

export default function Home() {
  const [draft, setDraft] = useState("");
  const [lane, setLane] = useState<Lane>("today");
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") {
      return seedTasks;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return seedTasks;
    }

    try {
      const parsed = JSON.parse(saved) as unknown;
      return Array.isArray(parsed) && parsed.every(isTask) ? parsed : seedTasks;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return seedTasks;
    }
  });
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [hydrated, tasks]);

  const counts = useMemo(
    () => {
      const summary: Record<Lane, number> = { today: 0, tomorrow: 0, someday: 0 };

      for (const task of tasks) {
        if (!task.done) {
          summary[task.lane] += 1;
        }
      }

      return summary;
    },
    [tasks],
  );

  const tasksByLane = useMemo(() => {
    const grouped: Record<Lane, Task[]> = { today: [], tomorrow: [], someday: [] };

    for (const task of tasks) {
      grouped[task.lane].push(task);
    }

    return grouped;
  }, [tasks]);

  const focusTask = useMemo(
    () => tasks.find((task) => !task.done && task.lane === "today") ?? tasks.find((task) => !task.done),
    [tasks],
  );

  function addTask() {
    const parsed = parseLane(draft, lane);

    if (!parsed.title) {
      return;
    }

    setTasks((current) => [
      { id: crypto.randomUUID(), title: parsed.title, lane: parsed.lane, done: false },
      ...current,
    ]);
    setDraft("");
    setLane(parsed.lane);
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function moveTask(id: string) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, lane: nextLane(task.lane) } : task)),
    );
  }

  function resetDemo() {
    setTasks(seedTasks);
    setDraft("");
    setLane("today");
  }

  if (!hydrated) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="glass-card overflow-hidden rounded-[32px] p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
              Codespaces-ready • zero setup in browser
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Task Planner Comfort
              </h1>
              <p className="text-base leading-7 text-slate-300 sm:text-lg">
                Минималистичный планер для ленивого творческого исследователя: быстро сбрасывай задачи,
                выбирай один фокус и не трать силы на лишнюю структуру.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {laneOrder.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">{laneLabels[item]}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{counts[item]}</p>
                <p className="mt-1 text-sm text-slate-400">активных задач</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[28px] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <label className="flex-1">
              <span className="mb-2 block text-sm text-slate-300">Быстро добавить</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-400/60"
                placeholder="Например: завтра: проверить идею лендинга"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    addTask();
                  }
                }}
              />
            </label>
            <label className="sm:w-44">
              <span className="mb-2 block text-sm text-slate-300">Куда положить</span>
              <select
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none focus:border-sky-400/60"
                value={lane}
                onChange={(event) => setLane(event.target.value as Lane)}
              >
                {laneOrder.map((item) => (
                  <option key={item} value={item}>
                    {laneLabels[item]}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="rounded-2xl bg-sky-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-sky-300"
              onClick={addTask}
              type="button"
            >
              Добавить
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Поддерживаются префиксы <span className="font-mono text-slate-200">сегодня:</span>,{" "}
            <span className="font-mono text-slate-200">завтра:</span> и{" "}
            <span className="font-mono text-slate-200">потом:</span>.
          </p>
        </div>

        <aside className="glass-card rounded-[28px] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Focus mode</p>
              <h2 className="text-xl font-semibold text-white">Одна задача за раз</h2>
            </div>
            <button
              className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
              onClick={resetDemo}
              type="button"
            >
              Сбросить демо
            </button>
          </div>

          {focusTask ? (
            <div className="mt-5 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm text-emerald-200">Сейчас самое важное</p>
              <p className="mt-2 text-2xl font-semibold text-white">{focusTask.title}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-200">
                  {laneLabels[focusTask.lane]}
                </span>
                <button
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
                  onClick={() => toggleTask(focusTask.id)}
                  type="button"
                >
                  Отметить готовым
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5 text-slate-300">
              Все задачи закрыты — можно спокойно отдыхать.
            </div>
          )}

          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li>• Данные сохраняются локально в браузере.</li>
            <li>
              • В Codespaces достаточно запустить только{" "}
              <span className="font-mono text-slate-200">npm run dev</span>.
            </li>
            <li>• Приложение автоматически открывается на forwarded port 3000.</li>
          </ul>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {laneOrder.map((item) => (
          <section key={item} className="glass-card rounded-[28px] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{laneLabels[item]}</h2>
              <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-slate-300">
                {counts[item]}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {tasksByLane[item].length ? (
                tasksByLane[item].map((task) => (
                    <article
                      key={task.id}
                      className={`rounded-3xl border p-4 transition ${
                        task.done
                          ? "border-white/5 bg-slate-950/30 text-slate-500"
                          : "border-white/10 bg-white/5 text-slate-100"
                      }`}
                    >
                      <div className="flex gap-3">
                        <button
                          aria-label={task.done ? "Вернуть задачу" : "Завершить задачу"}
                          aria-pressed={task.done}
                          className={`mt-1 h-5 w-5 rounded-full border ${
                            task.done ? "border-emerald-300 bg-emerald-300" : "border-slate-500"
                          }`}
                          onClick={() => toggleTask(task.id)}
                          type="button"
                        >
                          <span className="sr-only">{task.done ? "Готово" : "Не готово"}</span>
                          <span aria-hidden="true" className="flex h-full w-full items-center justify-center text-[10px] text-slate-950">
                            {task.done ? "✓" : ""}
                          </span>
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={task.done ? "line-through" : ""}>{task.title}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:bg-white/5"
                              onClick={() => moveTask(task.id)}
                              type="button"
                            >
                              Переложить
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/3 p-4 text-sm text-slate-400">
                  Пусто — можно не перегружать себя.
                </div>
              )}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
