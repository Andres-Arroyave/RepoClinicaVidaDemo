export interface Suggestion {
  id: number;
  author_name: string;
  role: string;
  category: string;
  sede: string;
  title: string;
  description: string;
  urgency: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  status: 'Pendiente' | 'En Revisión' | 'Implementada' | 'Descartada';
  ai_analysis?: string;
  ai_priority_score?: number;
  created_at: string;
}

export interface Feedback {
  id: number;
  patient_name: string;
  service_type: string;
  sede: string;
  rating_overall: number;
  waiting_time_rating: number;
  staff_care_rating: number;
  facility_rating: number;
  comment: string;
  sentiment: 'Positivo' | 'Neutro' | 'Negativo' | 'Alerta Crítica';
  ai_summary: string;
  ai_recommendation: string;
  created_at: string;
}

export interface AISatisfactionDashboard {
  totalResponses: number;
  npsEstimated: number;
  averageSatisfaction: number;
  averages: {
    overall: number;
    waiting: number;
    care: number;
    facilities: number;
  };
  sentimentDistribution: {
    positivo: number;
    neutro: number;
    negativo: number;
    alerta: number;
  };
  topOpportunities: {
    area: string;
    impact: string;
    score: number;
    actionAI: string;
  }[];
}

export interface ClinicSede {
  id: string;
  name: string;
  address: string;
  zone: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  services: string[];
  specialties: string[];
  emergency_level: 'Alta Complejidad' | 'Urgencias 24h' | 'Consulta Prioritaria' | 'Centro Especializado';
  sst_status: 'Óptimo' | 'En Monitoreo' | 'Auditoría en Curso';
  image_url: string;
}

export interface AIRouteResult {
  matchedSede: ClinicSede;
  reasoning: string;
  routeSteps: string[];
  urgencyDetected: boolean;
}

export interface RiskItem {
  id: number;
  process: string;
  zone_area: string;
  danger_type: string;
  danger_description: string;
  effects: string;
  existing_controls: string;
  deficiency_level: number;
  exposure_level: number;
  probability_level: number;
  probability_interpretation: string;
  consequence_level: number;
  risk_level: number;
  risk_interpretation: string;
  intervention_measures: string;
}

// Production backend URL (configurable via env or fallback to local)
const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api');

// Fallback initial in-memory data for pure frontend resilience
const fallbackSedes: ClinicSede[] = [
  {
    id: 'sede-prado',
    name: 'Clínica Vida - Sede Prado Centro (Hospitalaria Principal)',
    address: 'Calle 64 # 51D - 154, Prado Centro, Medellín',
    zone: 'Prado Centro (Comuna 10)',
    phone: '(604) 448 3030 Ext. 101',
    hours: 'Atención 24 Horas / Urgencias Continuas',
    lat: 6.2588,
    lng: -75.5683,
    services: [
      'Urgencias Médicas y Quirúrgicas 24h',
      'Hospitalización General y Pediátrica',
      'Unidad de Cuidados Intensivos (UCI)',
      'Salas de Cirugía de Alta Complejidad',
      'Laboratorio Clínico y Banco de Sangre',
      'Imagenología (TAC, Resonancia, Rayos X)'
    ],
    specialties: ['Medicina Interna', 'Cirugía General', 'Cardiología', 'Ortopedia', 'Infectología', 'Neurología'],
    emergency_level: 'Alta Complejidad',
    sst_status: 'Óptimo',
    image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sede-poblado',
    name: 'Clínica Vida - Sede El Poblado (Oncología & Especialistas)',
    address: 'Carrera 43A # 1 Sur - 220, El Poblado, Medellín',
    zone: 'El Poblado (Comuna 14)',
    phone: '(604) 448 3030 Ext. 201',
    hours: 'Lunes a Viernes 6:30 am - 7:00 pm | Sábados 7:00 am - 1:00 pm',
    lat: 6.2085,
    lng: -75.5714,
    services: [
      'Centro Integral Oncológico y Quimioterapia',
      'Consulta Médica Especializada',
      'Ginecología Oncológica y Mastología',
      'Endoscopia y Colonoscopia',
      'Farmacia Oncológica Especializada'
    ],
    specialties: ['Oncología Clínica', 'Hematología', 'Mastología', 'Dermatología', 'Genética'],
    emergency_level: 'Centro Especializado',
    sst_status: 'Óptimo',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sede-laureles',
    name: 'Clínica Vida - Sede Laureles (Ambulatoria y Diagnóstico)',
    address: 'Avenida Nutibara # 73 - 42, Laureles, Medellín',
    zone: 'Laureles - Estadio (Comuna 11)',
    phone: '(604) 448 3030 Ext. 301',
    hours: 'Lunes a Sábado 7:00 am - 6:00 pm',
    lat: 6.2442,
    lng: -75.5947,
    services: [
      'Consulta Prioritaria y Medicina General',
      'Laboratorio Clínico y Toma de Muestras',
      'Ecografía Doppler y Mamografía Digital',
      'Vacunación Internacional y Empresarial',
      'Medicina del Trabajo y Salud Ocupacional'
    ],
    specialties: ['Medicina Familiar', 'Pediatría', 'Ginecología', 'Medicina del Trabajo', 'Nutrición'],
    emergency_level: 'Consulta Prioritaria',
    sst_status: 'Óptimo',
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sede-belen',
    name: 'Clínica Vida - Sede Belén (Rehabilitación & Fisioterapia)',
    address: 'Carrera 76 # 30A - 28, Belén Rosales, Medellín',
    zone: 'Belén (Comuna 16)',
    phone: '(604) 448 3030 Ext. 401',
    hours: 'Lunes a Viernes 7:00 am - 5:00 pm | Sábados 8:00 am - 12:00 m',
    lat: 6.2312,
    lng: -75.5986,
    services: [
      'Fisioterapia y Rehabilitación Física Integral',
      'Terapia Ocupacional y Fonoaudiología',
      'Acondicionamiento Físico Post-quirúrgico',
      'Ergonomía y Calificación de Origen Laboral'
    ],
    specialties: ['Fisiatría', 'Ortopedia', 'Terapia Física', 'Seguridad y Salud en el Trabajo'],
    emergency_level: 'Centro Especializado',
    sst_status: 'En Monitoreo',
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sede-envigado',
    name: 'Clínica Vida - Sede Sur / Envigado (Consulta Externa)',
    address: 'Carrera 48 # 26 Sur - 181, Conexión Medellín - Envigado',
    zone: 'Sur / Las Vegas',
    phone: '(604) 448 3030 Ext. 501',
    hours: 'Lunes a Viernes 6:30 am - 7:00 pm',
    lat: 6.1759,
    lng: -75.5898,
    services: [
      'Consulta Externa Subespecializada',
      'Toma de Muestras y Biopsias',
      'Chequeos Médicos Ejecutivos e Institucionales',
      'Salud Preventiva Integral'
    ],
    specialties: ['Urología', 'Gastroenterología', 'Endocrinología', 'Neumología'],
    emergency_level: 'Consulta Prioritaria',
    sst_status: 'Auditoría en Curso',
    image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
  }
];

export const api = {
  // --- SST Suggestions ---
  async getSuggestions(): Promise<Suggestion[]> {
    try {
      const res = await fetch(`${API_BASE}/suggestions`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend no disponible, usando caché local:', e);
    }
    const local = localStorage.getItem('cv_suggestions');
    return local ? JSON.parse(local) : [];
  },

  async createSuggestion(data: any): Promise<Suggestion> {
    try {
      const res = await fetch(`${API_BASE}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend no conectado, simulando localmente:', e);
    }
    // Fallback local
    const newSug: Suggestion = {
      id: Date.now(),
      author_name: data.author_name || 'Colaborador Anónimo',
      role: data.role || 'Personal Asistencial',
      category: data.category,
      sede: data.sede,
      title: data.title,
      description: data.description,
      urgency: data.urgency,
      status: 'Pendiente',
      ai_analysis: `[IA SST Local]: Alerta registrada con severidad para ${data.category}. Prioridad estimada en ${data.urgency === 'Crítica' ? '92%' : '75%'}.`,
      ai_priority_score: data.urgency === 'Crítica' ? 95 : 70,
      created_at: new Date().toISOString()
    };
    const local = localStorage.getItem('cv_suggestions');
    const list = local ? JSON.parse(local) : [];
    list.unshift(newSug);
    localStorage.setItem('cv_suggestions', JSON.stringify(list));
    return newSug;
  },

  async updateSuggestionStatus(id: number, status: string) {
    try {
      const res = await fetch(`${API_BASE}/suggestions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend fallback status update:', e);
    }
    const local = localStorage.getItem('cv_suggestions');
    if (local) {
      const list = JSON.parse(local);
      const found = list.find((s: any) => s.id === id);
      if (found) {
        found.status = status;
        localStorage.setItem('cv_suggestions', JSON.stringify(list));
      }
    }
    return { success: true, id, status };
  },

  // --- Reto 6: Feedbacks ---
  async getFeedbacks(): Promise<Feedback[]> {
    try {
      const res = await fetch(`${API_BASE}/feedback`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Usando feedbacks locales:', e);
    }
    const local = localStorage.getItem('cv_feedbacks');
    return local ? JSON.parse(local) : [];
  },

  async createFeedback(dto: any): Promise<Feedback> {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback feedback local:', e);
    }

    const avg = (dto.rating_overall + dto.waiting_time_rating + dto.staff_care_rating + dto.facility_rating) / 4;
    const sentiment = avg >= 4 ? 'Positivo' : avg <= 2 ? 'Negativo' : 'Neutro';
    const newFeedback: Feedback = {
      id: Date.now(),
      patient_name: dto.patient_name || 'Paciente Vida',
      service_type: dto.service_type,
      sede: dto.sede,
      rating_overall: dto.rating_overall,
      waiting_time_rating: dto.waiting_time_rating,
      staff_care_rating: dto.staff_care_rating,
      facility_rating: dto.facility_rating,
      comment: dto.comment,
      sentiment,
      ai_summary: `[IA Reto 6]: Paciente califica con ${avg.toFixed(1)}/5 el servicio de ${dto.service_type}. Se observa sentimiento ${sentiment}.`,
      ai_recommendation: sentiment === 'Positivo' ? 'Felicitar al personal médico y mantener protocolos.' : 'Plan de contingencia para reducir tiempos y contactar al usuario.',
      created_at: new Date().toISOString()
    };
    const local = localStorage.getItem('cv_feedbacks');
    const list = local ? JSON.parse(local) : [];
    list.unshift(newFeedback);
    localStorage.setItem('cv_feedbacks', JSON.stringify(list));
    return newFeedback;
  },

  async getAISatisfactionDashboard(): Promise<AISatisfactionDashboard> {
    try {
      const res = await fetch(`${API_BASE}/feedback/dashboard`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback satisfaction dashboard:', e);
    }

    return {
      totalResponses: 184,
      npsEstimated: 76,
      averageSatisfaction: 4.4,
      averages: {
        overall: 4.5,
        waiting: 3.8,
        care: 4.8,
        facilities: 4.6
      },
      sentimentDistribution: {
        positivo: 142,
        neutro: 26,
        negativo: 14,
        alerta: 2
      },
      topOpportunities: [
        {
          area: 'Reducción de Tiempo de Espera en Triage (Reto 6)',
          impact: 'Alto',
          score: 3.8,
          actionAI: 'Notificación inteligente previa al turno vía SMS/WhatsApp para escalonar llegadas a Urgencias Prado Centro.'
        },
        {
          area: 'Digitalización de Entrega de Resultados',
          impact: 'Medio',
          score: 4.2,
          actionAI: 'Activación del portal de tele-resultados inmediatos con asistente conversacional.'
        },
        {
          area: 'Calidez en Atención de Admisiones',
          impact: 'Medio',
          score: 4.5,
          actionAI: 'Capacitación mensual en humanización del servicio y lenguaje empático en ventanilla.'
        }
      ]
    };
  },

  // --- Reto 7: Sedes ---
  async getSedes(): Promise<ClinicSede[]> {
    try {
      const res = await fetch(`${API_BASE}/sedes`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback sedes locales:', e);
    }
    return fallbackSedes;
  },

  async querySedesWithAI(query: string): Promise<AIRouteResult> {
    try {
      const res = await fetch(`${API_BASE}/sedes/ai-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback AI routing:', e);
    }

    const q = query.toLowerCase();
    let target: ClinicSede = fallbackSedes[0]!;
    let urgency = false;
    let reasoning = '';

    if (q.includes('urgenc') || q.includes('dolor') || q.includes('infarto') || q.includes('sangre') || q.includes('grave')) {
      target = fallbackSedes[0]!;
      urgency = true;
      reasoning = '🚨 CONDICIÓN DE URGENCIA PRIORITARIA: Se recomienda traslado de inmediato a la Sede Prado Centro (Hospitalaria de Alta Complejidad), disponible 24/7.';
    } else if (q.includes('cancer') || q.includes('quimio') || q.includes('tumor') || q.includes('mama')) {
      target = fallbackSedes[1]!;
      reasoning = '🎯 ENRUTAMIENTO ONCOLÓGICO: Sede El Poblado cuenta con la infraestructura integral para quimioterapia y medicina especializada.';
    } else if (q.includes('fisio') || q.includes('terapia') || q.includes('espalda') || q.includes('hueso') || q.includes('rehab')) {
      target = fallbackSedes[3]!;
      reasoning = '🏃 ENRUTAMIENTO FÍSICO Y SST: Sede Belén cuenta con gimnasio de rehabilitación y calificación ergonómica.';
    } else if (q.includes('laboratorio') || q.includes('muestra') || q.includes('vacuna') || q.includes('general')) {
      target = fallbackSedes[2]!;
      reasoning = '🩺 SERVICIO AMBULATORIO: Sede Laureles es la opción más rápida para toma de exámenes y consulta prioritaria.';
    } else {
      target = fallbackSedes[4]!;
      reasoning = '🏥 CONSULTA EXTERNA ESPECIALIZADA: Sede Sur (Envigado) para citas programadas y diagnóstico especializado.';
    }

    return {
      matchedSede: target,
      reasoning,
      routeSteps: [
        `Verificación de disponibilidad de especialistas en ${target.name}.`,
        `Ruta sugerida: Llegar a ${target.address}.`,
        urgency ? 'Ingresar directamente por puerta de urgencias médicas.' : 'Presentar documento en ventanilla de recepción.'
      ],
      urgencyDetected: urgency
    };
  },

  // --- Matriz de Riesgos ---
  async getRiskMatrix(): Promise<RiskItem[]> {
    try {
      const res = await fetch(`${API_BASE}/risk-matrix`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback matriz de riesgos local:', e);
    }

    return [
      {
        id: 1,
        process: 'Atención Hospitalaria y Urgencias',
        zone_area: 'Sede Prado Centro - Triage y UCI',
        danger_type: 'Biológico (Virus, Bacterias, Fluidos)',
        danger_description: 'Exposición por salpicaduras o pinchazos con agujas contaminadas',
        effects: 'Infecciones nosocomiales, hepatitis B/C, VIH, patologías respiratorias',
        existing_controls: 'EPP N95, guantes de nitrilo, guardianes cortopunzantes, cabinas biológicas',
        deficiency_level: 6,
        exposure_level: 4,
        probability_level: 24,
        probability_interpretation: 'Muy Alto (MA)',
        consequence_level: 60,
        risk_level: 1440,
        risk_interpretation: 'I (No Aceptable)',
        intervention_measures: 'Dispositivos retráctiles automáticos, auditoría de adherencia a bioseguridad 100% y vacunación anual obligatoria.'
      },
      {
        id: 2,
        process: 'Pabellón Quirúrgico y Radiología',
        zone_area: 'Sede Prado Centro y Poblado',
        danger_type: 'Físico (Radiaciones Ionizantes y Láser)',
        danger_description: 'Emisión continua durante procedimientos intervencionistas',
        effects: 'Radiodermitis, cataratas tempranas, alteraciones celulares',
        existing_controls: 'Chalecos plomados, dosimetría termo-luminiscente mensual, biombos',
        deficiency_level: 2,
        exposure_level: 3,
        probability_level: 6,
        probability_interpretation: 'Medio (M)',
        consequence_level: 25,
        risk_level: 150,
        risk_interpretation: 'II (No Aceptable o Aceptable con Control)',
        intervention_measures: 'Calibración semestral de tubos de rayos X, control de dosis acumulativa y pausas obligatorias.'
      },
      {
        id: 3,
        process: 'Preparación de Citostáticos',
        zone_area: 'Sede El Poblado - Central de Mezclas',
        danger_type: 'Químico (Fármacos Oncológicos)',
        danger_description: 'Inhalación o contacto dérmico con aerosoles de quimioterapia',
        effects: 'Carcinogénesis, toxicidad celular, dermatitis por contacto',
        existing_controls: 'Cabinas de Bioseguridad Clase II B2 con extracción al exterior',
        deficiency_level: 6,
        exposure_level: 2,
        probability_level: 12,
        probability_interpretation: 'Alto (A)',
        consequence_level: 60,
        risk_level: 720,
        risk_interpretation: 'I (No Aceptable)',
        intervention_measures: 'Kit de contención de derrames con sensor de VOCs, EPP de permeabilidad cero y rotación semanal.'
      },
      {
        id: 4,
        process: 'Consulta Externa y Telemedicina',
        zone_area: 'Sede Laureles y Belén - Consultorios',
        danger_type: 'Biomecánico / Ergonómico',
        danger_description: 'Sedestación prolongada frente a pantallas de visualización de datos',
        effects: 'Lumbalgias, cervicalgias, síndrome de fatiga visual y túnel carpiano',
        existing_controls: 'Sillas ergonómicas nivelables, pantallas a nivel de ojos',
        deficiency_level: 2,
        exposure_level: 3,
        probability_level: 6,
        probability_interpretation: 'Medio (M)',
        consequence_level: 10,
        risk_level: 60,
        risk_interpretation: 'III (Aceptable)',
        intervention_measures: 'Programa activo "Pausas Saludables Vida" cada 2 horas con software de bloqueo ergonómico.'
      }
    ];
  },

  async addRiskItem(item: any): Promise<RiskItem> {
    try {
      const res = await fetch(`${API_BASE}/risk-matrix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Fallback add risk:', e);
    }
    return {
      id: Date.now(),
      ...item,
      probability_level: item.deficiency_level * item.exposure_level,
      probability_interpretation: 'Alto (A)',
      risk_level: item.deficiency_level * item.exposure_level * item.consequence_level,
      risk_interpretation: 'I (No Aceptable)'
    };
  }
};
