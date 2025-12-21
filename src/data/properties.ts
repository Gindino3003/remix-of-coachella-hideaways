import desertOasis from "@/assets/property-desert-oasis.jpg";
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
}

export const properties: Property[] = [
  {
    id: "desert-oasis-villa",
    name: "Desert Oasis Villa",
    tagline: "Luxury retreat with stunning mountain views",
    description: "Experience the ultimate desert escape at our stunning Desert Oasis Villa. This beautifully designed 4-bedroom retreat offers breathtaking views of the Santa Rosa Mountains, a private pool with spa, and world-class amenities. Perfect for families or groups seeking a luxurious Coachella Valley getaway. The open floor plan seamlessly blends indoor and outdoor living, featuring floor-to-ceiling windows that flood the space with natural light. Relax by the fire pit under the stars or enjoy a sunset cocktail on the expansive patio.",
    location: "Palm Desert, CA",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 10,
    pricePerNight: 495,
    rating: 4.97,
    reviews: 128,
    amenities: [
      "Private Pool & Spa",
      "Mountain Views",
      "Outdoor Kitchen & BBQ",
      "Fire Pit",
      "High-Speed WiFi",
      "Smart Home Features",
      "Fully Equipped Kitchen",
      "Washer & Dryer",
      "Air Conditioning",
      "Private Parking",
      "55\" Smart TV",
      "Sonos Sound System",
      "Outdoor Dining Area",
      "Lounge Chairs",
      "Board Games"
    ],
    houseRules: [
      "No smoking on premises",
      "No parties or events",
      "Pets allowed with prior approval ($50 fee)",
      "Check-in after 4:00 PM",
      "Check-out by 11:00 AM",
      "Maximum 10 guests",
      "Quiet hours: 10 PM - 8 AM",
      "No unregistered guests"
    ],
    images: [desertOasis],
    featured: true
  },
  {
    id: "palm-springs-modern",
    name: "Palm Springs Modern",
    tagline: "Mid-century modern masterpiece",
    description: "Step into Palm Springs history at this meticulously restored mid-century modern gem. Originally designed in 1962, this 3-bedroom home perfectly balances vintage charm with contemporary luxury. The iconic butterfly roof, clerestory windows, and terrazzo floors transport you to the golden age of desert modernism. Enjoy the saltwater pool, lush landscaping, and the vibrant downtown Palm Springs scene just minutes away.",
    location: "Palm Springs, CA",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    pricePerNight: 375,
    rating: 4.94,
    reviews: 89,
    amenities: [
      "Saltwater Pool",
      "Mid-Century Architecture",
      "Terrazzo Floors",
      "Mountain Views",
      "High-Speed WiFi",
      "Fully Equipped Kitchen",
      "Washer & Dryer",
      "Air Conditioning",
      "Private Parking",
      "Smart TV",
      "Record Player & Vinyl Collection",
      "Outdoor Shower",
      "Citrus Trees",
      "Walking Distance to Downtown"
    ],
    houseRules: [
      "No smoking on premises",
      "No parties or events",
      "No pets allowed",
      "Check-in after 3:00 PM",
      "Check-out by 10:00 AM",
      "Maximum 6 guests",
      "Quiet hours: 10 PM - 8 AM",
      "Respect the vintage furnishings"
    ],
    images: [palmSprings],
    featured: true
  },
  {
    id: "coachella-ranch-estate",
    name: "Coachella Ranch Estate",
    tagline: "Sprawling estate perfect for groups",
    description: "Welcome to the ultimate group getaway destination! This expansive 5-bedroom ranch estate sits on 2 acres with unobstructed views of the Coachella Valley. Perfect for Coachella and Stagecoach festival-goers or large family gatherings. Features include a resort-style pool, outdoor entertaining areas, a fully equipped game room, and enough space for everyone to spread out and relax.",
    location: "Indio, CA",
    bedrooms: 5,
    bathrooms: 4,
    maxGuests: 14,
    pricePerNight: 695,
    rating: 4.92,
    reviews: 156,
    amenities: [
      "Resort-Style Pool",
      "2-Acre Property",
      "Game Room",
      "Outdoor Kitchen",
      "Fire Pit",
      "High-Speed WiFi",
      "Multiple Living Areas",
      "Washer & Dryer",
      "Air Conditioning",
      "Ample Parking",
      "Pool Table",
      "Ping Pong Table",
      "Basketball Hoop",
      "Horseshoe Pit",
      "10 Minutes to Coachella Grounds"
    ],
    houseRules: [
      "No smoking on premises",
      "Quiet hours strictly enforced",
      "Pets allowed with prior approval ($75 fee)",
      "Check-in after 4:00 PM",
      "Check-out by 11:00 AM",
      "Maximum 14 guests",
      "No unregistered guests during festivals",
      "Parking for 6 vehicles maximum"
    ],
    images: [coachellaRanch],
    featured: true
  },
  {
    id: "la-quinta-hideaway",
    name: "La Quinta Hideaway",
    tagline: "Intimate couples retreat near Old Town",
    description: "Escape to this charming 2-bedroom casita nestled in the heart of La Quinta. Perfect for couples or a small family seeking tranquility and convenience. Walk to the award-winning Old Town La Quinta with its art galleries, boutiques, and restaurants. Return home to your private courtyard, refreshing plunge pool, and the peaceful sounds of the desert evening.",
    location: "La Quinta, CA",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    pricePerNight: 275,
    rating: 4.98,
    reviews: 74,
    amenities: [
      "Private Plunge Pool",
      "Courtyard Garden",
      "Walking Distance to Old Town",
      "Mountain Views",
      "High-Speed WiFi",
      "Gourmet Kitchen",
      "Washer & Dryer",
      "Air Conditioning",
      "Private Parking",
      "Smart TV",
      "Outdoor Dining",
      "Gas Fireplace",
      "Luxury Linens",
      "Coffee & Tea Station"
    ],
    houseRules: [
      "No smoking on premises",
      "No parties or events",
      "No pets allowed",
      "Check-in after 3:00 PM",
      "Check-out by 10:00 AM",
      "Maximum 4 guests",
      "Quiet hours: 9 PM - 8 AM",
      "Adult-only property"
    ],
    images: [laQuinta],
    featured: false
  },
  {
    id: "rancho-mirage-luxury",
    name: "Rancho Mirage Luxury",
    tagline: "Celebrity-worthy retreat with golf course views",
    description: "Live like a star in this stunning 4-bedroom Rancho Mirage estate overlooking the Thunderbird Country Club golf course. This newly renovated property features designer interiors, a chef's kitchen, infinity pool, and unparalleled sunset views. Just minutes from The River shopping and dining district, this home offers the perfect blend of seclusion and accessibility.",
    location: "Rancho Mirage, CA",
    bedrooms: 4,
    bathrooms: 3.5,
    maxGuests: 8,
    pricePerNight: 575,
    rating: 4.95,
    reviews: 62,
    amenities: [
      "Infinity Pool & Spa",
      "Golf Course Views",
      "Designer Interiors",
      "Chef's Kitchen",
      "Wine Fridge",
      "High-Speed WiFi",
      "Smart Home System",
      "Washer & Dryer",
      "Air Conditioning",
      "3-Car Garage",
      "75\" Smart TV",
      "Outdoor Fireplace",
      "BBQ & Outdoor Kitchen",
      "Putting Green",
      "Concierge Services Available"
    ],
    houseRules: [
      "No smoking on premises",
      "No parties or events",
      "No pets allowed",
      "Check-in after 4:00 PM",
      "Check-out by 11:00 AM",
      "Maximum 8 guests",
      "Quiet hours: 10 PM - 8 AM",
      "Golf carts not included"
    ],
    images: [ranchoMirage],
    featured: true
  }
];

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(p => p.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(p => p.featured);
};
