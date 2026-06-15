import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../../identity-access/application/session.service';
import { ApiRepositoryService } from '../../../../shared/infrastructure/http/api-repository.service';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { CreditSimulation } from '../../../domain/model/simulation.model';

@Component({
  selector: 'app-credits-page',
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, ...MATERIAL_IMPORTS],
  templateUrl: './credits-page.html',
  styleUrl: './credits-page.scss'
})
export class CreditsPage implements OnInit {
  private readonly session = inject(SessionService);
  private readonly api = inject(ApiRepositoryService);
  readonly simulations = signal<CreditSimulation[]>([]);

  ngOnInit(): void {
    const user = this.session.currentUser();
    if (user) this.api.getSimulations(String(user.id)).subscribe((simulations) => this.simulations.set(simulations));
  }
}
