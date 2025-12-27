import axios from 'axios';

// API Base URL - đọc từ environment variable hoặc sử dụng giá trị mặc định
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tamlinhaz.xyz/upwork/api';

// Interface cho API response
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

// Interface cho property detail response (old API - not used now)
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

// New API interfaces for getPropertyContent endpoint
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
}

export interface NewApiPropertyContentResponse {
    getPropertyContent: NewApiPropertyContent[];
}

export interface ApiPropertyDetailResponse {
    status: string;
    data: ApiPropertyDetail;
}

// Axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch all properties
export const fetchProperties = async (): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get<ApiResponse>('https://joincomvoca.com/panel/public_api.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching properties:', error);
        throw error;
    }
};

// Fetch property detail using new API endpoint
export const fetchPropertyById = async (id: string): Promise<NewApiPropertyContentResponse> => {
    try {
        // Use the new API endpoint
        const response = await apiClient.get<NewApiPropertyContentResponse>('https://tamlinhaz.xyz/upwork/api/getPropertyContent.php', {
            params: { propKey: id }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching property ${id}:`, error);
        throw error;
    }
};

// Helper function to convert API property to app property format (for list)
export const convertApiPropertyToProperty = (apiProp: ApiProperty): any => {
    // Chuyển đổi display_price từ "$225" thành số 225
    const priceMatch = apiProp.display_price.match(/\d+/);
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;

    // Xử lý cover_image URL
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

// Helper function to convert new API property content to app property format
export const convertApiPropertyDetailToProperty = (response: NewApiPropertyContentResponse, city?: string, state?: string, propkey?: string): any => {
    if (!response.getPropertyContent || response.getPropertyContent.length === 0) {
        throw new Error('No property content found');
    }

    const apiProp = response.getPropertyContent[0];

    // Extract room info (usually first room)
    const roomIds = Object.values(apiProp.roomIds);
    const firstRoom: NewApiRoomInfo | undefined = roomIds[0];

    // Chuyển đổi rackRate từ "500.00" thành số 500
    const price = firstRoom?.rackRate ? parseFloat(firstRoom.rackRate) : 0;

    // Xử lý images - lấy từ external images và filter empty URLs
    const images: string[] = [];
    if (apiProp.images && apiProp.images.external) {
        Object.values(apiProp.images.external).forEach((img: NewApiImage) => {
            if (img.url && img.url.trim()) {
                images.push(img.url);
            }
        });
    }

    // Xử lý amenities - convert feature codes thành readable amenities
    const amenities: string[] = [];
    if (firstRoom?.featureCodes && Array.isArray(firstRoom.featureCodes)) {
        firstRoom.featureCodes.forEach((code: string[]) => {
            if (code && code.length > 0) {
                // Convert code như "WIFI" thành "Wi-Fi"
                const amenityText = code[0]
                    .replace(/_/g, ' ')
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                amenities.push(amenityText);
            }
        });
    }

    // Xử lý house rules - combine generalPolicy và houseRules
    const houseRules: string[] = [];
    if (apiProp.texts?.generalPolicy?.EN) {
        const policies = apiProp.texts.generalPolicy.EN.split('\n').filter(rule => rule.trim());
        houseRules.push(...policies);
    }
    if (apiProp.texts?.houseRules?.EN) {
        const rules = apiProp.texts.houseRules.EN.split('\n').filter(rule => rule.trim());
        houseRules.push(...rules);
    }

    // Extract description từ room texts
    const description = firstRoom?.texts?.contentDescriptionText?.EN ||
        firstRoom?.texts?.roomDescription1?.EN ||
        'No description available';

    // Extract bedrooms/bathrooms count từ feature codes
    let bedrooms = 0;
    let bathrooms = 0;
    if (firstRoom?.featureCodes) {
        firstRoom.featureCodes.forEach((code: string[]) => {
            if (code.some((item) => item === 'BEDROOM')) bedrooms++;
            if (code.some((item) => item === 'BATHROOM_FULL')) bathrooms++;
            if (code.some((item) => item === 'BATHROOM_HALF')) bathrooms += 0.5;
        });
    }

    // Extract check-in/check-out times
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
        houseRules: houseRules,
        images: images,
        featured: false,
        checkInTime: checkInTime,
        checkOutTime: checkOutTime,
        directions: apiProp.texts?.directions?.EN || '',
        cleaningFee: apiProp.roomIds?.[0]?.cleaningFee || 0,
    };
};
