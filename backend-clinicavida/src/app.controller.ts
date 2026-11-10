import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString(), system: 'Clinica Vida Medellín API' };
  }

  // --- SST SUGGESTIONS ---
  @Get('suggestions')
  getSuggestions() {
    return this.appService.getSuggestions();
  }

  @Post('suggestions')
  createSuggestion(@Body() body: {
    author_name: string;
    role: string;
    category: string;
    sede: string;
    title: string;
    description: string;
    urgency: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  }) {
    return this.appService.createSuggestion(body);
  }

  @Patch('suggestions/:id/status')
  updateSuggestionStatus(
    @Param('id') id: string,
    @Body('status') status: 'Pendiente' | 'En Revisión' | 'Implementada' | 'Descartada'
  ) {
    return this.appService.updateSuggestionStatus(+id, status);
  }

  // --- RETO 6: FEEDBACK & SATISFACCIÓN IA ---
  @Get('feedback')
  getFeedbacks() {
    return this.appService.getFeedbacks();
  }

  @Post('feedback')
  createFeedback(@Body() body: {
    patient_name?: string;
    service_type: string;
    sede: string;
    rating_overall: number;
    waiting_time_rating: number;
    staff_care_rating: number;
    facility_rating: number;
    comment: string;
  }) {
    return this.appService.createFeedback(body);
  }

  @Get('feedback/dashboard')
  getAISatisfactionDashboard() {
    return this.appService.getAISatisfactionDashboard();
  }

  // --- RETO 7: SEDES Y ASISTENTE IA ---
  @Get('sedes')
  getSedes() {
    return this.appService.getSedes();
  }

  @Post('sedes/ai-route')
  querySedesWithAI(@Body('query') query: string) {
    return this.appService.querySedesWithAI(query || '');
  }

  // --- MATRIZ DE RIESGOS SST GTC 45 ---
  @Get('risk-matrix')
  getRiskMatrix() {
    return this.appService.getRiskMatrix();
  }

  @Post('risk-matrix')
  addRiskItem(@Body() body: any) {
    return this.appService.addRiskItem(body);
  }

  // --- MARCO TECNOLÓGICO ---
  @Get('tech-framework')
  getTechFramework() {
    return this.appService.getTechFramework();
  }
}
