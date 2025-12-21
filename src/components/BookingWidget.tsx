import { useState } from "react";
import { Calendar, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/properties";
import { useToast } from "@/hooks/use-toast";

interface BookingWidgetProps {
  property: Property;
}

export const BookingWidget = ({ property }: BookingWidgetProps) => {
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const subtotal = nights * property.pricePerNight;
  const cleaningFee = 150;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + cleaningFee + serviceFee;

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Please select dates",
        description: "Choose your check-in and check-out dates to continue.",
        variant: "destructive",
      });
      return;
    }

    if (nights < 2) {
      toast({
        title: "Minimum 2 nights required",
        description: "Please select at least 2 nights for your stay.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking request sent!",
      description: "We'll confirm your reservation within 24 hours.",
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated sticky top-24">
      {/* Price Header */}
      <div className="mb-6">
        <span className="font-display text-3xl font-semibold text-foreground">
          ${property.pricePerNight}
        </span>
        <span className="text-muted-foreground"> / night</span>
      </div>

      {/* Date Selection */}
      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-3">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              CHECK-IN
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="p-3">
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              CHECK-OUT
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                min={checkIn || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-border p-3">
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            GUESTS
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="bg-transparent text-sm text-foreground focus:outline-none appearance-none cursor-pointer"
              >
                {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "guest" : "guests"}
                    </option>
                  )
                )}
              </select>
            </div>
            <ChevronDown size={16} className="text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Book Button */}
      <Button
        variant="accent"
        size="xl"
        className="w-full mb-4"
        onClick={handleBooking}
      >
        Reserve Now
      </Button>

      <p className="text-center text-sm text-muted-foreground mb-6">
        You won't be charged yet
      </p>

      {/* Price Breakdown */}
      {nights > 0 && (
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground underline cursor-help">
              ${property.pricePerNight} × {nights} nights
            </span>
            <span className="text-foreground">${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground underline cursor-help">
              Cleaning fee
            </span>
            <span className="text-foreground">${cleaningFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground underline cursor-help">
              Service fee
            </span>
            <span className="text-foreground">${serviceFee}</span>
          </div>
          <div className="flex justify-between font-semibold pt-3 border-t border-border">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
};
