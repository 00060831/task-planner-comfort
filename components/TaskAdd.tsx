'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useEffect, useState } from 'react';

type TaskAddProps = {
  onAddTask: (title: string) => void;
};

export function TaskAdd({ onAddTask }: TaskAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }
    onAddTask(value);
    setValue('');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-105 hover:bg-violet-400"
      >
        + Add Task
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.form
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={submit}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-add-label"
              className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-4"
            >
              <label id="task-add-label" htmlFor="new-task" className="mb-2 block text-xs text-slate-400">
                Add task (Cmd/Ctrl+K)
              </label>
              <input
                id="new-task"
                autoFocus
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="🔴 Срочно @сегодня #work"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none ring-violet-400 focus:ring"
              />
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
