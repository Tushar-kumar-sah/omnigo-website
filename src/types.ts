export type AppRole = 'GUEST' | 'CUSTOMER' | 'PARTNER' | 'ADMIN';

export type ServiceType = 
  | 'TOW_FLATBED'
  | 'TOW_WHEEL_LIFT'
  | 'BATTERY_JUMP'
  | 'EV_CHARGING'
  | 'FLAT_TIRE'
  | 'LOCKOUT'
  | 'FUEL_DELIVERY'
  | 'WINCHING'
  | 'ACCIDENT_RECOVERY'
  | 'BIKE_TRANSPORT'
  | 'FLEET_LOGISTICS';

export interface ServiceItem {
  id: ServiceType;
  title: string;
  description: string;
  basePrice: number;
  perMilePrice: number;
  iconName: string;
  badge?: string;
  popular?: boolean;
}

export interface Booking {
  id: string;
  type: string;
  status: 'SEARCHING_DRIVER' | 'EN_ROUTE' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  pickupLocation: string;
  destination: string;
  customerName: string;
  customerPhone: string;
  vehicleModel?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  licensePlate?: string;
  rating?: number;
  etaMinutes: number;
  lat: number;
  lng: number;
  driverLat: number;
  driverLng: number;
  amount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  createdAt: string;
}

export interface WalletData {
  credits: number;
  currency: string;
  transactions: {
    id: string;
    type: 'TOP_UP' | 'SERVICE' | 'CASHBACK' | 'EARNING';
    amount: number;
    title: string;
    date: string;
  }[];
}

export interface PartnerDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: number;
  totalTrips: number;
  earningsToday: number;
  isOnline: boolean;
  lat: number;
  lng: number;
  status: 'AVAILABLE' | 'ON_JOB' | 'BREAK';
}

export interface SupportTicket {
  id: string;
  customerName: string;
  subject: string;
  category: 'DISPATCH' | 'BILLING' | 'TECHNICAL' | 'EMERGENCY';
  status: 'OPEN' | 'RESOLVED' | 'IN_PROGRESS';
  priority: 'HIGH' | 'URGENT' | 'NORMAL';
  createdAt: string;
}
