export type DocumentType = 'DNI' | 'CE' | 'PASSPORT';
export type EmploymentType = 'Dependiente' | 'Independiente' | 'Mixto';

export interface UserProfile {
  id: string;
  documentType: DocumentType;
  documentNumber: string;
  names: string;
  lastNames: string;
  email: string;
  phone: string;
  grossMonthlyIncome: number;
  employmentType: EmploymentType;
  birthDate: string;
  password: string;
  registrationDate: string;
}

/** Minimal user info stored locally after JWT auth */
export interface LocalSessionUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  roles: string[];
}
