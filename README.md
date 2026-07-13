# hexlet-vibecoding

Учусь вайбкодингу, тут будут мои эксперименты.

## Калькулятор калорий и ИМТ

Веб-приложение для расчёта индекса массы тела и суточной нормы калорий.

### Возможности

- Расчёт индекса массы тела (ИМТ) с категорией по ВОЗ
- Расчёт базового обмена веществ (BMR) по формуле **Миффлина — Сан Жеора**
- Учёт уровня физической активности (TDEE)
- Корректировка нормы под цель: похудение, поддержание или набор массы
- Рекомендации по белкам, жирам и углеводам

### Стек

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — сборка и dev-сервер
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — оформление

### Запуск

```bash
npm install
npm run dev      # запустить dev-сервер
npm run build    # собрать продакшн-версию в dist/
```

### Структура

- `index.html` — точка входа Vite
- `src/App.tsx` — корневой компонент
- `src/components/CalorieCalculator.tsx` — форма и логика расчёта
- `src/components/ui/` — компоненты shadcn/ui
- `src/index.css` — тема (CSS-переменные, светлая палитра)
