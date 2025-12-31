export interface UpsellItem {
  id: string;
  type: string;
  price: number;
  unit: string;
  period: string;
  description: {
    EN: string;
    VI: string;
  };
}

export interface Property {
  id: string;
  name: string;
  tagline: string;
  description: string;
  location: string;
  propKey?: string;
  roomId?: string;
  city?: string;
  state?: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  rating: number;
  reviews: number;
  
  // Cấu trúc Amenities mới
  amenities?: {
    icon: string;
    title: string;
    items: string[];
  }[];
  
  // Các trường cũ giữ lại để tương thích
  groupedAmenities?: Record<string, string[]>;
  amenitiesList?: string[];
  houseRules: string[];
  images: string[];
  featured: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  cleaningFee: string;
  upsells?: UpsellItem[];
  checkInTime?: string;
  checkOutTime?: string;
  directions?: string;
}