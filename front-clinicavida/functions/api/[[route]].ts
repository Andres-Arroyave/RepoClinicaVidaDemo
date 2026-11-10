export interface Env {
  DB?: any;
}

const fallbackSedes = [
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

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, '');
  const method = request.method;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Health
    if (path === 'health' || path === '') {
      return new Response(JSON.stringify({ status: 'ok', system: 'Clinica Vida Cloudflare Worker Edge API' }), { headers: corsHeaders });
    }

    // 2. Sedes
    if (path === 'sedes') {
      return new Response(JSON.stringify(fallbackSedes), { headers: corsHeaders });
    }

    // 3. AI Route
    if (path === 'sedes/ai-route' && method === 'POST') {
      const body: any = await request.json();
      const text = (body?.query || '').toLowerCase();
      let target = fallbackSedes[0];
      let reasoning = '';
      let urgencyDetected = false;

      if (text.includes('urgenc') || text.includes('infarto') || text.includes('sangre') || text.includes('fractura') || text.includes('grave')) {
        urgencyDetected = true;
        target = fallbackSedes[0];
        reasoning = '🚨 CONDICIÓN DE URGENCIA VITAL: Se enruta de inmediato a Sede Prado Centro (Hospitalaria de Alta Complejidad), equipada con UCI y cirujanos 24h.';
      } else if (text.includes('cancer') || text.includes('quimio') || text.includes('oncol') || text.includes('mama')) {
        target = fallbackSedes[1];
        reasoning = '🎯 ENRUTAMIENTO ONCOLÓGICO: La Sede El Poblado cuenta con infraestructura integral para Oncología y Quimioterapia.';
      } else if (text.includes('fisio') || text.includes('rehabilit') || text.includes('espalda') || text.includes('laboral')) {
        target = fallbackSedes[3];
        reasoning = '🏃 ENRUTAMIENTO TERAPÉUTICO: Sede Belén alberga el centro de rehabilitación biomecánica y medicina ocupacional.';
      } else if (text.includes('laboratorio') || text.includes('sangre') || text.includes('vacuna') || text.includes('general')) {
        target = fallbackSedes[2];
        reasoning = '🩺 SERVICIO AMBULATORIO Y PREVENTIVO: Sede Laureles optimizada para exámenes rápidos y consulta prioritaria.';
      } else {
        target = fallbackSedes[4];
        reasoning = '🏥 CONSULTA EXTERNA SUBESPECIALIZADA: Sede Sur (Envigado) para chequeos preventivos y especialistas.';
      }

      return new Response(JSON.stringify({
        matchedSede: target,
        reasoning,
        routeSteps: [
          `Confirmación en ${target.name}.`,
          `Dirección: ${target.address}.`,
          urgencyDetected ? 'Ingreso directo por urgencias 24h.' : 'Presentar documento en admisión.'
        ],
        urgencyDetected
      }), { headers: corsHeaders });
    }

    // 4. Feedback
    if (path === 'feedback') {
      if (method === 'POST') {
        const dto: any = await request.json();
        const avg = (dto.rating_overall + dto.waiting_time_rating + dto.staff_care_rating + dto.facility_rating) / 4;
        const sentiment = avg >= 4.2 ? 'Positivo' : avg <= 2.2 ? 'Negativo' : 'Neutro';
        const res = {
          id: Date.now(),
          ...dto,
          sentiment,
          ai_summary: `[IA Edge]: Paciente califica con ${avg.toFixed(1)}/5 el servicio de ${dto.service_type}. Percepción general ${sentiment}.`,
          ai_recommendation: sentiment === 'Positivo' ? 'Felicitar al equipo asistencial y replicar protocolos.' : 'Plan inmediato de mitigación y gestión de tiempos de espera.',
          created_at: new Date().toISOString()
        };
        return new Response(JSON.stringify(res), { headers: corsHeaders });
      }

      // GET default feedbacks
      return new Response(JSON.stringify([
        {
          id: 1,
          patient_name: 'Mariana Gómez',
          service_type: 'Urgencias Adultos',
          sede: 'Sede Prado Centro',
          rating_overall: 2,
          waiting_time_rating: 1,
          staff_care_rating: 4,
          facility_rating: 3,
          comment: 'La atención del médico fue excelente, pero la espera en sala fue larga.',
          sentiment: 'Negativo',
          ai_summary: 'Insatisfacción por tiempo de espera en urgencias (4h); excelente trato asistencial.',
          ai_recommendation: 'Rebalancear triaje médico en horas pico de 6pm a 10pm.',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          patient_name: 'Carlos E. Restrepo',
          service_type: 'Consulta Oncología',
          sede: 'Sede El Poblado',
          rating_overall: 5,
          waiting_time_rating: 5,
          staff_care_rating: 5,
          facility_rating: 5,
          comment: 'Atención impecable y muy profesional.',
          sentiment: 'Positivo',
          ai_summary: 'Experiencia sobresaliente en oncología.',
          ai_recommendation: 'Documentar la buena práctica asistencial.',
          created_at: new Date().toISOString()
        }
      ]), { headers: corsHeaders });
    }

    // 5. Feedback Dashboard
    if (path === 'feedback/dashboard') {
      return new Response(JSON.stringify({
        totalResponses: 184,
        npsEstimated: 78,
        averageSatisfaction: 4.5,
        averages: { overall: 4.5, waiting: 3.8, care: 4.8, facilities: 4.6 },
        sentimentDistribution: { positivo: 144, neutro: 26, negativo: 12, alerta: 2 },
        topOpportunities: [
          {
            area: 'Reducción de Tiempo de Espera en Triage (Reto 6)',
            impact: 'Alto',
            score: 3.8,
            actionAI: 'Notificación inteligente previa al turno vía SMS para escalonar llegadas a Urgencias Prado Centro.'
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
      }), { headers: corsHeaders });
    }

    // 6. Suggestions SST
    if (path === 'suggestions') {
      if (method === 'POST') {
        const body: any = await request.json();
        const score = body.urgency === 'Crítica' ? 95 : body.urgency === 'Alta' ? 82 : 65;
        const res = {
          id: Date.now(),
          ...body,
          status: 'Pendiente',
          ai_analysis: `[IA Prevención SST]: Alerta procesada en el Edge de Cloudflare con severidad para ${body.category}. Ponderación de riesgo: ${score}/100.`,
          ai_priority_score: score,
          created_at: new Date().toISOString()
        };
        return new Response(JSON.stringify(res), { headers: corsHeaders });
      }

      return new Response(JSON.stringify([
        {
          id: 1,
          author_name: 'Dra. Luisa Montoya',
          role: 'Médico Especialista',
          category: 'Bioseguridad y Residuos',
          sede: 'Sede Prado Centro',
          title: 'Instalación de dispensadores adicionales de gel antiséptico en pasillo UCI 3',
          description: 'Durante las rondas nocturnas los dispensadores actuales quedan distantes de camas críticas.',
          urgency: 'Alta',
          status: 'En Revisión',
          ai_analysis: 'Impacto directo en indicadores de infección nosocomial (IAAS). Requiere aprobación inmediata.',
          ai_priority_score: 88,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          author_name: 'Julián Pérez',
          role: 'Auxiliar Mantenimiento',
          category: 'Infraestructura y Prevención de Caídas',
          sede: 'Sede El Poblado',
          title: 'Cinta antideslizante en rampa de acceso peatonal',
          description: 'Con las lluvias frecuentes de Medellín, el piso cerámico de la rampa se torna resbaladizo.',
          urgency: 'Crítica',
          status: 'Pendiente',
          ai_analysis: 'Riesgo inminente de caída al mismo nivel y traumatismos laborales en días de lluvia.',
          ai_priority_score: 95,
          created_at: new Date().toISOString()
        }
      ]), { headers: corsHeaders });
    }

    // 7. Risk Matrix
    if (path === 'risk-matrix') {
      return new Response(JSON.stringify([
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
        }
      ]), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ error: 'Endpoint no encontrado' }), { status: 404, headers: corsHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}
