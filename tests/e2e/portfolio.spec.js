import { test, expect } from '@playwright/test';

test('muestra la presentación y los proyectos desde la API', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ideas que toman');
  await expect(page.getByRole('button', { name: 'Ver detalles de UniSocial' })).toBeVisible();
});

test('filtra proyectos y abre sus detalles', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Diseño', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ver detalles de Feria en 3D' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver detalles de Veterinaria multimodular' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Ver detalles de Feria en 3D' }).click();
  await expect(page.getByRole('dialog', { name: 'Feria en 3D' })).toContainText('Blender');
  await page.getByRole('button', { name: 'Cerrar detalles' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('envía el formulario y confirma el guardado', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Tu nombre').fill('Ana Ejemplo');
  await page.getByLabel('Tu correo').fill('ana@example.com');
  await page.getByLabel('Tu mensaje').fill('Me gustaría conversar sobre un proyecto de software.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('status')).toContainText('se guardó correctamente');
});
