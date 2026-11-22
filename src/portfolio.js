export const categories = ['Todos', 'Desarrollo', 'Diseño'];

export function filterProjects(projects, category, query = '') {
  const needle = query.trim().toLocaleLowerCase('es');
  return projects.filter((project) => {
    const matchesCategory = category === 'Todos' || project.category === category;
    const text = `${project.title} ${project.description} ${project.stack}`.toLocaleLowerCase('es');
    return matchesCategory && (!needle || text.includes(needle));
  });
}

export function validateContact(input) {
  const name = String(input?.name ?? '').trim();
  const email = String(input?.email ?? '').trim();
  const message = String(input?.message ?? '').trim();
  if (name.length < 2 || name.length > 100) return 'Escribe un nombre de 2 a 100 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return 'Escribe un correo válido.';
  if (message.length < 10 || message.length > 3000) return 'El mensaje debe tener entre 10 y 3000 caracteres.';
  return null;
}
