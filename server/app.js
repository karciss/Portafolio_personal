import express from 'express';
import path from 'node:path';
import { validateContact } from '../src/portfolio.js';

export function createApp(store, staticDir = path.resolve('dist')) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));
  app.get('/api/projects', (_request, response) => response.json(store.listProjects()));
  app.post('/api/contact', (request, response) => {
    if (request.body?.website) return response.status(202).json({ ok: true });
    const error = validateContact(request.body);
    if (error) return response.status(400).json({ error });
    const { name, email, message } = request.body;
    store.saveMessage({ name, email, message });
    return response.status(201).json({ ok: true });
  });
  app.use(express.static(staticDir));
  app.get('/{*path}', (_request, response) => response.sendFile(path.join(staticDir, 'index.html')));
  return app;
}
