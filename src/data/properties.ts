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
}

export const properties: Property[] = [
  {
    id: "desert-oasis-villa",
    name: "Indian Palms Desert Retreat",
    tagline: "Golf course oasis near Coachella & Stagecoach",
    description: "Welcome to the perfect desert retreat, nestled alongside a lush golf course within the Indian Palms Country Club. This spacious 4-bedroom, 2.5-bathroom oasis is tailor-made for your desert escape. Only 2 miles away from the valley's top attractions, including the renowned Coachella and Stagecoach Music Festivals, and just minutes from the Indian Wells Tennis Gardens.\n\nStep into a backyard oasis complete with a fenced pool and spa, comfy lounge chairs, plush beach towels, pool floaties, and a covered patio boasting a dining table for 8 and a refreshing water misting system. Enjoy a gas grill, hammock, lawn games, an entry courtyard with a lemon tree, and stunning Indian Palms Country Club golf course views.\n\nInside, discover an open floor plan with 2,375 sq ft of living space, a sunroom lounge area, a stylish retro 8-person dining table, and mid-century furniture. The fully equipped kitchen features a large center island, ample cabinet space, cooking appliances, drip coffee maker, popcorn machine, and a 3-person breakfast bar.\n\nWhether you're here for festivals, golf, or simply a tranquil desert getaway, this California desert home has all the ingredients for an unforgettable stay in Indio. And yes, we warmly welcome your furry friends!",
    location: "Indio, CA",
    bedrooms: 4,
    bathrooms: 2.5,
    maxGuests: 12,
    pricePerNight: 495,
    rating: 4.97,
    reviews: 128,
    amenities: [
      "Private Heated Pool & Spa",
      "Golf Course Views",
      "2,375 Sq Ft Living Space",
      "Keyless Entry",
      "Step-Free Access",
      "5 Smart TVs",
      "Pool Table",
      "Smart Speaker",
      "High-Speed WiFi",
      "Gas Grill & Outdoor Kitchen",
      "Covered Patio with Misting System",
      "Outdoor Dining for 8",
      "Hammock & Lawn Games",
      "Lounge Chairs & Pool Floaties",
      "Washer & Dryer",
      "Air Conditioning & Ceiling Fans",
      "Garage Parking (2 vehicles)",
      "Driveway Parking (2 vehicles)",
      "Mid-Century Furniture",
      "Complimentary Toiletries",
      "Quality Linens & Towels"
    ],
    houseRules: [
      "Check-in after 4:00 PM",
      "Check-out by 11:00 AM",
      "Pets welcome ($100 fee for first 2 pets, $100 for 3rd pet)",
      "Pool heating available ($60/day)",
      "Spa heating available ($30/day)",
      "No smoking on premises",
      "No parties or events",
      "Maximum 12 guests",
      "Quiet hours: 10 PM - 8 AM",
      "Stay 4+ nights for additional discounts"
    ],
    images: [indianPalmsMain, desertOasis, desertOasis2, desertOasis3, desertOasis4, desertOasis5],
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
