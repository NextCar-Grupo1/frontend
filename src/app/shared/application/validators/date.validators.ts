import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function todayIsoDate(): string {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');

  return `${today.getFullYear()}-${month}-${day}`;
}

export function notBeforeTodayValidator(): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    return control.value && control.value < todayIsoDate() ? { dateBeforeToday: true } : null;
  };
}

export function minimumAgeValidator(minimumAge: number): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    if (!control.value) return null;

    const birthDate = new Date(`${control.value}T00:00:00`);
    const today = new Date(`${todayIsoDate()}T00:00:00`);
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age -= 1;

    return age >= minimumAge ? null : { minimumAge: { requiredAge: minimumAge, actualAge: age } };
  };
}
