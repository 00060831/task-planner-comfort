"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { TaskAdd } from "@/components/TaskAdd";
import { TaskCard } from "@/components/TaskCard";
import { FocusMode } from "@/components/FocusMode";
import { BrainDump } from "@/components/BrainDump";
import { useTaskPlanner } from "@/lib/hooks";
import { DisplayTask, PlannerView, TaskBucket } from "@/lib/types";

const pageCopy: Record<PlannerView, { eyebrow: string; title: string; description: string }> = {
  overview: {
    eyebrow: "Comfort dashboard",
    title: "Планер, который не заставляет думать о планере",
    description: "Открыл и сразу понял: что сегодня важно, что можно оставить на завтра и что стоит просто сохранить на потом.",
  },
  today: {
    eyebrow: "Today",
    title: "Только то, что реально стоит сделать сегодня",
    description: "Красные и важные задачи сверху, остальное не шумит.",
  },
  tomorrow: {
    eyebrow: "Tomorrow",
    title: "Завтрашний буфер без тревоги",
    description: "Сложи сюда всё, что не хочется держать в голове до утра.",
  },
  someday: {
    eyebrow: "Someday",
    title: "Место для идей без дедлайна",
    description: "Ничего не давит: просто аккуратный список того, к чему можно вернуться позже.",
  },
  focus: {
    eyebrow: "Focus",
    title: "Одна задача. Один экран. Ноль суеты.",
    description: "Фокус-режим сам подбирает следующее действие и даёт только три кнопки.",
  },
  archive: {
    eyebrow: "Archive",
    title: "История завершённых задач и идей",
    description: "Поиск по тексту и тегам помогает вспомнить, чем ты уже занимался.",
  },
};

function bucketHeading(bucket: TaskBucket) {
  if (bucket === "today") {
    return "Today";
  }

  if (bucket === "tomorrow") {
    return "Tomorrow";
  }

  return "Someday";
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-900/45 p-5 text-sm text-slate-400">
      <p className="font-medium text-slate-200">{title}</p>
      <p className="mt-2">{description}</p>
    </div>
  );
}

function BucketSection({
  title,
  description,
  tasks,
  onComplete,
  onSnooze,
  onSomeday,
  onMove,
}: {
  title: string;
  description: string;
  tasks: DisplayTask[];
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onSomeday: (id: string) => void;
  onMove: (id: string, bucket: TaskBucket) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{tasks.length}</span>
      </div>

      {tasks.length ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onSnooze={onSnooze}
              onSomeday={onSomeday}
              onMove={onMove}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="Пусто и спокойно" description="Добавь одну мысль через кнопку снизу — этого уже достаточно." />
      )}
    </section>
  );
}

export function PlannerScreen({ view }: { view: PlannerView }) {
  const {
    loaded,
    tasks,
    archive,
    completeTask,
    snoozeTask,
    moveToSomeday,
    restoreTask,
    setBucket,
    getFocusTask,
    getCurrentProject,
    getZenReminder,
    getContextHint,
  } = useTaskPlanner();
  const [search, setSearch] = useState("");

  const grouped = useMemo(
    () => ({
      today: tasks.filter((task) => task.bucket === "today" && !task.snoozedUntil),
      tomorrow: tasks.filter((task) => task.bucket === "tomorrow" && !task.snoozedUntil),
      someday: tasks.filter((task) => task.bucket === "someday" && !task.snoozedUntil),
    }),
    [tasks],
  );
  const hiddenCount = tasks.filter((task) => task.snoozedUntil).length;

  const archiveResults = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return archive;
    }

    return archive.filter((task) =>
      [task.title, ...task.smartTags.map((tag) => `#${tag}`)].join(" ").toLowerCase().includes(normalized),
    );
  }, [archive, search]);

  const activeResults = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return [];
    }

    return tasks.filter((task) =>
      [task.title, ...task.smartTags.map((tag) => `#${tag}`)].join(" ").toLowerCase().includes(normalized),
    );
  }, [search, tasks]);

  const copy = pageCopy[view];

  if (!loaded) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4 text-sm text-slate-400">
        Загружаем комфортный режим…
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-32 pt-6">
      <header className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200/70">{copy.eyebrow}</p>
          <h1 className="text-3xl font-semibold text-white">{copy.title}</h1>
          <p className="text-sm leading-6 text-slate-400">{copy.description}</p>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[28px] border border-sky-400/15 bg-sky-400/8 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200/70">Current project</p>
            <p className="mt-2 text-lg font-semibold text-white">{getCurrentProject()}</p>
            <p className="mt-1 text-sm text-slate-400">{getContextHint()}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-slate-900/65 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Zen reminder</p>
            <p className="mt-2 text-sm text-slate-200">{getZenReminder()}</p>
            {hiddenCount ? <p className="mt-2 text-xs text-slate-500">Спрятано на час: {hiddenCount}</p> : null}
          </div>
        </div>

        {(view === "overview" || view === "archive") && (
          <label className="block">
            <span className="mb-2 block text-sm text-slate-400">Быстрый поиск</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="теги, текст, июньские идеи…"
              className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-300 focus:outline-none"
            />
          </label>
        )}
      </header>

      <Navigation />

      <div className="mt-6 space-y-6">
        {view === "focus" ? (
          <FocusMode
            task={getFocusTask()}
            contextHint={getContextHint()}
            onComplete={completeTask}
            onSnooze={snoozeTask}
            onSomeday={moveToSomeday}
          />
        ) : null}

        {view === "archive" ? (
          archiveResults.length ? (
            <div className="space-y-3">
              {archiveResults.map((task) => (
                <TaskCard key={task.id} task={task} archived onRestore={restoreTask} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Архив пока тихий"
              description="Заверши хотя бы одну задачу, и она сразу появится здесь вместе с поиском по истории."
            />
          )
        ) : null}

        {view === "overview" ? (
          <>
            {search ? (
              <section className="space-y-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">Найдено в активных задачах</h2>
                  <p className="mt-1 text-sm text-slate-400">Поиск работает по тексту и умным тегам.</p>
                </div>
                {activeResults.length ? (
                  activeResults.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                      onSnooze={snoozeTask}
                      onSomeday={moveToSomeday}
                      onMove={setBucket}
                    />
                  ))
                ) : (
                  <EmptyState title="Совпадений нет" description="Попробуй другой тег или открой архив — там лежат завершённые идеи." />
                )}
              </section>
            ) : (
              <>
                <section className="grid gap-3 sm:grid-cols-3">
                  {(["today", "tomorrow", "someday"] as TaskBucket[]).map((bucket) => (
                    <Link
                      key={bucket}
                      href={`/${bucket}`}
                      className="rounded-[28px] border border-white/10 bg-slate-900/65 p-4 transition hover:border-sky-300/40 hover:bg-slate-900"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{bucketHeading(bucket)}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{grouped[bucket].length}</p>
                      <p className="mt-1 text-sm text-slate-400">видимых задач</p>
                    </Link>
                  ))}
                </section>

                <BucketSection
                  title="Today"
                  description="Самое важное, что стоит сделать именно сегодня."
                  tasks={grouped.today}
                  onComplete={completeTask}
                  onSnooze={snoozeTask}
                  onSomeday={moveToSomeday}
                  onMove={setBucket}
                />

                <BucketSection
                  title="Tomorrow"
                  description="Хорошее место для переключения контекста без потери мысли."
                  tasks={grouped.tomorrow}
                  onComplete={completeTask}
                  onSnooze={snoozeTask}
                  onSomeday={moveToSomeday}
                  onMove={setBucket}
                />

                <BrainDump />
              </>
            )}
          </>
        ) : null}

        {view === "today" ? (
          <BucketSection
            title="Today"
            description="Виден только живой список без всего, что уже отложено."
            tasks={grouped.today}
            onComplete={completeTask}
            onSnooze={snoozeTask}
            onSomeday={moveToSomeday}
            onMove={setBucket}
          />
        ) : null}

        {view === "tomorrow" ? (
          <BucketSection
            title="Tomorrow"
            description="Сюда приятно сгружать всё, что не хочется решать сейчас."
            tasks={grouped.tomorrow}
            onComplete={completeTask}
            onSnooze={snoozeTask}
            onSomeday={moveToSomeday}
            onMove={setBucket}
          />
        ) : null}

        {view === "someday" ? (
          <>
            <BucketSection
              title="Someday"
              description="Без дедлайна, без тревоги, с сохранённым контекстом."
              tasks={grouped.someday}
              onComplete={completeTask}
              onSnooze={snoozeTask}
              onSomeday={moveToSomeday}
              onMove={setBucket}
            />
            <BrainDump />
          </>
        ) : null}
      </div>

      <TaskAdd />
    </main>
  );
}
