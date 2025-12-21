import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold">Desert Haven</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Luxury vacation rentals in the heart of Coachella Valley. 
              Experience the desert in style.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-smooth"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-smooth"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <Link
                to="/properties"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-smooth"
              >
                Our Properties
              </Link>
              <Link
                to="/events"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-smooth"
              >
                Events & Activities
              </Link>
              <Link
                to="/contact"
                className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-smooth"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@deserthaven.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-smooth"
              >
                <Mail size={16} />
                hello@deserthaven.com
              </a>
              <a
                href="tel:+17605551234"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-smooth"
              >
                <Phone size={16} />
                (760) 555-1234
              </a>
              <span className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <MapPin size={16} />
                Coachella Valley, CA
              </span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Stay Updated</h4>
            <p className="text-primary-foreground/70 text-sm">
              Get exclusive offers and updates.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:border-primary-foreground/40 transition-smooth"
              />
              <button
                type="submit"
                className="px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Desert Haven Rentals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
