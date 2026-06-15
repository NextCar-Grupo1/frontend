import { Injectable } from '@angular/core';
import {
  CreditSimulation,
  PaymentScheduleItem,
  SimulationInput,
  SimulationResult
} from '../domain/model/simulation.model';
import { Vehicle } from '../domain/model/vehicle.model';
import { FinancialEntity } from '../domain/model/financial-entity.model';
import { UserProfile } from '../../identity-access/domain/model/user-profile.model';

const CAPITALIZATION_PERIODS: Record<SimulationInput['capitalization'], number> = {
  Mensual: 12,
  Bimestral: 6,
  Trimestral: 4,
  Semestral: 2,
  Anual: 1
};

@Injectable({ providedIn: 'root' })
export class FinancialCalculatorService {
  buildSimulation(
    input: SimulationInput,
    vehicle: Vehicle,
    entity: FinancialEntity,
    user: UserProfile,
    existingSimulation?: Pick<CreditSimulation, 'id' | 'createdAt'>
  ): CreditSimulation {
    const result = this.calculate(input, user);

    return {
      ...input,
      id: existingSimulation?.id ?? crypto.randomUUID(),
      createdAt: existingSimulation?.createdAt ?? new Date().toISOString(),
      status: result.approvalScore >= 82 ? 'Pre-aprobado' : 'Pendiente',
      vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      entityName: entity.name,
      result
    };
  }

  calculate(input: SimulationInput, user?: UserProfile): SimulationResult {
    const downPaymentAmount = input.vehiclePrice * (input.downPaymentPercent / 100);
    const financedAmount = input.vehiclePrice - downPaymentAmount;
    const effectiveAnnualRate = this.toEffectiveAnnualRate(input.annualRate / 100, input.rateType, input.capitalization);
    const effectiveMonthlyRate = Math.pow(1 + effectiveAnnualRate, 1 / 12) - 1;
    const graceMonths = Math.min(input.graceMonths, input.termMonths - 1);
    const schedule = this.buildSchedule(input, financedAmount, effectiveMonthlyRate, graceMonths);
    const monthlyInstallment = schedule[Math.min(graceMonths, schedule.length - 1)]?.totalPayment ?? 0;
    const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);
    const totalInsurance = schedule.reduce((sum, item) => sum + item.debtReliefInsurance + item.vehicleInsurance, 0);
    const totalPayment = schedule.reduce((sum, item) => sum + item.totalPayment, 0);
    const cashFlows = [financedAmount, ...schedule.map((item) => -item.totalPayment)];
    const irrMonthly = this.calculateIrr(cashFlows);
    const npv = this.calculateNpv(cashFlows, effectiveMonthlyRate);
    const annualCostRate = Number.isFinite(irrMonthly)
      ? Math.pow(1 + irrMonthly, 12) - 1
      : Math.pow(1 + effectiveMonthlyRate, 12) - 1;

    return {
      financedAmount,
      downPaymentAmount,
      monthlyInstallment,
      effectiveMonthlyRate,
      effectiveAnnualCostRate: annualCostRate,
      totalInterest,
      totalInsurance,
      totalPayment,
      npv,
      irr: annualCostRate,
      approvalScore: this.calculateApprovalScore(user, monthlyInstallment),
      schedule
    };
  }

  // Normaliza la tasa ingresada a TEA para que el cronograma use una sola base financiera.
  private toEffectiveAnnualRate(rate: number, type: SimulationInput['rateType'], capitalization: SimulationInput['capitalization']): number {
    if (type === 'Efectiva') {
      return rate;
    }

    const periods = CAPITALIZATION_PERIODS[capitalization];
    return Math.pow(1 + rate / periods, periods) - 1;
  }

  // Genera el plan frances vencido y adapta la cuota base cuando existe gracia total o parcial.
  private buildSchedule(
    input: SimulationInput,
    initialBalance: number,
    monthlyRate: number,
    graceMonths: number
  ): PaymentScheduleItem[] {
    const schedule: PaymentScheduleItem[] = [];
    let balance = initialBalance;
    let cumulativeAmortization = 0;
    let fixedInstallment = this.frenchInstallment(balance, monthlyRate, input.termMonths - graceMonths);

    for (let month = 1; month <= input.termMonths; month++) {
      const openingBalance = balance;
      const interest = openingBalance * monthlyRate;
      let amortization = fixedInstallment - interest;

      if (month <= graceMonths && input.gracePeriodType === 'Total') {
        balance += interest;
        amortization = 0;
        fixedInstallment = this.frenchInstallment(balance, monthlyRate, input.termMonths - month);
      } else if (month <= graceMonths && input.gracePeriodType === 'Parcial') {
        amortization = 0;
      } else {
        balance = Math.max(0, openingBalance - amortization);
      }
      cumulativeAmortization += Math.max(0, amortization);

      const debtReliefInsurance = openingBalance * (input.debtReliefInsuranceRate / 100);
      const vehicleInsurance = input.vehicleInsuranceMonthly;
      const additionalCosts = input.additionalMonthlyCosts;
      const basePayment = this.getBasePayment(input.gracePeriodType, month, graceMonths, interest, fixedInstallment);

      schedule.push({
        installmentNumber: month,
        dueDate: this.addMonths(input.startDate, month),
        openingBalance,
        amortization: Math.max(0, amortization),
        cumulativeAmortization,
        interest,
        debtReliefInsurance,
        vehicleInsurance,
        additionalCosts,
        totalPayment: basePayment + debtReliefInsurance + vehicleInsurance + additionalCosts,
        closingBalance: balance
      });
    }

    const last = schedule.at(-1);
    if (last && last.closingBalance > 0.01) {
      last.amortization += last.closingBalance;
      last.cumulativeAmortization += last.closingBalance;
      last.totalPayment += last.closingBalance;
      last.closingBalance = 0;
    }

    return schedule;
  }

  private getBasePayment(
    graceType: SimulationInput['gracePeriodType'],
    month: number,
    graceMonths: number,
    interest: number,
    fixedInstallment: number
  ): number {
    if (month > graceMonths || graceType === 'Sin gracia') {
      return fixedInstallment;
    }

    return graceType === 'Parcial' ? interest : 0;
  }

  private frenchInstallment(capital: number, rate: number, months: number): number {
    if (months <= 0) {
      return capital;
    }

    if (rate === 0) {
      return capital / months;
    }

    const factor = Math.pow(1 + rate, months);
    return capital * ((rate * factor) / (factor - 1));
  }

  private calculateNpv(cashFlows: number[], discountRate: number): number {
    return cashFlows.reduce((sum, flow, index) => sum + flow / Math.pow(1 + discountRate, index), 0);
  }

  // Resuelve la TIR mensual por biseccion; evita resultados extremos cuando no hay cambio de signo.
  private calculateIrr(cashFlows: number[]): number {
    const hasPositiveFlow = cashFlows.some((flow) => flow > 0);
    const hasNegativeFlow = cashFlows.some((flow) => flow < 0);

    if (!hasPositiveFlow || !hasNegativeFlow) {
      return Number.NaN;
    }

    let low = -0.9999;
    let high = 1;
    let lowValue = this.calculateNpv(cashFlows, low);
    let highValue = this.calculateNpv(cashFlows, high);

    while (lowValue * highValue > 0 && high < 10) {
      high *= 2;
      highValue = this.calculateNpv(cashFlows, high);
    }

    if (lowValue * highValue > 0) {
      return Number.NaN;
    }

    for (let i = 0; i < 80; i++) {
      const mid = (low + high) / 2;
      const midValue = this.calculateNpv(cashFlows, mid);

      if (Math.abs(midValue) < 1e-7) {
        return mid;
      }

      if (lowValue * midValue <= 0) {
        high = mid;
        highValue = midValue;
      } else {
        low = mid;
        lowValue = midValue;
      }
    }

    return (low + high) / 2;
  }

  // Indicador referencial de frontend; el backend real deberia reemplazarlo por evaluacion crediticia.
  private calculateApprovalScore(user: UserProfile | undefined, monthlyInstallment: number): number {
    if (!user) {
      return 72;
    }

    const paymentRatio = monthlyInstallment / Math.max(user.grossMonthlyIncome, 1);
    const base = user.grossMonthlyIncome >= 1500 ? 88 : 58;
    const penalty = paymentRatio > 0.35 ? 18 : paymentRatio > 0.25 ? 8 : 0;

    return Math.max(45, Math.min(96, base - penalty));
  }

  private addMonths(startDate: string, months: number): string {
    const date = new Date(startDate);
    date.setDate(date.getDate() + months * 30);
    return date.toISOString().slice(0, 10);
  }
}
