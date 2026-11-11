<script setup lang="ts">
import { ref, computed } from 'vue';

interface TrainingModule {
  id: string;
  title: string;
  category: 'Bioseguridad' | 'Ergonomía' | 'Radioprotección' | 'Emergencias' | 'Riesgo Químico';
  targetSede: string;
  durationMinutes: number;
  instructor: string;
  modality: 'Virtual Sincrónico' | 'Taller Práctico Presencial' | 'Microcápsula E-learning';
  regulation: string; // e.g. Res. 0312 / Dec. 1072
  objective: string;
  keyTopics: string[];
  evaluationScoreMin: number;
  status: 'Disponible' | 'Obligatorio Activo' | 'Próxima Sesión';
  nextSessionDate: string;
}

const selectedSedeFilter = ref('Todas las Sedes');
const selectedCategory = ref('Todas');
const activeTraining = ref<TrainingModule | null>(null);
const showEnrollModal = ref(false);
const showCertQuiz = ref(false);

// Formulario de inscripción rápida
const enrollForm = ref({
  fullName: '',
  documentId: '',
  role: 'Personal Asistencial (Enfermería / Médicos)',
  sede: 'Sede Prado Centro (Hospitalaria Principal)',
  email: ''
});
const enrollSuccessMessage = ref('');

// Test interactivo de certificación SST
const quizAnswers = ref<{ [key: number]: number }>({});
const quizSubmitted = ref(false);
const quizPassed = ref(false);

const trainings: TrainingModule[] = [
  {
    id: 'tr-01',
    title: 'Protocolo de Prevención de Infecciones Nosocomiales (IAAS) y Lavado Clínico',
    category: 'Bioseguridad',
    targetSede: 'Sede Prado Centro (Hospitalaria Principal)',
    durationMinutes: 45,
    instructor: 'Dra. Luisa Fernanda Montoya - Epidemióloga COPASST',
    modality: 'Taller Práctico Presencial',
    regulation: 'Resolución 0312 de 2019 / Estándares de Habilitación Res. 3100',
    objective: 'Estandarizar los 5 momentos del lavado de manos de la OMS y el descarte seguro de punzocortantes en guardianes de alta resistencia en UCI y Urgencias.',
    keyTopics: [
      'Técnica correcta de fricción hidroalcohólica vs lavado jabonoso',
      'Manejo seguro de dispositivos cortopunzantes retráctiles',
      'Protocolo de aislamiento por gotas y contacto en habitaciones hospitalarias',
      'Ruta de disposición final de residuos biocontaminados (Bolsa Roja)'
    ],
    evaluationScoreMin: 85,
    status: 'Obligatorio Activo',
    nextSessionDate: 'Martes y Jueves 07:00 am - Auditorio Sede Prado'
  },
  {
    id: 'tr-02',
    title: 'Manejo Seguro y Contención de Derrames de Agentes Citostáticos',
    category: 'Riesgo Químico',
    targetSede: 'Sede El Poblado (Oncología & Especialistas)',
    durationMinutes: 60,
    instructor: 'Q.F. Carlos Restrepo - Especialista en Farmacia Oncológica',
    modality: 'Taller Práctico Presencial',
    regulation: 'Decreto 1072 de 2015 / Guía GTC 45 Matriz de Riesgo Químico',
    objective: 'Capacitar al personal de cabina de mezclas oncológicas y salas de quimioterapia en el uso del Kit Antiderrame y EPP de permeabilidad cero.',
    keyTopics: [
      'Identificación de toxicidad sistémica y mutagénica de citostáticos',
      'Activación del kit de neutralización química de derrames en piso',
      'Revisión y mantenimiento de filtros HEPA en cabina flujo laminar Clase II B2',
      'Reporte inmediato ante contacto accidental en piel o conjuntiva'
    ],
    evaluationScoreMin: 90,
    status: 'Obligatorio Activo',
    nextSessionDate: 'Miércoles 02:00 pm - Central de Mezclas Poblado'
  },
  {
    id: 'tr-03',
    title: 'Higiene Postural, Levantamiento de Cargas y Pausas Activas Terapéuticas',
    category: 'Ergonomía',
    targetSede: 'Sede Belén (Rehabilitación & Fisioterapia)',
    durationMinutes: 30,
    instructor: 'Ft. Camilo Henao - Fisioterapeuta y Ergónomo Laboral',
    modality: 'Microcápsula E-learning',
    regulation: 'NTC 5693-1 Ergonomía y Manejo Manual de Cargas',
    objective: 'Prevenir lumbalgias mecánicas, hernias discales y síndrome de túnel carpiano en fisioterapeutas, camilleros y personal de admisiones.',
    keyTopics: [
      'Mecánica corporal en movilización y traslado de pacientes dependientes',
      'Ajuste ergonómico de sillas, apoyapiés y pantallas de visualización de datos',
      'Rutina de estiramientos miofasciales de 5 minutos cada 2 horas',
      'Identificación temprana de síntomas osteomusculares de origen laboral'
    ],
    evaluationScoreMin: 80,
    status: 'Disponible',
    nextSessionDate: 'Acceso Virtual Continuo 24/7'
  },
  {
    id: 'tr-04',
    title: 'Protección Radiológica en Fluoroscopia, Rayos X y Dosimetría Ocupacional',
    category: 'Radioprotección',
    targetSede: 'Sede Prado Centro (Hospitalaria Principal)',
    durationMinutes: 50,
    instructor: 'Físico Médico Andrés Valderrama - Asesor de Protección Radiológica',
    modality: 'Virtual Sincrónico',
    regulation: 'Resolución 181434 / MinMinas y Salud Protección Radiológica',
    objective: 'Asegurar la aplicación del principio ALARA (tan bajo como sea razonablemente alcanzable) en personal de quirófano e imagenología.',
    keyTopics: [
      'Distancia, blindaje y tiempo como pilares de radioprotección',
      'Porte correcto y lectura mensual del dosímetro termoluminiscente (TLD)',
      'Inspección y almacenamiento de delantales, protectores tiroideos y gafas plomadas',
      'Límites anuales de dosis equivalente en cristalino y cuerpo entero'
    ],
    evaluationScoreMin: 85,
    status: 'Próxima Sesión',
    nextSessionDate: 'Viernes 14 de Noviembre - 10:00 am Vía Teams'
  },
  {
    id: 'tr-05',
    title: 'Plan de Evacuación Hospitalaria, Código Rojo y Triage en Desastres',
    category: 'Emergencias',
    targetSede: 'Todas las Sedes de Medellín',
    durationMinutes: 60,
    instructor: 'Comité de Emergencias y Brigada de Evacuación Clínica Vida',
    modality: 'Taller Práctico Presencial',
    regulation: 'Plan de Emergencias y Contingencias - Decreto 1072 Art. 2.2.4.6.25',
    objective: 'Entrenar a brigadistas y colaboradores en la evacuación horizontal y vertical de pacientes, uso de camillas de lona y código de incendios.',
    keyTopics: [
      'Rutas de evacuación sismorresistentes y puntos de encuentro en sedes Medellín',
      'Clasificación rápida START para triaje de víctimas en desastres',
      'Manejo de extintores Solkaflam y CO2 en áreas con equipos biomédicos',
      'Procedimiento de corte de líneas de gases medicinales (Oxígeno y Vacío)'
    ],
    evaluationScoreMin: 90,
    status: 'Obligatorio Activo',
    nextSessionDate: 'Próximo Simulacro Distrital - Sábado 09:00 am'
  },
  {
    id: 'tr-06',
    title: 'Bioseguridad en Flebotomía y Manejo de Muestras Biológicas Ambulatorias',
    category: 'Bioseguridad',
    targetSede: 'Sede Laureles (Ambulatoria y Diagnóstico)',
    durationMinutes: 35,
    instructor: 'Bacterióloga Sandra Echeverri - Coordinadora de Laboratorio',
    modality: 'Microcápsula E-learning',
    regulation: 'Resolución 0312 de 2019 / Bioseguridad en Laboratorios de Diagnóstico',
    objective: 'Minimizar el riesgo de aerosoles biológicos, salpicaduras y rotura de tubos al vacío durante la toma y transporte de muestras ambulatorias.',
    keyTopics: [
      'Orden correcto de llenado de tubos de extracción al vacío',
      'Uso obligatorio de gafas de seguridad y guantes de nitrilo sin talco',
      'Embalaje triple para transporte seguro de muestras entre sedes',
      'Desinfección con hipoclorito a 5000 ppm ante derrames de sangre'
    ],
    evaluationScoreMin: 80,
    status: 'Disponible',
    nextSessionDate: 'Plataforma Virtual Campus Vida'
  }
];

const sedesOptions = [
  'Todas las Sedes',
  'Sede Prado Centro (Hospitalaria Principal)',
  'Sede El Poblado (Oncología & Especialistas)',
  'Sede Laureles (Ambulatoria y Diagnóstico)',
  'Sede Belén (Rehabilitación & Fisioterapia)',
  'Sede Sur / Envigado (Consulta Externa)'
];

const categoriesOptions = [
  'Todas',
  'Bioseguridad',
  'Riesgo Químico',
  'Ergonomía',
  'Radioprotección',
  'Emergencias'
];

const filteredTrainings = computed(() => {
  return trainings.filter(t => {
    const matchSede = selectedSedeFilter.value === 'Todas las Sedes' ||
                      t.targetSede.includes(selectedSedeFilter.value) ||
                      t.targetSede.includes('Todas las Sedes');
    const matchCat = selectedCategory.value === 'Todas' || t.category === selectedCategory.value;
    return matchSede && matchCat;
  });
});

const openTrainingDetail = (tr: TrainingModule) => {
  activeTraining.value = tr;
  showEnrollModal.value = true;
  enrollSuccessMessage.value = '';
  showCertQuiz.value = false;
  quizSubmitted.value = false;
};

const handleEnroll = () => {
  if (!enrollForm.value.fullName || !enrollForm.value.documentId) return;
  enrollSuccessMessage.value = `¡Registro exitoso! ${enrollForm.value.fullName} ha sido inscrito(a) en la capacitación "${activeTraining.value?.title}". Se ha notificado al coordinador de SG-SST de su sede.`;
};

const submitQuiz = () => {
  quizSubmitted.value = true;
  // Simulación: Si responde las 2 preguntas correctamente
  const q1 = quizAnswers.value[1] === 1;
  const q2 = quizAnswers.value[2] === 2;
  quizPassed.value = q1 && q2;
};
</script>

<template>
  <div class="trainings-module animate-fade">
    <!-- BANNER INSTITUCIONAL -->
    <div class="module-banner">
      <div class="banner-badge">
        <span class="badge badge-primary">Plan Anual de Capacitación SST</span>
        <span class="badge badge-success">Decreto 1072 / Res. 0312</span>
      </div>
      <h2>Campus de Capacitación y Entrenamiento en Seguridad y Salud (SST)</h2>
      <p class="banner-text">
        Programa oficial de formación continua y entrenamiento preventivo para colaboradores asistenciales, administrativos y de servicios de <strong>Clínica Vida en sus sedes de Medellín</strong>. Fortalecemos las competencias en bioseguridad, manejo de emergencias y ergonomía para proteger la vida de quienes cuidan la vida.
      </p>

      <div class="stats-ribbon">
        <div class="ribbon-item">
          <span class="num">6</span>
          <span class="lbl">Módulos Activos 2026</span>
        </div>
        <div class="ribbon-item">
          <span class="num">100%</span>
          <span class="lbl">Cobertura Sedes Medellín</span>
        </div>
        <div class="ribbon-item">
          <span class="num">85%+</span>
          <span class="lbl">Nota Mínima Aprobatoria</span>
        </div>
        <div class="ribbon-item">
          <span class="num">Certificado</span>
          <span class="lbl">COPASST con Código QR</span>
        </div>
      </div>
    </div>

    <!-- FILTROS POR SEDE Y CATEGORÍA -->
    <div class="card filter-card">
      <div class="filter-header">
        <span class="icon">🎯</span>
        <div>
          <h4>Filtros de Formación Especializada</h4>
          <p>Selecciona tu sede de adscripción en Medellín o el tipo de riesgo laboral a consultar:</p>
        </div>
      </div>

      <div class="filters-row">
        <div class="form-group flex-1">
          <label class="form-label">Sede Hospitalaria / Asistencial:</label>
          <select v-model="selectedSedeFilter" class="form-select">
            <option v-for="sede in sedesOptions" :key="sede" :value="sede">{{ sede }}</option>
          </select>
        </div>

        <div class="form-group flex-1">
          <label class="form-label">Eje Temático del Riesgo:</label>
          <select v-model="selectedCategory" class="form-select">
            <option v-for="cat in categoriesOptions" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- GRID DE CAPACITACIONES -->
    <div class="trainings-grid">
      <div
        v-for="tr in filteredTrainings"
        :key="tr.id"
        class="card training-card"
        :class="{ 'card-highlight': tr.status === 'Obligatorio Activo' }"
      >
        <div class="card-top">
          <span :class="['badge', tr.status === 'Obligatorio Activo' ? 'badge-danger' : 'badge-primary']">
            {{ tr.status }}
          </span>
          <span class="modality-pill">⏱️ {{ tr.durationMinutes }} min · {{ tr.modality }}</span>
        </div>

        <h3 class="training-title">{{ tr.title }}</h3>

        <div class="target-sede-pill">
          <span>📍</span> <strong>{{ tr.targetSede }}</strong>
        </div>

        <p class="training-objective">{{ tr.objective }}</p>

        <div class="topics-box">
          <span class="topics-title">Temario Clave:</span>
          <ul>
            <li v-for="(top, i) in tr.keyTopics.slice(0, 3)" :key="i">{{ top }}</li>
          </ul>
        </div>

        <div class="card-footer-info">
          <div class="instructor-tag">
            <small>Facilitador:</small>
            <span>{{ tr.instructor }}</span>
          </div>
          <div class="regulation-tag">
            <small>Marco Legal:</small>
            <span>{{ tr.regulation }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-primary btn-block" @click="openTrainingDetail(tr)">
            📝 Inscribirme / Evaluar Módulo
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DE DETALLE, INSCRIPCIÓN Y CERTIFICACIÓN -->
    <div v-if="showEnrollModal && activeTraining" class="modal-overlay" @click.self="showEnrollModal = false">
      <div class="modal-box card animate-fade">
        <div class="modal-header">
          <div class="modal-header-left">
            <span class="badge badge-primary">{{ activeTraining.category }}</span>
            <h3>{{ activeTraining.title }}</h3>
            <p class="modal-sub">📍 {{ activeTraining.targetSede }} · {{ activeTraining.nextSessionDate }}</p>
          </div>
          <button class="close-btn" @click="showEnrollModal = false">×</button>
        </div>

        <!-- Pestañas del Modal -->
        <div class="modal-tabs">
          <button
            :class="['m-tab', { active: !showCertQuiz }]"
            @click="showCertQuiz = false"
          >
            📋 Registro de Participación
          </button>
          <button
            :class="['m-tab', { active: showCertQuiz }]"
            @click="showCertQuiz = true"
          >
            🎓 Evaluación de Conocimientos (Certificado)
          </button>
        </div>

        <!-- CONTENIDO PESTAÑA 1: FORMULARIO DE INSCRIPCIÓN -->
        <div v-if="!showCertQuiz" class="modal-tab-content">
          <div v-if="enrollSuccessMessage" class="alert-box alert-success">
            ✨ {{ enrollSuccessMessage }}
          </div>

          <form v-else @submit.prevent="handleEnroll" class="enroll-form">
            <p class="form-instructions">
              Diligencia tus datos institucionales para registrar tu asistencia en el sistema de gestión SG-SST y notificar a tu jefe inmediato.
            </p>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Nombre Completo del Colaborador <span class="req">*</span></label>
                <input
                  v-model="enrollForm.fullName"
                  type="text"
                  class="form-control"
                  placeholder="Ej. Carolina Montoya Restrepo"
                  required
                />
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Documento de Identidad (C.C.) <span class="req">*</span></label>
                <input
                  v-model="enrollForm.documentId"
                  type="text"
                  class="form-control"
                  placeholder="Ej. 1017234890"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label class="form-label">Rol / Cargo en Clínica Vida <span class="req">*</span></label>
                <select v-model="enrollForm.role" class="form-select">
                  <option value="Médico Especialista / Urgenciólogo">Médico Especialista / Urgenciólogo</option>
                  <option value="Enfermería Jefe / Auxiliar">Enfermería Jefe / Auxiliar</option>
                  <option value="Fisioterapeuta / Rehabilitador">Fisioterapeuta / Rehabilitador</option>
                  <option value="Regente de Farmacia / Químico">Regente de Farmacia / Químico</option>
                  <option value="Bacteriólogo / Flebotomista">Bacteriólogo / Flebotomista</option>
                  <option value="Servicios Generales / Mantenimiento">Servicios Generales / Mantenimiento</option>
                  <option value="Personal Administrativo y Facturación">Personal Administrativo</option>
                </select>
              </div>

              <div class="form-group flex-1">
                <label class="form-label">Sede de Adscripción <span class="req">*</span></label>
                <select v-model="enrollForm.sede" class="form-select">
                  <option v-for="s in sedesOptions.slice(1)" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Correo Institucional (para envío de constancia)</label>
              <input
                v-model="enrollForm.email"
                type="email"
                class="form-control"
                placeholder="usuario@clinicavida.com.co"
              />
            </div>

            <div class="enroll-footer">
              <button type="submit" class="btn btn-primary submit-enroll-btn">
                ✅ Confirmar Inscripción en el SG-SST
              </button>
            </div>
          </form>
        </div>

        <!-- CONTENIDO PESTAÑA 2: EVALUACIÓN Y CERTIFICACIÓN -->
        <div v-else class="modal-tab-content quiz-section">
          <div class="quiz-intro">
            <h4>Prueba Rápida de Validación de Competencias</h4>
            <p>Responde las siguientes preguntas técnicas para validar tu comprensión y generar tu constancia de capacitación.</p>
          </div>

          <div class="quiz-questions">
            <!-- PREGUNTA 1 -->
            <div class="question-item">
              <span class="q-number">1.</span>
              <div class="q-content">
                <p class="q-text">
                  En el contexto de la {{ activeTraining.targetSede }}, ¿cuál es la medida primordial e inmediata para el control de este riesgo?
                </p>
                <div class="q-options">
                  <label class="q-option">
                    <input type="radio" v-model="quizAnswers[1]" :value="1" name="q1" />
                    Aplicar estrictamente la jerarquía de controles (fuente, medio, individuo) y adherencia a los EPP certificados.
                  </label>
                  <label class="q-option">
                    <input type="radio" v-model="quizAnswers[1]" :value="2" name="q1" />
                    Esperar a la reunión anual del COPASST antes de reportar la anomalía.
                  </label>
                  <label class="q-option">
                    <input type="radio" v-model="quizAnswers[1]" :value="3" name="q1" />
                    Continuar con la labor asistencial sin verificar los protocolos de bioseguridad.
                  </label>
                </div>
              </div>
            </div>

            <!-- PREGUNTA 2 -->
            <div class="question-item">
              <span class="q-number">2.</span>
              <div class="q-content">
                <p class="q-text">
                  Bajo la normatividad colombiana (Decreto 1072 y Res. 0312), la participación en las capacitaciones programadas de SST es:
                </p>
                <div class="q-options">
                  <label class="q-option">
                    <input type="radio" v-model="quizAnswers[2]" :value="1" name="q2" />
                    Opcional y sujeta únicamente al tiempo libre del colaborador.
                  </label>
                  <label class="q-option">
                    <input type="radio" v-model="quizAnswers[2]" :value="2" name="q2" />
                    Obligatoria para todos los trabajadores y vinculados, constituyendo un deber legal de autocuidado.
                  </label>
                  <label class="q-option">
                    <input type="radio" v-model="quizAnswers[2]" :value="3" name="q2" />
                    Exclusiva solo para el personal del área de mantenimiento.
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="quiz-actions" v-if="!quizSubmitted">
            <button class="btn btn-primary" @click="submitQuiz">
              📊 Enviar Respuestas y Calificar
            </button>
          </div>

          <!-- RESULTADO DEL QUIZ -->
          <div v-if="quizSubmitted" class="quiz-result animate-fade">
            <div v-if="quizPassed" class="cert-box success-cert">
              <div class="cert-icon">🏆📜</div>
              <h3>¡Felicitaciones! Has Aprobado la Evaluación (100%)</h3>
              <p>Tu certificación oficial ha sido emitida satisfactoriamente con aval del Comité Paritario de Seguridad y Salud en el Trabajo (COPASST).</p>
              
              <div class="cert-card">
                <div class="cert-header">
                  <strong>CLÍNICA VIDA MEDELLÍN · CERTIFICADO DE APROBACIÓN SST</strong>
                  <small>Código de Verificación: CV-SST-{{ activeTraining.id.toUpperCase() }}-{{ Date.now().toString().slice(-5) }}</small>
                </div>
                <div class="cert-body">
                  <p>Certifica que el colaborador ha completado satisfactoriamente el módulo:</p>
                  <h4>"{{ activeTraining.title }}"</h4>
                  <p>Conforme a los lineamientos del <strong>{{ activeTraining.regulation }}</strong>.</p>
                </div>
                <div class="cert-footer">
                  <span>Sede: {{ activeTraining.targetSede }}</span>
                  <span>Fecha: {{ new Date().toLocaleDateString() }}</span>
                </div>
              </div>
            </div>

            <div v-else class="cert-box fail-cert">
              <div class="cert-icon">⚠️</div>
              <h3>Calificación Insuficiente</h3>
              <p>No alcanzaste el puntaje mínimo de aprobación ({{ activeTraining.evaluationScoreMin }}%). Revisa el material de estudio y vuelve a intentarlo.</p>
              <button class="btn btn-outline" @click="quizSubmitted = false; quizAnswers = {}">
                🔄 Reintentar Evaluación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trainings-module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-banner {
  background: linear-gradient(135deg, #0d9488 0%, #0369a1 100%);
  color: #ffffff;
  padding: 1.75rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.2);
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
  max-width: 860px;
  opacity: 0.95;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

/* RIBBON STATS */
.stats-ribbon {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
}
.ribbon-item {
  display: flex;
  flex-direction: column;
}
.ribbon-item .num {
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1.2;
}
.ribbon-item .lbl {
  font-size: 0.75rem;
  opacity: 0.85;
  text-transform: uppercase;
}

/* FILTROS */
.filter-card {
  padding: 1.25rem 1.5rem;
}
.filter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.filter-header .icon { font-size: 1.5rem; }
.filter-header h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}
.filter-header p {
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.filters-row {
  display: flex;
  gap: 1.25rem;
}
@media (max-width: 768px) {
  .filters-row { flex-direction: column; }
}

/* GRID DE CAPACITACIONES */
.trainings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}
.training-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 4px solid var(--primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.training-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.training-card.card-highlight {
  border-top-color: var(--danger);
  background: #ffffff;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.modality-pill {
  font-size: 0.72rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.training-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.35;
  margin-bottom: 0.5rem;
}

.target-sede-pill {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: 0.78rem;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  margin-bottom: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.training-objective {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
  margin-bottom: 1rem;
}

.topics-box {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
}
.topics-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}
.topics-box ul {
  padding-left: 1.2rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.card-footer-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-top: 1px dashed var(--border-color);
  padding-top: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}
.instructor-tag, .regulation-tag {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
}
.instructor-tag span, .regulation-tag span {
  font-weight: 600;
  color: var(--text-primary);
}

.btn-block { width: 100%; }

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}
.modal-box {
  background: #ffffff;
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}
.modal-header-left h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0.35rem 0;
}
.modal-sub {
  font-size: 0.82rem;
  color: var(--text-secondary);
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: var(--text-muted);
}

.modal-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 1.25rem;
}
.m-tab {
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}
.m-tab:hover { color: var(--primary); }
.m-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.form-instructions {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}
.form-row {
  display: flex;
  gap: 1rem;
}
.flex-1 { flex: 1; }
.req { color: var(--danger); }
.submit-enroll-btn {
  width: 100%;
  padding: 0.85rem;
  margin-top: 1rem;
  font-size: 0.95rem;
}

/* QUIZ */
.quiz-intro {
  margin-bottom: 1.25rem;
}
.quiz-intro h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-primary);
}
.quiz-intro p {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.quiz-questions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}
.question-item {
  display: flex;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 1rem;
}
.q-number {
  font-weight: 800;
  color: var(--primary);
  font-size: 1rem;
}
.q-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.6rem;
}
.q-options {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.q-option {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.84rem;
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1.35;
}
.q-option input { margin-top: 0.2rem; }

.quiz-actions {
  display: flex;
  justify-content: flex-end;
}

/* CERTIFICADO */
.cert-box {
  text-align: center;
  padding: 1.5rem;
  border-radius: var(--radius-md);
}
.cert-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.cert-box h3 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.35rem; }
.cert-box p { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; }

.cert-card {
  background: #fefce8;
  border: 2px dashed #ca8a04;
  border-radius: var(--radius-sm);
  padding: 1.25rem;
  text-align: center;
}
.cert-header {
  font-size: 0.75rem;
  color: #854d0e;
  border-bottom: 1px solid #fde047;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}
.cert-header strong { display: block; font-size: 0.85rem; }
.cert-body h4 {
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 800;
  margin: 0.4rem 0;
}
.cert-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.72rem;
  color: #713f12;
  border-top: 1px solid #fde047;
  padding-top: 0.5rem;
}
</style>
