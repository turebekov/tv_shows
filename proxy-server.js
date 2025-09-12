const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Включаем CORS
app.use(cors());

// Прокси для TVMaze API
app.use('/api', createProxyMiddleware({
  target: 'https://api.tvmaze.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
}));

// Статические файлы из папки browser
app.use(express.static(path.join(__dirname, 'browser')));

// Все остальные запросы направляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'browser', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📺 TVMaze API proxy: http://localhost:${PORT}/api`);
  console.log(`🌐 App available at: http://localhost:${PORT}`);
});
