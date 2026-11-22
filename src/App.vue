<script setup>
import { computed, onMounted, ref } from 'vue';
import { categories, filterProjects } from './portfolio.js';

const projects = ref([]);
const category = ref('Todos');
const query = ref('');
const selectedProject = ref(null);
const loading = ref(true);
const loadError = ref(false);
const menuOpen = ref(false);
const form = ref({ name: '', email: '', message: '', website: '' });
const formState = ref('idle');
const formMessage = ref('');
const filteredProjects = computed(() => filterProjects(projects.value, category.value, query.value));

async function loadProjects() {
  loading.value = true;
  loadError.value = false;
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('API unavailable');
    projects.value = await response.json();
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

async function submitContact() {
  formState.value = 'sending';
  formMessage.value = '';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'No se pudo enviar el mensaje.');
    formState.value = 'success';
    formMessage.value = '¡Gracias! Tu mensaje se guardó correctamente.';
    form.value = { name: '', email: '', message: '', website: '' };
  } catch (error) {
    formState.value = 'error';
    formMessage.value = error.message || 'Inténtalo de nuevo.';
  }
}

function closeModal(event) {
  if (event.key === 'Escape') selectedProject.value = null;
}

onMounted(() => {
  loadProjects();
  window.addEventListener('keydown', closeModal);
});
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#inicio" @click="menuOpen = false" aria-label="Carolina Cisneros, inicio">
        <span class="brand-mark">C<span>✳</span></span><span>Carolina<span class="brand-last"> Cisneros</span></span>
      </a>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="primary-nav" @click="menuOpen = !menuOpen">{{ menuOpen ? 'Cerrar' : 'Menú' }}</button>
      <nav id="primary-nav" class="nav-links" :class="{ 'is-open': menuOpen }" aria-label="Navegación principal">
        <a href="#sobre-mi" @click="menuOpen = false">Sobre mí</a>
        <a href="#proyectos" @click="menuOpen = false">Proyectos</a>
        <a href="#trayectoria" @click="menuOpen = false">Trayectoria</a>
        <a class="nav-contact" href="#contacto" @click="menuOpen = false">Hablemos <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main>
      <section id="inicio" class="hero section-wrap">
        <div class="hero-copy">
          <div class="eyebrow"><span class="availability-dot"></span> PORTAFOLIO PERSONAL · SUCRE, BOLIVIA</div>
          <h1>Ideas que toman <em>forma</em> en código.</h1>
          <p class="hero-lead">Hola, soy <strong>Carolina Cisneros Arroyo</strong>. Estudio Ingeniería de Sistemas Informáticos y conecto desarrollo, diseño y seguridad para crear experiencias digitales con intención.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="#proyectos">Explorar proyectos <span aria-hidden="true">↗</span></a>
            <a class="button button-text" href="#contacto">Trabajemos juntos <span aria-hidden="true">↗</span></a>
          </div>
          <div class="hero-micro"><span>01 / DESARROLLO</span><span>02 / DISEÑO</span><span>03 / SEGURIDAD</span></div>
        </div>
        <div class="hero-art" aria-label="Ilustración abstracta con iniciales de Carolina">
          <div class="art-grid"></div>
          <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
          <div class="art-card"><span class="art-top">CREAR · EXPLORAR · APRENDER</span><span class="art-initials">CC<span>✳</span></span><span class="art-bottom">Diseño & tecnología<br />en movimiento</span></div>
          <div class="art-chip chip-code">&lt;idea /&gt;</div>
          <div class="art-chip chip-spark">✦</div>
          <div class="art-caption">Una mirada curiosa.<br />Muchas formas de crear.</div>
        </div>
        <a class="scroll-cue" href="#sobre-mi">DESLIZA PARA CONOCERME <span aria-hidden="true">↓</span></a>
      </section>

      <section id="sobre-mi" class="about-section section-wrap">
        <div class="section-heading"><span class="section-kicker">UN POCO SOBRE MÍ</span><h2>Tecnología con una <em>mirada creativa.</em></h2></div>
        <div class="about-layout">
          <div class="about-statement"><span class="quote-mark">“</span><p>Me gusta entender cómo funcionan las cosas y después imaginar cómo pueden funcionar mejor.</p></div>
          <div class="about-copy"><p>Mi camino combina programación, bases de datos, redes y diseño gráfico. Me interesan especialmente la ciberseguridad y las soluciones digitales que se sienten claras, útiles y agradables de usar.</p><p>Trabajo con herramientas de desarrollo web y móvil, y también exploro la identidad visual, la animación y el modelado 3D.</p><a class="inline-link" href="mailto:cisneroscarolina869@gmail.com">Escríbeme por correo <span aria-hidden="true">↗</span></a></div>
        </div>
        <div class="skill-strip" aria-label="Áreas de trabajo"><span>Desarrollo full stack</span><span>Diseño gráfico</span><span>Modelado 3D</span><span>Ciberseguridad</span></div>
      </section>

      <section id="proyectos" class="projects-section section-wrap">
        <div class="section-heading projects-heading"><div><span class="section-kicker">TRABAJO SELECCIONADO</span><h2>Proyectos que cuentan <em>una historia.</em></h2></div><p>Una selección de experiencias de software y diseño extraídas de mi portafolio original.</p></div>
        <div class="project-tools"><div class="filter-group" aria-label="Filtrar proyectos"><button v-for="item in categories" :key="item" type="button" :class="{ active: category === item }" :aria-pressed="category === item" @click="category = item">{{ item }}</button></div><label class="search-box"><span class="sr-only">Buscar proyectos</span><span aria-hidden="true">⌕</span><input v-model="query" type="search" placeholder="Buscar proyecto" /></label></div>
        <p v-if="loading" class="status-message" role="status">Cargando proyectos…</p>
        <div v-else-if="loadError" class="status-message" role="alert">No pudimos cargar los proyectos. <button type="button" @click="loadProjects">Reintentar</button></div>
        <div v-else-if="!filteredProjects.length" class="status-message">No hay proyectos para esta búsqueda.</div>
        <div v-else class="project-grid">
          <article v-for="(project, index) in filteredProjects" :key="project.slug" class="project-card" :class="`accent-${project.accent}`">
            <button class="project-open" type="button" :aria-label="`Ver detalles de ${project.title}`" @click="selectedProject = project">
              <div class="project-visual"><span class="visual-index">{{ String(index + 1).padStart(2, '0') }}</span><div class="visual-shape"><span>{{ project.glyph }}</span></div><span class="visual-corner" aria-hidden="true">↗</span></div>
              <div class="project-info"><div class="project-meta"><span>{{ project.category }}</span><span>{{ project.kind }}</span></div><h3>{{ project.title }}</h3><p>{{ project.description }}</p><span class="project-more">Ver detalles <span aria-hidden="true">↗</span></span></div>
            </button>
          </article>
        </div>
      </section>

      <section id="trayectoria" class="journey-section section-wrap"><div class="section-heading"><span class="section-kicker">APRENDER Y EVOLUCIONAR</span><h2>Una trayectoria en <em>construcción.</em></h2></div><div class="journey-layout"><div class="journey-intro"><p>Curiosidad, práctica y ganas de seguir aprendiendo: los ingredientes detrás de cada proyecto.</p><div class="journey-decoration">✳</div></div><div class="timeline"><div class="timeline-item"><span class="timeline-date">ACTUALIDAD</span><div><h3>Ingeniería de Sistemas Informáticos</h3><p>Universidad del Valle · Sucre</p></div></div><div class="timeline-item"><span class="timeline-date">2024</span><div><h3>Fundamentos de inteligencia artificial</h3><p>IBM SkillsBuild · Cisco Networking Academy</p></div></div><div class="timeline-item"><span class="timeline-date">2023</span><div><h3>Bachiller y Técnico Medio en Diseño Gráfico</h3><p>Colegio Don Bosco A · Sucre</p></div></div><div class="timeline-item"><span class="timeline-date">2022</span><div><h3>Inglés B2</h3><p>Facultad de Humanidades y Ciencias de la Educación</p></div></div></div></div></section>

      <section id="contacto" class="contact-section section-wrap"><div class="contact-panel"><div class="contact-copy"><span class="section-kicker">EL PRÓXIMO PROYECTO</span><h2>¿Creamos algo <em>juntos?</em></h2><p>Si tienes una idea, una colaboración o simplemente quieres conversar sobre tecnología y diseño, me encantará leerte.</p><a href="mailto:cisneroscarolina869@gmail.com">cisneroscarolina869@gmail.com <span aria-hidden="true">↗</span></a><div class="contact-flower" aria-hidden="true">✳</div></div><form class="contact-form" @submit.prevent="submitContact"><h3>Cuéntame tu idea</h3><label>Tu nombre<input v-model="form.name" name="name" autocomplete="name" required minlength="2" maxlength="100" placeholder="¿Cómo te llamas?" /></label><label>Tu correo<input v-model="form.email" name="email" type="email" autocomplete="email" required placeholder="tu@correo.com" /></label><label>Tu mensaje<textarea v-model="form.message" name="message" required minlength="10" maxlength="3000" rows="5" placeholder="Me gustaría conversar sobre…"></textarea></label><input v-model="form.website" class="honeypot" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" /><button class="button button-primary" type="submit" :disabled="formState === 'sending'">{{ formState === 'sending' ? 'Enviando…' : 'Enviar mensaje' }} <span aria-hidden="true">↗</span></button><p v-if="formMessage" class="form-feedback" :class="formState" role="status">{{ formMessage }}</p></form></div></section>
    </main>
    <footer class="site-footer section-wrap"><div><a class="brand" href="#inicio"><span class="brand-mark">C<span>✳</span></span><span>Carolina Cisneros</span></a><p>Diseño, código y nuevas ideas.</p></div><div class="footer-links"><a href="https://github.com/karciss" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="mailto:cisneroscarolina869@gmail.com">Correo ↗</a><a href="#inicio">Volver arriba ↑</a></div><small>© {{ new Date().getFullYear() }} Carolina Cisneros Arroyo</small></footer>

    <div v-if="selectedProject" class="modal-backdrop" @click.self="selectedProject = null"><div class="project-modal" role="dialog" aria-modal="true" :aria-label="selectedProject.title"><button class="modal-close" type="button" aria-label="Cerrar detalles" @click="selectedProject = null">×</button><div class="modal-glyph" :class="`accent-${selectedProject.accent}`">{{ selectedProject.glyph }}</div><span class="section-kicker">{{ selectedProject.category }} · {{ selectedProject.kind }}</span><h2>{{ selectedProject.title }}</h2><p>{{ selectedProject.description }}</p><div class="modal-stack"><strong>Herramientas</strong><span>{{ selectedProject.stack }}</span></div><a class="inline-link" href="#contacto" @click="selectedProject = null">Conversar sobre un proyecto <span aria-hidden="true">↗</span></a></div></div>
  </div>
</template>
