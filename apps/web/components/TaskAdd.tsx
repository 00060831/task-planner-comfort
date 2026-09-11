"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { parseTaskInput } from "@/lib/parser";
import { useTaskPlanner } from "@/lib/hooks";

const priorityLabel = {
  urgent: "🔴 Срочно",
  important: "🟠 Важно",
  gentle: "🟢 Когда захочется",
};

const bucketLabel = {
  today: "Today",
  tomorrow: "Tomorrow",
  someday: "Someday",
};

export function TaskAdd() {
  const { addTask } = useTaskPlanner();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const preview = useMemo(() => parseTaskInput(value || "🟠 Новая идея"), [value]);

  const submit = () => {
    if (!value.trim()) {
      return;
    }

    addTask(value);
    setValue("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex items-center gap-2 rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-500/30 transition hover:scale-[1.02]"
      >
        <PlusIcon className="h-5 w-5" />
        One-click add
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/75 p-4 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900 p-5 shadow-2xl shadow-slate-950"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-200/70">Quick capture</p>
                  <h2 className="mt-1 text-2xl font-semibold text-white">Что хочешь не забыть?</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 p-2 text-sky-200">
                  <SparklesIcon className="h-5 w-5" />
                </div>
              </div>

              <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                autoFocus
                rows={4}
                placeholder="Например: 🔴 Срочный код @сегодня #product"
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-4 text-base text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-300"
              />

              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-rose-500/10 px-3 py-1 text-rose-200">
                  {priorityLabel[preview.priority]}
                </span>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-200">
                  {bucketLabel[preview.bucket]}
                </span>
                {preview.recurring ? (
                  <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-200">
                    Повтор еженедельно · {preview.recurring.label}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">⌘K / Ctrl+K открывает capture из любого экрана.</p>
                <button
                  type="button"
                  onClick={submit}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
                >
                  Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
