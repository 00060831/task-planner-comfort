import { AppData } from './types';

const STORAGE_KEY = 'task-planner-comfort:data';
const THEME_KEY = 'task-planner-comfort:theme';

const canUseStorage = () => typeof window !== 'undefined';

export const loadAppData = (): AppData | null => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return null;
  }
};

export const saveAppData = (data: AppData) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const saveTheme = (theme: 'dark' | 'light') => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(THEME_KEY, theme);
};

export const loadTheme = (): 'dark' | 'light' => {
  if (!canUseStorage()) {
    return 'dark';
  }

  const theme = window.localStorage.getItem(THEME_KEY);
  return theme === 'light' ? 'light' : 'dark';
};
