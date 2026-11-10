<script setup lang="ts">
import { ref } from 'vue';
import SSTModule from './components/SSTModule.vue';
import SatisfactionModule from './components/SatisfactionModule.vue';
import MapModule from './components/MapModule.vue';
import RiskMatrixModule from './components/RiskMatrixModule.vue';
import TechFrameworkModule from './components/TechFrameworkModule.vue';

type Tab = 'sst' | 'satisfaction' | 'map' | 'risk' | 'tech';
const activeTab = ref<Tab>('sst');
</script>

<template>
  <div class="app-layout">
    <!-- TOP HEALTHCARE NAVBAR -->
    <header class="app-navbar">
      <div class="nav-container">
        <div class="brand">
          <div class="brand-logo">
            <span class="cross">+</span>
          </div>
          <div class="brand-text">
            <div class="brand-title">CLÍNICA VIDA</div>
            <div class="brand-subtitle">Medellín · Sistema Integrado SST, Calidad & IA</div>
          </div>
        </div>

        <nav class="nav-tabs">
          <button
            :class="['tab-btn', { active: activeTab === 'sst' }]"
            @click="activeTab = 'sst'"
          >
            <span class="tab-icon">🛡️</span>
            <span>Buzón SST & Reportes</span>
          </button>

          <button
            :class="['tab-btn', { active: activeTab === 'satisfaction' }]"
            @click="activeTab = 'satisfaction'"
          >
            <span class="tab-icon">🤖</span>
            <span>Reto 6: IA Satisfacción</span>
            <span class="badge-mini">NLP</span>
          </button>

          <button
            :class="['tab-btn', { active: activeTab === 'map' }]"
            @click="activeTab = 'map'"
          >
            <span class="tab-icon">🗺️</span>
            <span>Reto 7: Mapa de Sedes</span>
          </button>

          <button
            :class="['tab-btn', { active: activeTab === 'risk' }]"
            @click="activeTab = 'risk'"
          >
            <span class="tab-icon">📊</span>
            <span>Matriz GTC 45</span>
          </button>

          <button
            :class="['tab-btn', { active: activeTab === 'tech' }]"
            @click="activeTab = 'tech'"
          >
            <span class="tab-icon">📐</span>
            <span>Marco Tecnológico</span>
          </button>
        </nav>

        <div class="emergency-quick-badge">
          <span class="dot">●</span>
          <span>Línea Médica: (604) 448 3030</span>
        </div>
      </div>
    </header>

    <!-- MAIN VIEW CONTAINER -->
    <main class="main-content">
      <div class="content-wrapper">
        <SSTModule v-if="activeTab === 'sst'" />
        <SatisfactionModule v-else-if="activeTab === 'satisfaction'" />
        <MapModule v-else-if="activeTab === 'map'" />
        <RiskMatrixModule v-else-if="activeTab === 'risk'" />
        <TechFrameworkModule v-else-if="activeTab === 'tech'" />
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="app-footer">
      <div class="footer-container">
        <div>
          <strong>Clínica Vida Medellín</strong> · Proyecto Integrador de Seguridad y Salud en el Trabajo & Soluciones con Inteligencia Artificial.
        </div>
        <div class="footer-meta">
          <span>Vue 3 + NestJS + SQLite3</span>
          <span>·</span>
          <span>Cumplimiento Decreto 1072 & Guía Técnica Colombiana GTC 45</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
}

.app-navbar {
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.nav-container {
  max-width: 1360px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}
.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
}
.brand-logo .cross {
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
}
.brand-title {
  font-size: 1.15rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}
.brand-subtitle {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.nav-tabs {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  background: transparent;
  border: 1px solid transparent;
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}
.tab-btn:hover {
  background: #f1f5f9;
  color: var(--text-primary);
}
.tab-btn.active {
  background: var(--primary-light);
  color: var(--primary-dark);
  border-color: #bae6fd;
}
.badge-mini {
  background: var(--accent);
  color: white;
  font-size: 0.65rem;
  padding: 0.1rem 0.35rem;
  border-radius: 9999px;
  font-weight: 800;
}

.emergency-quick-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
}
.emergency-quick-badge .dot {
  color: var(--danger);
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

@media (max-width: 1080px) {
  .emergency-quick-badge { display: none; }
}
@media (max-width: 900px) {
  .nav-container {
    height: auto;
    padding: 0.75rem 1rem;
    flex-direction: column;
    align-items: stretch;
  }
  .nav-tabs {
    overflow-x: auto;
    padding-bottom: 0.25rem;
  }
}

.main-content {
  flex: 1;
  padding: 2rem 1.5rem;
}
.content-wrapper {
  max-width: 1360px;
  margin: 0 auto;
}

.app-footer {
  background: #ffffff;
  border-top: 1px solid var(--border-color);
  padding: 1.5rem;
  margin-top: auto;
  font-size: 0.8rem;
  color: var(--text-secondary);
}
.footer-container {
  max-width: 1360px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.footer-meta {
  display: flex;
  gap: 0.5rem;
  color: var(--text-muted);
}
</style>
