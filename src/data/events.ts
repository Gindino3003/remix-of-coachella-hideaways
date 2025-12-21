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

export const events: Event[] = [
  {
    id: "coachella-2025",
    title: "Coachella Valley Music and Arts Festival",
    description: "The world-renowned music and arts festival featuring top artists across multiple stages, immersive art installations, and unforgettable experiences in the desert.",
    date: "April 11-13 & 18-20, 2025",
    time: "All Day",
    location: "Empire Polo Club, Indio",
    category: "Music Festival",
    link: "https://www.coachella.com"
  },
  {
    id: "stagecoach-2025",
    title: "Stagecoach Country Music Festival",
    description: "The largest country music festival on the West Coast, featuring legendary headliners and rising stars in country, Americana, and roots music.",
    date: "April 25-27, 2025",
    time: "All Day",
    location: "Empire Polo Club, Indio",
    category: "Music Festival",
    link: "https://www.stagecoachfestival.com"
  },
  {
    id: "palm-springs-film",
    title: "Palm Springs International Film Festival",
    description: "One of the largest film festivals in North America, showcasing international films and honoring the year's top filmmakers and actors.",
    date: "January 2-13, 2025",
    time: "Various",
    location: "Palm Springs",
    category: "Film & Arts",
    link: "https://www.psfilmfest.org"
  },
  {
    id: "modernism-week",
    title: "Modernism Week",
    description: "A celebration of midcentury modern design, architecture, art, and culture featuring tours, lectures, films, and special events throughout Palm Springs.",
    date: "February 13-23, 2025",
    time: "Various",
    location: "Palm Springs",
    category: "Architecture & Design"
  },
  {
    id: "bnp-paribas",
    title: "BNP Paribas Open",
    description: "The fifth largest tennis tournament in the world, featuring the top ATP and WTA players competing in the beautiful desert setting.",
    date: "March 3-16, 2025",
    time: "10:00 AM - 10:00 PM",
    location: "Indian Wells Tennis Garden",
    category: "Sports"
  },
  {
    id: "joshua-tree-hiking",
    title: "Joshua Tree National Park",
    description: "Explore the unique desert landscape of Joshua Tree with hiking trails, rock climbing, stargazing, and the iconic Joshua Trees.",
    date: "Year-round",
    time: "Sunrise to Sunset",
    location: "Joshua Tree, CA",
    category: "Outdoor Activities"
  },
  {
    id: "palm-springs-tram",
    title: "Palm Springs Aerial Tramway",
    description: "Take a breathtaking ride on the world's largest rotating tramcar to the pristine wilderness of Mt. San Jacinto State Park.",
    date: "Year-round",
    time: "10:00 AM - 8:00 PM",
    location: "Palm Springs",
    category: "Outdoor Activities"
  },
  {
    id: "living-desert",
    title: "The Living Desert Zoo & Gardens",
    description: "Explore this unique zoo and botanical garden featuring animals and plants of the world's deserts across 1,200 acres.",
    date: "Year-round",
    time: "9:00 AM - 5:00 PM",
    location: "Palm Desert",
    category: "Family Activities"
  },
  {
    id: "villagefest",
    title: "Palm Springs VillageFest",
    description: "Weekly street fair featuring local artisans, food vendors, live entertainment, and a festive atmosphere on Palm Canyon Drive.",
    date: "Every Thursday",
    time: "6:00 PM - 10:00 PM",
    location: "Downtown Palm Springs",
    category: "Local Culture"
  },
  {
    id: "hot-air-balloon",
    title: "Hot Air Balloon Rides",
    description: "Soar above the Coachella Valley at sunrise for spectacular views of the desert landscape and surrounding mountains.",
    date: "Year-round",
    time: "Sunrise departures",
    location: "Various locations",
    category: "Outdoor Activities"
  },
  {
    id: "spa-resorts",
    title: "Desert Spa Experiences",
    description: "Indulge in world-class spa treatments at luxury resorts throughout the valley, featuring natural mineral springs and desert-inspired therapies.",
    date: "Year-round",
    time: "Various",
    location: "Various locations",
    category: "Wellness"
  },
  {
    id: "golf-courses",
    title: "Championship Golf",
    description: "Play on over 100 championship golf courses designed by legends like Arnold Palmer and Jack Nicklaus, set against stunning mountain backdrops.",
    date: "Year-round",
    time: "Dawn to Dusk",
    location: "Throughout the Valley",
    category: "Sports"
  }
];

export const getEventCategories = (): string[] => {
  return [...new Set(events.map(e => e.category))];
};

export const getEventsByCategory = (category: string): Event[] => {
  return events.filter(e => e.category === category);
};
