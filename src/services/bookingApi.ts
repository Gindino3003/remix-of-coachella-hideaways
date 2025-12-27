import axios from 'axios';

// API: https://joincomvoca.com/panel/getBooking.php?propKey=A9F3K7M2Q8X4L6ZB&roomId=637297&from=20251227&to=20251227

export interface DailyBookingData {
    i: number;  // 1 = available, 0 = unavailable
    p1: string; // price
    m: string;  // minimum stay
}

export interface BookingResponse {
    [date: string]: DailyBookingData;
}

/**
 * Fetch availability and pricing from the booking API
 * @param propKey Property key
 * @param roomId Room ID
 * @param from Check-in date (YYYYMMDD)
 * @param to Check-out date (YYYYMMDD)
 */
export const fetchBookingData = async (
    propKey: string,
    roomId: string,
    from: string,
    to: string
): Promise<BookingResponse> => {
    try {
        const response = await axios.get<BookingResponse>(
            'https://joincomvoca.com/panel/getBooking.php',
            {
                params: {
                    propKey,
                    roomId,
                    from,
                    to,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching booking data:', error);
        throw error;
    }
};

/**
 * Helper to format date as YYYYMMDD
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
};

/**
 * Helper to format string date (YYYY-MM-DD) as YYYYMMDD
 */
export const formatStringDateToYYYYMMDD = (dateStr: string): string => {
    return dateStr.replace(/-/g, '');
};
