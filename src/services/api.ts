import axios from 'axios';


const API_BASE_URL = 'https://tamlinhaz.xyz/upwork/api';


export interface ApiProperty {
    propId: string;
    propKey: string;
    name: string;
    address: string;
    city: string;
    state: string;
    latitude: string;
    longitude: string;
    maxPeople: string;
    cover_image: string | null;
    star_rating: number;
    reviews_count: number;
    bedrooms: number;
    bathrooms: number;
    display_price: string;
    description: string;
}

export interface ApiResponse {
    status: string;
    total: number;
    data: ApiProperty[];
}


export interface ApiPropertyDetail {
    name: string;
    propId: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    latitude: string;
    longitude: string;
    phone: string;
    email: string;
    roomTypes: Array<{
        name: string;
        qty: string;
        roomId: string;
        maxPeople: string;
        minStay: string;
        maxStay: string;
        rackRate: string;
        cleaningFee: string;
        securityDeposit: string;
    }>;
    images: string[];
    description: string;
    amenities: string[];
    house_rules: string;
    star_rating: number;
    reviews_count: number;
    bedrooms: number;
    bathrooms: number;
    maxPeople: string;
    display_price: string;
}


export interface NewApiImage {
    url: string;
    caption: {
        EN: string;
    };
    map: Array<{
        propId: string;
        position: string;
    }>;
}

export interface NewApiRoomInfo {
    roomId: string;
    name: string;
    featureCodes: string[][];
    rackRate: string;
    cleaningFee: string;
    securityDeposit: string;
    texts: {
        displayName: { EN: string };
        roomDescription1: { EN: string };
        contentDescriptionText: { EN: string };
    };
}

export interface NewApiPropertyContent {
    propId: string;
    name: string;
    checkInStartHour: string;
    checkOutEndHour: string;
    images: {
        external: Record<string, NewApiImage>;
    };
    texts: {
        houseRules: { EN: string };
        generalPolicy: { EN: string };
        directions: { EN: string };
    };
    roomIds: Record<string, NewApiRoomInfo>;
    bookingData?: {
        upsell?: Record<string, {
            type: string;
            price: string;
            unit: string;
            period: string;
            vat: string;
            image: string;
            description: {
                EN: string;
                VI: string;
            };
        }>;
    };
}

export interface NewApiPropertyContentResponse {
    getPropertyContent: NewApiPropertyContent[];
}

export interface ApiPropertyDetailResponse {
    status: string;
    data: ApiPropertyDetail;
}


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const fetchProperties = async (): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get<ApiResponse>('https://joincomvoca.com/panel/public_api.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};


export const fetchPropertyById = async (id: string): Promise<NewApiPropertyContentResponse> => {
    try {

        const response = await apiClient.get<NewApiPropertyContentResponse>('https://tamlinhaz.xyz/upwork/api/getPropertyContent.php', {
            params: { propKey: id }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching property ${id}:`, error);
        throw error;
    }
};


export const convertApiPropertyToProperty = (apiProp: ApiProperty): any => {

    const priceMatch = apiProp.display_price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;


    const imageUrl = apiProp.cover_image
        ? `${API_BASE_URL}/${apiProp.cover_image}`
        : null;

    return {
        id: apiProp.propKey,
        name: apiProp.name,
        tagline: `${apiProp.city}, ${apiProp.state}`,
        description: apiProp.description,
        location: `${apiProp.city}, ${apiProp.state}`,
        city: apiProp.city,
        state: apiProp.state,
        bedrooms: apiProp.bedrooms,
        bathrooms: apiProp.bathrooms,
        maxGuests: parseInt(apiProp.maxPeople),
        pricePerNight: price,
        rating: apiProp.star_rating,
        reviews: apiProp.reviews_count,
        amenities: [],
        houseRules: [],
        images: imageUrl ? [imageUrl] : [],
        featured: false,
        address: apiProp.address,
        latitude: parseFloat(apiProp.latitude),
        longitude: parseFloat(apiProp.longitude),
        propKey: apiProp.propKey,
    };
};


export const convertApiPropertyDetailToProperty = (response: NewApiPropertyContentResponse, city?: string, state?: string, propkey?: string): any => {
    if (!response.getPropertyContent || response.getPropertyContent.length === 0) {
        throw new Error('No property content found');
    }

    const apiProp = response.getPropertyContent[0];


    const roomIds = Object.values(apiProp.roomIds);
    const firstRoom: NewApiRoomInfo | undefined = roomIds[0];


    const price = firstRoom?.rackRate ? parseFloat(firstRoom.rackRate) : 0;


    const images: string[] = [];
    if (apiProp.images && apiProp.images.external) {
        Object.values(apiProp.images.external).forEach((img: NewApiImage) => {
            if (img.url && img.url.trim()) {
                images.push(img.url);
            }
        });
    }


    const amenities: string[] = [];
    const groupedAmenities: Record<string, string[]> = {
        "Internet": [],
        "Kitchen": [],
        "Entertainment": [],
        "Pool and Wellness": [],
        "Business": [],
        "Food and Drink": [],
        "Location": [],
        "Pets": [],
        "Services": [],
        "Sports": [],
        "Suitability": [],
        "Amenities": []
    };

    const groupMapping: Record<string, string> = {

        "WIFI": "Internet", "INTERNET": "Internet", "HIGH_SPEED_INTERNET": "Internet", "WIFI_POCKET": "Internet",

        "KITCHEN": "Kitchen", "OVEN": "Kitchen", "STOVE": "Kitchen", "MICROWAVE": "Kitchen", "REFRIGERATOR": "Kitchen",
        "DISHWASHER": "Kitchen", "COFFEE_MAKER": "Kitchen", "COOKWARE": "Kitchen", "DISHES": "Kitchen",
        "UTENSILS": "Kitchen", "TOASTER": "Kitchen", "GRILL": "Kitchen", "BBQ_GRILL": "Kitchen", "KITCHENETTE": "Kitchen",
        "COFFEE_MACHINE": "Kitchen", "KETTLE": "Kitchen", "ELECTRIC_KETTLE": "Kitchen",

        "TV": "Entertainment", "SMART_TV": "Entertainment", "CABLE_TV": "Entertainment", "STREAMING": "Entertainment",
        "GAMES": "Entertainment", "FOOSBALL": "Entertainment", "BILLIARD": "Entertainment", "PING_PONG": "Entertainment",
        "BOARD_GAMES": "Entertainment", "DVD": "Entertainment", "MUSIC_PLAYER": "Entertainment", "STEREO": "Entertainment",
        "RADIO": "Entertainment", "NETFLIX": "Entertainment", "PLAYSTATION": "Entertainment", "XBOX": "Entertainment",
        "MOVIE_LIBRARY": "Entertainment", "VIDEO_GAMES": "Entertainment",

        "POOL": "Pool and Wellness", "SWIMMING_POOL": "Pool and Wellness", "HOT_TUB": "Pool and Wellness",
        "JACUZZI": "Pool and Wellness", "SPA": "Pool and Wellness", "GYM": "Pool and Wellness", "FITNESS_CENTER": "Pool and Wellness",
        "SAUNA": "Pool and Wellness", "STEAM_ROOM": "Pool and Wellness", "MASSAGE": "Pool and Wellness",

        "WORKSPACE": "Business", "DESK": "Business", "OFFICE_CHAIR": "Business", "PRINTER": "Business", "COMPUTER": "Business",
        "BUSINESS_CENTER": "Business", "MEETING_ROOM": "Business", "FAX": "Business",

        "DINING_TABLE": "Food and Drink", "BARBEQUE": "Food and Drink", "BREAKFAST": "Food and Drink", "COFFEE": "Food and Drink",
        "TEA": "Food and Drink", "RESTAURANT": "Food and Drink", "BAR": "Food and Drink", "MINIBAR": "Food and Drink",
        "WINE_CHILLER": "Food and Drink", "BREAKFAST_INCLUDED": "Food and Drink",

        "BEACHFRONT": "Location", "MOUNTAIN_VIEW": "Location", "LAKEFRONT": "Location", "CITY_CENTER": "Location", "RURAL": "Location",
        "WATERFRONT": "Location", "OCEAN_VIEW": "Location", "GARDEN_VIEW": "Location", "POOL_VIEW": "Location",

        "PETS_ALLOWED": "Pets", "DOG_FRIENDLY": "Pets", "PETS_STAY_FREE": "Pets",

        "CLEANING": "Services", "CONCIERGE": "Services", "LAUNDRY": "Services", "DRYING": "Services", "IRONING": "Services",
        "PARKING": "Services", "FREE_PARKING": "Services", "AIR_CONDITIONING": "Services", "HEATING": "Services",
        "ELEVATOR": "Services", "LIFT": "Services", "SECURITY": "Services", "SHUTTLE": "Services", "VALET_PARKING": "Services",
        "WASHING_MACHINE": "Services", "CLOTHES_DRYER": "Services",

        "TENNIS": "Sports", "GOLF": "Sports", "BASKETBALL": "Sports", "BIKES": "Sports", "HIKING": "Sports", "FISHING": "Sports",
        "WATER_SPORTS": "Sports", "GOLF_COURSE": "Sports", "TENNIS_COURT": "Sports", "BIKE_RENTAL": "Sports",

        "ACCESSIBILITY": "Suitability", "WHEELCHAIR": "Suitability", "CHILD_FRIENDLY": "Suitability",
        "SENIOR_FRIENDLY": "Suitability", "SMOKING_ALLOWED": "Suitability", "NON_SMOKING_ONLY": "Suitability",
        "FAMILY_FRIENDLY": "Suitability", "WHEELCHAIR_ACCESSIBLE": "Suitability",
    };

    if (firstRoom?.featureCodes && Array.isArray(firstRoom.featureCodes)) {
        firstRoom.featureCodes.forEach((code: string[]) => {
            if (code && code.length > 0) {
                const rawCode = code[0].toUpperCase();
                const amenityText = code[0]
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                amenities.push(amenityText);


                let group = groupMapping[rawCode];
                if (!group) {

                    if (rawCode.includes("WIFI") || rawCode.includes("INTERNET")) group = "Internet";
                    else if (rawCode.includes("KITCHEN") || rawCode.includes("COOK") || rawCode.includes("OVEN") || rawCode.includes("FRIDGE") || rawCode.includes("REFRIGERATOR")) group = "Kitchen";
                    else if (rawCode.includes("TV") || rawCode.includes("DVD") || rawCode.includes("GAME") || rawCode.includes("ENTERTAINMENT")) group = "Entertainment";
                    else if (rawCode.includes("POOL") || rawCode.includes("SPA") || rawCode.includes("GYM") || rawCode.includes("FITNESS") || rawCode.includes("HUB")) group = "Pool and Wellness";
                    else if (rawCode.includes("DESK") || rawCode.includes("BUSINESS") || rawCode.includes("OFFICE")) group = "Business";
                    else if (rawCode.includes("PET")) group = "Pets";
                    else if (rawCode.includes("VIEW") || rawCode.includes("LOCATION")) group = "Location";
                    else if (rawCode.includes("SPORT") || rawCode.includes("GOLF") || rawCode.includes("TENNIS")) group = "Sports";
                    else if (rawCode.includes("WHEELCHAIR") || rawCode.includes("ACCESSIBLE") || rawCode.includes("FRIENDLY")) group = "Suitability";
                    else if (rawCode.includes("CLEAN") || rawCode.includes("PARKING") || rawCode.includes("AC_") || rawCode.includes("AIR_CONDITION") || rawCode.includes("HEATING") || rawCode.includes("WASHER") || rawCode.includes("DRYER")) group = "Services";
                    else group = "Amenities";
                }

                if (!groupedAmenities[group]) {
                    groupedAmenities[group] = [];
                }
                groupedAmenities[group].push(amenityText);
            }
        });
    }


    Object.keys(groupedAmenities).forEach(key => {
        if (groupedAmenities[key].length === 0) {
            delete groupedAmenities[key];
        }
    });


    const houseRules: string[] = [];
    if (apiProp.texts?.generalPolicy?.EN) {
        const policies = apiProp.texts.generalPolicy.EN.split('\n').filter(rule => rule.trim());
        houseRules.push(...policies);
    }
    if (apiProp.texts?.houseRules?.EN) {
        const rules = apiProp.texts.houseRules.EN.split('\n').filter(rule => rule.trim());
        houseRules.push(...rules);
    }


    const description = firstRoom?.texts?.contentDescriptionText?.EN ||
        firstRoom?.texts?.roomDescription1?.EN ||
        'No description available';


    let bedrooms = 0;
    let bathrooms = 0;
    if (firstRoom?.featureCodes) {
        firstRoom.featureCodes.forEach((code: string[]) => {
            if (code.some((item) => item === 'BEDROOM')) bedrooms++;
            if (code.some((item) => item === 'BATHROOM_FULL')) bathrooms++;
            if (code.some((item) => item === 'BATHROOM_HALF')) bathrooms += 0.5;
        });
    }


    const checkInTime = apiProp.checkInStartHour ? `${apiProp.checkInStartHour}:00` : '15:00';
    const checkOutTime = apiProp.checkOutEndHour ? `${apiProp.checkOutEndHour}:00` : '11:00';

    return {
        id: apiProp.propId,
        propKey: propkey,
        roomId: firstRoom?.roomId || '',
        name: apiProp.name || firstRoom?.name || '',
        tagline: firstRoom?.texts?.displayName?.EN || apiProp.name,
        description: description,
        location: city && state ? `${city}, ${state}` : '',
        city: city,
        state: state,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        maxGuests: 12,
        pricePerNight: price,
        rating: 5,
        reviews: 0,
        amenities: amenities,
        groupedAmenities: groupedAmenities,
        houseRules: houseRules,
        images: images,
        featured: false,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        directions: apiProp.texts?.directions?.EN || '',
        cleaningFee: apiProp.roomIds?.[0]?.cleaningFee || 0,
        upsells: apiProp.bookingData?.upsell ? Object.entries(apiProp.bookingData.upsell)
            .filter(([, item]) => item.type !== "0")
            .map(([id, item]) => {
                if (!item.type) return null;
                return {
                    id,
                    type: item?.type?.toString(),
                    price: parseFloat(item.price),
                    unit: item.unit,
                    period: item.period,
                    description: item.description || { EN: "", VI: "" }
                }
            }).filter(Boolean) : [],
    };
};
