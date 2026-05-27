# Публикация сайта

## Что загрузить на хостинг

Загрузите в корень сайта:

- `index.html`
- `404.html`
- `styles.css`
- `script.js`
- `analytics-consent.js`
- `robots.txt`
- `sitemap.xml`
- `assets/`
- `fi/`
- `ru/`
- `privacy-policy/`

Не загружайте временные папки вроде `.tmp-edge-*`.

## Что заменить перед запуском

1. Вставьте реальный `GA4 Measurement ID` вместо `G-XXXXXXXXXX` в `analytics-consent.js`.
2. Замените заглушку `https://instagram.com/` на вашу ссылку в:
   - `index.html`
   - `fi/index.html`
   - `ru/index.html`

## Что проверить после публикации

1. Домен `duocodestudio.com` открывается по `HTTPS`.
2. Работают страницы:
   - `https://duocodestudio.com/`
   - `https://duocodestudio.com/fi/`
   - `https://duocodestudio.com/ru/`
   - `https://duocodestudio.com/privacy-policy/`
3. Работают `robots.txt` и `sitemap.xml`.
4. Показывается cookie-баннер.
5. Кнопка email открывает `contact@duocodestudio.com`.
6. Переключение языков работает.

## После запуска

Добавьте `https://duocodestudio.com/sitemap.xml` в `Google Search Console`.
