# Task Planner Comfort

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/00060831/task-planner-comfort)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/00060831/task-planner-comfort)

Минимальный Next.js проект с автостартом для Codespaces и fallback-страницей.

## Быстрый запуск в Codespaces

После создания Codespace `postStartCommand` автоматически запускает:

```bash
npm install && npm run dev
```

Приложение открывается на forwarded port **3000**.

## Debug: если страница в Codespace не открывается

В терминале выполните:

```bash
node -v
npm -v
npm install
npm run typecheck
npm run dev
```

Ожидаемый успешный вывод:

- `node -v` → `v20.x.x`
- `npm run typecheck` → без ошибок
- `npm run dev` → строка `ready - started server on 0.0.0.0:3000`

Если порт не открылся:
1. VS Code → **Ports**
2. Убедитесь, что есть `3000` и Visibility = Private/Public
3. Откройте ссылку порта вручную

## Варианты для пользователя сейчас

### A) Пересоздать Codespace

1. Закрыть текущий Codespace
2. GitHub → Code → Codespaces → Delete
3. Создать заново
4. Дождаться полной загрузки
5. В терминале: `npm install && npm run dev`

### B) Резервный деплой через Vercel

1. Нажмите кнопку **Deploy with Vercel** выше
2. Подключите GitHub аккаунт
3. Через ~1 минуту получите live URL на `vercel.app`

### C) Локальный запуск

```bash
git clone https://github.com/00060831/task-planner-comfort
cd task-planner-comfort
npm install
npm run dev
# открыть http://localhost:3000
```

## Fallback без сложной Node-настройки

Если среда не запускает Next.js, используйте статическую страницу:

- файл: `public/fallback.html`
- можно открыть как резервную демо-версию

## Проверка конфигурации

- `next.config.js` валиден
- TypeScript конфиг включен (`tsconfig.json`, `next-env.d.ts`)
- hardcoded абсолютных путей нет
- `devcontainer.json` автоматически ставит зависимости и запускает dev server
