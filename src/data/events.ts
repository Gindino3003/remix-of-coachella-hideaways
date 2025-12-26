export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  link?: string;
}

// Hàm helper này giờ sẽ nhận danh sách sự kiện làm tham số đầu vào
export const getEventCategories = (eventsList: Event[]): string[] => {
  return [...new Set(eventsList.map((e) => e.category))];
};
