<script setup lang="ts">
// Marco Tecnológico Documentado para el Proyecto Integrador
</script>

<template>
  <div class="framework-module animate-fade">
    <div class="framework-banner">
      <span class="badge badge-primary">Arquitectura de Software & Cumplimiento Normativo</span>
      <h2>Marco Tecnológico e Ingeniería del Proyecto Integrador</h2>
      <p class="banner-desc">
        Documentación detallada del stack tecnológico, diseño de base de datos relacional SQLite, arquitectura reactiva en Vue 3 y estándares de Seguridad y Salud en el Trabajo aplicados a la Clínica Vida de Medellín.
      </p>
    </div>

    <div class="framework-grid">
      <!-- STACK TECNOLOGICO -->
      <div class="card">
        <div class="card-icon">💻</div>
        <h3>Frontend Moderno & Reactivo</h3>
        <p class="section-lead">Desarrollado con <strong>Vue.js 3 (Composition API & &lt;script setup&gt;)</strong> y <strong>Vite 8</strong>.</p>
        <ul class="spec-list">
          <li><strong>Componentes Modulares:</strong> Arquitectura desacoplada en 4 grandes ejes: Gestión SST, Reto 6 (IA Satisfacción), Reto 7 (Geolocalización) y Matriz de Riesgo GTC 45.</li>
          <li><strong>Geolocalización:</strong> Integración de Leaflet con OpenStreetMap en coordenadas reales del Valle de Aburrá sin dependencias de APIs de pago.</li>
          <li><strong>Design System Sanitario:</strong> Paleta cromática biomédica accesible, tokens CSS modernos, tipografía humanista y componentes reactivos de alta usabilidad.</li>
          <li><strong>Manejo de Estado Dual:</strong> Conexión fluida con la API REST de NestJS con mecanismo de fallback transparente en LocalStorage en caso de contingencia.</li>
        </ul>
      </div>

      <!-- BACKEND NESTJS -->
      <div class="card">
        <div class="card-icon">⚙️</div>
        <h3>Backend Modular NestJS v12</h3>
        <p class="section-lead">Servicios empresariales estructurados en TypeScript con control de concurrencia e inyección de dependencias.</p>
        <ul class="spec-list">
          <li><strong>Controladores RESTful:</strong> Endpoints para la gestión de sugerencias SST, encuestas inmediatas y cálculo de matrices de riesgo.</li>
          <li><strong>CORS & Middleware:</strong> Habilitación segura de Cross-Origin Resource Sharing y serialización de peticiones HTTP.</li>
          <li><strong>Capas de Servicio:</strong> Separación estricta entre la lógica de negocio (`AppService`), controladores (`AppController`) y persistencia.</li>
        </ul>
      </div>

      <!-- BASE DE DATOS SQLITE -->
      <div class="card">
        <div class="card-icon">🗄️</div>
        <h3>Persistencia con SQLite3</h3>
        <p class="section-lead">Base de datos relacional ligera, autocontenida y transaccional (`clinicavida.sqlite`).</p>
        <ul class="spec-list">
          <li><strong>`sst_suggestions`:</strong> Almacena el buzón de seguridad, rol del reportante, nivel de urgencia, estado de gestión y score predictivo IA.</li>
          <li><strong>`user_feedbacks`:</strong> Registro detallado de calificaciones por servicio, tiempo de espera, trato médico, análisis de sentimiento y resumen semántico.</li>
          <li><strong>`risk_matrix`:</strong> Almacenamiento paramétrico de la matriz GTC 45 (ND, NE, NP, NC, NR y jerarquías de control).</li>
        </ul>
      </div>

      <!-- INTELIGENCIA ARTIFICIAL -->
      <div class="card">
        <div class="card-icon">🤖</div>
        <h3>Capa de Inteligencia Artificial & NLP</h3>
        <p class="section-lead">Motores semánticos de decisión implementados para los dos retos estratégicos de Clínica Vida:</p>
        <ul class="spec-list">
          <li><strong>Reto 6 (Satisfacción Inmediata):</strong> Análisis de sentimiento automatizado, extracción de temas críticos (fricciones en triage, tiempos prolongados) y formulación de planes de acción inmediatos.</li>
          <li><strong>Reto 7 (Mapa & Ruteo Clínico):</strong> Asistente de triaje y enrutamiento contextual que clasifica el requerimiento del paciente (oncología, urgencia vital, rehabilitación física, laboratorio) y le asigna la sede más indicada en Medellín.</li>
          <li><strong>SST Predictivo:</strong> Ponderación del riesgo de sugerencias de seguridad basándose en palabras clave de alta criticidad (químicos, agujas, caídas, biológicos).</li>
        </ul>
      </div>
    </div>

    <!-- MARCO NORMATIVO COLOMBIANO -->
    <div class="card legal-card">
      <div class="legal-header">
        <span class="icon">⚖️</span>
        <div>
          <h3>Marco Regulatorio Colombiano en SST y Calidad en Salud</h3>
          <p>Cumplimiento estricto de las directrices normativas del Ministerio de Salud y Protección Social y del Ministerio del Trabajo.</p>
        </div>
      </div>

      <div class="legal-grid">
        <div class="legal-item">
          <strong>Decreto 1072 de 2015</strong>
          <p>Decreto Único Reglamentario del Sector Trabajo. Establece la obligación de implementar el Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST) con participación de los trabajadores.</p>
        </div>
        <div class="legal-item">
          <strong>Resolución 0312 de 2019</strong>
          <p>Estándares Mínimos del SG-SST para instituciones prestadoras de salud en Colombia, garantizando auditorías periódicas y comités paritarios (COPASST).</p>
        </div>
        <div class="legal-item">
          <strong>Guía Técnica Colombiana GTC 45</strong>
          <p>Metodología estándar para identificar peligros en procesos asistenciales y valorar riesgos laborales mediante cálculo matemático de deficiencia, exposición y consecuencia.</p>
        </div>
        <div class="legal-item">
          <strong>Resolución 3100 de 2019</strong>
          <p>Sistema Obligatorio de Garantía de Calidad en Salud (SOGCS) - Habilitación de servicios y monitorización continua de la experiencia del usuario.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.framework-module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.framework-banner {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding: 1.75rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.framework-banner h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0.4rem 0;
}
.banner-desc {
  font-size: 0.95rem;
  opacity: 0.9;
  max-width: 860px;
  line-height: 1.5;
}

.framework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.25rem;
}
.card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
.framework-grid h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}
.section-lead {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.85rem;
}
.spec-list {
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.45;
}
.spec-list strong {
  color: var(--text-primary);
}

.legal-card {
  padding: 1.75rem;
}
.legal-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
}
.legal-header .icon {
  font-size: 2rem;
}
.legal-header h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
}
.legal-header p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.legal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.legal-item {
  background: #f8fafc;
  border-left: 3px solid var(--primary);
  padding: 0.85rem 1rem;
  border-radius: 4px;
}
.legal-item strong {
  display: block;
  font-size: 0.9rem;
  color: var(--primary-dark);
  margin-bottom: 0.3rem;
}
.legal-item p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
</style>
