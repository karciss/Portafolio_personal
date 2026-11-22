import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createStore } from '../../server/db.js';
import { createApp } from '../../server/app.js';

let store;
let server;
let base;

before(async () => {
  store = await createStore(':memory:');
  server = createApp(store).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  store.close();
});

test('API de salud responde correctamente', async () => {
  const response = await fetch(`${base}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});

test('API de proyectos lee datos iniciales desde SQLite', async () => {
  const response = await fetch(`${base}/api/projects`);
  const projects = await response.json();
  assert.equal(response.status, 200);
  assert.equal(projects.length, 12);
  assert.ok(projects.some((project) => project.slug === 'veterinaria-multimodular'));
});

test('API de contacto rechaza datos inválidos sin guardar mensajes', async () => {
  const beforeCount = store.countMessages();
  const response = await fetch(`${base}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'A', email: 'error', message: 'corto' }),
  });
  assert.equal(response.status, 400);
  assert.equal(store.countMessages(), beforeCount);
});

test('API de contacto guarda un mensaje válido en SQLite', async () => {
  const beforeCount = store.countMessages();
  const response = await fetch(`${base}/api/contact`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Ana', email: 'ana@example.com', message: 'Quiero saber más de tu trabajo.' }),
  });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(store.countMessages(), beforeCount + 1);
});

test('SQLite conserva los mensajes después de cerrar y reabrir la base', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'carolina-portfolio-'));
  const file = path.join(directory, 'test.sqlite');
  const first = await createStore(file);
  first.saveMessage({ name: 'Berta', email: 'berta@example.com', message: 'Quisiera revisar mi proyecto contigo.' });
  first.close();
  const second = await createStore(file);
  assert.equal(second.countMessages(), 1);
  second.close();
  fs.rmSync(file);
  fs.rmdirSync(directory);
});
