<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api, type ClinicSede, type AIRouteResult } from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const sedes = ref<ClinicSede[]>([]);
const selectedSede = ref<ClinicSede | null>(null);
const searchQuery = ref('');
const selectedSpecialty = ref('Todas');
const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;
let markers: { [key: string]: any } = {};

// AI ROUTING ASSISTANT
const aiPrompt = ref('');
const aiLoading = ref(false);
const aiResult = ref<AIRouteResult | null>(null);

const specialtiesList = [
  'Todas',
  'Urgencias 24h',
  'Oncología Clínica',
  'Hospitalización / UCI',
  'Fisioterapia y Rehabilitación',
  'Consulta Prioritaria',
  'Laboratorio Clínico',
  'Cirugía de Alta Complejidad'
];

const loadSedes = async () => {
  sedes.value = await api.getSedes();
  if (sedes.value.length > 0 && sedes.value[0]) {
    selectedSede.value = sedes.value[0];
  }
  initLeafletMap();
};

const initLeafletMap = () => {
  if (!mapContainer.value) return;

  // Centro de Medellín (alrededores de Alpujarra/Prado)
  map = L.map(mapContainer.value).setView([6.235, -75.58], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Icono personalizado SVG
  const customIcon = L.divIcon({
    className: 'custom-map-pin',
    html: `<div class="pin-inner"><span class="pin-symbol">🏥</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });

  sedes.value.forEach(sede => {
    if (!map) return;
    const marker = L.marker([sede.lat, sede.lng], { icon: customIcon }).addTo(map);

    const popupHtml = `
      <div style="font-family: system-ui; max-width: 200px;">
        <strong style="color: #0284c7; font-size: 13px;">${sede.name}</strong>
        <p style="margin: 4px 0; font-size: 11px; color: #475569;">${sede.address}</p>
        <div style="margin-top: 4px; font-size: 10px; color: #10b981; font-weight: bold;">
          ● ${sede.emergency_level}
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml);
    marker.on('click', () => {
      selectSede(sede, false);
    });

    markers[sede.id] = marker;
  });
};

const selectSede = (sede: ClinicSede, panTo = true) => {
  selectedSede.value = sede;
  if (map && panTo) {
    map.flyTo([sede.lat, sede.lng], 14, { duration: 1.2 });
    markers[sede.id]?.openPopup();
  }
};

onMounted(() => {
  loadSedes();
});

const filteredSedes = computed(() => {
  return sedes.value.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.address.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.zone.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    let matchesSpecialty = true;
    if (selectedSpecialty.value !== 'Todas') {
      matchesSpecialty = s.services.some(srv => srv.toLowerCase().includes(selectedSpecialty.value.toLowerCase())) ||
                         s.specialties.some(sp => sp.toLowerCase().includes(selectedSpecialty.value.toLowerCase())) ||
                         s.emergency_level.toLowerCase().includes(selectedSpecialty.value.toLowerCase());
    }

    return matchesSearch && matchesSpecialty;
  });
});

const runAIRouting = async () => {
  if (!aiPrompt.value.trim()) return;
  aiLoading.value = true;
  try {
    const res = await api.querySedesWithAI(aiPrompt.value);
    aiResult.value = res;
    selectSede(res.matchedSede, true);
  } finally {
    aiLoading.value = false;
  }
};
</script>

<template>
  <div class="map-module animate-fade">
    <div class="module-header">
      <div class="header-content">
        <span class="badge badge-primary">Red Asistencial Valle de Aburrá</span>
        <h2>Red de Sedes en Medellín & Ruteo Asistido por Inteligencia Artificial</h2>
        <p class="subtitle">
          Explora la ubicación satelital, nivel de complejidad médica y cartera de servicios de las sedes de Clínica Vida en el Valle de Aburrá. Utiliza el orientador de triaje con IA para saber a qué sede acudir según tu necesidad médica.
        </p>
      </div>

      <!-- ASISTENTE DE RUTEO CON IA -->
      <div class="ai-route-box">
        <div class="ai-route-title">
          <span class="ai-spark">🤖</span>
          <strong>Asistente Clínico de Ruteo Inteligente</strong>
        </div>
        <div class="ai-input-group">
          <input
            v-model="aiPrompt"
            type="text"
            placeholder="Ej. 'Dolor de pecho súbito y mareo', 'Toma de biopsia de tiroides' o 'Fisioterapia rodilla'..."
            @keyup.enter="runAIRouting"
          />
          <button class="btn btn-primary btn-sm" @click="runAIRouting" :disabled="aiLoading">
            <span v-if="aiLoading">Analizando...</span>
            <span v-else>Enrutar con IA</span>
          </button>
        </div>

        <div v-if="aiResult" class="ai-result-panel" :class="{ 'urgency-active': aiResult.urgencyDetected }">
          <div class="ai-result-header">
            <strong>Recomendación IA: {{ aiResult.matchedSede.name }}</strong>
            <span v-if="aiResult.urgencyDetected" class="badge badge-danger">Urgencia Vital Detectada</span>
          </div>
          <p class="ai-reason">{{ aiResult.reasoning }}</p>
          <ul class="route-steps">
            <li v-for="(step, sIdx) in aiResult.routeSteps" :key="sIdx">{{ step }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="map-workspace">
      <!-- SIDEBAR DE LISTA DE SEDES Y FILTROS -->
      <div class="sedes-sidebar card">
        <div class="filter-controls">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Buscar por sede, barrio o calle..."
            />
          </div>

          <div class="specialty-chips">
            <button
              v-for="sp in specialtiesList"
              :key="sp"
              :class="['chip-btn', { active: selectedSpecialty === sp }]"
              @click="selectedSpecialty = sp"
            >
              {{ sp }}
            </button>
          </div>
        </div>

        <div class="sedes-list-scroll">
          <div
            v-for="sede in filteredSedes"
            :key="sede.id"
            :class="['sede-card', { active: selectedSede?.id === sede.id }]"
            @click="selectSede(sede)"
          >
            <div class="sede-card-top">
              <span class="sede-zone">{{ sede.zone }}</span>
              <span class="badge" :class="sede.sst_status === 'Óptimo' ? 'badge-success' : 'badge-warning'">
                SST: {{ sede.sst_status }}
              </span>
            </div>

            <h4 class="sede-name">{{ sede.name }}</h4>
            <p class="sede-address">📍 {{ sede.address }}</p>

            <div class="sede-chips">
              <span class="service-pill" v-for="srv in sede.services.slice(0, 2)" :key="srv">
                {{ srv }}
              </span>
              <span v-if="sede.services.length > 2" class="service-pill more">
                +{{ sede.services.length - 2 }} más
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- MAPA INTERACTIVO Y DETALLE DE SEDE -->
      <div class="map-main-area">
        <div class="map-canvas card" ref="mapContainer"></div>

        <!-- DETALLE EXPANDIDO DE LA SEDE SELECCIONADA -->
        <div v-if="selectedSede" class="sede-detail-card card animate-fade">
          <div class="detail-grid">
            <div class="detail-img-box">
              <img :src="selectedSede.image_url" :alt="selectedSede.name" />
              <div class="emergency-tag">{{ selectedSede.emergency_level }}</div>
            </div>

            <div class="detail-body">
              <div class="detail-header">
                <div>
                  <h3 class="detail-title">{{ selectedSede.name }}</h3>
                  <p class="detail-loc">📍 {{ selectedSede.address }} · {{ selectedSede.zone }}</p>
                </div>
                <div class="detail-contact">
                  <span class="phone-badge">📞 {{ selectedSede.phone }}</span>
                  <span class="hours-badge">🕒 {{ selectedSede.hours }}</span>
                </div>
              </div>

              <div class="detail-services-grid">
                <div class="services-column">
                  <h5>🏥 Cartera de Servicios Habilitados:</h5>
                  <ul>
                    <li v-for="srv in selectedSede.services" :key="srv">{{ srv }}</li>
                  </ul>
                </div>

                <div class="specialties-column">
                  <h5>👨‍⚕️ Especialidades Médicas:</h5>
                  <div class="tags-cluster">
                    <span class="tag-badge" v-for="spec in selectedSede.specialties" :key="spec">
                      {{ spec }}
                    </span>
                  </div>

                  <div class="sst-safeguard">
                    <strong>🛡️ Compromiso SST Clínica Vida:</strong>
                    <p>Sede dotada con protocolos de bioseguridad GTC 45, señalización activa y red de evacuación sismo-resistente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.header-content h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.35rem 0;
}
.subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.45;
  max-width: 900px;
}

/* AI ROUTE BOX */
.ai-route-box {
  background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%);
  border: 1px solid #99f6e4;
  border-radius: var(--radius-md);
  padding: 1.2rem;
}
.ai-route-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #0f766e;
  margin-bottom: 0.6rem;
}
.ai-spark { font-size: 1.2rem; }
.ai-input-group {
  display: flex;
  gap: 0.75rem;
}
.ai-input-group input {
  flex: 1;
  padding: 0.7rem 1rem;
  font-size: 0.92rem;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-sm);
  outline: none;
  background: #ffffff;
}
.ai-input-group input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.ai-result-panel {
  margin-top: 1rem;
  background: #ffffff;
  border: 1px solid #5eead4;
  border-radius: var(--radius-sm);
  padding: 1rem;
}
.ai-result-panel.urgency-active {
  border-color: var(--danger);
  background: #fff5f5;
}
.ai-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #0f172a;
  margin-bottom: 0.35rem;
}
.ai-reason {
  font-size: 0.88rem;
  color: #334155;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}
.route-steps {
  padding-left: 1.25rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

/* WORKSPACE */
.map-workspace {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1.5rem;
  min-height: 600px;
}
@media (max-width: 1024px) {
  .map-workspace {
    grid-template-columns: 1fr;
  }
}

.sedes-sidebar {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  height: 100%;
}
.filter-controls {
  margin-bottom: 1rem;
}
.search-input-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}
.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: var(--text-muted);
}
.search-input-wrapper input {
  padding-left: 2.2rem;
}

.specialty-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.chip-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}
.chip-btn:hover { background: #e2e8f0; }
.chip-btn.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}

.sedes-list-scroll {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  max-height: 520px;
  padding-right: 0.25rem;
}
.sede-card {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.sede-card:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: var(--shadow-sm);
}
.sede-card.active {
  background: #ffffff;
  border-color: var(--primary);
  border-left: 4px solid var(--primary);
  box-shadow: 0 2px 10px rgba(2, 132, 199, 0.15);
}
.sede-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}
.sede-zone {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary-dark);
}
.sede-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
}
.sede-address {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
}
.sede-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.service-pill {
  font-size: 0.68rem;
  background: #ffffff;
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  color: #475569;
}
.service-pill.more {
  color: var(--primary);
  font-weight: 700;
}

/* MAP AREA */
.map-main-area {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.map-canvas {
  height: 380px;
  width: 100%;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* DETAIL CARD */
.sede-detail-card {
  padding: 1.25rem;
}
.detail-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
}
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
.detail-img-box {
  position: relative;
  height: 180px;
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.detail-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.emergency-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: rgba(15, 23, 42, 0.85);
  color: #ffffff;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.detail-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
}
.detail-loc {
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.detail-contact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: right;
}
.phone-badge, .hours-badge {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.detail-services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
@media (max-width: 600px) {
  .detail-services-grid {
    grid-template-columns: 1fr;
  }
}
.services-column h5, .specialties-column h5 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 0.45rem;
}
.services-column ul {
  padding-left: 1.2rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
.tags-cluster {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}
.tag-badge {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}
.sst-safeguard {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.sst-safeguard strong {
  color: var(--primary);
  display: block;
  margin-bottom: 0.15rem;
}
</style>

<style>
/* Leaflet custom pin style */
.custom-map-pin {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pin-inner {
  width: 34px;
  height: 34px;
  background: #0284c7;
  border: 2px solid #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  font-size: 16px;
  transition: transform 0.2s ease;
}
.pin-inner:hover {
  transform: scale(1.15);
  background: #0369a1;
}
</style>
