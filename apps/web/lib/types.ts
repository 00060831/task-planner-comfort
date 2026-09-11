export type TaskBucket = "today" | "tomorrow" | "someday";
export type TaskPriority = "urgent" | "important" | "gentle";
export type PlannerView = "overview" | TaskBucket | "focus" | "archive";

export interface RecurringRule {
  cadence: "weekly";
  weekday: number;
  label: string;
}

export interface Task {
  id: string;
  title: string;
  bucket: TaskBucket;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  archived: boolean;
  completedAt?: string;
  scheduledFor?: string;
  snoozedUntil?: string;
  recurring?: RecurringRule;
  source?: "quick-add" | "brain-dump";
}

export interface DisplayTask extends Task {
  smartTags: string[];
}

export interface BrainDumpNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface PlannerSnapshot {
  tasks: Task[];
  brainDumpDraft: string;
}

export interface ParsedTaskInput {
  title: string;
  bucket: TaskBucket;
  priority: TaskPriority;
  tags: string[];
  scheduledFor?: string;
  recurring?: RecurringRule;
}
