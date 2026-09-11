'use client';

import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';

type TaskListProps = {
  tasks: Task[];
  onUpdate: (id: string, next: Partial<Task>) => void;
};

export function TaskList({ tasks, onUpdate }: TaskListProps) {
  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
        Empty view. Add a task with Cmd/Ctrl+K.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
