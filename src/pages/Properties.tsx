import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";

const Properties = () => {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
