import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AssistantService } from '../../../application/assistant.service';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-assistant-widget',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './assistant-widget.html',
  styleUrl: './assistant-widget.scss',
})
export class AssistantWidget {
  protected readonly assistant = inject(AssistantService);

  readonly query = signal('');
  readonly messages = signal<ChatMessage[]>([
    {
      from: 'bot',
      text: 'Hola 👋 Soy el asistente de NextCar. Pregúntame sobre tasas, cuotas, gracia, VAN/TIR o Compra Inteligente.',
    },
  ]);

  ask(question?: string): void {
    const text = (question ?? this.query()).trim();
    if (!text) return;
    const answer = this.assistant.findAnswer(text);
    this.messages.update((msgs) => [
      ...msgs,
      { from: 'user', text },
      { from: 'bot', text: answer },
    ]);
    this.query.set('');
  }

  close(): void {
    this.assistant.close();
  }
}
