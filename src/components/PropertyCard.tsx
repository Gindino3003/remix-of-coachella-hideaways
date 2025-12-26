import { Link } from "react-router-dom";
import { Star, Users, Bed, Bath } from "lucide-react";
import { Property } from "@/data/properties";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
  delay?: number;
}

export const PropertyCard = ({ property, className, delay = 0 }: PropertyCardProps) => {
  return (
    <Link
      to={`/property/${property.id}`}
      className={cn(
        "group block rounded-2xl overflow-hidden bg-card shadow-soft hover:shadow-elevated transition-smooth opacity-0 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent z-10" />
        {property.images[0] ? (
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-700"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Image coming soon</span>
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1.5 rounded-full bg-background/95 backdrop-blur-sm text-sm font-semibold text-foreground">
            ${property.pricePerNight}{" "}
            <span className="font-normal text-muted-foreground"></span>
          </span>
        </div>
        {/* Rating */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-background/95 backdrop-blur-sm">
          <Star size={14} className="fill-sunset text-sunset" />
          <span className="text-sm font-medium">{property.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
            {property.name}
          </h3>
          <p className="text-sm text-muted-foreground">{property.location}</p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.tagline}
        </p>

        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Bed size={16} />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Bath size={16} />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users size={16} />
            <span>{property.maxGuests} guests</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
