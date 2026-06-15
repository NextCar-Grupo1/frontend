import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Backend models
import { Vehicle } from '../../../financing/domain/model/backend-models';
import { FinancialEntity } from '../../../financing/domain/model/backend-models';
import {
  LoanSimulationResult,
  PaymentScheduleEntry,
} from '../../../financing/domain/model/backend-models';

// Frontend models (used by existing templates)
import {
  CreditSimulation,
  SimulationResult,
  PaymentScheduleItem,
} from '../../../financing/domain/model/simulation.model';

// Auth models
import {
  SignUpRequest,
  SignInRequest,
  UserResource,
} from '../../../identity-access/domain/model/sign-up-request.model';

const API = environment.nextCarApiBaseUrl;

// ── ADAPTER FUNCTIONS: Backend DTO → Frontend Model ─────────────────────────

function toCreditSimulation(backend: LoanSimulationResult): CreditSimulation {
  let cumulativeAmortization = 0;
  const schedule = backend.schedule.map((e) => {
    cumulativeAmortization += e.amortization;
    return toPaymentItem(e, cumulativeAmortization);
  });

  return {
    id: String(backend.id),
    userId: '',
    vehicleId: '',
    financialEntityId: '',
    currency: backend.currency === 'SOLES' ? 'PEN' : 'USD',
    vehiclePrice: backend.vehiclePrice,
    downPaymentPercent:
      backend.vehiclePrice > 0 ? Math.round((backend.initialFee / backend.vehiclePrice) * 100) : 20,
    termMonths: backend.termMonths,
    startDate: backend.startDate,
    rateType: backend.rateType === 'TEA' ? 'Efectiva' : 'Nominal',
    capitalization: toFrontendCap(backend.capitalizationFrequency),
    annualRate: backend.rateType === 'TEA' ? backend.rateValue * 100 : backend.rateValue * 100,
    gracePeriodType: toFrontendGrace(backend.gracePeriodType),
    graceMonths: backend.gracePeriodMonths,
    debtReliefInsuranceRate: 0,
    vehicleInsuranceMonthly: 0,
    additionalMonthlyCosts: 0,
    createdAt: backend.startDate,
    status: backend.npv >= 0 ? 'Pre-aprobado' : 'Pendiente',
    vehicleName: '',
    entityName: backend.financialEntityName,
    result: {
      financedAmount: backend.principal,
      downPaymentAmount: backend.initialFee,
      monthlyInstallment: backend.totalMonthlyInstallment,
      effectiveMonthlyRate: backend.monthlyEffectiveRate,
      effectiveAnnualCostRate: backend.tcea,
      totalInterest: backend.totalInterestPaid,
      totalInsurance: backend.totalInsurancePaid,
      totalPayment: backend.totalPaid,
      npv: backend.npv,
      irr: backend.monthlyIrr,
      approvalScore: backend.npv >= 0 ? 85 : 65,
      schedule,
    },
  };
}

function toPaymentItem(e: PaymentScheduleEntry, cumulativeAmortization = 0): PaymentScheduleItem {
  return {
    installmentNumber: e.periodNumber,
    dueDate: e.paymentDate,
    openingBalance: e.initialBalance,
    amortization: e.amortization,
    cumulativeAmortization,
    interest: e.interest,
    debtReliefInsurance: e.desgravamenInsurance,
    vehicleInsurance: e.vehicleInsurance,
    additionalCosts: e.portes,
    totalPayment: e.totalInstallment,
    closingBalance: e.finalBalance,
  };
}

function toFrontendCap(f: string): 'Mensual' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual' {
  const m: Record<string, any> = {
    DAILY: 'Mensual',
    MONTHLY: 'Mensual',
    BIMONTHLY: 'Bimestral',
    QUARTERLY: 'Trimestral',
    SEMI_ANNUAL: 'Semestral',
    ANNUAL: 'Anual',
  };
  return m[f] || 'Mensual';
}

function toFrontendGrace(g: string): 'Sin gracia' | 'Parcial' | 'Total' {
  const m: Record<string, any> = { NONE: 'Sin gracia', PARTIAL: 'Parcial', TOTAL: 'Total' };
  return m[g] || 'Sin gracia';
}

@Injectable({ providedIn: 'root' })
export class ApiRepositoryService {
  constructor(private readonly http: HttpClient) {}

  // ── AUTH ────────────────────────────────────────────────────────────────────

  /** POST /api/v1/authentication/sign-in */
  signIn(
    body: SignInRequest,
  ): Observable<{ id: number; email: string; token: string; roles: string[] } | null> {
    return this.http.post<{ id: number; email: string; token: string; roles: string[] }>(
      `${API}/authentication/sign-in`,
      body,
    );
  }

  /** POST /api/v1/authentication/sign-up */
  signUp(body: SignUpRequest): Observable<UserResource> {
    return this.http.post<UserResource>(`${API}/authentication/sign-up`, body);
  }

  /** GET /api/v1/users/{id} */
  getUser(id: number): Observable<UserResource> {
    return this.http.get<UserResource>(`${API}/users/${id}`);
  }

  // ── VEHICLES ────────────────────────────────────────────────────────────────

  /** GET /api/v1/vehicles */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${API}/vehicles`);
  }

  /** GET /api/v1/vehicles/{id} */
  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${API}/vehicles/${id}`);
  }

  // ── FINANCIAL ENTITIES ──────────────────────────────────────────────────────

  /** GET /api/v1/loan-simulations/financial-entities */
  getFinancialEntities(): Observable<FinancialEntity[]> {
    return this.http.get<FinancialEntity[]>(`${API}/loan-simulations/financial-entities`);
  }

  // ── LOAN SIMULATIONS ────────────────────────────────────────────────────────

  /** POST /api/v1/loan-simulations — returns adapted CreditSimulation */
  createSimulation(body: any): Observable<CreditSimulation> {
    return this.http
      .post<LoanSimulationResult>(`${API}/loan-simulations`, body)
      .pipe(map(toCreditSimulation));
  }

  /** GET /api/v1/loan-simulations/{id} — returns adapted CreditSimulation */
  getSimulation(id: string): Observable<CreditSimulation> {
    return this.http
      .get<LoanSimulationResult>(`${API}/loan-simulations/${id}`)
      .pipe(map(toCreditSimulation));
  }

  /** GET /api/v1/loan-simulations/my — returns adapted CreditSimulation[] */
  getMySimulations(): Observable<CreditSimulation[]> {
    return this.http
      .get<LoanSimulationResult[]>(`${API}/loan-simulations/my`)
      .pipe(map((list) => list.map(toCreditSimulation)));
  }

  /** GET /api/v1/loan-simulations/my (alias for userId-based queries) — for dashboard/credits */
  getSimulations(userId: string): Observable<CreditSimulation[]> {
    return this.getMySimulations();
  }

  // ── CUSTOMERS ───────────────────────────────────────────────────────────────

  /** POST /api/v1/customers */
  createCustomerProfile(body: {
    documentNumber: string;
    address: string;
    district: string;
    city: string;
    employmentType: string;
    occupation: string;
    employer?: string;
    monthlyIncome: number;
  }): Observable<{
    id: number;
    userId: number;
    documentNumber: string;
    address: string;
    district: string;
    city: string;
    employmentType: string;
    employmentTypeDisplayName: string;
    occupation: string;
    employer: string;
    monthlyIncome: number;
    profileComplete: boolean;
  }> {
    return this.http.post<any>(`${API}/customers`, body);
  }

  /** GET /api/v1/customers/me */
  getMyCustomerProfile(): Observable<{
    id: number;
    userId: number;
    documentNumber: string;
    address: string;
    district: string;
    city: string;
    employmentType: string;
    employmentTypeDisplayName: string;
    occupation: string;
    employer: string;
    monthlyIncome: number;
    profileComplete: boolean;
  }> {
    return this.http.get<any>(`${API}/customers/me`);
  }

  /** PUT /api/v1/customers/{id} */
  updateCustomerProfile(
    id: number,
    body: {
      address: string;
      district: string;
      city: string;
      employmentType: string;
      occupation: string;
      employer?: string;
      monthlyIncome: number;
    },
  ): Observable<any> {
    return this.http.put(`${API}/customers/${id}`, body);
  }

  // ── DNI VERIFICATION ────────────────────────────────────────────────────────

  /** GET /api/v1/dni/{dni} */
  verifyDni(dni: string): Observable<{
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  }> {
    return this.http.get<any>(`${API}/dni/${dni}`);
  }

  // ── USERS (admin) ───────────────────────────────────────────────────────────

  /** GET /api/v1/users */
  getUsers(): Observable<UserResource[]> {
    return this.http.get<UserResource[]>(`${API}/users`);
  }
}
