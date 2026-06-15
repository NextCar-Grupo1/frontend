import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiRepositoryService } from '../../../../shared/infrastructure/http/api-repository.service';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { CreditSimulation } from '../../../domain/model/simulation.model';

@Component({
  selector: 'app-results-page',
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, DecimalPipe, ...MATERIAL_IMPORTS],
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss'
})
export class ResultsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiRepositoryService);
  readonly simulation = signal<CreditSimulation | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly columns = ['installmentNumber', 'dueDate', 'openingBalance', 'amortization', 'cumulativeAmortization', 'interest', 'insurance', 'totalPayment', 'closingBalance'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.errorMessage.set('No se encontro el identificador de la simulacion.');
      return;
    }

    this.api.getSimulation(id).subscribe({
      next: (simulation) => {
        this.simulation.set(simulation);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('No se encontro la simulacion solicitada.');
      }
    });
  }

  printReport(): void {
    window.print();
  }
}
