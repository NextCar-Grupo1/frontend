import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../../identity-access/application/session.service';
import { ApiRepositoryService } from '../../../../shared/infrastructure/http/api-repository.service';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { CreditSimulation } from '../../../domain/model/simulation.model';
import { Vehicle } from '../../../domain/model/backend-models';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, DecimalPipe, ...MATERIAL_IMPORTS],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  private readonly session = inject(SessionService);
  private readonly api = inject(ApiRepositoryService);
  readonly user = this.session.currentUser;
  readonly simulations = signal<CreditSimulation[]>([]);
  readonly vehicles = signal<Vehicle[]>([]);

  ngOnInit(): void {
    const user = this.user();
    if (!user) return;
    this.api.getSimulations(String(user.id)).subscribe((simulations) => this.simulations.set(simulations));
    this.api.getVehicles().subscribe((vehicles) => this.vehicles.set(vehicles));
  }

  totalFinanced(): number {
    return this.simulations().reduce((sum, item) => sum + item.result.financedAmount, 0);
  }

  averageApproval(): number {
    const simulations = this.simulations();
    return simulations.length
      ? simulations.reduce((sum, item) => sum + item.result.approvalScore, 0) / simulations.length
      : 0;
  }
}
