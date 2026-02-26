import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;
const API_URL = 'http://localhost:5000';

// API 프록시
app.use('/api', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Backend API is not available' });
  },
}));

// Static files with SPA fallback
app.use(express.static(path.join(__dirname, 'dist'), {
  index: false
}));

// SPA fallback - catch all routes that aren't API or static files
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`🚀 StyleRoom web server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying /api/* to ${API_URL}`);
});
