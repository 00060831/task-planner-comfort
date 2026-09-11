'use client';

import { Task } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

type FocusModeProps = {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onDone: (id: string) => void;
  onSnooze: (id: string) => void;
  onNotUrgent: (id: string) => void;
};

export function FocusMode({ task, isOpen, onClose, onDone, onSnooze, onNotUrgent }: FocusModeProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="focus-mode-title"
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/95 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-xl rounded-3xl border border-violet-700/50 bg-slate-900 p-6 text-center shadow-glow"
          >
            <h2 id="focus-mode-title" className="sr-only">
              Focus Mode
            </h2>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-violet-300">Focus Mode</p>
            {task ? (
              <>
                <h2 className="mb-6 text-2xl font-semibold text-white">{task.title}</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => onDone(task.id)}
                    className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-medium text-white"
                  >
                    Готово
                  </button>
                  <button
                    onClick={() => onSnooze(task.id)}
                    className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-white"
                  >
                    Отложить
                  </button>
                  <button
                    onClick={() => onNotUrgent(task.id)}
                    className="rounded-xl bg-slate-700 px-3 py-2 text-sm font-medium text-white"
                  >
                    Не срочно
                  </button>
                </div>
              </>
            ) : (
              <p className="mb-6 text-slate-300">Нет активных задач в текущем списке.</p>
            )}
            <button onClick={onClose} className="mt-6 text-sm text-slate-400 hover:text-white">
              Закрыть
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
