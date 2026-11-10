import initSqlJs, { Database } from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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
  risk_interpretation: 'I (No Aceptable)' | 'II (No Aceptable o Aceptable con Control)' | 'III (Aceptable)' | 'IV (Aceptable)';
  intervention_measures: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private db!: Database;
  private dbPath: string;
  private initializedPromise: Promise<void>;

  private constructor() {
    this.dbPath = resolve(process.cwd(), 'clinicavida.sqlite');
    this.initializedPromise = this.initDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async initDatabase() {
    const SQL = await initSqlJs();
    if (existsSync(this.dbPath)) {
      const filebuffer = readFileSync(this.dbPath);
      this.db = new SQL.Database(filebuffer);
    } else {
      this.db = new SQL.Database();
    }
    this.initTables();
    this.seedDefaultData();
    this.saveToFile();
  }

  private initTables() {
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
      );

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
      );

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
      );
    `);
  }

  private seedDefaultData() {
    // Check risk matrix
    const resRisk = this.db.exec('SELECT COUNT(*) as count FROM risk_matrix');
    const riskCount = resRisk[0]?.values[0]?.[0] || 0;

    if (riskCount === 0) {
      this.db.run(`
        INSERT INTO risk_matrix (
          process, zone_area, danger_type, danger_description, effects,
          existing_controls, deficiency_level, exposure_level, probability_level,
          probability_interpretation, consequence_level, risk_level, risk_interpretation, intervention_measures
        ) VALUES 
        (
          'Atención Hospitalaria', 'Sede Prado Centro - Urgencias y UCI', 'Biológico',
          'Contacto con fluidos corporales, punzocortantes y virus respiratorios',
          'Infecciones nosocomiales, hepatitis B/C, VIH, patologías respiratorias agudas',
          'Protocolo de bioseguridad, guardianes cortopunzantes, uso de EPP N95',
          6, 4, 24, 'Muy Alto (MA)', 60, 1440, 'I (No Aceptable)',
          'Implementar dispositivos de seguridad retráctiles en agujas y auditorías continuas.'
        ),
        (
          'Cirugía y Quirófanos', 'Sede Poblado - Pabellón Quirúrgico', 'Físico / Radiaciones no ionizantes',
          'Manejo de equipos de electrobisturí, láser y radioscopia intraoperatoria',
          'Quemaduras, fatiga visual, exposición a radiación dispersa',
          'Delantales plomados, dosimetría personal, mantenimiento preventivo',
          2, 3, 6, 'Medio (M)', 25, 150, 'II (No Aceptable o Aceptable con Control)',
          'Renovación periódica de blindajes plomados y señalización lumínica activa.'
        );
      `);
    }

    // Check feedbacks
    const resFeedback = this.db.exec('SELECT COUNT(*) as count FROM user_feedbacks');
    const fbCount = resFeedback[0]?.values[0]?.[0] || 0;
    if (fbCount === 0) {
      this.db.run(`
        INSERT INTO user_feedbacks (
          patient_name, service_type, sede, rating_overall, waiting_time_rating,
          staff_care_rating, facility_rating, comment, sentiment, ai_summary, ai_recommendation
        ) VALUES 
        (
          'Mariana Gómez', 'Urgencias Adultos', 'Sede Prado Centro', 2, 1, 4, 3,
          'El médico y las enfermeras fueron muy atentos, pero la espera en sala fue larga.',
          'Negativo', 'Insatisfacción por tiempo de espera en urgencias (4h); excelente trato asistencial.',
          'Rebalancear triaje médico en horarios pico de 6pm a 10pm.'
        ),
        (
          'Carlos E. Restrepo', 'Consulta Oncología', 'Sede El Poblado', 5, 5, 5, 5,
          'Excelente atención del Dr. Velásquez y el equipo de enfermería oncológica.',
          'Positivo', 'Experiencia sobresaliente en oncología.',
          'Mantener el estándar y documentar la buena práctica asistencial.'
        );
      `);
    }

    // Check suggestions
    const resSug = this.db.exec('SELECT COUNT(*) as count FROM sst_suggestions');
    const sugCount = resSug[0]?.values[0]?.[0] || 0;
    if (sugCount === 0) {
      this.db.run(`
        INSERT INTO sst_suggestions (
          author_name, role, category, sede, title, description, urgency, status, ai_analysis, ai_priority_score
        ) VALUES 
        (
          'Dra. Luisa Fernanda Montoya', 'Médico Especialista', 'Bioseguridad y Residuos', 'Sede Prado Centro',
          'Instalación de dispensadores adicionales de gel antiséptico en pasillo UCI 3',
          'Durante las rondas nocturnas los puntos actuales quedan distantes de las camas críticas.',
          'Alta', 'En Revisión',
          'Impacto directo en indicadores de infección nosocomial (IAAS). Requiere aprobación inmediata.',
          88
        ),
        (
          'Julián Pérez', 'Auxiliar de Mantenimiento', 'Infraestructura y Prevención de Caídas', 'Sede El Poblado',
          'Cinta antideslizante en rampa de acceso peatonal posterior',
          'Con las lluvias de Medellín, el piso cerámico de la rampa se torna resbaladizo.',
          'Crítica', 'Pendiente',
          'Riesgo inminente de caída al mismo nivel y traumatismos laborales en días de lluvia.',
          95
        );
      `);
    }
  }

  private saveToFile() {
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      writeFileSync(this.dbPath, buffer);
    } catch (e) {
      console.error('Error guardando clinicavida.sqlite:', e);
    }
  }

  // QUERY HELPERS
  public async all<T = any>(query: string, params: any[] = []): Promise<T[]> {
    await this.initializedPromise;
    const stmt = this.db.prepare(query);
    stmt.bind(params);
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as T);
    }
    stmt.free();
    return results;
  }

  public async run(query: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    await this.initializedPromise;
    this.db.run(query, params);
    const res = this.db.exec('SELECT last_insert_rowid() as lastID, changes() as changes');
    const lastID = (res[0]?.values[0]?.[0] as number) || 0;
    const changes = (res[0]?.values[0]?.[1] as number) || 0;
    this.saveToFile();
    return { lastID, changes };
  }
}
