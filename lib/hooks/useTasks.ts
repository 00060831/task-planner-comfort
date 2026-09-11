'use client';

import { useMemo, useState, useEffect } from 'react';
import { parseTaskInput } from '@/lib/parser';
import { loadAppData, saveAppData } from '@/lib/storage';
import { AppData, BrainDumpItem, Task } from '@/lib/types';

const nowIso = () => new Date().toISOString();
const makeId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const makeSeedTask = (
  id: string,
  raw: string,
  overrides: Partial<Pick<Task, 'view' | 'priority' | 'scheduledFor'>> = {},
): Task => {
  const parsed = parseTaskInput(raw);
  const createdAt = nowIso();

  return {
    id,
    title: parsed.title,
    view: overrides.view ?? parsed.view,
    priority: overrides.priority ?? parsed.priority,
    scheduledFor: overrides.scheduledFor ?? parsed.scheduledFor,
    tags: parsed.tags,
    done: false,
    snoozedUntil: null,
    createdAt,
    updatedAt: createdAt,
  };
};

const seedData = (): AppData => ({
  tasks: [
    makeSeedTask('seed-task-1', '🔴 Подготовить вопросы для интервью @сегодня #research'),
    makeSeedTask('seed-task-2', 'Прочитать статью про AI завтра #learning'),
    makeSeedTask('seed-task-3', 'Собрать идеи для будущего проекта #creative', {
      view: 'someday',
      priority: 'low',
      scheduledFor: null,
    }),
  ],
  brainDump: [
    { id: 'seed-idea-1', text: 'Идея: мини-курс по заметкам', createdAt: nowIso() },
    { id: 'seed-idea-2', text: 'Проверить гипотезу о micro-learning', createdAt: nowIso() },
  ],
});

const isTaskActive = (task: Task) => {
  if (task.done) {
    return false;
  }

  if (!task.snoozedUntil) {
    return true;
  }

  return new Date(task.snoozedUntil).getTime() <= Date.now();
};

export const useTasks = () => {
  const [data, setData] = useState<AppData>({ tasks: [], brainDump: [] });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loaded = loadAppData();
    if (loaded) {
      setData(loaded);
    } else {
      setData(seedData());
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    saveAppData(data);
  }, [data, isReady]);

  const addTask = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const parsed = parseTaskInput(trimmed);
    const createdAt = nowIso();
    const task: Task = {
      id: makeId(),
      title: parsed.title,
      priority: parsed.priority,
      view: parsed.view,
      scheduledFor: parsed.scheduledFor,
      tags: parsed.tags,
      done: false,
      snoozedUntil: null,
      createdAt,
      updatedAt: createdAt,
    };

    setData((current) => ({ ...current, tasks: [task, ...current.tasks] }));
  };

  const updateTask = (id: string, updater: (task: Task) => Task) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) {
          return task;
        }
        return { ...updater(task), updatedAt: nowIso() };
      }),
    }));
  };
  const patchTask = (id: string, patch: Partial<Task>) => {
    updateTask(id, (task) => ({ ...task, ...patch }));
  };

  const completeTask = (id: string) => updateTask(id, (task) => ({ ...task, done: true }));

  const snoozeTask = (id: string) => {
    const snoozedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    updateTask(id, (task) => ({ ...task, snoozedUntil }));
  };

  const markNotUrgent = (id: string) => {
    updateTask(id, (task) => ({ ...task, priority: 'low', view: 'someday', scheduledFor: null }));
  };

  const addBrainDump = (text: string) => {
    const value = text.trim();
    if (!value) {
      return;
    }

    const item: BrainDumpItem = { id: makeId(), text: value, createdAt: nowIso() };
    setData((current) => ({ ...current, brainDump: [item, ...current.brainDump] }));
  };

  const visibleTasks = useMemo(() => data.tasks.filter(isTaskActive), [data.tasks]);

  const tasksByView = useMemo(
    () => ({
      today: visibleTasks.filter((task) => task.view === 'today'),
      tomorrow: visibleTasks.filter((task) => task.view === 'tomorrow'),
      someday: visibleTasks.filter((task) => task.view === 'someday'),
    }),
    [visibleTasks],
  );

  const exportJson = () => JSON.stringify(data, null, 2);

  return {
    data,
    isReady,
    tasksByView,
    addTask,
    updateTask,
    patchTask,
    completeTask,
    snoozeTask,
    markNotUrgent,
    addBrainDump,
    exportJson,
  };
};
