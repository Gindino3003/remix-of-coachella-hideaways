import axios from 'axios';



export interface DailyBookingData {
    i: number;
    p1: string;
    m: string;
}

export interface BookingResponse {
    [date: string]: DailyBookingData;
}


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


export const formatDateToYYYYMMDD = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
};


export const formatStringDateToYYYYMMDD = (dateStr: string): string => {
    return dateStr.replace(/-/g, '');
};
