import { Injectable } from '@nestjs/common';
import { DatabaseService, Suggestion, Feedback, ClinicSede, RiskItem } from './database.service.js';

@Injectable()
export class AppService {
  private db = DatabaseService.getInstance();

  private sedesList: ClinicSede[] = [
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

  // =====================
  // SST SUGGESTIONS
  // =====================
  async getSuggestions(): Promise<Suggestion[]> {
    return this.db.all<Suggestion>('SELECT * FROM sst_suggestions ORDER BY created_at DESC');
  }

  async createSuggestion(data: {
    author_name: string;
    role: string;
    category: string;
    sede: string;
    title: string;
    description: string;
    urgency: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  }): Promise<Suggestion> {
    // Motor IA Simulado para análisis SST
    const aiAnalysis = this.analyzeSSTWithAI(data.title, data.description, data.category, data.urgency);

    const res = await this.db.run(
      `INSERT INTO sst_suggestions 
      (author_name, role, category, sede, title, description, urgency, status, ai_analysis, ai_priority_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?, ?)`,
      [
        data.author_name || 'Anónimo / Colaborador',
        data.role || 'Colaborador SST',
        data.category || 'Seguridad General',
        data.sede || 'Sede Principal',
        data.title,
        data.description,
        data.urgency || 'Media',
        aiAnalysis.analysis,
        aiAnalysis.priorityScore
      ]
    );

    const created = await this.db.all<Suggestion>('SELECT * FROM sst_suggestions WHERE id = ?', [res.lastID]);
    return created[0];
  }

  async updateSuggestionStatus(id: number, status: 'Pendiente' | 'En Revisión' | 'Implementada' | 'Descartada') {
    await this.db.run('UPDATE sst_suggestions SET status = ? WHERE id = ?', [status, id]);
    return { success: true, id, status };
  }

  private analyzeSSTWithAI(title: string, desc: string, category: string, urgency: string) {
    const text = `${title} ${desc}`.toLowerCase();
    let priorityScore = 50;

    if (urgency === 'Crítica') priorityScore += 35;
    else if (urgency === 'Alta') priorityScore += 20;
    else if (urgency === 'Media') priorityScore += 10;

    const criticalKeywords = ['biológico', 'sangre', 'punzón', 'aguja', 'químico', 'incendio', 'caída', 'resbaloso', 'eléctrico', 'fuga', 'oxígeno', 'infección', 'derrame'];
    let matches = criticalKeywords.filter(k => text.includes(k));
    priorityScore = Math.min(100, priorityScore + (matches.length * 8));

    let riskLevel = 'Moderado';
    if (priorityScore >= 80) riskLevel = 'Crítico / Intervención Urgente (24-48h)';
    else if (priorityScore >= 60) riskLevel = 'Alto / Programar con COPASST';

    const analysis = `[IA Prevención SST]: Severidad evaluada en ${riskLevel}. Se identificaron factores clave (${matches.length > 0 ? matches.join(', ') : 'factores ambientales'}). Recomendación de protocolo: Mitigación inmediata de la condición subestándar en ${category} y notificación al comité paritario.`;

    return { analysis, priorityScore };
  }

  // =====================
  // RETO 6: FEEDBACK & SATISFACCIÓN CON IA
  // =====================
  async getFeedbacks(): Promise<Feedback[]> {
    return this.db.all<Feedback>('SELECT * FROM user_feedbacks ORDER BY created_at DESC');
  }

  async createFeedback(dto: {
    patient_name?: string;
    service_type: string;
    sede: string;
    rating_overall: number;
    waiting_time_rating: number;
    staff_care_rating: number;
    facility_rating: number;
    comment: string;
  }) {
    const aiResult = this.processFeedbackWithAI(dto);

    const res = await this.db.run(
      `INSERT INTO user_feedbacks 
      (patient_name, service_type, sede, rating_overall, waiting_time_rating, staff_care_rating, facility_rating, comment, sentiment, ai_summary, ai_recommendation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.patient_name || 'Paciente / Usuario Anónimo',
        dto.service_type,
        dto.sede,
        dto.rating_overall,
        dto.waiting_time_rating,
        dto.staff_care_rating,
        dto.facility_rating,
        dto.comment,
        aiResult.sentiment,
        aiResult.summary,
        aiResult.recommendation
      ]
    );

    const row = await this.db.all<Feedback>('SELECT * FROM user_feedbacks WHERE id = ?', [res.lastID]);
    return row[0];
  }

  private processFeedbackWithAI(dto: {
    rating_overall: number;
    waiting_time_rating: number;
    staff_care_rating: number;
    facility_rating: number;
    comment: string;
    service_type: string;
    sede: string;
  }) {
    const text = (dto.comment || '').toLowerCase();
    const avgScore = (dto.rating_overall + dto.waiting_time_rating + dto.staff_care_rating + dto.facility_rating) / 4;

    let sentiment: 'Positivo' | 'Neutro' | 'Negativo' | 'Alerta Crítica' = 'Neutro';
    if (avgScore >= 4.2) sentiment = 'Positivo';
    else if (avgScore <= 2.2) sentiment = 'Negativo';
    
    // Si contiene palabras de riesgo para el paciente
    if (text.includes('negligencia') || text.includes('peligro') || text.includes('error') || text.includes('demanda') || avgScore < 1.5) {
      sentiment = 'Alerta Crítica';
    }

    let summary = '';
    let recommendation = '';

    if (sentiment === 'Positivo') {
      summary = `Evaluación favorable del paciente (${avgScore.toFixed(1)}/5). Se evidencia satisfacción con la calidez del personal y tiempos adecuados en ${dto.service_type}.`;
      recommendation = `Reconocer al equipo asistencial de ${dto.sede}. Replicar el modelo de flujo de atención en otras sedes de Medellín.`;
    } else if (sentiment === 'Negativo' || sentiment === 'Alerta Crítica') {
      const waitIssue = dto.waiting_time_rating <= 2;
      const careIssue = dto.staff_care_rating <= 2;
      const facilityIssue = dto.facility_rating <= 2;

      summary = `Insatisfacción detectada (${avgScore.toFixed(1)}/5). Principales fricciones: ${waitIssue ? 'Tiempos de espera excesivos; ' : ''}${careIssue ? 'Atención percibida fría/deficiente; ' : ''}${facilityIssue ? 'Condiciones de infraestructura o comodidad;' : ''}`;
      recommendation = `[Plan Inmediato]: Auditoría de oportunidad en triage y ventanillas de ${dto.sede}. Contacto de fidelización/gestión del caso en menos de 24 horas.`;
    } else {
      summary = `Experiencia estándar calificada con ${avgScore.toFixed(1)}/5. Servicio prestado sin incidentes graves pero con oportunidad de agilidad.`;
      recommendation = `Optimizar señalética y comunicación preventiva sobre tiempos estimados de llamada en sala.`;
    }

    return { sentiment, summary, recommendation };
  }

  async getAISatisfactionDashboard() {
    const feedbacks = await this.getFeedbacks();
    const total = feedbacks.length;
    if (total === 0) {
      return {
        totalResponses: 0,
        npsEstimated: 100,
        averageSatisfaction: 5,
        sentimentDistribution: { positivo: 0, neutro: 0, negativo: 0, alerta: 0 },
        topOpportunities: []
      };
    }

    let sumOverall = 0;
    let sumWaiting = 0;
    let sumCare = 0;
    let sumFacilities = 0;
    let posCount = 0;
    let negCount = 0;
    let neutCount = 0;
    let alertCount = 0;

    for (const f of feedbacks) {
      sumOverall += f.rating_overall;
      sumWaiting += f.waiting_time_rating;
      sumCare += f.staff_care_rating;
      sumFacilities += f.facility_rating;

      if (f.sentiment === 'Positivo') posCount++;
      else if (f.sentiment === 'Neutro') neutCount++;
      else if (f.sentiment === 'Negativo') negCount++;
      else if (f.sentiment === 'Alerta Crítica') alertCount++;
    }

    const nps = Math.round(((posCount - (negCount + alertCount)) / total) * 100);

    const topOpportunities = [
      {
        area: 'Gestión de Tiempos de Espera (Salas y Triage)',
        impact: 'Alto',
        score: +(sumWaiting / total).toFixed(1),
        actionAI: 'Implementar turnero predictivo basado en IA que informe en tiempo real el tiempo aproximado en pantalla y vía WhatsApp.'
      },
      {
        area: 'Humanización y Trato Asistencial',
        impact: 'Medio-Alto',
        score: +(sumCare / total).toFixed(1),
        actionAI: 'Talleres de comunicación asertiva para personal de enfermería y admisiones en sedes con alto volumen.'
      },
      {
        area: 'Confort e Infraestructura SST Hospitalaria',
        impact: 'Medio',
        score: +(sumFacilities / total).toFixed(1),
        actionAI: 'Regulación bioclimática de salas de espera en Prado Centro y ampliación de zonas de descanso ergonómicas.'
      }
    ];

    return {
      totalResponses: total,
      npsEstimated: nps,
      averageSatisfaction: +(sumOverall / total).toFixed(2),
      averages: {
        overall: +(sumOverall / total).toFixed(1),
        waiting: +(sumWaiting / total).toFixed(1),
        care: +(sumCare / total).toFixed(1),
        facilities: +(sumFacilities / total).toFixed(1)
      },
      sentimentDistribution: {
        positivo: posCount,
        neutro: neutCount,
        negativo: negCount,
        alerta: alertCount
      },
      topOpportunities
    };
  }

  // =====================
  // RETO 7: SEDES Y ASISTENTE IA DE RUTEO
  // =====================
  getSedes(): ClinicSede[] {
    return this.sedesList;
  }

  querySedesWithAI(userNeed: string): {
    matchedSede: ClinicSede;
    reasoning: string;
    routeSteps: string[];
    urgencyDetected: boolean;
  } {
    const text = userNeed.toLowerCase();
    let target = this.sedesList[0]; // default Prado Centro (Principal)
    let reasoning = '';
    let urgencyDetected = false;

    if (
      text.includes('infarto') ||
      text.includes('sangrado') ||
      text.includes('fractura') ||
      text.includes('urgencia') ||
      text.includes('grave') ||
      text.includes('accidente') ||
      text.includes('inconsciente')
    ) {
      urgencyDetected = true;
      target = this.sedesList.find(s => s.id === 'sede-prado')!;
      reasoning = '🚨 CONDICIÓN DE URGENCIA VITAL: Se enruta de inmediato a Sede Prado Centro (Hospitalaria de Alta Complejidad), equipada con UCI, cirujanos 24h y salas de reanimación.';
    } else if (text.includes('cancer') || text.includes('quimio') || text.includes('oncol') || text.includes('tumor') || text.includes('mama')) {
      target = this.sedesList.find(s => s.id === 'sede-poblado')!;
      reasoning = '🎯 ENRUTAMIENTO ESPECIALIZADO: La Sede El Poblado cuenta con la infraestructura integral para Oncología, Quimioterapia ambulatoria y mastología de alta precisión.';
    } else if (text.includes('rehabilit') || text.includes('fisioterap') || text.includes('rodilla') || text.includes('columna') || text.includes('laboral') || text.includes('postura')) {
      target = this.sedesList.find(s => s.id === 'sede-belen')!;
      reasoning = '🏃 ENRUTAMIENTO TERAPÉUTICO: Sede Belén alberga el gimnasio de rehabilitación biomecánica, calificación de origen laboral y fisioterapeutas clínicos.';
    } else if (text.includes('laboratorio') || text.includes('sangre') || text.includes('muestra') || text.includes('vacuna') || text.includes('general') || text.includes('ecograf')) {
      target = this.sedesList.find(s => s.id === 'sede-laureles')!;
      reasoning = '🩺 SERVICIO AMBULATORIO Y PREVENTIVO: Sede Laureles está optimizada para toma ágil de muestras, ecografías y consulta prioritaria sin congestión hospitalaria.';
    } else {
      target = this.sedesList.find(s => s.id === 'sede-envigado')!;
      reasoning = '🏥 CONSULTA EXTERNA SUBESPECIALIZADA: La Sede Sur (Envigado/Las Vegas) ofrece agendas programadas y comodidad para chequeos preventivos.';
    }

    const routeSteps = [
      `Confirmación de horario y disponibilidad en ${target.name}.`,
      `Dirección exacta: ${target.address}.`,
      `Llegada recomendada con 15 minutos de anticipación y documento de identidad.`,
      urgencyDetected ? 'Priorizar ingreso directo por rampa de urgencias 24 horas.' : 'Dirigirse a recepción / módulo de admisión con orden médica si aplica.'
    ];

    return {
      matchedSede: target,
      reasoning,
      routeSteps,
      urgencyDetected
    };
  }

  // =====================
  // MATRIZ DE RIESGOS SST (GTC 45)
  // =====================
  async getRiskMatrix(): Promise<RiskItem[]> {
    return this.db.all<RiskItem>('SELECT * FROM risk_matrix ORDER BY risk_level DESC');
  }

  async addRiskItem(item: {
    process: string;
    zone_area: string;
    danger_type: string;
    danger_description: string;
    effects: string;
    existing_controls: string;
    deficiency_level: number;
    exposure_level: number;
    consequence_level: number;
    intervention_measures: string;
  }) {
    const prob = item.deficiency_level * item.exposure_level;
    let probInter = 'Bajo (B)';
    if (prob >= 24) probInter = 'Muy Alto (MA)';
    else if (prob >= 10) probInter = 'Alto (A)';
    else if (prob >= 6) probInter = 'Medio (M)';

    const riskLevel = prob * item.consequence_level;
    let riskInter: any = 'IV (Aceptable)';
    if (riskLevel >= 600) riskInter = 'I (No Aceptable)';
    else if (riskLevel >= 150) riskInter = 'II (No Aceptable o Aceptable con Control)';
    else if (riskLevel >= 40) riskInter = 'III (Aceptable)';

    const res = await this.db.run(
      `INSERT INTO risk_matrix (
        process, zone_area, danger_type, danger_description, effects,
        existing_controls, deficiency_level, exposure_level, probability_level,
        probability_interpretation, consequence_level, risk_level, risk_interpretation, intervention_measures
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.process,
        item.zone_area,
        item.danger_type,
        item.danger_description,
        item.effects,
        item.existing_controls,
        item.deficiency_level,
        item.exposure_level,
        prob,
        probInter,
        item.consequence_level,
        riskLevel,
        riskInter,
        item.intervention_measures
      ]
    );

    const rows = await this.db.all<RiskItem>('SELECT * FROM risk_matrix WHERE id = ?', [res.lastID]);
    return rows[0];
  }

  // =====================
  // MARCO TECNOLÓGICO Y METADATA DEL PROYECTO
  // =====================
  getTechFramework() {
    return {
      projectName: 'Proyecto Integrador Clínica Vida Medellín - Sistema de SST, Calidad & Ubicación con IA',
      version: '1.0.0',
      description: 'Plataforma integral orientada a la Gestión de Seguridad y Salud en el Trabajo (SST), Monitoreo con Inteligencia Artificial de la Satisfacción del Paciente (Reto 6) y Sistema Interactivo de Geolocalización y Ruteo Inteligente de Sedes en Medellín (Reto 7).',
      architecture: {
        frontend: {
          framework: 'Vue.js 3 (Composition API, <script setup>)',
          buildTool: 'Vite 8',
          styling: 'Custom Healthcare UI Design System con CSS Variables & Flex/Grid modernos',
          mapEngine: 'Leaflet OpenStreetMap (Sin claves propietarias)',
          icons: 'Lucide Icons / SVG Sanitizados',
          stateManagement: 'Reactive Composables & Local Storage Backup'
        },
        backend: {
          runtime: 'Node.js LTS (ES Modules)',
          framework: 'NestJS v12 (Modular Architecture)',
          database: 'SQLite3 Transaccional persistente (clinicavida.sqlite)',
          aiLayer: 'Motor Heurístico y de Análisis de Sentimiento y Ruteo Predictivo integrado en TypeScript'
        },
        regulatoryFramework: {
          sstStandard: 'Decreto 1072 de 2015 & Resolución 0312 de 2019 (Estándares Mínimos SG-SST Colombia)',
          riskStandard: 'Guía Técnica Colombiana GTC 45 (Identificación de Peligros y Valoración de Riesgos)',
          qualityHealth: 'Sistema Obligatorio de Garantía de Calidad en Salud (SOGCS) - Resolución 3100 de 2019'
        }
      }
    };
  }
}
