# Task Planner Comfort

Repository for planning and validating the MVP UX of a comfort-first task planner for creative users.

MVP phase has moved to **UX validation for a "Lazy Creative Researcher"**: a user who wants speed, beauty, and zero friction.

## 🧪 Test Goal

Validate that the product is understandable and usable **without reading instructions**, especially on mobile.

## ✅ UX Test Scenarios (MVP)

1. **Quick idea capture**
   - Action: `Cmd/Ctrl + K` → type `Прочитать статью про OAuth` → `Enter`
   - Pass: task appears in **Today** or default **Someday** in < 5s total

2. **Smart priority parsing**
   - Input: `🔴 Fix bug in auth @сегодня`
   - Pass:
     - priority = red/urgent
     - date = Today
     - title = `Fix bug in auth`

3. **Brain Dump mode**
   - Add 5 ideas in sequence:
     - `Написать blog post`
     - `Исследовать нейросети`
     - `Купить кофе`
     - `Переговоры с клиентом`
     - `Финализировать дизайн`
   - Pass: all are captured quickly without forced extra fields

4. **Focus Mode**
   - Open focus view for one task (example: `Написать blog post`)
   - Pass:
     - `Готово` completes and moves to next task
     - `Отложить на 1 час` hides/defers task
     - `Это не срочно` moves task to Someday

5. **Context switching**
   - Switch from Project A to Project B and back
   - Pass: task list filters by current project context and restores quickly

6. **Mobile swipes**
   - On mobile:
     - swipe left = done
     - swipe right = defer
   - Pass: interactions are smooth, no visible lag

7. **Three-view clarity**
   - First launch must show:
     - Today
     - Tomorrow
     - Someday
   - Pass: user instantly understands where tasks belong

8. **Zen reminders**
   - Task with due `Today 18:00`
   - Pass: gentle in-app highlight only (no intrusive push/sound)

9. **Archive & search**
   - Search for June task with keyword `OAuth`
   - Pass: item can be found in archive quickly and reliably

10. **Recurring tasks**
    - Input: `Встреча в пятницу каждую неделю`
    - Pass: recurring weekly task is created automatically

## 🎨 UX Checklist

- [ ] One-click add works (`Cmd/Ctrl + K`, `Enter`)
- [ ] Interface is not cluttered (clear whitespace)
- [ ] Priority colors are intuitive (🔴 🟠 🟢 🔵)
- [ ] Animations are helpful and non-distracting
- [ ] Dark theme is comfortable
- [ ] Mobile interactions are fast (swipe/actions)
- [ ] No instructions needed to get started (**most important**)
- [ ] Only essential fields are required (title first)
- [ ] Tab transitions are smooth
- [ ] Archive is out of the way but searchable

## 📊 Success Metrics

1. **Time to First Task**: < 5 seconds
2. **Mandatory fields**: exactly 1 (title)
3. **User delight**: user prefers it over Notes/Todo apps
4. **No friction**: no "where to click / what does this mean"
5. **Mobile advantage**: key flows as fast or faster than desktop
6. **Focus success**: user can stay on one task with minimal context noise

## 🔧 Post-Test Feedback Loop

For each failed or painful step, capture:

- Scenario ID (1-10)
- Device (mobile/desktop + browser)
- User quote (what felt annoying)
- Expected vs actual behavior
- Severity (P0/P1/P2)
- Proposed fix

Then execute in this order:

1. remove friction in primary flows
2. improve mobile gestures/performance
3. add missing smart parsing features
4. tune UI polish and motion
5. optimize startup/runtime performance to perceived < 1s open

## 📌 MVP+ Features to Evaluate Next

- Offline-first behavior
- Cross-device sync
- Complete keyboard shortcut coverage
- Dark/light theme toggle
- Export structured tasks to Jira
