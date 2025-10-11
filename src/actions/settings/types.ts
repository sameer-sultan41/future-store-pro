export interface CarouselItem {
  id: number;
  link: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export interface AvailableLanguage {
  code: string;
  flag: string;
  name: string;
}

export interface AvailableCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface AvailablePaymentMethod {
  id: string;
  icon: string;
  name: string;
}

export interface AvailableDeliveryDate {
  id: string;
  cost: number;
  days: number;
  name: string;
}

export interface ShippingZone {
  name: string;
  baseCost: number;
  countries: string[];
  freeShippingThreshold: number;
}

export interface SettingsResponse {
  id: string;
  common: {
    taxRate: number;
    pageSize: number;
    defaultColor: string;
    defaultTheme: string;
    isMaintenanceMode: boolean;
    lowStockThreshold: number;
    freeShippingMinPrice: number;
  };
  site: {
    name: string;
    email: string;
    phone: string;
    social: {
      twitter: string;
      facebook: string;
      instagram: string;
    };
    address: string;
    description: string;
  };
  carousels: CarouselItem[];
  available_languages: AvailableLanguage[];
  default_language: string;
  available_currencies: AvailableCurrency[];
  default_currency: string;
  available_payment_methods: AvailablePaymentMethod[];
  default_payment_method: string;
  available_delivery_dates: AvailableDeliveryDate[];
  default_delivery_date: string;
  shipping_zones: {
    domestic: ShippingZone;
    international: ShippingZone;
    [key: string]: ShippingZone;
  };
  created_at: string;
  updated_at: string;
}