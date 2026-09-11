# Task Planner Comfort

Минималистичный планер задач для ленивого творческого исследователя: быстро закинуть мысль, выбрать один фокус и не утонуть в сложной системе.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/00060831/task-planner-comfort)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/00060831/task-planner-comfort)

## Что внутри

- **Quick add** — одна строка для добавления задач
- **Today / Tomorrow / Someday** — мягкая сортировка без жёсткого календаря
- **Focus mode** — приложение подсказывает следующую задачу
- **localStorage** — демо работает без сервера и базы данных
- **Codespaces-ready** — можно открыть и запустить прямо в браузере

## Открыть прямо на GitHub

### Вариант 1 — GitHub Codespaces

1. Нажми кнопку **Open in GitHub Codespaces** выше.
2. Дождись создания codespace.
3. В терминале выполни:

```bash
npm run dev
```

4. GitHub автоматически откроет preview для порта **3000**.
5. Готово: приложение работает прямо в браузере.

`npm install` отдельно не нужен: `.devcontainer/devcontainer.json` делает это автоматически при первом запуске.

### Вариант 2 — локально

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Быстрый сценарий тестирования

1. Добавь задачу в поле сверху.
2. Попробуй префиксы `сегодня:`, `завтра:` или `потом:`.
3. Отметь задачу выполненной.
4. Нажми **Переложить**, чтобы переместить её между колонками.
5. Проверь карточку **Focus mode** — она показывает следующий приоритет.

## Деплой

### Vercel

Нажми кнопку **Deploy with Vercel** выше и подключи репозиторий. Для этого проекта не нужен отдельный backend, поэтому деплой проходит как обычное Next.js приложение.

## Стек

- Next.js
- React
- TypeScript
- Tailwind CSS
