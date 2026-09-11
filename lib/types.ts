export type TaskView = 'today' | 'tomorrow' | 'someday';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  priority: TaskPriority;
  view: TaskView;
  scheduledFor: string | null;
  tags: string[];
  done: boolean;
  snoozedUntil: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BrainDumpItem = {
  id: string;
  text: string;
  createdAt: string;
};

export type AppData = {
  tasks: Task[];
  brainDump: BrainDumpItem[];
};

export type ParsedTask = {
  title: string;
  priority: TaskPriority;
  view: TaskView;
  scheduledFor: string | null;
  tags: string[];
};
