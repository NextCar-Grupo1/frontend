/** Matches VehicleResource from backend catalog module */
export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: 'SOLES' | 'DOLLARS';
  imageUrl: string;
  category: 'SEDAN' | 'SUV' | 'HATCHBACK' | 'PICKUP' | 'VAN' | 'LUXURY';
  categoryDisplayName: string;
  fuelType: 'GASOLINE' | 'HYBRID' | 'ELECTRIC';
  fuelTypeDisplayName: string;
  transmission: 'MANUAL' | 'AUTOMATIC' | 'CVT';
  transmissionDisplayName: string;
  engineCC: number;
  seatingCapacity: number;
  description: string;
  estimatedMonthlyPayment: number;
}

/** Matches FinancialEntityResource from backend financial module */
export interface FinancialEntity {
  name: string;
  displayName: string;
  smartPurchaseResidualRate: number;
  defaultDesgravamenRate: number;
  defaultVehicleInsurance: number;
  defaultPortes: number;
  maxGracePeriodMonths: number;
}

/** Matches CreateLoanSimulationResource from backend */
export interface CreateLoanSimulationRequest {
  currency: 'SOLES' | 'DOLLARS';
  vehiclePrice: number;
  initialFeeRate: number;
  termMonths: number;
  startDate: string;
  paymentMethod: 'FRENCH' | 'SMART_PURCHASE';
  rateType: 'TEA' | 'TNA';
  rateValue: number;
  capitalizationFrequency:
    | 'DAILY'
    | 'MONTHLY'
    | 'BIMONTHLY'
    | 'QUARTERLY'
    | 'SEMI_ANNUAL'
    | 'ANNUAL';
  gracePeriodType: 'NONE' | 'PARTIAL' | 'TOTAL';
  gracePeriodMonths: number;
  financialEntity: string;
  desgravamenRate: number;
  vehicleInsuranceMonthly: number;
  portesMonthly: number;
}

/** Matches PaymentScheduleEntryResource from backend */
export interface PaymentScheduleEntry {
  periodNumber: number;
  paymentDate: string;
  initialBalance: number;
  amortization: number;
  interest: number;
  desgravamenInsurance: number;
  vehicleInsurance: number;
  portes: number;
  totalInstallment: number;
  finalBalance: number;
  gracePeriodType: 'NONE' | 'PARTIAL' | 'TOTAL';
  balloonPeriod: boolean;
}

/** Matches LoanSimulationResource from backend */
export interface LoanSimulationResult {
  id: number;
  currency: 'SOLES' | 'DOLLARS';
  vehiclePrice: number;
  initialFee: number;
  principal: number;
  termMonths: number;
  startDate: string;
  paymentMethod: 'FRENCH' | 'SMART_PURCHASE';
  rateType: 'TEA' | 'TNA';
  rateValue: number;
  capitalizationFrequency:
    | 'DAILY'
    | 'MONTHLY'
    | 'BIMONTHLY'
    | 'QUARTERLY'
    | 'SEMI_ANNUAL'
    | 'ANNUAL';
  gracePeriodType: 'NONE' | 'PARTIAL' | 'TOTAL';
  gracePeriodMonths: number;
  financialEntityName: string;
  monthlyEffectiveRate: number;
  baseInstallment: number;
  totalMonthlyInstallment: number;
  npv: number;
  monthlyIrr: number;
  tcea: number;
  totalInterestPaid: number;
  totalInsurancePaid: number;
  totalAmortization: number;
  totalPaid: number;
  schedule: PaymentScheduleEntry[];
}

/** Extended simulation stored in backend (maps to LoanSimulation aggregate) */
export interface CreditSimulation {
  id: number;
  userId: number;
  currency: 'SOLES' | 'DOLLARS';
  vehiclePrice: number;
  initialFeeRate: number;
  initialFee: number;
  principal: number;
  termMonths: number;
  startDate: string;
  paymentMethod: 'FRENCH' | 'SMART_PURCHASE';
  rateType: 'TEA' | 'TNA';
  rateValue: number;
  capitalizationFrequency:
    | 'DAILY'
    | 'MONTHLY'
    | 'BIMONTHLY'
    | 'QUARTERLY'
    | 'SEMI_ANNUAL'
    | 'ANNUAL';
  gracePeriodType: 'NONE' | 'PARTIAL' | 'TOTAL';
  gracePeriodMonths: number;
  financialEntity: string;
  desgravamenRate: number;
  vehicleInsuranceMonthly: number;
  portesMonthly: number;
  monthlyEffectiveRate: number;
  baseInstallment: number;
  totalMonthlyInstallment: number;
  npv: number;
  monthlyIrr: number;
  tcea: number;
  totalInterestPaid: number;
  totalInsurancePaid: number;
  totalAmortization: number;
  totalPaid: number;
  schedule: PaymentScheduleEntry[];
  vehicleName?: string;
  entityName?: string;
  createdAt?: string;
}
