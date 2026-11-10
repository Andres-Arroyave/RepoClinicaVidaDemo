<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api, type Feedback, type AISatisfactionDashboard } from '../services/api';

const feedbacks = ref<Feedback[]>([]);
const dashboard = ref<AISatisfactionDashboard | null>(null);
const loading = ref(false);
const submitting = ref(false);
const showSuccessModal = ref(false);
const lastAIResult = ref<Feedback | null>(null);

const serviceTypes = [
  'Urgencias y Triage Adultos',
  'Urgencias Pediátricas',
  'Consulta Externa Especializada',
  'Centro Oncológico y Quimioterapia',
  'Laboratorio Clínico y Muestras',
  'Imágenes Diagnósticas (TAC / Resonancia)',
  'Fisioterapia y Rehabilitación',
  'Cirugía Ambulatoria'
];

const sedes = [
  'Sede Prado Centro (Hospitalaria Principal)',
  'Sede El Poblado (Oncología & Especialistas)',
  'Sede Laureles (Ambulatoria y Diagnóstico)',
  'Sede Belén (Rehabilitación & Fisioterapia)',
  'Sede Sur / Envigado (Consulta Externa)'
];

const form = ref({
  patient_name: '',
  service_type: serviceTypes[0],
  sede: sedes[0],
  rating_overall: 5,
  waiting_time_rating: 4,
  staff_care_rating: 5,
  facility_rating: 5,
  comment: ''
});

const loadData = async () => {
  loading.value = true;
  try {
    const [fList, dData] = await Promise.all([
      api.getFeedbacks(),
      api.getAISatisfactionDashboard()
    ]);
    feedbacks.value = fList;
    dashboard.value = dData;
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);

const submitFeedback = async () => {
  submitting.value = true;
  try {
    const res = await api.createFeedback(form.value);
    lastAIResult.value = res;
    feedbacks.value.unshift(res);
    showSuccessModal.value = true;

    // Reset
    form.value = {
      patient_name: '',
      service_type: serviceTypes[0],
      sede: sedes[0],
      rating_overall: 5,
      waiting_time_rating: 4,
      staff_care_rating: 5,
      facility_rating: 5,
      comment: ''
    };

    // Refresh metrics
    dashboard.value = await api.getAISatisfactionDashboard();
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="satisfaction-module animate-fade">
    <div class="module-banner">
      <div class="banner-badge">
        <span class="badge badge-primary">Reto Clínica Vida #6</span>
        <span class="badge badge-success">Motor IA NLP en Tiempo Real</span>
      </div>
      <h2>Sistema IA de Evaluación Inmediata de Satisfacción & Mejora Continua</h2>
      <p class="banner-text">
        Permite a la Clínica Vida recopilar al instante la percepción del paciente al finalizar cualquier servicio médico, procesando el lenguaje natural con IA para detectar alertas, clasificar el sentimiento y generar acciones de mejora inmediatas.
      </p>
    </div>

    <!-- DASHBOARD DE INTELIGENCIA ARTIFICIAL -->
    <div v-if="dashboard" class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-icon">⭐</span>
        <div class="kpi-info">
          <span class="kpi-label">Satisfacción Promedio</span>
          <div class="kpi-val">{{ dashboard.averageSatisfaction }} <small>/ 5.0</small></div>
          <span class="kpi-hint">Basado en {{ dashboard.totalResponses }} encuestas</span>
        </div>
      </div>

      <div class="kpi-card">
        <span class="kpi-icon">🎯</span>
        <div class="kpi-info">
          <span class="kpi-label">NPS Score Estimado</span>
          <div class="kpi-val" :class="{ 'nps-high': dashboard.npsEstimated >= 50 }">+{{ dashboard.npsEstimated }}</div>
          <span class="kpi-hint">Nivel de lealtad y recomendación</span>
        </div>
      </div>

      <div class="kpi-card">
        <span class="kpi-icon">🤖</span>
        <div class="kpi-info">
          <span class="kpi-label">Análisis de Sentimiento IA</span>
          <div class="sentiment-bars">
            <span class="s-badge pos">👍 {{ dashboard.sentimentDistribution.positivo }}</span>
            <span class="s-badge neu">😐 {{ dashboard.sentimentDistribution.neutro }}</span>
            <span class="s-badge neg">⚠️ {{ dashboard.sentimentDistribution.negativo + dashboard.sentimentDistribution.alerta }}</span>
          </div>
          <span class="kpi-hint">{{ dashboard.sentimentDistribution.alerta }} Alertas críticas gestionadas</span>
        </div>
      </div>

      <div class="kpi-card">
        <span class="kpi-icon">⏳</span>
        <div class="kpi-info">
          <span class="kpi-label">Calificación Tiempo Espera</span>
          <div class="kpi-val">{{ dashboard.averages.waiting }} <small>/ 5.0</small></div>
          <span class="kpi-hint">Foco de optimización con IA</span>
        </div>
      </div>
    </div>

    <div class="satisfaction-body">
      <!-- FORMULARIO DE EVALUACIÓN INMEDIATA -->
      <div class="card form-card">
        <div class="card-title">
          <span class="icon">📲</span>
          <div>
            <h3>Encuesta Ágil al Finalizar Servicio</h3>
            <p class="card-subtitle">Diseñada para totems de salida, tablets de sala o código QR al alta médica.</p>
          </div>
        </div>

        <form @submit.prevent="submitFeedback">
          <div class="form-row">
            <div class="form-group flex-1">
              <label class="form-label">Nombre del Paciente / Acompañante</label>
              <input
                v-model="form.patient_name"
                type="text"
                class="form-control"
                placeholder="Ej. Sofía Londoño (o dejar anónimo)"
              />
            </div>
            <div class="form-group flex-1">
              <label class="form-label">Sede de Atención <span class="req">*</span></label>
              <select v-model="form.sede" class="form-select" required>
                <option v-for="s in sedes" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Servicio Clínico Recibido <span class="req">*</span></label>
            <select v-model="form.service_type" class="form-select" required>
              <option v-for="serv in serviceTypes" :key="serv" :value="serv">{{ serv }}</option>
            </select>
          </div>

          <!-- RATING MATRICIAL 1-5 -->
          <div class="ratings-block">
            <h4 class="ratings-block-title">Califica de 1 a 5 estrellas tu experiencia:</h4>

            <div class="rating-row">
              <span class="r-label">Satisfacción General del Servicio:</span>
              <div class="star-group">
                <button
                  type="button"
                  v-for="star in 5"
                  :key="star"
                  :class="['star-btn', { active: form.rating_overall >= star }]"
                  @click="form.rating_overall = star"
                >★</button>
                <span class="star-num">{{ form.rating_overall }}/5</span>
              </div>
            </div>

            <div class="rating-row">
              <span class="r-label">Oportunidad y Tiempo de Espera:</span>
              <div class="star-group">
                <button
                  type="button"
                  v-for="star in 5"
                  :key="star"
                  :class="['star-btn', { active: form.waiting_time_rating >= star }]"
                  @click="form.waiting_time_rating = star"
                >★</button>
                <span class="star-num">{{ form.waiting_time_rating }}/5</span>
              </div>
            </div>

            <div class="rating-row">
              <span class="r-label">Trato Humano y Asistencial del Personal:</span>
              <div class="star-group">
                <button
                  type="button"
                  v-for="star in 5"
                  :key="star"
                  :class="['star-btn', { active: form.staff_care_rating >= star }]"
                  @click="form.staff_care_rating = star"
                >★</button>
                <span class="star-num">{{ form.staff_care_rating }}/5</span>
              </div>
            </div>

            <div class="rating-row">
              <span class="r-label">Comodidad y Bioseguridad de las Instalaciones:</span>
              <div class="star-group">
                <button
                  type="button"
                  v-for="star in 5"
                  :key="star"
                  :class="['star-btn', { active: form.facility_rating >= star }]"
                  @click="form.facility_rating = star"
                >★</button>
                <span class="star-num">{{ form.facility_rating }}/5</span>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">
              Comentarios, Vivencias u Oportunidades de Mejora
            </label>
            <textarea
              v-model="form.comment"
              rows="3"
              class="form-textarea"
              placeholder="Cuéntanos con tus propias palabras cómo te sentiste o qué podríamos hacer mejor..."
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary submit-btn" :disabled="submitting">
            <span v-if="submitting">Analizando con Inteligencia Artificial...</span>
            <span v-else>✨ Evaluar Experiencia con IA</span>
          </button>
        </form>
      </div>

      <!-- INSIGHTS DE IA Y OPORTUNIDADES IDENTIFICADAS -->
      <div class="insights-column">
        <div class="card opportunities-card">
          <div class="card-title">
            <span class="icon">💡</span>
            <h3>Oportunidades de Mejora Detectadas por la IA</h3>
          </div>
          <p class="card-subtitle">
            Algoritmo de clustering y análisis semántico sintetizando las respuestas de los usuarios en Clínica Vida Medellín.
          </p>

          <div class="opportunities-list" v-if="dashboard?.topOpportunities">
            <div
              v-for="(opp, idx) in dashboard.topOpportunities"
              :key="idx"
              class="opportunity-item"
            >
              <div class="opp-header">
                <span class="opp-badge">{{ opp.impact }} Impacto</span>
                <span class="opp-score">Calificación: {{ opp.score }}/5.0</span>
              </div>
              <h4 class="opp-title">{{ opp.area }}</h4>
              <div class="opp-action">
                <span class="ai-tag">Acción IA Sugerida:</span>
                <p>{{ opp.actionAI }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- ÚLTIMOS FEEDBACKS PROCESADOS -->
        <div class="card stream-card">
          <div class="card-title">
            <span class="icon">📡</span>
            <h3>Feed de Evaluaciones en Vivo</h3>
          </div>

          <div class="feed-list">
            <div
              v-for="f in feedbacks.slice(0, 4)"
              :key="f.id"
              class="feed-item"
            >
              <div class="feed-header">
                <span class="feed-patient">{{ f.patient_name }}</span>
                <span :class="['feed-sentiment', 'sentiment-' + f.sentiment.toLowerCase().replace(' ', '-')]">
                  {{ f.sentiment }}
                </span>
              </div>
              <div class="feed-service">{{ f.service_type }} · <strong>{{ f.sede }}</strong></div>
              <div class="feed-rating">
                Calificación General: <strong>{{ f.rating_overall }}/5</strong>
              </div>
              <p class="feed-comment" v-if="f.comment">"{{ f.comment }}"</p>
              <div class="feed-ai-pill">
                <strong>Análisis IA:</strong> {{ f.ai_summary }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE PROCESAMIENTO IA EXITOSO -->
    <div v-if="showSuccessModal && lastAIResult" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal-content animate-fade">
        <div class="modal-header">
          <div class="modal-icon">🤖✨</div>
          <h3>¡Respuesta Procesada por la Inteligencia Artificial!</h3>
          <button class="close-btn" @click="showSuccessModal = false">×</button>
        </div>

        <div class="modal-body">
          <div class="sentiment-result-card" :class="'card-' + lastAIResult.sentiment.toLowerCase().replace(' ', '-')">
            <div class="sentiment-title">
              Sentimiento Detectado: <strong>{{ lastAIResult.sentiment }}</strong>
            </div>
            <p class="sentiment-summary">{{ lastAIResult.ai_summary }}</p>
          </div>

          <div class="ai-recommendation-box">
            <h4>💡 Oportunidad de Mejora / Acción Inmediata:</h4>
            <p>{{ lastAIResult.ai_recommendation }}</p>
          </div>

          <div class="modal-footer-info">
            <p>✅ Esta respuesta se ha almacenado en SQLite e integrado a las métricas de calidad de Clínica Vida Medellín.</p>
            <button class="btn btn-primary" @click="showSuccessModal = false">Continuar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.satisfaction-module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-banner {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  padding: 1.75rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(2, 132, 199, 0.2);
}
.banner-badge {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.module-banner h2 {
  font-size: 1.65rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}
.banner-text {
  font-size: 0.95rem;
  max-width: 820px;
  opacity: 0.95;
  line-height: 1.5;
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}
.kpi-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: var(--shadow-sm);
}
.kpi-icon {
  font-size: 2rem;
  background: #f0fdfa;
  padding: 0.75rem;
  border-radius: var(--radius-md);
}
.kpi-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}
.kpi-val {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}
.kpi-val.nps-high { color: var(--success); }
.kpi-val small { font-size: 0.9rem; color: var(--text-muted); }
.kpi-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.sentiment-bars {
  display: flex;
  gap: 0.4rem;
  margin: 0.2rem 0;
}
.s-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}
.s-badge.pos { background: #dcfce7; color: #166534; }
.s-badge.neu { background: #fef9c3; color: #854d0e; }
.s-badge.neg { background: #fee2e2; color: #991b1b; }

/* BODY */
.satisfaction-body {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 1024px) {
  .satisfaction-body {
    grid-template-columns: 1fr;
  }
}

.card-title {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}
.card-title .icon {
  font-size: 1.5rem;
}
.card-title h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}
.card-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}
.flex-1 { flex: 1; }
.req { color: var(--danger); }

/* RATINGS */
.ratings-block {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  margin-top: 0.5rem;
}
.ratings-block-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.85rem;
}
.rating-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px dashed var(--border-color);
}
.rating-row:last-child { border-bottom: none; }
.r-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.star-group {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}
.star-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: transform 0.15s ease, color 0.15s ease;
  line-height: 1;
  padding: 0 0.1rem;
}
.star-btn:hover {
  transform: scale(1.2);
  color: #f59e0b;
}
.star-btn.active {
  color: #f59e0b;
}
.star-num {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-left: 0.4rem;
  min-width: 30px;
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  font-size: 1rem;
  margin-top: 1rem;
}

/* OPPORTUNITIES */
.insights-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.opportunities-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.opportunity-item {
  background: #f8fafc;
  border-left: 4px solid var(--primary);
  border-radius: 4px var(--radius-sm) var(--radius-sm) 4px;
  padding: 1rem;
}
.opp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}
.opp-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary);
}
.opp-score {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.opp-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.4rem;
}
.opp-action {
  background: #ffffff;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  border: 1px solid var(--border-color);
}
.ai-tag {
  font-weight: 700;
  color: #0369a1;
  display: block;
  margin-bottom: 0.15rem;
}

/* STREAM */
.feed-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  max-height: 380px;
  overflow-y: auto;
}
.feed-item {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.85rem 1rem;
}
.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.feed-patient {
  font-weight: 700;
  font-size: 0.9rem;
}
.feed-sentiment {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  text-transform: uppercase;
}
.sentiment-positivo { background: #dcfce7; color: #166534; }
.sentiment-neutro { background: #fef9c3; color: #854d0e; }
.sentiment-negativo { background: #fee2e2; color: #991b1b; }
.sentiment-alerta-crítica { background: #ef4444; color: #ffffff; }

.feed-service {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 0.15rem;
}
.feed-rating {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0.35rem 0;
}
.feed-comment {
  font-size: 0.82rem;
  font-style: italic;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}
.feed-ai-pill {
  font-size: 0.76rem;
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.35rem 0.55rem;
  border-radius: 4px;
}

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
.modal-content {
  background: #ffffff;
  border-radius: var(--radius-lg);
  max-width: 540px;
  width: 100%;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
}
.modal-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
}
.modal-icon { font-size: 2rem; }
.modal-header h3 { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); }
.close-btn {
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted);
}
.sentiment-result-card {
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
}
.card-positivo { background: #dcfce7; border: 1px solid #86efac; color: #166534; }
.card-neutro { background: #fef9c3; border: 1px solid #fde047; color: #854d0e; }
.card-negativo { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; }
.card-alerta-crítica { background: #ef4444; color: white; }

.sentiment-title { font-weight: 700; margin-bottom: 0.3rem; }
.ai-recommendation-box {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 1rem;
  margin-bottom: 1.25rem;
}
.ai-recommendation-box h4 {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.35rem;
}
.ai-recommendation-box p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.modal-footer-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
