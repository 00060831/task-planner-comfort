"use client";

import { BoltIcon, ClockIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { DisplayTask } from "@/lib/types";

interface FocusModeProps {
  task?: DisplayTask;
  contextHint: string;
  onComplete: (id: string) => void;
  onSnooze: (id: string) => void;
  onSomeday: (id: string) => void;
}

export function FocusMode({
  task,
  contextHint,
  onComplete,
  onSnooze,
  onSomeday,
}: FocusModeProps) {
  if (!task) {
    return (
      <section className="rounded-[32px] border border-dashed border-white/10 bg-slate-900/50 p-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">Focus mode</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Сейчас можно ничего не делать.</h2>
        <p className="mt-3 text-sm text-slate-400">
          Добавь одну задачу через кнопку внизу, и фокус-режим сам выберет следующее действие.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/75 p-6 shadow-xl shadow-slate-950/40">
      <p className="text-sm uppercase tracking-[0.3em] text-sky-200/70">Что делать сейчас?</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">{task.title}</h2>
      <p className="mt-3 text-sm text-slate-400">{contextHint}</p>

      <div className="mt-6 grid gap-3">
        <button
          type="button"
          onClick={() => onComplete(task.id)}
          className="flex items-center justify-center gap-2 rounded-3xl bg-emerald-400 px-4 py-4 text-base font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          <BoltIcon className="h-5 w-5" />
          Готово → следующая
        </button>
        <button
          type="button"
          onClick={() => onSnooze(task.id)}
          className="flex items-center justify-center gap-2 rounded-3xl border border-white/10 px-4 py-4 text-base text-slate-100 transition hover:bg-white/5"
        >
          <ClockIcon className="h-5 w-5" />
          Отложить на 1 час
        </button>
        <button
          type="button"
          onClick={() => onSomeday(task.id)}
          className="flex items-center justify-center gap-2 rounded-3xl border border-white/10 px-4 py-4 text-base text-slate-100 transition hover:bg-white/5"
        >
          <FaceFrownIcon className="h-5 w-5" />
          Депрессует → Someday
        </button>
      </div>
    </section>
  );
}
