/** Matches CustomerResource from backend customers module */
export interface CustomerProfile {
  id: number;
  userId: number;
  documentNumber: string;
  address: string;
  district: string;
  city: string;
  employmentType: EmploymentType;
  employmentTypeDisplayName: string;
  occupation: string;
  employer: string;
  monthlyIncome: number;
  profileComplete: boolean;
}

export type EmploymentType = 'DEPENDENT' | 'INDEPENDENT' | 'BUSINESS_OWNER' | 'RETIRED';
