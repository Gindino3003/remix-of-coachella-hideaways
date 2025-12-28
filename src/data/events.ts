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


export const getEventCategories = (eventsList: Event[]): string[] => {
  return [...new Set(eventsList.map((e) => e.category))];
};
