'use client';

import { BrainDump } from '@/components/BrainDump';
import { FocusMode } from '@/components/FocusMode';
import { Navigation } from '@/components/Navigation';
import { TaskAdd } from '@/components/TaskAdd';
import { TaskList } from '@/components/TaskList';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTasks } from '@/lib/hooks/useTasks';
import { loadTheme, saveTheme } from '@/lib/storage';
import { Task, TaskView } from '@/lib/types';
import { useEffect, useMemo, useState } from 'react';

export default function HomePage() {
  const [activeView, setActiveView] = useState<TaskView>('today');
  const [focusMode, setFocusMode] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { isReady, tasksByView, data, addTask, updateTask, completeTask, snoozeTask, markNotUrgent, addBrainDump, exportJson } =
    useTasks();

  useEffect(() => {
    const restored = loadTheme();
    setTheme(restored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveTheme(theme);
  }, [theme]);

  const activeTasks = tasksByView[activeView];
  const focusTask: Task | null = useMemo(() => activeTasks[0] ?? null, [activeTasks]);

  const onExport = () => {
    const payload = exportJson();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'task-planner-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isReady) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">Loading...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid w-full max-w-5xl gap-5">
        <header className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold">Task Planner for Lazy Creative Researchers</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Comfort-first planning with low-friction task capture.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onExport} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-white dark:bg-slate-700">
                Export JSON
              </button>
              <button
                onClick={() => setFocusMode(true)}
                className="rounded-full bg-violet-500 px-3 py-1 text-xs font-medium text-white"
              >
                Focus
              </button>
              <ThemeToggle theme={theme} onToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))} />
            </div>
          </div>

          <Navigation activeView={activeView} onChange={setActiveView} />
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Active tasks: {activeTasks.length} / Total saved: {data.tasks.length}</p>
        </header>

        <TaskList
          tasks={activeTasks}
          onUpdate={(id, next) => {
            updateTask(id, (task) => ({ ...task, ...next }));
          }}
        />

        <BrainDump items={data.brainDump} onAdd={addBrainDump} />
      </div>

      <FocusMode
        isOpen={focusMode}
        task={focusTask}
        onClose={() => setFocusMode(false)}
        onDone={completeTask}
        onSnooze={snoozeTask}
        onNotUrgent={markNotUrgent}
      />

      <TaskAdd onAddTask={addTask} />
    </main>
  );
}
