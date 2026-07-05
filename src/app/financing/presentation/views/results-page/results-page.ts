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
    const item = this.simulation();
    if (!item) {
      window.print();
      return;
    }

    const reportWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!reportWindow) {
      window.print();
      return;
    }

    reportWindow.document.open();
    reportWindow.document.write(this.buildPrintableReport(item));
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  }

  private buildPrintableReport(item: CreditSimulation): string {
    const rows = item.result.schedule
      .map(
        (row) => `
          <tr>
            <td>${row.installmentNumber}</td>
            <td>${this.formatDate(row.dueDate)}</td>
            <td>${this.formatMoney(row.openingBalance, item.currency)}</td>
            <td>${this.formatMoney(row.amortization, item.currency)}</td>
            <td>${this.formatMoney(row.cumulativeAmortization, item.currency)}</td>
            <td>${this.formatMoney(row.interest, item.currency)}</td>
            <td>${this.formatMoney(row.debtReliefInsurance + row.vehicleInsurance, item.currency)}</td>
            <td>${this.formatMoney(row.totalPayment, item.currency)}</td>
            <td>${this.formatMoney(row.closingBalance, item.currency)}</td>
          </tr>`,
      )
      .join('');

    return `<!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>Reporte de simulacion ${this.escapeHtml(item.id)}</title>
          <style>
            @page { size: A4 landscape; margin: 12mm; }
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #18202f; margin: 0; }
            header { border-bottom: 2px solid #1f4f8f; margin-bottom: 16px; padding-bottom: 10px; }
            h1 { font-size: 22px; margin: 0 0 6px; }
            h2 { font-size: 15px; margin: 18px 0 8px; }
            p { margin: 3px 0; }
            .muted { color: #5f6b7a; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 14px 0; }
            .card { border: 1px solid #d8dee8; border-radius: 6px; padding: 8px; }
            .label { color: #5f6b7a; font-size: 11px; text-transform: uppercase; }
            .value { display: block; font-size: 15px; font-weight: 700; margin-top: 4px; }
            table { border-collapse: collapse; width: 100%; font-size: 9px; }
            th, td { border: 1px solid #d8dee8; padding: 5px 4px; text-align: right; }
            th { background: #eef3fb; color: #18202f; font-size: 8px; text-transform: uppercase; }
            td:nth-child(1), td:nth-child(2), th:nth-child(1), th:nth-child(2) { text-align: left; }
            tr:nth-child(even) td { background: #f8fafc; }
            .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <header>
            <h1>Reporte de simulacion vehicular</h1>
            <p><strong>${this.escapeHtml(item.vehicleName || 'Vehiculo')}</strong></p>
            <p class="muted">${this.escapeHtml(item.entityName)} - ${item.termMonths} meses - Estado: ${this.escapeHtml(item.status)}</p>
          </header>

          <section class="grid">
            <div class="card"><span class="label">Cuota mensual total</span><span class="value">${this.formatMoney(item.result.monthlyInstallment, item.currency)}</span></div>
            <div class="card"><span class="label">Monto financiado</span><span class="value">${this.formatMoney(item.result.financedAmount, item.currency)}</span></div>
            <div class="card"><span class="label">Cuota inicial</span><span class="value">${this.formatMoney(item.result.downPaymentAmount, item.currency)}</span></div>
            <div class="card"><span class="label">Total a pagar</span><span class="value">${this.formatMoney(item.result.totalPayment, item.currency)}</span></div>
          </section>

          <section class="summary">
            <div class="card"><span class="label">VAN</span><span class="value">${this.formatMoney(item.result.npv, item.currency)}</span></div>
            <div class="card"><span class="label">TIR</span><span class="value">${this.formatPercent(item.result.irr)}</span></div>
            <div class="card"><span class="label">TCEA estimada</span><span class="value">${this.formatPercent(item.result.effectiveAnnualCostRate)}</span></div>
          </section>

          <h2>Cronograma de pagos</h2>
          <table>
            <thead>
              <tr>
                <th>Cuota</th>
                <th>Fecha</th>
                <th>Capital vivo</th>
                <th>Amortizacion</th>
                <th>Capital amortizado</th>
                <th>Interes</th>
                <th>Seguros</th>
                <th>Cuota total</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`;
  }

  private formatMoney(value: number, currency: CreditSimulation['currency']): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatPercent(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value);
  }

  private formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-PE').format(new Date(value));
  }

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return entities[char];
    });
  }
}
