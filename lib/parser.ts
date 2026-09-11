import { ParsedTask, TaskPriority, TaskView } from './types';

const WEEKDAYS: Record<string, number> = {
  понедельник: 1,
  вторник: 2,
  среду: 3,
  среда: 3,
  четверг: 4,
  пятницу: 5,
  пятница: 5,
  субботу: 6,
  суббота: 6,
  воскресенье: 0,
};
const WEEKDAY_PATTERN = Object.keys(WEEKDAYS).join('|');

const dateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
};

const nextWeekday = (weekday: number) => {
  const now = new Date();
  const daysAhead = (7 + weekday - now.getDay()) % 7 || 7;
  return addDays(now, daysAhead);
};

const inferView = (scheduledFor: string | null): TaskView => {
  if (!scheduledFor) {
    return 'someday';
  }

  const today = dateString(new Date());
  if (scheduledFor === today) {
    return 'today';
  }

  const tomorrow = dateString(addDays(new Date(), 1));
  if (scheduledFor === tomorrow) {
    return 'tomorrow';
  }

  return 'someday';
};

const parsePriority = (text: string): TaskPriority => {
  const lowered = text.toLowerCase();

  if (lowered.includes('🔴') || lowered.includes('срочно') || lowered.includes('urgent')) {
    return 'high';
  }

  if (lowered.includes('🟢') || lowered.includes('не срочно') || lowered.includes('later')) {
    return 'low';
  }

  if (lowered.includes('🟡') || lowered.includes('важно')) {
    return 'medium';
  }

  return 'medium';
};

const parseSchedule = (text: string) => {
  const lowered = text.toLowerCase();
  const hasWord = (word: string) => new RegExp(`(^|\\s|[.,!?])${word}($|\\s|[.,!?])`, 'i').test(lowered);
  const explicitWeekday = lowered.match(
    new RegExp(`(^|\\s|[.,!?])в\\s+(${WEEKDAY_PATTERN})(?=$|\\s|[.,!?])`, 'i'),
  );

  if (lowered.includes('@сегодня') || hasWord('сегодня')) {
    return dateString(new Date());
  }

  if (lowered.includes('@завтра') || hasWord('завтра')) {
    return dateString(addDays(new Date(), 1));
  }

  if (explicitWeekday) {
    const weekday = explicitWeekday[2];
    const weekdayIndex = WEEKDAYS[weekday];
    if (weekdayIndex !== undefined) {
      return dateString(nextWeekday(weekdayIndex));
    }
  }

  for (const [day, dayIndex] of Object.entries(WEEKDAYS)) {
    if (hasWord(day)) {
      return dateString(nextWeekday(dayIndex));
    }
  }

  return null;
};

const normalizeTitle = (text: string) =>
  text
    .replace(
      /(^|\s|[.,!?])в\s+(понедельник|вторник|среда|среду|четверг|пятница|пятницу|суббота|субботу|воскресенье)(?=$|\s|[.,!?])/gi,
      ' ',
    )
    .replace(
      /(^|\s|[.,!?])(сегодня|завтра|понедельник|вторник|среда|среду|четверг|пятница|пятницу|суббота|субботу|воскресенье)($|\s|[.,!?])/gi,
      ' ',
    )
    .replace(/#[^\s#@]+/g, '')
    .replace(/@сегодня|@завтра/gi, '')
    .replace(/[🔴🟡🟢]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const parseTaskInput = (input: string): ParsedTask => {
  const tags = [...input.matchAll(/#([^\s#@]+)/g)].map((entry) => entry[1]);
  const scheduledFor = parseSchedule(input);

  return {
    title: normalizeTitle(input) || input.trim(),
    priority: parsePriority(input),
    view: inferView(scheduledFor),
    scheduledFor,
    tags,
  };
};
