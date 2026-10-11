import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Make, VehicleModel, VehicleType } from '../models/vehicle.models';

@Injectable({ providedIn: 'root' })
export class VehicleApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/vehicles';

  getMakes() {
    return this.http.get<Make[]>(`${this.baseUrl}/makes`);
  }

  getTypesForMake(makeId: number) {
    return this.http.get<VehicleType[]>(`${this.baseUrl}/types/${makeId}`);
  }

  getModels(makeId: number, year: number, vehicleType: string) {
    const params = new HttpParams()
      .set('makeId', makeId)
      .set('year', year)
      .set('vehicleType', vehicleType);

    return this.http.get<VehicleModel[]>(`${this.baseUrl}/models`, { params });
  }
}
