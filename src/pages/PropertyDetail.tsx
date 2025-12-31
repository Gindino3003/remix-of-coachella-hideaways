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
  LayoutGrid,
  Utensils,
  Wifi,
  Gamepad2,
  Car,
  Trees,
  Shield,
  Baby,
  Armchair,
  Shirt, 
  Sparkles,
  Bath as BathIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Hàm chọn Icon
const getCategoryIcon = (title: string) => {
  const normalizedTitle = title ? title.toLowerCase() : "";
  
  if (normalizedTitle.includes("property")) return LayoutGrid;
  if (normalizedTitle.includes("outdoor") || normalizedTitle.includes("pool")) return Trees;
  if (normalizedTitle.includes("kitchen") || normalizedTitle.includes("dining")) return Utensils;
  if (normalizedTitle.includes("sleep") || normalizedTitle.includes("comfort")) return Armchair;
  if (normalizedTitle.includes("tech") || normalizedTitle.includes("wifi")) return Wifi;
  if (normalizedTitle.includes("entertain")) return Gamepad2;
  if (normalizedTitle.includes("laundry") || normalizedTitle.includes("clean")) return Shirt;
  if (normalizedTitle.includes("parking")) return Car;
  if (normalizedTitle.includes("family")) return Baby;
  if (normalizedTitle.includes("safe") || normalizedTitle.includes("secur")) return Shield;
  if (normalizedTitle.includes("bath")) return BathIcon;
  return Sparkles; 
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
        setError("Failed to load property details. Please try again later.");
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

  // Lấy danh sách amenities, nếu không có thì trả về mảng rỗng để không bị lỗi
  const amenitiesList = property.amenities || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <PropertyGallery images={property.images} propertyName={property.name} />
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cột chính bên trái */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Thông tin cơ bản */}
              <div className="border-b border-border pb-8">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-muted-foreground">{property.location}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                  {property.name}
                </h1>
                {property.tagline && (
                    <p className="text-lg text-muted-foreground mb-4 italic">
                        {property.tagline}
                    </p>
                )}
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

              {/* Mô tả */}
              <div className="border-b border-border pb-8">
                <h2 className="font-display text-2xl font-semibold mb-4">
                  About This Property
                </h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  {property.description.split('\n').map((line, i) => {
                    if (!line.trim()) return <br key={i}/>;
                    return (
                      <div key={i} className={`${line.trim().startsWith('-') ? 'pl-4' : ''}`}>
                        {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={j} className="text-foreground font-semibold">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phần Amenities mới - Hiển thị 2 cột */}
              {amenitiesList.length > 0 && (
                <div className="border-b border-border pb-8">
                  <h2 className="font-display text-2xl font-semibold mb-8">
                    Amenities
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {amenitiesList.map((group, index) => {
                      if (!group) return null;
                      const IconComponent = getCategoryIcon(group.title);
                      
                      return (
                        <div key={index} className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-5 h-5 text-orange-500" /> 
                            <h3 className="font-semibold text-foreground text-base">
                              {group.title}
                            </h3>
                          </div>

                          <ul className="space-y-2 pl-1">
                            {group.items && group.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nội quy */}
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

            {/* Sidebar Booking */}
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