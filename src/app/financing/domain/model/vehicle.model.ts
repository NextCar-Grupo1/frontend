export type VehicleStatus = 'Disponible' | 'Reservado' | 'No disponible';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  currency: 'PEN' | 'USD';
  fuelType: 'Gasolina' | 'Hibrido' | 'Electrico';
  status: VehicleStatus;
  imageUrl: string;
}
