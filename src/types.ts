export interface ServiceSpec {
  label: string;
  value: string;
}

export interface TechnicalService {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategory: string;
  description: string;
  iconName: string;
  duration: string;
  rating: string;
  price: number;
  warranty: string;
  specifications: ServiceSpec[];
  imageUrl: string;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  brand?: string;
}
