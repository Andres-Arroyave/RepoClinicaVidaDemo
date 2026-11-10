import sqlite3 from 'sqlite3';
import { resolve } from 'path';

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
  rating_overall: number; // 1 to 5
  waiting_time_rating: number; // 1 to 5
  staff_care_rating: number; // 1 to 5
  facility_rating: number; // 1 to 5
  comment: string;
  sentiment: 'Positivo' | 'Neutro' | 'Negativo' | 'Alerta Crítica';
  ai_summary: string;
  ai_recommendation: string;
  created_at: string;
}

export interface ClinicSede {
  id: string;
  name: string;
  address: string;
  zone: string; // e.g. El Poblado, Laureles, Prado Centro, Belén, Guayabal
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
  probability_level: number; // def * exp
  probability_interpretation: string;
  consequence_level: number;
  risk_level: number; // prob * cons
  risk_interpretation: 'I (No Aceptable)' | 'II (No Aceptable o Aceptable con Control)' | 'III (Aceptable)' | 'IV (Aceptable)';
  intervention_measures: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private db: sqlite3.Database;

  private constructor() {
    const dbPath = resolve(process.cwd(), 'clinicavida.sqlite');
    this.db = new sqlite3.Database(dbPath);
    this.initTables();
    this.seedDefaultData();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initTables() {
    this.db.serialize(() => {
      // 1. Sugerencias SST
      this.db.run(`
        CREATE TABLE IF NOT EXISTS sst_suggestions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          author_name TEXT NOT NULL,
          role TEXT NOT NULL,
          category TEXT NOT NULL,
          sede TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          urgency TEXT DEFAULT 'Media',
          status TEXT DEFAULT 'Pendiente',
          ai_analysis TEXT,
          ai_priority_score INTEGER DEFAULT 50,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Encuestas de satisfacción & IA (Reto 6)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS user_feedbacks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          patient_name TEXT,
          service_type TEXT NOT NULL,
          sede TEXT NOT NULL,
          rating_overall INTEGER NOT NULL,
          waiting_time_rating INTEGER NOT NULL,
          staff_care_rating INTEGER NOT NULL,
          facility_rating INTEGER NOT NULL,
          comment TEXT,
          sentiment TEXT,
          ai_summary TEXT,
          ai_recommendation TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 3. Matriz de Riesgos SST (GTC 45)
      this.db.run(`
        CREATE TABLE IF NOT EXISTS risk_matrix (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          process TEXT NOT NULL,
          zone_area TEXT NOT NULL,
          danger_type TEXT NOT NULL,
          danger_description TEXT NOT NULL,
          effects TEXT NOT NULL,
          existing_controls TEXT NOT NULL,
          deficiency_level INTEGER NOT NULL,
          exposure_level INTEGER NOT NULL,
          probability_level INTEGER NOT NULL,
          probability_interpretation TEXT NOT NULL,
          consequence_level INTEGER NOT NULL,
          risk_level INTEGER NOT NULL,
          risk_interpretation TEXT NOT NULL,
          intervention_measures TEXT NOT NULL
        )
      `);
    });
  }

  private seedDefaultData() {
    // Check if risk matrix has data
    this.db.get('SELECT COUNT(*) as count FROM risk_matrix', (err, row: any) => {
      if (err || row?.count > 0) return;

      const stmt = this.db.prepare(`
        INSERT INTO risk_matrix (
          process, zone_area, danger_type, danger_description, effects,
          existing_controls, deficiency_level, exposure_level, probability_level,
          probability_interpretation, consequence_level, risk_level, risk_interpretation, intervention_measures
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const initialRisks = [
        [
          'Atención Hospitalaria',
          'Sede Prado Centro - Urgencias y UCI',
          'Biológico',
          'Contacto con fluidos corporales, punzocortantes y virus respiratorios',
          'Infecciones nosocomiales, hepatitis B/C, VIH, patologías respiratorias agudas',
          'Protocolo de bioseguridad, guardianes cortopunzantes, uso de EPP N95',
          6, 4, 24, 'Muy Alto (MA)', 60, 1440, 'I (No Aceptable)',
          'Implementar dispositivos de seguridad retráctiles en agujas, auditorías semanales de adherencia a lavado de manos y control de vacunación continua.'
        ],
        [
          'Cirugía y Quirófanos',
          'Sede Poblado - Pabellón Quirúrgico',
          'Físico / Radiaciones no ionizantes',
          'Manejo de equipos de electrobisturí, láser y radioscopia intraoperatoria',
          'Quemaduras, fatiga visual, exposición a radiación dispersa',
          'Delantales plomados, dosimetría personal, mantenimiento preventivo',
          2, 3, 6, 'Medio (M)', 25, 150, 'II (No Aceptable o Aceptable con Control)',
          'Renovación periódica de blindajes plomados, señalización activa de activación radiológica con sensor lumínico.'
        ],
        [
          'Servicios Farmacéuticos',
          'Sede Laureles - Central de Mezclas',
          'Químico',
          'Manipulación de agentes oncológicos y reconstituyentes citostáticos',
          'Efectos mutagénicos, toxicidad sistémica por inhalación o derrame dérmico',
          'Cabina de flujo laminar clase II B2, filtros HEPA, kit antiderrame químico',
          6, 2, 12, 'Alto (A)', 60, 720, 'I (No Aceptable)',
          'Mantenimiento semestral certificado de cabinas de bio-seguridad, capacitación con simulacros trimestrales y doble chequeo automatizado.'
        ],
        [
          'Consulta Externa y Administrativo',
          'Sede Belén - Recepción y Facturación',
          'Biomecánico / Ergonómico',
          'Posturas prolongadas sedentes y movimientos repetitivos de digitación',
          'Síndrome de túnel carpiano, lumbalgias mecánicas, fatiga visual',
          'Sillas ergonómicas ajustables, pausas activas programadas',
          2, 3, 6, 'Medio (M)', 10, 60, 'III (Aceptable)',
          'Rediseño ergonómico de puestos con apoyapiés y descansamuñecas, pausas activas gamificadas en pantalla.'
        ],
        [
          'Mantenimiento e Infraestructura',
          'Todas las Sedes Medellín',
          'Condiciones de Seguridad / Eléctrico',
          'Mantenimiento a subestaciones eléctricas y generadores de respaldo hospitalario',
          'Electrocución, arcos eléctricos, quemaduras de tercer grado, fuego',
          'Bloqueo y etiquetado (LOTO), herramientas dieléctricas 1000V',
          6, 2, 12, 'Alto (A)', 100, 1200, 'I (No Aceptable)',
          'Certificación RETIE vigente, uso obligatorio de trajes ignífugos de arco eléctrico y permisos de trabajo en caliente estrictos.'
        ]
      ];

      for (const risk of initialRisks) {
        stmt.run(risk);
      }
      stmt.finalize();
    });

    // Seed initial feedback
    this.db.get('SELECT COUNT(*) as count FROM user_feedbacks', (err, row: any) => {
      if (err || row?.count > 0) return;

      const stmt = this.db.prepare(`
        INSERT INTO user_feedbacks (
          patient_name, service_type, sede, rating_overall, waiting_time_rating,
          staff_care_rating, facility_rating, comment, sentiment, ai_summary, ai_recommendation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const seedFeedbacks = [
        [
          'Mariana Gómez',
          'Urgencias Adultos',
          'Sede Prado Centro',
          2, 1, 4, 3,
          'El médico y las enfermeras fueron muy atentos y amables, pero la espera en sala fue de casi 4 horas con mucho frío.',
          'Negativo',
          'Insatisfacción marcada por tiempo de espera prolongado (4h) en urgencias; alta valoración a la calidad humana médica.',
          'Rebalancear triaje médico en horarios pico de 6pm a 10pm y climatizar la sala de espera.'
        ],
        [
          'Carlos E. Restrepo',
          'Consulta Oncología',
          'Sede El Poblado',
          5, 5, 5, 5,
          'Excelente atención del Dr. Velásquez y el equipo de enfermería oncológica. La sede es impecable y la orientación es rápida.',
          'Positivo',
          'Experiencia sobresaliente en oncología; destaca la infraestructura moderna y el profesionalismo del especialista.',
          'Mantener el estándar y documentar la buena práctica de acompañamiento integral al paciente oncológico.'
        ],
        [
          'Valentina Jaramillo',
          'Laboratorio Clínico',
          'Sede Laureles',
          4, 3, 5, 4,
          'Toma de muestra sin dolor y muy higiénica. La entrega digital de resultados fue rápida pero la fila de registro matutino era larga.',
          'Positivo',
          'Excelente destreza en flebotomía y bacteriólogas; congestión matinal puntual en facturación.',
          'Habilitar módulo de auto-check-in digital vía QR en recepción de Laureles para horas de la mañana.'
        ]
      ];

      for (const item of seedFeedbacks) {
        stmt.run(item);
      }
      stmt.finalize();
    });

    // Seed initial suggestions
    this.db.get('SELECT COUNT(*) as count FROM sst_suggestions', (err, row: any) => {
      if (err || row?.count > 0) return;

      const stmt = this.db.prepare(`
        INSERT INTO sst_suggestions (
          author_name, role, category, sede, title, description, urgency, status, ai_analysis, ai_priority_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const seedSuggestions = [
        [
          'Dra. Luisa Fernanda Montoya',
          'Médico Especialista',
          'Bioseguridad y Residuos',
          'Sede Prado Centro',
          'Instalación de dispensadores adicionales de gel antiséptico en pasillo UCI 3',
          'Durante las rondas nocturnas los dos puntos actuales quedan distantes de las camas 308 a 314, lo cual aumenta el riesgo de no fricción oportuna de manos.',
          'Alta',
          'En Revisión',
          'Impacto directo en indicadores de infección asociada a la atención en salud (IAAS). Requiere aprobación y fijación de soportes en pared.',
          88
        ],
        [
          'Julián Pérez',
          'Auxiliar de Mantenimiento',
          'Infraestructura y Prevención de Caídas',
          'Sede El Poblado',
          'Cinta antideslizante en rampa de acceso peatonal posterior',
          'Con las lluvias frecuentes de Medellín, el piso cerámico de la rampa se torna resbaladizo para personal y camilleros.',
          'Crítica',
          'Pendiente',
          'Riesgo inminente de caída al mismo nivel y traumatismos laborales en días de lluvia. Prioridad alta de corrección inmediata.',
          95
        ]
      ];

      for (const s of seedSuggestions) {
        stmt.run(s);
      }
      stmt.finalize();
    });
  }

  // --- QUERY HELPERS ---
  public all<T = any>(query: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  public run(query: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }
}
