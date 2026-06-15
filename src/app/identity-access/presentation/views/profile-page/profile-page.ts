import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MATERIAL_IMPORTS } from '../../../../shared/presentation/material/material-imports';
import { SessionService } from '../../../application/session.service';
import { ApiRepositoryService } from '../../../../shared/infrastructure/http/api-repository.service';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, ReactiveFormsModule, ...MATERIAL_IMPORTS],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly session = inject(SessionService);
  private readonly api = inject(ApiRepositoryService);
  private readonly snackBar = inject(MatSnackBar);

  readonly user = this.session.currentUser;
  readonly customerId = signal<number | null>(null);
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: [{ value: '', disabled: true }],
    phone: [''],
    documentNumber: [''],
    address: [''],
    district: [''],
    city: [''],
    employmentType: ['DEPENDENT'],
    occupation: [''],
    employer: [''],
    monthlyIncome: [0],
  });

  ngOnInit(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.form.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      });

      // Load customer profile
      this.api.getMyCustomerProfile().subscribe({
        next: (profile) => {
          this.customerId.set(profile.id);
          this.form.patchValue({
            documentNumber: profile.documentNumber,
            address: profile.address,
            district: profile.district,
            city: profile.city,
            employmentType: profile.employmentType,
            occupation: profile.occupation,
            employer: profile.employer,
            monthlyIncome: profile.monthlyIncome,
          });
        },
        error: () => {
          /* No customer profile yet — thats OK */
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const raw = this.form.getRawValue();

    const customerId = this.customerId();
    if (customerId) {
      this.api
        .updateCustomerProfile(customerId, {
          address: raw.address || '',
          district: raw.district || '',
          city: raw.city || '',
          employmentType: raw.employmentType || 'DEPENDENT',
          occupation: raw.occupation || '',
          employer: raw.employer || '',
          monthlyIncome: raw.monthlyIncome || 0,
        })
        .subscribe({
          next: () => {
            this.loading.set(false);
            this.snackBar.open('Perfil actualizado correctamente.', 'Cerrar', { duration: 3000 });
          },
          error: () => {
            this.loading.set(false);
            this.snackBar.open('No se pudieron guardar los cambios.', 'Cerrar', { duration: 3500 });
          },
        });
    } else {
      this.api
        .createCustomerProfile({
          documentNumber: raw.documentNumber || '',
          address: raw.address || '',
          district: raw.district || '',
          city: raw.city || '',
          employmentType: raw.employmentType || 'DEPENDENT',
          occupation: raw.occupation || '',
          employer: raw.employer || '',
          monthlyIncome: raw.monthlyIncome || 0,
        })
        .subscribe({
          next: (profile) => {
            this.customerId.set(profile.id);
            this.loading.set(false);
            this.snackBar.open('Perfil creado correctamente.', 'Cerrar', { duration: 3000 });
          },
          error: () => {
            this.loading.set(false);
            this.snackBar.open('No se pudo crear el perfil.', 'Cerrar', { duration: 3500 });
          },
        });
    }
  }
}
