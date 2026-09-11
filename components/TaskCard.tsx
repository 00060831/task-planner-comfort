'use client';

import { Task, TaskPriority, TaskView } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

type TaskCardProps = {
  task: Task;
  onUpdate: (id: string, next: Partial<Task>) => void;
};

const priorityStyles: Record<TaskPriority, string> = {
  high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);

  const tagsValue = task.tags.join(', ');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4"
    >
      <button className="w-full text-left" onClick={() => setExpanded((current) => !current)}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-base font-medium text-white">{task.title}</h3>
          <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span>View: {task.view}</span>
          {task.scheduledFor && <span>Date: {task.scheduledFor}</span>}
          {task.tags.map((tag) => (
            <span key={`${task.id}-${tag}`} className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
              #{tag}
            </span>
          ))}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 grid gap-3 border-t border-slate-700 pt-4 text-sm">
          <label className="grid gap-1 text-slate-400">
            Priority
            <select
              value={task.priority}
              onChange={(event) => onUpdate(task.id, { priority: event.target.value as TaskPriority })}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>

          <label className="grid gap-1 text-slate-400">
            View
            <select
              value={task.view}
              onChange={(event) => onUpdate(task.id, { view: event.target.value as TaskView })}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-white"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="someday">Someday</option>
            </select>
          </label>

          <label className="grid gap-1 text-slate-400">
            Date
            <input
              type="date"
              value={task.scheduledFor ?? ''}
              onChange={(event) => onUpdate(task.id, { scheduledFor: event.target.value || null })}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-white"
            />
          </label>

          <label className="grid gap-1 text-slate-400">
            Tags
            <input
              value={tagsValue}
              onChange={(event) =>
                onUpdate(task.id, {
                  tags: event.target.value
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter(Boolean),
                })
              }
              placeholder="work, idea"
              className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-white"
            />
          </label>
        </div>
      )}
    </motion.article>
  );
}
