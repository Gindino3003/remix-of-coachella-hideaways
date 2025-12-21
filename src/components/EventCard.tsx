import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Event } from "@/data/events";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  className?: string;
  delay?: number;
}

export const EventCard = ({ event, className, delay = 0 }: EventCardProps) => {
  const CardContent = () => (
    <>
      {/* Category Badge */}
      <div className="mb-4">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {event.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {event.description}
      </p>

      {/* Details */}
      <div className="space-y-2 mt-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={14} className="text-primary" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} className="text-primary" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} className="text-primary" />
          <span>{event.location}</span>
        </div>
      </div>

      {event.link && (
        <div className="mt-4 pt-4 border-t border-border">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            Learn More <ExternalLink size={14} />
          </span>
        </div>
      )}
    </>
  );

  const cardClasses = cn(
    "group flex flex-col p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-smooth opacity-0 animate-fade-in-up",
    className
  );

  if (event.link) {
    return (
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
        style={{ animationDelay: `${delay}ms` }}
      >
        <CardContent />
      </a>
    );
  }

  return (
    <div className={cardClasses} style={{ animationDelay: `${delay}ms` }}>
      <CardContent />
    </div>
  );
};
