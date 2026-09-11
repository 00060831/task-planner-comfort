"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUturnLeftIcon, CheckIcon, ClockIcon } from "@heroicons/react/24/outline";
import { DisplayTask, TaskBucket } from "@/lib/types";

const priorityStyles = {
  urgent: "bg-rose-500/12 text-rose-200",
  important: "bg-amber-500/12 text-amber-200",
  gentle: "bg-emerald-500/12 text-emerald-200",
};

const priorityEmoji = {
  urgent: "🔴",
  important: "🟠",
  gentle: "🟢",
};

const bucketActions: TaskBucket[] = ["today", "tomorrow", "someday"];

interface TaskCardProps {
  task: DisplayTask;
  archived?: boolean;
  onComplete?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onSomeday?: (id: string) => void;
  onRestore?: (id: string) => void;
  onMove?: (id: string, bucket: TaskBucket) => void;
}

export function TaskCard({
  task,
  archived,
  onComplete,
  onSnooze,
  onSomeday,
  onRestore,
  onMove,
}: TaskCardProps) {
  const startX = useRef<number | null>(null);

  const handleSwipeEnd = (endX: number) => {
    if (startX.current === null) {
      return;
    }

    const distance = endX - startX.current;

    if (distance <= -72 && onComplete) {
      onComplete(task.id);
    }

    if (distance >= 72 && onSnooze) {
      onSnooze(task.id);
    }

    startX.current = null;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[28px] border border-white/10 bg-[var(--card)] p-4 shadow-lg shadow-slate-950/25 backdrop-blur"
      onTouchStart={(event) => {
        startX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        handleSwipeEnd(event.changedTouches[0]?.clientX ?? 0);
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full px-2.5 py-1 ${priorityStyles[task.priority]}`}>
              {priorityEmoji[task.priority]} {task.priority}
            </span>
            <span className="rounded-full bg-sky-500/12 px-2.5 py-1 text-sky-200">{task.bucket}</span>
            {task.recurring ? (
              <span className="rounded-full bg-violet-500/12 px-2.5 py-1 text-violet-200">
                weekly · {task.recurring.label}
              </span>
            ) : null}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{task.title}</h3>
            <p className="mt-1 text-sm text-slate-400">
              {task.source === "brain-dump" ? "Из brain dump" : "Быстрый capture"} · свайп влево = done, вправо = +1h
            </p>
          </div>
          {task.smartTags.length ? (
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {task.smartTags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/6 px-2.5 py-1">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
          {task.snoozedUntil ? (
            <p className="text-xs text-slate-500">Спит до {new Date(task.snoozedUntil).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {archived ? (
          <button
            type="button"
            onClick={() => onRestore?.(task.id)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
          >
            <ArrowUturnLeftIcon className="h-4 w-4" />
            Вернуть
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onComplete?.(task.id)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
            >
              <CheckIcon className="h-4 w-4" />
              Готово
            </button>
            <button
              type="button"
              onClick={() => onSnooze?.(task.id)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              <ClockIcon className="h-4 w-4" />
              +1 час
            </button>
            <button
              type="button"
              onClick={() => onSomeday?.(task.id)}
              className="rounded-full border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
            >
              Депрессует
            </button>
          </>
        )}
      </div>

      {!archived && onMove ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
          {bucketActions
            .filter((bucket) => bucket !== task.bucket)
            .map((bucket) => (
              <button
                key={bucket}
                type="button"
                onClick={() => onMove(task.id, bucket)}
                className="rounded-full bg-white/5 px-2.5 py-1 transition hover:bg-white/10"
              >
                → {bucket}
              </button>
            ))}
        </div>
      ) : null}
    </motion.article>
  );
}
