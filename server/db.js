import fs from 'node:fs';
import path from 'node:path';
import initSqlJs from 'sql.js';
import { seedProjects } from './projects.js';

export async function createStore(filePath = ':memory:') {
  const SQL = await initSqlJs();
  const persisted = filePath !== ':memory:' && fs.existsSync(filePath);
  const db = persisted ? new SQL.Database(new Uint8Array(fs.readFileSync(filePath))) : new SQL.Database();
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
    category TEXT NOT NULL, kind TEXT NOT NULL, stack TEXT NOT NULL,
    description TEXT NOT NULL, accent TEXT NOT NULL, glyph TEXT NOT NULL
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
    message TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`);
  for (const project of seedProjects) {
    db.run(`INSERT INTO projects (slug,title,category,kind,stack,description,accent,glyph)
      VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title, category=excluded.category, kind=excluded.kind,
      stack=excluded.stack, description=excluded.description,
      accent=excluded.accent, glyph=excluded.glyph`,
      [project.slug, project.title, project.category, project.kind, project.stack, project.description, project.accent, project.glyph]);
  }
  const save = () => {
    if (filePath === ':memory:') return;
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporary = `${filePath}.tmp`;
    fs.writeFileSync(temporary, Buffer.from(db.export()));
    fs.renameSync(temporary, filePath);
  };
  save();
  return {
    listProjects() {
      const result = db.exec('SELECT slug,title,category,kind,stack,description,accent,glyph FROM projects ORDER BY id');
      return result.length ? result[0].values.map((row) => Object.fromEntries(result[0].columns.map((column, index) => [column, row[index]]))) : [];
    },
    saveMessage({ name, email, message }) {
      db.run('INSERT INTO messages (name,email,message) VALUES (?,?,?)', [name.trim(), email.trim(), message.trim()]);
      save();
      return db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    },
    countMessages() { return db.exec('SELECT COUNT(*) FROM messages')[0].values[0][0]; },
    close() { db.close(); }
  };
}
