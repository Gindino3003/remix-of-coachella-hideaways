// src/pages/Events.tsx
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";

// --- SỬA LỖI 1: Thêm chữ 's' vào tên file (events) ---
// Máy tính bạn đang lưu file là events.ts nên phải import đúng tên
import { Event, getEventCategories } from "@/data/events"; 

import { cn } from "@/lib/utils";

const Events = () => {
  // Khai báo state
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Gọi API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://joincomvoca.com/panel/event/api/manager.php");
        
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        
        // Xử lý dữ liệu trả về từ API
        if (Array.isArray(data)) {
           setEvents(data);
        } else if (data && data.data && Array.isArray(data.data)) {
           setEvents(data.data);
        } else {
           setEvents([]);
        }
      } catch (err) {
        console.error("Lỗi:", err);
        setError("Không thể tải danh sách sự kiện.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Tính toán category
  const categories = events.length > 0 ? getEventCategories(events) : [];

  // Lọc sự kiện
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
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-6">
              Events & Activities
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover the best of Coachella Valley.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      {!isLoading && !error && events.length > 0 && (
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
      )}

      {/* Events Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col justify-center items-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p>Loading...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* --- SỬA LỖI 2: Đã thêm thẻ bao bọc <> </> ở đây --- */}
          {!isLoading && !error && (
            <>
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
            </>
          )}
          {/* -------------------------------------------------- */}
          
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;