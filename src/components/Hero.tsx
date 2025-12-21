import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface HeroProps {
  backgroundImage: string;
}

export const Hero = ({ backgroundImage }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Luxury desert villa with pool"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 mb-8 opacity-0 animate-fade-in">
            <Star size={16} className="fill-sunset text-sunset" />
            <span className="text-sm font-medium">
              5-Star Rated Vacation Rentals
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight mb-6 opacity-0 animate-fade-in-up animation-delay-100">
            Your Desert
            <br />
            <span className="text-gradient">Paradise Awaits</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto mb-10 opacity-0 animate-fade-in-up animation-delay-200">
            Luxury vacation rentals in Coachella Valley. Experience stunning
            desert landscapes, private pools, and world-class amenities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animation-delay-300">
            <Button variant="hero" asChild>
              <Link to="/properties">
                Explore Properties
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="heroOutline" asChild>
              <Link to="/events">Things to Do</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-primary-foreground/20 opacity-0 animate-fade-in-up animation-delay-400">
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-semibold">5</div>
              <div className="text-sm text-primary-foreground/70">
                Unique Properties
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-semibold">500+</div>
              <div className="text-sm text-primary-foreground/70">
                Happy Guests
              </div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-semibold">4.9</div>
              <div className="text-sm text-primary-foreground/70">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animation-delay-500">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-bounce" />
        </div>
      </div>
    </section>
  );
};
