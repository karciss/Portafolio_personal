import path from 'node:path';
import { createStore } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3000);
const store = await createStore(process.env.DB_PATH || path.resolve('data/portfolio.sqlite'));
const app = createApp(store);
app.listen(port, '0.0.0.0', () => console.log(`Portafolio disponible en http://localhost:${port}`));
