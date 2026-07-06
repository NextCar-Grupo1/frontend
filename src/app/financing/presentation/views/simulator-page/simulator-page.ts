import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest } from 'rxjs';
import { SessionService } from '../../../../identity-access/application/session.service';
import {
  notBeforeTodayValidator,
  todayIsoDate,
} from '../../../../shared/application/validators/date.validators';
import { ApiRepositoryService } from '../../../../shared/infrastructure/http/api-repository.service';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { Vehicle, FinancialEntity } from '../../../domain/model/backend-models';
import {
  CreditSimulation,
  CurrencyCode,
  GracePeriodType,
  RateType,
  SimulationInput,
  SimulationResult,
} from '../../../domain/model/simulation.model';

@Component({
  selector: 'app-simulator-page',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe, DecimalPipe, ...MATERIAL_IMPORTS],
  templateUrl: './simulator-page.html',
  styleUrl: './simulator-page.scss',
})
export class SimulatorPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiRepositoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly snackBar = inject(MatSnackBar);

  readonly user = this.session.currentUser;
  readonly vehicles = signal<Vehicle[]>([]);
  readonly entities = signal<FinancialEntity[]>([]);
  readonly preview = signal<SimulationResult | null>(null);
  readonly simulationBeingEdited = signal<CreditSimulation | null>(null);
  readonly today = todayIsoDate();

  readonly form = this.fb.nonNullable.group({
    vehicleId: ['', Validators.required],
    financialEntityId: ['', Validators.required],
    currency: ['PEN' as CurrencyCode, Validators.required],
    vehiclePrice: [85000, [Validators.required, Validators.min(1000)]],
    downPaymentPercent: [20, [Validators.required, Validators.min(20), Validators.max(80)]],
    termMonths: [36, [Validators.required, Validators.min(24), Validators.max(36)]],
    startDate: [this.today, [Validators.required, notBeforeTodayValidator()]],
    rateType: ['Efectiva' as RateType, Validators.required],
    capitalization: ['Mensual' as SimulationInput['capitalization'], Validators.required],
    annualRate: [12.5, [Validators.required, Validators.min(0.1)]],
    gracePeriodType: ['Sin gracia' as GracePeriodType, Validators.required],
    graceMonths: [0, [Validators.required, Validators.min(0), Validators.max(6)]],
    debtReliefInsuranceRate: [0.05, [Validators.required, Validators.min(0)]],
    vehicleInsuranceMonthly: [150, [Validators.required, Validators.min(0)]],
    additionalMonthlyCosts: [18, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    combineLatest([this.api.getVehicles(), this.api.getFinancialEntities()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([vehicles, entities]) => {
        this.vehicles.set(vehicles);
        this.entities.set(entities);
        const vehicle = vehicles[0];
        const entity = entities[0];
        this.form.patchValue({
          vehicleId: String(vehicle?.id ?? ''),
          financialEntityId: entity?.name ?? '',
          currency: vehicle?.currency === 'SOLES' ? 'PEN' : 'USD',
          vehiclePrice: vehicle?.price ?? 85000,
          annualRate: 12.5,
          debtReliefInsuranceRate: (entity?.defaultDesgravamenRate ?? 0.05) * 100,
          vehicleInsuranceMonthly: entity?.defaultVehicleInsurance ?? 150,
          additionalMonthlyCosts: entity?.defaultPortes ?? 10,
        });
        this.loadSimulationForEdition();
        this.recalculate();
      });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recalculate());
  }

  onVehicleChange(): void {
    const vehicle = this.selectedVehicle();
    if (!vehicle) return;
    this.form.patchValue({
      vehiclePrice: vehicle.price,
      currency: vehicle.currency === 'SOLES' ? 'PEN' : 'USD',
      vehicleInsuranceMonthly: this.defaultVehicleInsurance(vehicle, this.selectedEntity()),
    });
  }

  onEntityChange(): void {
    const entity = this.selectedEntity();
    if (!entity) return;
    this.form.patchValue({
      annualRate: 12.5,
      debtReliefInsuranceRate: entity.defaultDesgravamenRate * 100,
      vehicleInsuranceMonthly: entity.defaultVehicleInsurance,
      additionalMonthlyCosts: entity.defaultPortes,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const vehicle = this.selectedVehicle();
    const entity = this.selectedEntity();
    if (!vehicle || !entity) return;

    const raw = this.form.getRawValue();

    // Build request matching backend CreateLoanSimulationResource
    const request: any = {
      currency: raw.currency === 'PEN' ? 'SOLES' : 'DOLLARS',
      vehiclePrice: raw.vehiclePrice,
      initialFeeRate: raw.downPaymentPercent / 100,
      termMonths: raw.termMonths,
      startDate: raw.startDate,
      paymentMethod: 'FRENCH',
      rateType: raw.rateType === 'Efectiva' ? 'TEA' : 'TNA',
      rateValue: raw.annualRate / 100,
      capitalizationFrequency:
        raw.rateType === 'Efectiva' ? 'MONTHLY' : this.toBackendCap(raw.capitalization),
      gracePeriodType:
        raw.gracePeriodType === 'Sin gracia'
          ? 'NONE'
          : raw.gracePeriodType === 'Parcial'
            ? 'PARTIAL'
            : 'TOTAL',
      gracePeriodMonths: raw.graceMonths,
      financialEntity: entity.name,
      desgravamenRate: raw.debtReliefInsuranceRate / 100,
      vehicleInsuranceMonthly: raw.vehicleInsuranceMonthly,
      portesMonthly: raw.additionalMonthlyCosts,
    };

    this.api.createSimulation(request).subscribe({
      next: (saved) => {
        this.router.navigate(['/results', saved.id]);
      },
      error: () =>
        this.snackBar.open(
          'No se pudo guardar la simulacion. Verifica que el backend este corriendo.',
          'Cerrar',
          { duration: 4200 },
        ),
    });
  }

  private toBackendCap(cap: string): string {
    const map: Record<string, string> = {
      Mensual: 'MONTHLY',
      Bimestral: 'BIMONTHLY',
      Trimestral: 'QUARTERLY',
      Semestral: 'SEMI_ANNUAL',
      Anual: 'ANNUAL',
    };
    return map[cap] || 'MONTHLY';
  }

  selectedVehicle(): Vehicle | undefined {
    const selectedVehicleId = this.form.controls.vehicleId.value;
    return this.vehicles().find(
      (vehicle) => String(vehicle.id) === String(selectedVehicleId),
    );
  }

  selectedEntity(): FinancialEntity | undefined {
    return this.entities().find(
      (entity) => entity.name === this.form.controls.financialEntityId.value,
    );
  }

  requiresCapitalization(): boolean {
    return this.form.controls.rateType.value === 'Nominal';
  }

  private recalculate(): void {
    // Backend does the calculation now; preview cleared until first submission
    this.preview.set(null);
  }

  private loadSimulationForEdition(): void {
    const simulationId = this.route.snapshot.paramMap.get('id');
    if (!simulationId || this.simulationBeingEdited()) return;

    this.api
      .getSimulation(simulationId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (simulation) => {
          this.simulationBeingEdited.set(simulation);
          this.form.patchValue({
            currency: simulation.currency,
            vehiclePrice: simulation.vehiclePrice,
            downPaymentPercent: simulation.downPaymentPercent,
            termMonths: simulation.termMonths,
            startDate: simulation.startDate,
            rateType: simulation.rateType,
            capitalization: simulation.capitalization,
            annualRate: simulation.annualRate,
            gracePeriodType: simulation.gracePeriodType,
            graceMonths: simulation.graceMonths,
          });
        },
        error: () =>
          this.snackBar.open('No se pudo cargar la simulacion para editar.', 'Cerrar', {
            duration: 4200,
          }),
      });
  }

  private defaultVehicleInsurance(vehicle?: Vehicle, entity?: FinancialEntity): number {
    if (!entity) return 150;
    return entity.defaultVehicleInsurance;
  }
}
