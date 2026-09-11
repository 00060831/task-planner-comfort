# Task Planner for Lazy Creative Researchers 🚀

Минималистичный comfort-first планер задач для творческих пользователей, которым важны скорость, фокус и низкое трение.

## Быстрый старт

```bash
git clone https://github.com/00060831/task-planner-comfort
cd task-planner-comfort
npm install
# опционально: cp .env.example .env.local
npm run dev
```

Откройте http://localhost:3000

## Как использовать

**Добавить задачу:**
- Нажмите Cmd+K (Mac) или Ctrl+K (Windows)
- Введите задачу и нажмите Enter
- Или используйте плавающую кнопку `+ Add Task`

**Smart parsing:**
- `🔴 Срочно @сегодня #work` → высокий приоритет, Today, тег
- `Презентация в пятницу #team` → задача на ближайшую пятницу

**Three Views:**
- Today
- Tomorrow
- Someday

**Focus Mode:**
- `Готово` → завершает задачу
- `Отложить` → скрывает на 1 час
- `Не срочно` → переносит в Someday

**Brain Dump:**
- Быстро добавляйте идеи в отдельный блок

**Тема и экспорт:**
- Переключатель `🌙 Dark / ☀️ Light`
- `Export JSON` для выгрузки локальных данных

## Тестирование

1. Добавьте несколько задач через Cmd/Ctrl + K
2. Переключайте Today/Tomorrow/Someday
3. Проверьте все действия в Focus Mode
4. Добавьте 3-5 идей в Brain Dump
5. Обновите страницу — данные должны сохраниться

Технические проверки:

```bash
npm run lint
npm run build
```

## UX validation scenarios (MVP)

1. Quick idea capture (< 5s)
2. Smart priority/date parsing
3. Brain Dump for 5 quick ideas
4. Focus Mode actions (done/defer/not urgent)
5. Three-view clarity on first launch
6. Comfort on dark theme and mobile usage

## Seed data

При первом открытии автоматически создаются демо-задачи и идеи для быстрого теста интерфейса.

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- localStorage
