import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-field-help',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <mat-icon
      class="field-help-icon"
      [matTooltip]="text"
      matTooltipPosition="above"
      matTooltipClass="field-help-tooltip"
      tabindex="0"
      [attr.aria-label]="'Ayuda: ' + text"
    >
      help_outline
    </mat-icon>
  `,
  styles: [
    `
      .field-help-icon {
        cursor: help;
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--nextcar-muted, #64748b);
        vertical-align: middle;
        margin-left: 4px;
      }
      .field-help-icon:hover,
      .field-help-icon:focus {
        color: var(--nextcar-emerald, #18a66a);
      }
    `,
  ],
})
export class FieldHelp {
  @Input({ required: true }) text!: string;
}
