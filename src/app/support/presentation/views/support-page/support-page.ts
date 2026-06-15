import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { SupportTopic } from '../../../domain/model/support-topic.model';

@Component({
  selector: 'app-support-page',
  imports: [CommonModule, ...MATERIAL_IMPORTS],
  templateUrl: './support-page.html',
  styleUrl: './support-page.scss'
})
export class SupportPage {
  readonly topics: SupportTopic[] = [
    { title: 'Compra Inteligente', icon: 'directions_car', description: 'Financiamiento vehicular con cuotas menores durante 2 o 3 anos y una decision final sobre renovar, conservar o devolver el vehiculo.' },
    { title: 'TEA y TEM', icon: 'percent', description: 'La tasa efectiva anual se convierte a tasa efectiva mensual para calcular intereses de cada cuota del cronograma.' },
    { title: 'Metodo frances', icon: 'functions', description: 'Modelo de amortizacion con cuota base constante, donde al inicio pesa mas el interes y luego crece la amortizacion.' },
    { title: 'VAN y TIR', icon: 'show_chart', description: 'Indicadores financieros que ayudan a comparar el costo real de la alternativa y su rendimiento financiero estimado.' }
  ];
}
