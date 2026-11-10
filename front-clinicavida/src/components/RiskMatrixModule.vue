<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api, type RiskItem } from '../services/api';

const risks = ref<RiskItem[]>([]);
const loading = ref(false);
const showAddModal = ref(false);

const newRisk = ref({
  process: '',
  zone_area: '',
  danger_type: 'Biológico',
  danger_description: '',
  effects: '',
  existing_controls: '',
  deficiency_level: 6,
  exposure_level: 3,
  consequence_level: 60,
  intervention_measures: ''
});

const dangerTypes = [
  'Biológico (Virus, Bacterias, Fluidos, Hongos)',
  'Físico (Radiaciones, Ruido, Iluminación, Temperaturas)',
  'Químico (Gases, Vapores, Citostáticos, Desinfectantes)',
  'Biomecánico (Cargas, Posturas prolongadas, Mov. repetitivo)',
  'Psicosocial (Estrés laboral, Turnos rotativos, Carga mental)',
  'Condiciones de Seguridad (Eléctrico, Mecánico, Locativo)',
  'Fenómenos Naturales (Sismos, Inundaciones)'
];

const loadMatrix = async () => {
  loading.value = true;
  try {
    risks.value = await api.getRiskMatrix();
  } finally {
    loading.value = false;
  }
};

onMounted(loadMatrix);

const saveRisk = async () => {
  if (!newRisk.value.process || !newRisk.value.danger_description) return;
  const created = await api.addRiskItem(newRisk.value);
  risks.value.unshift(created);
  showAddModal.value = false;
  // Reset
  newRisk.value = {
    process: '',
    zone_area: '',
    danger_type: 'Biológico',
    danger_description: '',
    effects: '',
    existing_controls: '',
    deficiency_level: 6,
    exposure_level: 3,
    consequence_level: 60,
    intervention_measures: ''
  };
};

const getRiskClass = (interpretation: string) => {
  if (interpretation.includes('I (')) return 'risk-i';
  if (interpretation.includes('II (')) return 'risk-ii';
  if (interpretation.includes('III (')) return 'risk-iii';
  return 'risk-iv';
};
</script>

<template>
  <div class="matrix-module animate-fade">
    <div class="matrix-header">
      <div class="header-info">
        <span class="badge badge-primary">GTC 45 / Decreto 1072 de 2015</span>
        <h2>Matriz Integral de Identificación de Peligros y Valoración de Riesgos SST</h2>
        <p class="subtitle">
          Herramienta técnica obligatoria del SG-SST de Clínica Vida Medellín bajo la metodología de la Guía Técnica Colombiana GTC 45 (Segunda actualización). Permite clasificar la probabilidad, consecuencias y medidas jerárquicas de intervención.
        </p>
      </div>

      <button class="btn btn-primary" @click="showAddModal = true">
        ➕ Agregar Peligro a la Matriz
      </button>
    </div>

    <!-- RESUMEN DE NIVELES GTC 45 -->
    <div class="gtc-levels-summary">
      <div class="summary-card level-i">
        <span class="level-badge">Nivel I</span>
        <h4>No Aceptable (VR: 600 - 4000)</h4>
        <p>Situación crítica. Suspensión de actividades hasta que el riesgo esté bajo control. Intervención urgente.</p>
      </div>
      <div class="summary-card level-ii">
        <span class="level-badge">Nivel II</span>
        <h4>No Aceptable o Aceptable con Control (VR: 150 - 500)</h4>
        <p>Corregir y adoptar medidas de control de inmediato en la fuente o medio.</p>
      </div>
      <div class="summary-card level-iii">
        <span class="level-badge">Nivel III</span>
        <h4>Aceptable (VR: 40 - 120)</h4>
        <p>Mejorar si es posible. Sería conveniente justificar la intervención y su rentabilidad.</p>
      </div>
      <div class="summary-card level-iv">
        <span class="level-badge">Nivel IV</span>
        <h4>Aceptable (VR: ≤ 20)</h4>
        <p>Mantener las medidas de control existentes. Comprobaciones periódicas.</p>
      </div>
    </div>

    <!-- TABLA DE LA MATRIZ -->
    <div class="card table-card">
      <div class="table-responsive">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Proceso / Sede</th>
              <th>Clasificación del Peligro</th>
              <th>Descripción y Efectos en Salud</th>
              <th>Controles Existentes</th>
              <th class="th-calc">ND</th>
              <th class="th-calc">NE</th>
              <th class="th-calc">NP (ND×NE)</th>
              <th class="th-calc">NC</th>
              <th class="th-calc">NR (NP×NC)</th>
              <th>Aceptabilidad del Riesgo</th>
              <th>Medidas de Intervención</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in risks" :key="item.id" :class="getRiskClass(item.risk_interpretation)">
              <td>
                <strong>{{ item.process }}</strong>
                <div class="area-sub">{{ item.zone_area }}</div>
              </td>
              <td>
                <span class="danger-pill">{{ item.danger_type }}</span>
              </td>
              <td>
                <div class="desc-text">{{ item.danger_description }}</div>
                <div class="effect-text"><em>Efectos:</em> {{ item.effects }}</div>
              </td>
              <td>
                <div class="controls-text">{{ item.existing_controls }}</div>
              </td>
              <td class="td-num">{{ item.deficiency_level }}</td>
              <td class="td-num">{{ item.exposure_level }}</td>
              <td class="td-num highlight">
                {{ item.probability_level }}
                <small>{{ item.probability_interpretation }}</small>
              </td>
              <td class="td-num">{{ item.consequence_level }}</td>
              <td class="td-num risk-score">
                {{ item.risk_level }}
              </td>
              <td>
                <span class="risk-inter-badge" :class="getRiskClass(item.risk_interpretation)">
                  {{ item.risk_interpretation }}
                </span>
              </td>
              <td>
                <div class="intervention-text">{{ item.intervention_measures }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL AGREGAR PELIGRO -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-box card animate-fade">
        <div class="modal-header">
          <h3>➕ Incorporar Peligro a la Matriz GTC 45</h3>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>

        <form @submit.prevent="saveRisk" class="modal-form">
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Proceso Hospitalario</label>
              <input v-model="newRisk.process" type="text" class="form-control" placeholder="Ej. Esterilización Central" required />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Zona / Sede</label>
              <input v-model="newRisk.zone_area" type="text" class="form-control" placeholder="Ej. Sede Prado Centro - Piso 2" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Clasificación del Peligro (GTC 45)</label>
            <select v-model="newRisk.danger_type" class="form-select" required>
              <option v-for="d in dangerTypes" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Descripción del Peligro</label>
            <textarea v-model="newRisk.danger_description" rows="2" class="form-textarea" placeholder="Describe la fuente o situación de riesgo..." required></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Posibles Efectos en la Salud</label>
            <input v-model="newRisk.effects" type="text" class="form-control" placeholder="Ej. Quemaduras térmicas, inhalación de óxido de etileno" required />
          </div>

          <div class="form-group">
            <label class="form-label">Controles Existentes (Fuente, Medio, Individuo)</label>
            <input v-model="newRisk.existing_controls" type="text" class="form-control" placeholder="Ej. Extractor de gases, mascarilla con filtro químico" required />
          </div>

          <!-- EVALUACIÓN MATEMÁTICA GTC 45 -->
          <div class="calc-grid">
            <div class="form-group">
              <label class="form-label">Nivel Deficiencia (ND)</label>
              <select v-model.number="newRisk.deficiency_level" class="form-select">
                <option :value="10">10 (Muy Alto)</option>
                <option :value="6">6 (Alto)</option>
                <option :value="2">2 (Medio)</option>
                <option :value="0">0 (Bajo)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nivel Exposición (NE)</label>
              <select v-model.number="newRisk.exposure_level" class="form-select">
                <option :value="4">4 (Continua)</option>
                <option :value="3">3 (Frecuente)</option>
                <option :value="2">2 (Ocasional)</option>
                <option :value="1">1 (Esporádica)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Nivel Consecuencia (NC)</label>
              <select v-model.number="newRisk.consequence_level" class="form-select">
                <option :value="100">100 (Muerte)</option>
                <option :value="60">60 (Grave / Invalidez)</option>
                <option :value="25">25 (Grave temporal)</option>
                <option :value="10">10 (Leve)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Medidas de Intervención (Jerarquía de Control)</label>
            <textarea v-model="newRisk.intervention_measures" rows="2" class="form-textarea" placeholder="Eliminación, sustitución, controles de ingeniería, advertencias o EPP..." required></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline" @click="showAddModal = false">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Guardar en Matriz</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.matrix-module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.matrix-header {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem 2rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.header-info h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.35rem 0;
}
.subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.45;
  max-width: 820px;
}

/* SUMMARY CARDS */
.gtc-levels-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.summary-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
}
.summary-card h4 {
  font-size: 0.88rem;
  font-weight: 700;
  margin: 0.35rem 0;
}
.summary-card p {
  font-size: 0.78rem;
  line-height: 1.4;
}
.level-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.level-i { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
.level-i .level-badge { background: #ef4444; color: white; }

.level-ii { background: #fef3c7; border-color: #fde047; color: #92400e; }
.level-ii .level-badge { background: #f59e0b; color: white; }

.level-iii { background: #e0f2fe; border-color: #7dd3fc; color: #0369a1; }
.level-iii .level-badge { background: #0284c7; color: white; }

.level-iv { background: #dcfce7; border-color: #86efac; color: #166534; }
.level-iv .level-badge { background: #10b981; color: white; }

/* TABLE */
.table-card {
  padding: 0;
  overflow: hidden;
}
.table-responsive {
  overflow-x: auto;
}
.matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;
}
.matrix-table th {
  background: #f1f5f9;
  color: var(--text-primary);
  font-weight: 700;
  padding: 0.85rem 0.75rem;
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
}
.th-calc { text-align: center; }
.matrix-table td {
  padding: 0.85rem 0.75rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: top;
}

.area-sub {
  font-size: 0.75rem;
  color: var(--text-secondary);
}
.danger-pill {
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}
.desc-text {
  font-size: 0.82rem;
  color: var(--text-primary);
}
.effect-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}
.controls-text {
  font-size: 0.78rem;
  color: var(--text-secondary);
  max-width: 180px;
}
.intervention-text {
  font-size: 0.8rem;
  color: #1e293b;
  max-width: 240px;
}

.td-num {
  text-align: center;
  font-weight: 600;
  white-space: nowrap;
}
.td-num.highlight {
  color: var(--primary);
}
.td-num.highlight small {
  display: block;
  font-size: 0.68rem;
  color: var(--text-muted);
}
.td-num.risk-score {
  font-size: 1rem;
  font-weight: 800;
}

.risk-inter-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  display: inline-block;
  white-space: nowrap;
}
.risk-inter-badge.risk-i { background: #ef4444; color: white; }
.risk-inter-badge.risk-ii { background: #f59e0b; color: white; }
.risk-inter-badge.risk-iii { background: #0284c7; color: white; }
.risk-inter-badge.risk-iv { background: #10b981; color: white; }

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal-box {
  background: white;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.flex-1 { flex: 1; }
.calc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  background: #f8fafc;
  padding: 0.85rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
