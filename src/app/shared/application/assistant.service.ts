import { Injectable, signal } from '@angular/core';

export interface AssistantFaq {
  question: string;
  answer: string;
  keywords: string[];
}

const FAQS: AssistantFaq[] = [
  {
    question: '¿Qué es la Compra Inteligente?',
    answer:
      'Es un financiamiento vehicular con cuotas menores durante 2 o 3 años. Al final del plazo, decides si renuevas, conservas el auto pagando el valor residual, o lo devuelves.',
    keywords: ['compra inteligente', 'smart purchase', 'residual', 'balon'],
  },
  {
    question: '¿Cuál es la cuota inicial mínima?',
    answer:
      'La cuota inicial debe estar entre 20% y 80% del precio del vehículo. Por debajo de 20% el sistema no permite continuar la simulación.',
    keywords: ['cuota inicial', 'inicial', 'enganche'],
  },
  {
    question: '¿Qué es la TEA y la TEM?',
    answer:
      'La TEA es la Tasa Efectiva Anual que ofrece el banco. El sistema la convierte automáticamente a TEM (Tasa Efectiva Mensual) para calcular el interés de cada cuota.',
    keywords: ['tea', 'tem', 'tasa', 'interes'],
  },
  {
    question: '¿Qué son los periodos de gracia?',
    answer:
      'Gracia parcial: solo pagas interés, sin amortizar capital. Gracia total: no pagas nada, pero el interés se suma a tu deuda (capitaliza). Cada banco define un máximo de meses de gracia.',
    keywords: ['gracia', 'periodo de gracia', 'parcial', 'total'],
  },
  {
    question: '¿Qué significan VAN y TIR?',
    answer:
      'El VAN mide si el crédito conviene desde tu perspectiva como deudor. La TIR es el costo real del crédito expresado como tasa. La TCEA es la TIR anualizada, incluyendo seguros y comisiones.',
    keywords: ['van', 'tir', 'tcea', 'indicador'],
  },
  {
    question: '¿Por qué me piden verificar mi DNI?',
    answer:
      'Validamos tu DNI contra RENIEC para confirmar tu identidad y que seas mayor de edad, requisito para acceder a un crédito vehicular.',
    keywords: ['dni', 'reniec', 'identidad', 'edad'],
  },
  {
    question: '¿Qué plazos de crédito puedo elegir?',
    answer: 'Puedes simular a 24 o 36 meses en el simulador actual.',
    keywords: ['plazo', 'meses', 'duracion'],
  },
  {
    question: '¿Cómo contacto a un asesor humano?',
    answer:
      'Este es un asistente automático. Para hablar con un asesor real, llama al 01 555-0199 o escribe a consultas@nextcar.pe.',
    keywords: ['asesor', 'humano', 'telefono', 'contacto', 'llamar'],
  },
];

const DEFAULT_ANSWER =
  'No encontré una respuesta exacta. Prueba con otra palabra clave (por ejemplo "tasa", "gracia" o "cuota inicial"), o contáctanos al 01 555-0199.';

@Injectable({ providedIn: 'root' })
export class AssistantService {
  readonly isOpen = signal(false);
  readonly faqs = FAQS;

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  findAnswer(query: string): string {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return DEFAULT_ANSWER;
    const match = FAQS.find((faq) => faq.keywords.some((k) => normalized.includes(k)));
    return match ? match.answer : DEFAULT_ANSWER;
  }
}
