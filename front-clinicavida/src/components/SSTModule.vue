<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api, type Suggestion } from '../services/api';

const suggestions = ref<Suggestion[]>([]);
const loading = ref(false);
const submitting = ref(false);
const successMessage = ref('');

const categories = [
  'Bioseguridad y Manejo de Residuos Hospitalarios',
  'Infraestructura y Prevención de Caídas',
  'Ergonomía y Cuidado Biomecánico',
  'Riesgo Químico y Citostáticos',
  'Riesgo Psicosocial y Bienestar del Colaborador',
  'Equipos Médicos y Mantenimiento Biomédico',
  'Protección Radiológica',
  'Rutas de Evacuación y Emergencias'
];

const sedes = [
  'Sede Prado Centro (Hospitalaria Principal)',
  'Sede El Poblado (Oncología & Especialistas)',
  'Sede Laureles (Ambulatoria y Diagnóstico)',
  'Sede Belén (Rehabilitación & Fisioterapia)',
  'Sede Sur / Envigado (Consulta Externa)',
  'Todas las Sedes de Medellín'
];

const newSuggestion = ref({
  author_name: '',
  role: 'Enfermería / Asistencial',
  category: categories[0],
  sede: sedes[0],
  title: '',
  description: '',
  urgency: 'Media' as 'Baja' | 'Media' | 'Alta' | 'Crítica'
});

const filterCategory = ref('Todos');
const filterUrgency = ref('Todos');

const loadSuggestions = async () => {
  loading.value = true;
  try {
    suggestions.value = await api.getSuggestions();
  } finally {
    loading.value = false;
  }
};

onMounted(loadSuggestions);

const submitForm = async () => {
  if (!newSuggestion.value.title || !newSuggestion.value.description) return;
  submitting.value = true;
  try {
    const created = await api.createSuggestion(newSuggestion.value);
    suggestions.value.unshift(created);
    successMessage.value = '¡Sugerencia de seguridad registrada con éxito! El motor de IA evaluó el reporte y notificó al comité COPASST.';
    newSuggestion.value = {
      author_name: '',
      role: 'Enfermería / Asistencial',
      category: categories[0],
      sede: sedes[0],
      title: '',
      description: '',
      urgency: 'Media'
    };
    setTimeout(() => {
      successMessage.value = '';
    }, 6000);
  } finally {
    submitting.value = false;
  }
};

const updateStatus = async (item: Suggestion, newStatus: any) => {
  await api.updateSuggestionStatus(item.id, newStatus);
  item.status = newStatus;
};

const filteredSuggestions = () => {
  return suggestions.value.filter(s => {
    const matchesCat = filterCategory.value === 'Todos' || s.category === filterCategory.value;
    const matchesUrg = filterUrgency.value === 'Todos' || s.urgency === filterUrgency.value;
    return matchesCat && matchesUrg;
  });
};
</script>

<template>
  <div class="sst-module animate-fade">
    <div class="module-header">
      <div class="header-left">
        <span class="badge badge-primary">SG-SST Medellín | Res. 0312</span>
        <h2>Buzón de Seguridad y Salud en el Trabajo (SST)</h2>
        <p class="subtitle">
          Canal participativo institucional de Clínica Vida para que colaboradores, pacientes y visitantes reporten riesgos, condiciones inseguras y sugerencias de mejora laboral con priorización asistida por Inteligencia Artificial.
        </p>
      </div>
      <div class="stats-pills">
        <div class="pill">
          <span class="pill-number">{{ suggestions.length }}</span>
          <span class="pill-label">Reportes Totales</span>
        </div>
        <div class="pill critical">
          <span class="pill-number">{{ suggestions.filter(s => s.urgency === 'Crítica' || s.urgency === 'Alta').length }}</span>
          <span class="pill-label">Alta Prioridad IA</span>
        </div>
        <div class="pill solved">
          <span class="pill-number">{{ suggestions.filter(s => s.status === 'Implementada').length }}</span>
          <span class="pill-label">Implementadas</span>
        </div>
      </div>
    </div>

    <!-- Alert Success -->
    <div v-if="successMessage" class="alert-box alert-success">
      <div class="alert-icon">✨</div>
      <div class="alert-content">
        <strong>Procesado con Éxito</strong>
        <p>{{ successMessage }}</p>
      </div>
    </div>

    <div class="grid-layout">
      <!-- FORMULARIO DE SUGERENCIAS -->
      <div class="card form-card">
        <div class="card-title">
          <span class="icon">📝</span>
          <h3>Registrar Nueva Sugerencia / Reporte SST</h3>
        </div>
        <p class="card-desc">
          Tu reporte es vital para prevenir incidentes y accidentes de trabajo. Puedes realizarlo con tu nombre o mantenerlo anónimo.
        </p>

        <form @submit.prevent="submitForm">
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Tu Nombre o "Anónimo"</label>
              <input
                v-model="newSuggestion.author_name"
                type="text"
                class="form-control"
                placeholder="Ej. Dr. Mario Correa / Opcional"
              />
            </div>

            <div class="form-group flex-1">
              <label class="form-label">Rol o Perfil en Clínica Vida</label>
              <select v-model="newSuggestion.role" class="form-select">
                <option value="Médico Especialista / Cirujano">Médico Especialista / Cirujano</option>
                <option value="Enfermería / Auxiliar de Enfermería">Enfermería / Auxiliar</option>
                <option value="Personal Administrativo y Admisiones">Personal Administrativo</option>
                <option value="Mantenimiento / Servicios Generales">Mantenimiento / Servicios Generales</option>
                <option value="Paciente / Acompañante">Paciente / Acompañante</option>
                <option value="Estudiante / Residente">Estudiante / Residente</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Sede en Medellín <span class="required">*</span></label>
              <select v-model="newSuggestion.sede" class="form-select" required>
                <option v-for="sede in sedes" :key="sede" :value="sede">{{ sede }}</option>
              </select>
            </div>

            <div class="form-group flex-1">
              <label class="form-label">Categoría del Peligro / Sugerencia <span class="required">*</span></label>
              <select v-model="newSuggestion.category" class="form-select" required>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Nivel de Severidad Percibido</label>
              <div class="radio-urgency-group">
                <label :class="['radio-btn', { active: newSuggestion.urgency === 'Baja' }]">
                  <input type="radio" v-model="newSuggestion.urgency" value="Baja" />
                  Baja
                </label>
                <label :class="['radio-btn', { active: newSuggestion.urgency === 'Media' }]">
                  <input type="radio" v-model="newSuggestion.urgency" value="Media" />
                  Media
                </label>
                <label :class="['radio-btn', { active: newSuggestion.urgency === 'Alta' }]">
                  <input type="radio" v-model="newSuggestion.urgency" value="Alta" />
                  Alta
                </label>
                <label :class="['radio-btn critical', { active: newSuggestion.urgency === 'Crítica' }]">
                  <input type="radio" v-model="newSuggestion.urgency" value="Crítica" />
                  Crítica
                </label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Título Breve de la Sugerencia / Riesgo <span class="required">*</span></label>
            <input
              v-model="newSuggestion.title"
              type="text"
              class="form-control"
              placeholder="Ej. Fuga leve de vapor en sala de esterilización o falta de cinta antideslizante"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Descripción Detallada y Acción Propuesta <span class="required">*</span></label>
            <textarea
              v-model="newSuggestion.description"
              rows="4"
              class="form-textarea"
              placeholder="Describe detalladamente la ubicación exacta, qué observaste y cómo sugieres resolverlo para proteger al personal y pacientes..."
              required
            ></textarea>
          </div>

          <div class="form-footer">
            <div class="ai-hint">
              <span class="ai-spark">⚡</span>
              <span>Al enviar, el <strong>Motor IA de Prevención</strong> analizará la urgencia semántica y asignará prioridad al COPASST.</span>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting">Procesando con IA...</span>
              <span v-else>🚀 Registrar Sugerencia SST</span>
            </button>
          </div>
        </form>
      </div>

      <!-- LISTADO DE SUGERENCIAS Y MONITOREO IA -->
      <div class="card list-card">
        <div class="card-title-between">
          <div class="card-title">
            <span class="icon">📋</span>
            <h3>Bitácora Activa de Reportes SST</h3>
          </div>
          <button @click="loadSuggestions" class="btn btn-outline btn-sm">
            🔄 Actualizar
          </button>
        </div>

        <!-- FILTROS -->
        <div class="filter-bar">
          <div class="filter-item">
            <label>Filtrar Categoría:</label>
            <select v-model="filterCategory" class="form-select form-select-sm">
              <option value="Todos">Todas las categorías</option>
              <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="filter-item">
            <label>Urgencia:</label>
            <select v-model="filterUrgency" class="form-select form-select-sm">
              <option value="Todos">Todas</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando buzón de seguridad...</p>
        </div>

        <div v-else-if="filteredSuggestions().length === 0" class="empty-state">
          <p>No se encontraron reportes con los filtros seleccionados.</p>
        </div>

        <div v-else class="suggestions-list">
          <div
            v-for="item in filteredSuggestions()"
            :key="item.id"
            :class="['suggestion-item', { 'item-critical': item.urgency === 'Crítica' }]"
          >
            <div class="item-header">
              <div class="item-tags">
                <span :class="['badge', item.urgency === 'Crítica' ? 'badge-danger' : item.urgency === 'Alta' ? 'badge-warning' : 'badge-primary']">
                  {{ item.urgency }} Prioridad
                </span>
                <span class="badge badge-info">{{ item.category }}</span>
                <span class="item-date">{{ new Date(item.created_at).toLocaleDateString() }}</span>
              </div>
              <div class="status-selector">
                <select
                  :value="item.status"
                  @change="updateStatus(item, ($event.target as HTMLSelectElement).value)"
                  :class="['status-badge', 'status-' + item.status.toLowerCase().replace(' ', '-')]"
                >
                  <option value="Pendiente">⏳ Pendiente</option>
                  <option value="En Revisión">🔍 En Revisión</option>
                  <option value="Implementada">✅ Implementada</option>
                  <option value="Descartada">❌ Descartada</option>
                </select>
              </div>
            </div>

            <h4 class="item-title">{{ item.title }}</h4>
            <p class="item-desc">{{ item.description }}</p>

            <div class="item-meta">
              <span>📍 <strong>{{ item.sede }}</strong></span>
              <span>👤 {{ item.author_name }} ({{ item.role }})</span>
            </div>

            <!-- ANALISIS DE IA -->
            <div v-if="item.ai_analysis" class="ai-box">
              <div class="ai-box-header">
                <span class="ai-chip">IA SST Analytics</span>
                <span class="ai-score" :class="{ 'score-high': (item.ai_priority_score || 0) >= 80 }">
                  Score de Prioridad: {{ item.ai_priority_score || 50 }}/100
                </span>
              </div>
              <p class="ai-text">{{ item.ai_analysis }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sst-module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1.25rem;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
  border: 1px solid var(--border-color);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.header-left {
  max-width: 680px;
}
.header-left h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.35rem 0;
}
.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.45;
}

.stats-pills {
  display: flex;
  gap: 1rem;
}
.pill {
  background: #ffffff;
  border: 1px solid var(--border-color);
  padding: 0.85rem 1.2rem;
  border-radius: var(--radius-md);
  text-align: center;
  min-width: 110px;
  box-shadow: var(--shadow-sm);
}
.pill.critical {
  border-color: #fecaca;
  background: #fff5f5;
}
.pill.solved {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
.pill-number {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary);
}
.pill.critical .pill-number { color: var(--danger); }
.pill.solved .pill-number { color: var(--success); }
.pill-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

/* Alert */
.alert-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
}
.alert-success {
  background: var(--success-light);
  border-color: #86efac;
  color: #065f46;
}
.alert-icon {
  font-size: 1.5rem;
}

/* Grid */
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 1.5rem;
}
@media (max-width: 1024px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.card-title .icon {
  font-size: 1.3rem;
}
.card-title h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
}
.card-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
  margin-bottom: 1.25rem;
}
.card-title-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}
.flex-1 { flex: 1; }
.required { color: var(--danger); }

/* Radio Urgency */
.radio-urgency-group {
  display: flex;
  gap: 0.5rem;
}
.radio-btn {
  flex: 1;
  text-align: center;
  padding: 0.5rem 0.25rem;
  font-size: 0.82rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.15s ease;
}
.radio-btn input { display: none; }
.radio-btn:hover { background: #e2e8f0; }
.radio-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}
.radio-btn.critical.active {
  background: var(--danger);
  border-color: var(--danger);
  color: white;
}

.form-footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
}
.ai-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  background: #f0fdf4;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px solid #bbf7d0;
}
.ai-spark { font-size: 1rem; }

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}
.filter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.form-select-sm {
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
}

/* Suggestion List */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 680px;
  overflow-y: auto;
  padding-right: 0.25rem;
}
.suggestion-item {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.15rem;
  transition: all 0.2s ease;
}
.suggestion-item:hover {
  border-color: #cbd5e1;
  box-shadow: var(--shadow-sm);
}
.suggestion-item.item-critical {
  border-left: 4px solid var(--danger);
  background: #fffdfd;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
  gap: 0.5rem;
}
.item-tags {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.item-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: 0.25rem;
}

.item-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
}
.item-desc {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 0.75rem;
}

.item-meta {
  display: flex;
  gap: 1.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  outline: none;
}
.status-pendiente { background: #fef3c7; color: #92400e; }
.status-en-revisión { background: #e0f2fe; color: #0369a1; }
.status-implementada { background: #d1fae5; color: #065f46; }
.status-descartada { background: #f1f5f9; color: #64748b; }

/* AI Box */
.ai-box {
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
}
.ai-box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}
.ai-chip {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #0369a1;
  background: white;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}
.ai-score {
  font-size: 0.75rem;
  font-weight: 700;
  color: #065f46;
}
.ai-score.score-high {
  color: var(--danger);
  font-weight: 800;
}
.ai-text {
  font-size: 0.82rem;
  color: #1e293b;
  line-height: 1.4;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted);
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.5rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
