import axios from 'axios';
import { Property, UpsellItem } from '../data/properties';

const API_BASE_URL = 'https://tamlinhaz.xyz/upwork/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface NewApiPropertyContentResponse {
    getPropertyContent: any[];
}

export interface ApiResponse {
    status: string;
    total: number;
    data: any[];
}

export const fetchProperties = async (): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get<ApiResponse>('https://tamlinhaz.xyz/upwork/api/demo.php');
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

export const convertApiPropertyToProperty = (apiProp: any): any => {
    const priceMatch = apiProp.display_price ? apiProp.display_price.match(/\d+/) : null;
    const price = priceMatch ? parseInt(priceMatch[0]) : 0;
    const imageUrl = apiProp.cover_image ? `${apiProp.cover_image}` : null;

    return {
        id: apiProp.propKey,
        name: apiProp.name,
        tagline: `${apiProp.city}, ${apiProp.state}`,
        description: apiProp.description,
        location: `${apiProp.city}, ${apiProp.state}`,
        city: apiProp.city,
        state: apiProp.state,
        bedrooms: parseInt(apiProp.bedrooms),
        bathrooms: parseInt(apiProp.bathrooms),
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

export const convertApiPropertyDetailToProperty = (
    response: NewApiPropertyContentResponse, 
    city?: string, 
    state?: string, 
    propkey?: string
): Property => {
    if (!response.getPropertyContent || response.getPropertyContent.length === 0) {
        throw new Error('No property content found');
    }

    const apiProp = response.getPropertyContent[0];
    const roomIds = apiProp.roomIds ? Object.values(apiProp.roomIds) : [];
    const firstRoom: any = roomIds.length > 0 ? roomIds[0] : {};
    
    // Xử lý giá
    const price = apiProp.pricePerNight 
        ? parseFloat(apiProp.pricePerNight) 
        : (firstRoom?.rackRate ? parseFloat(firstRoom.rackRate) : 0);

    // Xử lý ảnh
    const images: string[] = [];
    if (apiProp.images && apiProp.images.external) {
        Object.values(apiProp.images.external).forEach((img: any) => {
            if (img.url && img.url.trim()) {
                images.push(img.url);
            }
        });
    }

    // Xử lý Amenities (Lấy trực tiếp từ JSON mới)
    const structuredAmenities = Array.isArray(apiProp.amenities) ? apiProp.amenities : [];

    // Xử lý House Rules
    const houseRules: string[] = [];
    if (Array.isArray(apiProp.houseRules)) {
        houseRules.push(...apiProp.houseRules);
    } else if (apiProp.texts?.houseRules?.EN) {
         houseRules.push(...apiProp.texts.houseRules.EN.split('\n').filter((r: string) => r.trim()));
    }

    // Xử lý Upsells
    const upsells: UpsellItem[] = apiProp.bookingData?.upsell 
        ? Object.entries(apiProp.bookingData.upsell)
            .filter(([, item]: [string, any]) => item.type !== "0")
            .map(([id, item]: [string, any]) => {
                if (!item.type) return null;
                return {
                    id,
                    type: item?.type?.toString(),
                    price: parseFloat(item.price),
                    unit: item.unit,
                    period: item.period,
                    description: item.description || { EN: "", VI: "" }
                } as UpsellItem;
            }).filter((item): item is UpsellItem => item !== null) 
        : [];

    // Description
    const description = apiProp.description || 
                        firstRoom?.texts?.contentDescriptionText?.EN || 
                        firstRoom?.texts?.roomDescription1?.EN || '';

    return {
        id: apiProp.propId || apiProp.id || '',
        propKey: propkey,
        roomId: firstRoom?.roomId || '',
        name: apiProp.name || '',
        tagline: apiProp.tagline || firstRoom?.texts?.displayName?.EN || '',
        description: description,
        
        location: apiProp.location || (city && state ? `${city}, ${state}` : ''),
        city: city || apiProp.city,
        state: state || apiProp.state,
        address: apiProp.address,
        
        bedrooms: Number(apiProp.bedrooms) || 0,
        bathrooms: Number(apiProp.bathrooms) || 0,
        maxGuests: Number(apiProp.maxGuests) || 0,
        pricePerNight: price,
        rating: Number(apiProp.rating) || 0,
        reviews: Number(apiProp.reviews) || 0,
        featured: !!apiProp.featured,
        
        amenities: structuredAmenities,
        
        houseRules: houseRules,
        images: images,
        
        cleaningFee: apiProp.cleaningFee || firstRoom?.cleaningFee || '0',
        checkInTime: apiProp.checkInStartHour ? `${apiProp.checkInStartHour}:00` : '16:00',
        checkOutTime: apiProp.checkOutEndHour ? `${apiProp.checkOutEndHour}:00` : '11:00',
        directions: apiProp.texts?.directions?.EN || '',
        upsells: upsells,
    };
};