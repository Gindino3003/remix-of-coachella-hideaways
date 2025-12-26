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

  const selectThumbnail = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Main Gallery Layout */}
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openGallery(currentIndex)}
        >
          <img
            src={`${displayImages[currentIndex]}`}
            alt={`${propertyName} - Main`}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-smooth" />

          {/* Navigation arrows on main image */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-elevated hover:bg-background transition-smooth opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-elevated hover:bg-background transition-smooth opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium">
            {currentIndex + 1} / {displayImages.length}
          </div>

          {/* Show all button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              openGallery(0);
            }}
            className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm text-sm font-medium shadow-soft hover:bg-background transition-smooth"
          >
            <Grid3X3 size={16} />
            Show all {displayImages.length} photos
          </button>
        </div>

        {/* Thumbnail Carousel */}
        <div className="relative">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => selectThumbnail(index)}
                className={cn(
                  "flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden border-2 transition-smooth hover:opacity-100",
                  index === currentIndex
                    ? "border-primary opacity-100 shadow-soft"
                    : "border-transparent opacity-70 hover:border-border"
                )}
              >
                <img
                  src={image}
                  alt={`${propertyName} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
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
