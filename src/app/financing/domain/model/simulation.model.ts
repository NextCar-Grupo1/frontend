export type CurrencyCode = 'PEN' | 'USD';
export type RateType = 'Efectiva' | 'Nominal';
export type GracePeriodType = 'Sin gracia' | 'Parcial' | 'Total';
export type SimulationStatus = 'Pendiente' | 'Pre-aprobado' | 'Expirado';

export interface SimulationInput {
  userId: string;
  vehicleId: string;
  financialEntityId: string;
  currency: CurrencyCode;
  vehiclePrice: number;
  downPaymentPercent: number;
  termMonths: number;
  startDate: string;
  rateType: RateType;
  capitalization: 'Mensual' | 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
  annualRate: number;
  gracePeriodType: GracePeriodType;
  graceMonths: number;
  debtReliefInsuranceRate: number;
  vehicleInsuranceMonthly: number;
  additionalMonthlyCosts: number;
}

export interface PaymentScheduleItem {
  installmentNumber: number;
  dueDate: string;
  openingBalance: number;
  amortization: number;
  cumulativeAmortization: number;
  interest: number;
  debtReliefInsurance: number;
  vehicleInsurance: number;
  additionalCosts: number;
  totalPayment: number;
  closingBalance: number;
}

export interface SimulationResult {
  financedAmount: number;
  downPaymentAmount: number;
  monthlyInstallment: number;
  effectiveMonthlyRate: number;
  effectiveAnnualCostRate: number;
  totalInterest: number;
  totalInsurance: number;
  totalPayment: number;
  npv: number;
  irr: number;
  approvalScore: number;
  schedule: PaymentScheduleItem[];
}

export interface CreditSimulation extends SimulationInput {
  id: string;
  createdAt: string;
  status: SimulationStatus;
  vehicleName: string;
  entityName: string;
  result: SimulationResult;
}
