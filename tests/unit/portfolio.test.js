import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects, validateContact } from '../../src/portfolio.js';

const sample = [
  { title: 'Veterinaria', category: 'Desarrollo', description: 'Sistema clínico', stack: 'React SQL' },
  { title: 'Feria en 3D', category: 'Diseño', description: 'Escenario animado', stack: 'Blender' },
  { title: 'Farmacia', category: 'Desarrollo', description: 'Gestión de productos', stack: 'C# SQL' },
];

test('filtra proyectos por categoría sin alterar la lista original', () => {
  const result = filterProjects(sample, 'Desarrollo');
  assert.deepEqual(result.map((project) => project.title), ['Veterinaria', 'Farmacia']);
  assert.equal(sample.length, 3);
});

test('busca sin distinguir mayúsculas ni espacios alrededor', () => {
  assert.deepEqual(filterProjects(sample, 'Todos', '  BLENDER  ').map((project) => project.title), ['Feria en 3D']);
});

test('rechaza correos inválidos aunque el resto del formulario sea válido', () => {
  assert.match(validateContact({ name: 'Ana', email: 'ana-invalida', message: 'Quisiera colaborar en una aplicación.' }), /correo válido/);
});

test('acepta un mensaje válido y rechaza textos demasiado cortos', () => {
  assert.equal(validateContact({ name: 'Ana', email: 'ana@example.com', message: 'Quisiera colaborar en una aplicación.' }), null);
  assert.match(validateContact({ name: 'Ana', email: 'ana@example.com', message: 'Hola' }), /10 y 3000/);
});
