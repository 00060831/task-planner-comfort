"use client";

import { useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useTaskPlanner } from "@/lib/hooks";

export function BrainDump() {
  const { brainDumpDraft, brainDumpNotes, updateBrainDumpDraft, importBrainDump } = useTaskPlanner();
  const [lastImportCount, setLastImportCount] = useState(0);

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/65 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200/70">Brain dump</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Свалка идей без структуры</h2>
        </div>
        <button
          type="button"
          onClick={() => setLastImportCount(importBrainDump())}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-slate-100 transition hover:bg-white/5"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          В задачи
        </button>
      </div>

      <textarea
        value={brainDumpDraft}
        onChange={(event) => updateBrainDumpDraft(event.target.value)}
        rows={5}
        placeholder="Пиши идеи строками. Автосохранение уже включено."
        className="mt-4 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-sm text-white placeholder:text-slate-500 focus:border-violet-300 focus:outline-none"
      />

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Автосохранение без кнопок.</span>
        {lastImportCount ? <span>Перенесено: {lastImportCount}</span> : null}
      </div>

      {brainDumpNotes.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {brainDumpNotes.map((note) => (
            <article key={note.id} className="rounded-3xl bg-amber-300/90 p-4 text-sm text-slate-900 shadow-md">
              {note.text}
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
