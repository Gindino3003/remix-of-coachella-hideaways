import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { events, getEventCategories } from "@/data/events";
import { cn } from "@/lib/utils";

const Events = () => {
  const categories = getEventCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredEvents = selectedCategory
    ? events.filter((e) => e.category === selectedCategory)
    : events;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-sand">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-6 opacity-0 animate-fade-in-up">
              Events & Activities
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-up animation-delay-100">
              Discover the best of Coachella Valley. From world-famous music
              festivals to outdoor adventures and cultural experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-md z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                selectedCategory === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              All Events
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-smooth",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} delay={index * 100} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No events found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
