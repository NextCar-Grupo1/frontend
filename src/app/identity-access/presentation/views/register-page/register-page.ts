import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  minimumAgeValidator,
  todayIsoDate,
} from '../../../../shared/application/validators/date.validators';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { SessionService } from '../../../application/session.service';
import { ApiRepositoryService } from '../../../../shared/infrastructure/http/api-repository.service';
import { RecaptchaService } from '../../../application/recaptcha.service';

@Component({
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ...MATERIAL_IMPORTS],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly api = inject(ApiRepositoryService);
  private readonly recaptcha = inject(RecaptchaService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  readonly maxBirthDate = todayIsoDate();

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    documentType: ['DNI' as const],
    documentNumber: [''],
    birthDate: ['', [Validators.required, minimumAgeValidator(18)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    grossMonthlyIncome: [1500, [Validators.required, Validators.min(1500)]],
    employmentType: ['Dependiente' as const],
    address: ['', Validators.required],
    district: ['', Validators.required],
    city: ['Lima', Validators.required],
    occupation: ['', Validators.required],
    employer: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    terms: [false, Validators.requiredTrue],
  });

  loading = false;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.password !== value.confirmPassword) {
      this.snackBar.open('La confirmacion de contrasena no coincide.', 'Cerrar', {
        duration: 3500,
      });
      return;
    }

    this.loading = true;

    this.recaptcha
      .execute('signup')
      .then((captchaToken) => {
        // Step 1: Register user in IAM module
        this.session
          .register({
            email: value.email,
            password: value.password,
            firstName: value.firstName,
            lastName: value.lastName,
            phone: value.phone,
            documentNumber: value.documentNumber || undefined,
            captchaToken,
          })
          .subscribe({
            next: () => {
              // Step 2: Auto-login after registration
              this.session.login(value.email, value.password).subscribe({
                next: (user) => {
                  if (!user) {
                    this.loading = false;
                    this.router.navigateByUrl('/auth/login');
                    return;
                  }

                  // Step 3: Create customer profile
                  const employmentTypeMap: Record<string, string> = {
                    Dependiente: 'DEPENDENT',
                    Independiente: 'INDEPENDENT',
                    Mixto: 'BUSINESS_OWNER',
                  };

                  this.api
                    .createCustomerProfile({
                      documentNumber: value.documentNumber || '',
                      address: value.address,
                      district: value.district,
                      city: value.city,
                      employmentType: employmentTypeMap[value.employmentType] || 'DEPENDENT',
                      occupation: value.occupation,
                      employer: value.employer || '',
                      monthlyIncome: value.grossMonthlyIncome,
                    })
                    .subscribe({
                      next: () => {
                        this.loading = false;
                        this.router.navigateByUrl('/dashboard');
                      },
                      error: () => {
                        this.loading = false;
                        this.router.navigateByUrl('/dashboard');
                      },
                    });
                },
                error: () => {
                  this.loading = false;
                  this.router.navigateByUrl('/auth/login');
                },
              });
            },
            error: (err) => {
              this.loading = false;
              this.snackBar.open('No se pudo registrar. Revisa que el backend este activo.', 'Cerrar', {
                duration: 4500,
              });
            },
          });
      })
      .catch(() => {
        this.loading = false;
        this.snackBar.open('No se pudo validar reCAPTCHA. Intentalo nuevamente.', 'Cerrar', {
          duration: 4500,
        });
      });
  }
}
