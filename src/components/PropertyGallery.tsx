import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
}

export const PropertyGallery = ({ images, propertyName }: PropertyGalleryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use placeholder images if none provided
  const displayImages = images.length > 0 ? images : [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeGallery = () => {
    setIsOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
        {/* Main Image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openGallery(0)}
        >
          <img
            src={displayImages[0]}
            alt={`${propertyName} - Main`}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-smooth" />
        </div>

        {/* Secondary Images */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="relative cursor-pointer group"
            onClick={() => openGallery(index + 1)}
          >
            <img
              src={image}
              alt={`${propertyName} - ${index + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-smooth" />
          </div>
        ))}

        {/* Show All Button */}
        {displayImages.length > 5 && (
          <button
            onClick={() => openGallery(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-sm font-medium shadow-soft hover:shadow-elevated transition-smooth"
          >
            <Grid3X3 size={16} />
            Show all {displayImages.length} photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/10 text-primary-foreground hover:bg-background/20 transition-smooth"
          >
            <X size={24} />
          </button>

          {/* Navigation */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 p-3 rounded-full bg-background/10 text-primary-foreground hover:bg-background/20 transition-smooth"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 p-3 rounded-full bg-background/10 text-primary-foreground hover:bg-background/20 transition-smooth"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image */}
          <img
            src={displayImages[currentIndex]}
            alt={`${propertyName} - ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain animate-scale-in"
          />

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/20 text-primary-foreground text-sm">
            {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-smooth",
                  index === currentIndex
                    ? "border-primary-foreground"
                    : "border-transparent opacity-50 hover:opacity-80"
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
