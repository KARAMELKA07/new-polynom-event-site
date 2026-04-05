# New-Polynom

Адаптивный React-сайт об отчётном концерте вокальной студии New-Polynom.

## Команды

```bash
npm install
npm run dev
npm run build
```

## Что где менять

- Основной текст и персонажи: `src/data/familyTree.js`
- Разметка страницы: `src/App.jsx`
- Интерактивное древо и модальное окно: `src/components/FamilyTreeCanvas.jsx`
- Визуальный стиль: `src/styles.css`

## Cloudflare Pages

Для публикации на Cloudflare Pages подойдёт стандартная сборка Vite:

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `20`
