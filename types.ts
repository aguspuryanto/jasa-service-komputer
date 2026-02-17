
export type DeviceCategory = 'Laptop' | 'Printer' | 'Komputer';

export type Brand = 'Asus' | 'Lenovo' | 'Acer' | 'HP' | 'Dell' | 'Apple' | 'Other';

export interface ServiceRequest {
  id: string;
  category: DeviceCategory;
  brand: Brand;
  description: string;
  address: string;
  scheduleDate: string;
  scheduleTime: string;
  status: 'pending' | 'matching' | 'confirmed' | 'on_way' | 'working' | 'completed';
  technician?: Technician;
  estimatedCost?: string;
}

export interface Technician {
  id: string;
  name: string;
  rating: number;
  specialization: string[];
  photo: string;
  lat?: number;
  lng?: number;
}

export interface AIAnalysis {
  possibleCause: string;
  estimatedFixTime: string;
  advice: string;
}
