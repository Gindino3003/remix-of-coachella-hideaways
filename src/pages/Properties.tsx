import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Property } from "@/data/properties";
import { fetchProperties, convertApiPropertyToProperty } from "@/services/api";

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProperties();

        // Chuyển đổi data từ API sang format của app
        const convertedProperties = response.data.map(convertApiPropertyToProperty);
        setProperties(convertedProperties);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
        setError('Unable to load the property list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 gradient-sand">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-foreground mb-6 opacity-0 animate-fade-in-up">
              Our Properties
            </h1>
            <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-up animation-delay-100">
              Discover our collection of luxury vacation rentals across Coachella
              Valley. Each property offers unique experiences and world-class
              amenities.
            </p>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                <p className="text-muted-foreground">Loading properties...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <p className="text-destructive mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-muted-foreground text-lg">Không có properties nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  delay={index * 100}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
