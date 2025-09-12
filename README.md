# TV Shows App - GitHub Pages Deployment

## 🚀 Деплой на GitHub Pages

### Вариант 1: Простой деплой (рекомендуется)

1. **Скопируйте файлы в корень ветки gh-pages:**
   ```bash
   git checkout gh-pages
   cp -r browser/* .
   git add .
   git commit -m "Deploy with CORS proxy"
   git push origin gh-pages
   ```

2. **Откройте приложение:**
   - https://turebekov.github.io/tv_shows/

### Вариант 2: Использование CORS прокси

Приложение использует публичные CORS прокси для обхода ограничений браузера:

- `cors-anywhere.herokuapp.com`
- `api.allorigins.win`
- `corsproxy.io`
- `thingproxy.freeboard.io`

### Вариант 3: Cloudflare Workers (продвинутый)

1. **Создайте Cloudflare Worker**
2. **Скопируйте код из `cloudflare-worker.js`**
3. **Настройте маршрут для вашего домена**

## 🔧 Локальная разработка

```bash
# Запуск прокси-сервера
npm start

# Открыть в браузере
http://localhost:3001
```

## 📁 Структура файлов

```
tv_shows/
├── browser/                 # Собранное приложение
│   ├── index.html
│   ├── main-UL5YSIGA.js
│   ├── styles-77XZT3HT.css
│   └── cors-proxy.js        # CORS прокси
├── proxy-server.js          # Локальный прокси
├── cors-proxy.js            # CORS прокси для браузера
├── cloudflare-worker.js     # Cloudflare Worker
└── package.json
```

## 🌐 API Endpoints

- **Поиск шоу**: `/api/search/shows?q=query`
- **Получение актеров**: `/api/shows/{id}/cast`
- **Детали шоу**: `/api/shows/{id}`

## ⚠️ Ограничения GitHub Pages

- Нет серверной части
- CORS ограничения
- Только статические файлы

## ✅ Решения

1. **CORS прокси** - обход ограничений браузера
2. **Cloudflare Workers** - серверная логика
3. **GitHub Actions** - автоматический деплой
