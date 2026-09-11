import { ParsedTaskInput, RecurringRule, TaskBucket, TaskPriority } from "@/lib/types";

const stopWords = new Set([
  "about",
  "after",
  "before",
  "that",
  "this",
  "with",
  "have",
  "ideas",
  "idea",
  "research",
  "today",
  "tomorrow",
  "someday",
  "для",
  "если",
  "или",
  "надо",
  "задача",
  "задачи",
  "потом",
  "сегодня",
  "завтра",
  "когда",
  "нибудь",
  "очень",
  "просто",
  "чтобы",
  "проект",
  "сделать",
  "нужно",
  "будет",
]);

const weekdayPatterns = [
  { weekday: 1, label: "понедельник", tokens: ["понедельник", "понедельника", "monday"] },
  { weekday: 2, label: "вторник", tokens: ["вторник", "вторника", "tuesday"] },
  { weekday: 3, label: "среду", tokens: ["среда", "среду", "wednesday"] },
  { weekday: 4, label: "четверг", tokens: ["четверг", "четверга", "thursday"] },
  { weekday: 5, label: "пятницу", tokens: ["пятница", "пятницу", "friday"] },
  { weekday: 6, label: "субботу", tokens: ["суббота", "субботу", "saturday"] },
  { weekday: 0, label: "воскресенье", tokens: ["воскресенье", "sunday"] },
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatLocalDay(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function dayOffset(offset: number) {
  const today = startOfDay(new Date());
  today.setDate(today.getDate() + offset);
  return formatLocalDay(today);
}

function nextWeekdayDate(weekday: number) {
  const today = startOfDay(new Date());
  const current = today.getDay();
  const rawDistance = (weekday - current + 7) % 7;
  const distance = rawDistance === 0 ? 7 : rawDistance;
  today.setDate(today.getDate() + distance);
  return formatLocalDay(today);
}

function detectRecurring(value: string): RecurringRule | undefined {
  for (const pattern of weekdayPatterns) {
    const tokenPattern = pattern.tokens.join("|");
    const recurringMatcher = new RegExp(
      `\\b(?:каждый|каждую|every|weekly|в|on)\\s+(?:${tokenPattern})\\b`,
      "iu",
    );

    if (recurringMatcher.test(value)) {
      return {
        cadence: "weekly",
        weekday: pattern.weekday,
        label: pattern.label,
      };
    }
  }

  return undefined;
}

function removeSmartTokens(value: string) {
  const weekdayTokens = weekdayPatterns
    .flatMap((pattern) => pattern.tokens)
    .join("|");

  return value
    .replace(/[🔴🟠🟢]/gu, " ")
    .replace(/@?(сегодня|today|завтра|tomorrow|когда-нибудь|someday)\b/giu, " ")
    .replace(new RegExp(`\\b(?:каждый|каждую|every|weekly|в|on)\\s+(?:${weekdayTokens})\\b`, "giu"), " ")
    .replace(/#([\p{L}\p{N}-]+)/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractMeaningfulWords(value: string) {
  const matches = value.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}-]{2,}/gu) ?? [];

  return [...new Set(matches.filter((word) => word.length >= 4 && !stopWords.has(word)))];
}

export function parseTaskInput(input: string): ParsedTaskInput {
  const raw = input.trim();
  let bucket: TaskBucket = "someday";
  let priority: TaskPriority = "important";

  if (/[🔴]/u.test(raw) || /\b(срочно|urgent)\b/iu.test(raw)) {
    priority = "urgent";
  } else if (/[🟢]/u.test(raw) || /\b(когда-нибудь|someday|later)\b/iu.test(raw)) {
    priority = "gentle";
  }

  let scheduledFor: string | undefined;

  if (/@?(сегодня|today)\b/iu.test(raw)) {
    bucket = "today";
    scheduledFor = dayOffset(0);
  } else if (/@?(завтра|tomorrow)\b/iu.test(raw)) {
    bucket = "tomorrow";
    scheduledFor = dayOffset(1);
  }

  const recurring = detectRecurring(raw);

  if (!scheduledFor && recurring) {
    scheduledFor = nextWeekdayDate(recurring.weekday);
    const now = dayOffset(0);
    const tomorrow = dayOffset(1);

    if (scheduledFor === now) {
      bucket = "today";
    } else if (scheduledFor === tomorrow) {
      bucket = "tomorrow";
    }
  }

  const tags = [...new Set([...raw.matchAll(/#([\p{L}\p{N}-]+)/gu)].map((match) => match[1].toLowerCase()))];
  const title = removeSmartTokens(raw) || "Новая идея";

  return {
    title,
    bucket,
    priority,
    tags,
    scheduledFor,
    recurring,
  };
}
