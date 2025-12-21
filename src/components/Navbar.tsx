import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/events", label: "Events & Activities" },
  { href: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-smooth",
        isHome
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md border-b border-border"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span
              className={cn(
                "font-display text-2xl font-semibold tracking-tight",
                isHome ? "text-primary-foreground" : "text-foreground"
              )}
            >
              Desert Haven
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-smooth hover:opacity-80",
                  isHome
                    ? "text-primary-foreground/90 hover:text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground",
                  location.pathname === link.href &&
                    (isHome ? "text-primary-foreground" : "text-primary")
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant={isHome ? "heroOutline" : "default"}
              size="sm"
              className={cn(isHome && "py-2 px-4 h-auto")}
              asChild
            >
              <Link to="/properties">Book Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-smooth",
              isHome
                ? "text-primary-foreground hover:bg-primary-foreground/10"
                : "text-foreground hover:bg-muted"
            )}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border animate-fade-in">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium py-2 transition-smooth",
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Button className="mt-2" asChild>
                <Link to="/properties" onClick={() => setIsOpen(false)}>
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
