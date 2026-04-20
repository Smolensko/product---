import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth';
import searchRoutes from './routes/search';
import aiRoutes from './routes/ai';
import { SERVER_CONFIG } from './config/constants';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Static Files
 */
const REACT_BUILD_FOLDER = path.join(__dirname, '..', 'frontend', 'dist');
app.use(
  express.static(REACT_BUILD_FOLDER, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    },
  })
);

app.use(
  '/assets',
  express.static(path.join(REACT_BUILD_FOLDER, 'assets'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    },
  })
);

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);

// AI Routes - 添加调试日志
console.log('Registering AI routes...');
app.use('/api/ai', aiRoutes);
console.log('AI routes registered');

// 测试AI路由
app.get('/api/ai/test', (req, res) => {
  console.log('AI test route hit');
  res.json({ success: true, message: 'AI routes are working!' });
});

app.use('/api', searchRoutes);

/**
 * SPA Fallback Route
 */
app.get('*', (_req, res) => {
  const indexPath = path.join(REACT_BUILD_FOLDER, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <head>
          <title>华史通鉴</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
            .container { max-width: 600px; margin: 0 auto; }
            h1 { color: #a72323; }
            p { color: #666; }
            .btn { display: inline-block; padding: 10px 20px; margin: 10px; background: #a72323; color: white; text-decoration: none; border-radius: 4px; }
            .btn:hover { background: #8a1a1a; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>华史通鉴</h1>
            <h2>中国历史查询系统</h2>
            <p>前端构建文件未找到，请运行前端构建命令。</p>
            <p>API服务已经启动，可以访问以下接口：</p>
            <a href="/api/auth/me" class="btn">测试API</a>
          </div>
        </body>
      </html>
    `);
  }
});

/**
 * Error Handler
 */
app.use(errorHandler as ErrorRequestHandler);

/**
 * Start Server
 */
app.listen(SERVER_CONFIG.PORT, () => {
  console.log(`Server ready on port ${SERVER_CONFIG.PORT}`);
});

export default app;
