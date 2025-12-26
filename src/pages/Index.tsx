import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PropertyCard } from "@/components/PropertyCard";
import { Property } from "@/data/properties";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Star, Clock } from "lucide-react";
import heroImage from "@/assets/property-indian-palms-main.jpg";
import { fetchProperties, convertApiPropertyToProperty } from "@/services/api";

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchProperties();

        // Chuyển đổi data từ API sang format của app và giới hạn chỉ lấy 6 phần tử
        const convertedProperties = response.data
          .map(convertApiPropertyToProperty)
          .slice(0, 6); // Chỉ lấy tối đa 6 properties
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

      {/* Hero Section */}
      <Hero backgroundImage={heroImage} />

      {/* Featured Properties */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hand-picked vacation homes offering the perfect desert getaway
            </p>
          </div>

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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    delay={index * 100}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/properties">
                    View All Properties
                    <ArrowRight size={18} />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-24 gradient-sand">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Why Book Direct?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Skip the middleman and enjoy exclusive benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 rounded-2xl bg-card shadow-soft opacity-0 animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl gradient-sunset flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Best Price Guarantee
              </h3>
              <p className="text-muted-foreground text-sm">
                Book direct and save up to 15% compared to other platforms. No
                hidden fees.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card shadow-soft opacity-0 animate-fade-in-up animation-delay-100">
              <div className="w-16 h-16 rounded-2xl gradient-sunset flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Personal Service
              </h3>
              <p className="text-muted-foreground text-sm">
                Direct communication with property owners for personalized
                recommendations.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-card shadow-soft opacity-0 animate-fade-in-up animation-delay-200">
              <div className="w-16 h-16 rounded-2xl gradient-sunset flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                Flexible Booking
              </h3>
              <p className="text-muted-foreground text-sm">
                Easy modifications and flexible cancellation policies tailored
                to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Ready for Your Desert Escape?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Book your perfect Coachella Valley vacation today and experience the
            magic of the desert.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="accent" size="xl" asChild>
              <Link to="/properties">
                Browse Properties
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="heroOutline" asChild>
              <Link to="/events">Explore Activities</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
