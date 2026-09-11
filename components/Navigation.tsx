'use client';

import { TaskView } from '@/lib/types';

const labels: Record<TaskView, string> = {
  today: 'Today',
  tomorrow: 'Tomorrow',
  someday: 'Someday',
};

type NavigationProps = {
  activeView: TaskView;
  onChange: (view: TaskView) => void;
};

export function Navigation({ activeView, onChange }: NavigationProps) {
  const views: TaskView[] = ['today', 'tomorrow', 'someday'];

  return (
    <nav className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-900/50 p-2 shadow-glow">
      {views.map((view) => (
        <button
          key={view}
          onClick={() => onChange(view)}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            activeView === view
              ? 'bg-violet-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {labels[view]}
        </button>
      ))}
    </nav>
  );
}
