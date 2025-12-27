import indianPalmsMain from "@/assets/property-indian-palms-main.jpg";
import desertOasis from "@/assets/property-desert-oasis.jpg";
import desertOasis2 from "@/assets/property-desert-oasis-2.jpg";
import desertOasis3 from "@/assets/property-desert-oasis-3.jpg";
import desertOasis4 from "@/assets/property-desert-oasis-4.jpg";
import desertOasis5 from "@/assets/property-desert-oasis-5.jpg";
import palmSprings from "@/assets/property-palm-springs.jpg";
import coachellaRanch from "@/assets/property-coachella-ranch.jpg";
import laQuinta from "@/assets/property-la-quinta.jpg";
import ranchoMirage from "@/assets/property-rancho-mirage.jpg";

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
  amenities: string[];
  houseRules: string[];
  images: string[];
  featured: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
  cleaningFee: string;
}
