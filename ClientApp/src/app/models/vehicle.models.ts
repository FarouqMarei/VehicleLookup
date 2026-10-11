export interface Make {
  make_ID: number;
  make_Name: string;
}

export interface VehicleType {
  vehicleTypeId: number;
  vehicleTypeName: string;
}

export interface VehicleModel {
  make_ID: number;
  make_Name: string;
  model_ID: number;
  model_Name: string;
}
