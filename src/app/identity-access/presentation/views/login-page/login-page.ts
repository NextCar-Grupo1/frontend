import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { SessionService } from '../../../application/session.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ...MATERIAL_IMPORTS],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly form = this.fb.nonNullable.group({
    email: ['juan.perez@nextcar.pe', [Validators.required, Validators.email]],
    password: ['NextCar123', Validators.required],
    remember: [true],
  });

  loading = false;
  showPassword = false;

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();
    this.session.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        if (!user) {
          this.snackBar.open('Credenciales incorrectas.', 'Cerrar', { duration: 3500 });
          return;
        }
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.loading = false;
        this.snackBar.open(
          'Error al conectar con el servidor. Verifica que el backend este corriendo.',
          'Cerrar',
          { duration: 4500 },
        );
      },
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
