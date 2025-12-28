import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyGallery } from "@/components/PropertyGallery";
import { BookingWidget } from "@/components/BookingWidget";
import { Property } from "@/data/properties";
import { fetchPropertyById, convertApiPropertyDetailToProperty } from "@/services/api";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Check,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Briefcase,
  Tv,
  UtensilsCrossed,
  Wifi,
  CookingPot,
  PawPrint,
  Waves,
  Settings,
  Trophy,
  Accessibility,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const getGroupIcon = (group: string) => {
  switch (group) {
    case "Amenities": return CheckCircle;
    case "Business": return Briefcase;
    case "Entertainment": return Tv;
    case "Food and Drink": return UtensilsCrossed;
    case "Internet": return Wifi;
    case "Kitchen": return CookingPot;
    case "Location": return MapPin;
    case "Pets": return PawPrint;
    case "Pool and Wellness": return Waves;
    case "Services": return Settings;
    case "Sports": return Trophy;
    case "Suitability": return Accessibility;
    default: return Check;
  }
};


const PropertyDetail = () => {
  const { id: propkey } = useParams();
  const location = useLocation();
  const { city, state } = location.state || {};
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!propkey) {
        setError("Property key is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetchPropertyById(propkey);


        const convertedProperty = convertApiPropertyDetailToProperty(response, city, state, propkey);
        setProperty(convertedProperty);
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [propkey, city, state]);


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading property...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-semibold mb-4">
            {error ? 'Error Loading Property' : 'Property Not Found'}
          </h1>
          <p className="text-muted-foreground mb-8">
            {error || "The property you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/properties">
              <ArrowLeft size={18} />
              Back to Properties
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <PropertyGallery images={property.images} propertyName={property.name} />
        </div>
      </section>

      {}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {}
            <div className="lg:col-span-2 space-y-8">
              {}
              <div className="border-b border-border pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-muted-foreground">{property.location}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                  {property.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-sunset text-sunset" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-muted-foreground">
                      ({property.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Bed size={16} />
                    <span>{property.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Bath size={16} />
                    <span>{property.bathrooms} bathrooms</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users size={16} />
                    <span>Up to {property.maxGuests} guests</span>
                  </div>
                </div>
              </div>

              {}
              <div className="border-b border-border pb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">
                  About This Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {}
              {property.groupedAmenities && Object.keys(property.groupedAmenities).length > 0 && (
                <div className="border-b border-border pb-8">
                  <h2 className="font-display text-2xl font-semibold mb-6">
                    Amenities
                  </h2>
                  <div className="space-y-8">
                    {Object.entries(property.groupedAmenities).map(([group, items], groupIndex) => {
                      const Icon = getGroupIcon(group);
                      return (
                        <div key={groupIndex}>
                          <div className="flex items-center gap-2 mb-4 text-primary">
                            <Icon size={20} />
                            <h3 className="font-semibold text-lg">{group}</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {items.map((amenity, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 text-foreground"
                              >
                                <Check size={18} className="text-primary/60 flex-shrink-0" />
                                <span className="text-sm md:text-base">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {}
              {property.houseRules && property.houseRules.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold mb-6">
                    House Rules
                  </h2>
                  <div className="space-y-3">
                    {property.houseRules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-foreground"
                      >
                        <AlertCircle
                          size={18}
                          className="text-muted-foreground flex-shrink-0 mt-0.5"
                        />
                        <span className="text-muted-foreground">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="lg:col-span-1">
              <BookingWidget property={property} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
