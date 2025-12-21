import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyGallery } from "@/components/PropertyGallery";
import { BookingWidget } from "@/components/BookingWidget";
import { getPropertyById } from "@/data/properties";
import {
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Check,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PropertyDetail = () => {
  const { id } = useParams();
  const property = getPropertyById(id || "");

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-semibold mb-4">
            Property Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The property you're looking for doesn't exist.
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

      {/* Gallery */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <PropertyGallery images={property.images} propertyName={property.name} />
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
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

              {/* Description */}
              <div className="border-b border-border pb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">
                  About This Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="border-b border-border pb-8">
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <Check size={18} className="text-primary flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
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
            </div>

            {/* Booking Widget */}
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
