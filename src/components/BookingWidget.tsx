import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, ChevronDown, PawPrint, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/properties";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { fetchBookingData, formatStringDateToYYYYMMDD, BookingResponse, formatDateToYYYYMMDD } from "@/services/bookingApi";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addMonths, isBefore, startOfToday, parseISO, startOfMonth, endOfMonth } from "date-fns";

interface BookingWidgetProps {
  property: Property;
}

export const BookingWidget = ({ property }: BookingWidgetProps) => {
  const { toast } = useToast();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [hasPet, setHasPet] = useState(false);
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [allAvailability, setAllAvailability] = useState<BookingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  const allowsPets = property.houseRules.some(rule =>
    rule.toLowerCase().includes("pets allowed")
  );


  const petFeeMatch = property.houseRules.find(rule =>
    rule.toLowerCase().includes("pets allowed")
  )?.match(/\$(\d+)/);
  const petFee = petFeeMatch ? parseInt(petFeeMatch[1]) : 50;

  const loadAvailability = async (startDate: Date, monthsToLoad: number = 3) => {
    if (!property.propKey || !property.roomId) return;

    const fromDate = startOfMonth(startDate);
    const toDate = endOfMonth(addMonths(fromDate, monthsToLoad - 1));
    const from = formatDateToYYYYMMDD(fromDate);
    const to = formatDateToYYYYMMDD(toDate);

    const monthKeys: string[] = [];
    for (let i = 0; i < monthsToLoad; i++) {
      monthKeys.push(format(addMonths(fromDate, i), "yyyy-MM"));
    }

    if (monthKeys.every(m => loadedMonths.has(m))) return;

    setIsAvailabilityLoading(true);
    try {
      const data = await fetchBookingData(property.propKey, property.roomId, from, to);
      setAllAvailability(prev => ({ ...prev, ...data }));
      setLoadedMonths(prev => {
        const next = new Set(prev);
        monthKeys.forEach(m => next.add(m));
        return next;
      });
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setIsAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability(new Date(), 3);
  }, [property.propKey, property.roomId]);

  const handleMonthChange = (month: Date) => {
    const monthKey = format(month, "yyyy-MM");
    if (!loadedMonths.has(monthKey)) {
      loadAvailability(month, 3);
    }
  };

  useEffect(() => {
    const loadBookingData = async () => {
      if (!checkIn || !checkOut || !property.propKey || !property.roomId) return;

      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);

      if (startDate >= endDate) return;

      setIsLoading(true);
      try {
        const from = formatStringDateToYYYYMMDD(checkIn);

        const toDate = new Date(endDate);
        toDate.setDate(toDate.getDate() - 1);
        const to = formatStringDateToYYYYMMDD(toDate.toISOString().split('T')[0]);

        const data = await fetchBookingData(property.propKey, property.roomId, from, to);
        setBookingData(data);
      } catch (err) {
        console.error('Failed to fetch booking data:', err);
        toast({
          title: "Error fetching rates",
          description: "Could not get live pricing. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingData();
  }, [checkIn, checkOut, property.propKey, property.roomId]);

  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    if (date) {
      setCheckIn(format(date, "yyyy-MM-dd"));
      if (checkOutDate && isBefore(checkOutDate, date)) {
        setCheckOutDate(undefined);
        setCheckOut("");
      }
    } else {
      setCheckIn("");
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    setCheckOutDate(date);
    if (date) {
      setCheckOut(format(date, "yyyy-MM-dd"));
    } else {
      setCheckOut("");
    }
  };

  const isDayDisabled = (date: Date) => {
    if (isBefore(date, startOfToday())) return true;

    if (allAvailability) {
      const dateKey = formatDateToYYYYMMDD(date);
      const dayData = allAvailability[dateKey];
      return dayData && dayData.i === 0;
    }
    return false;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateSubtotal = () => {
    const nights = calculateNights();
    if (nights === 0) return 0;

    if (bookingData) {
      let total = 0;
      const start = new Date(checkIn);
      for (let i = 0; i < nights; i++) {
        const current = new Date(start);
        current.setDate(current.getDate() + i);
        const dateKey = formatStringDateToYYYYMMDD(current.toISOString().split('T')[0]);
        const dayData = bookingData[dateKey];
        if (dayData) {
          total += parseFloat(dayData.p1);
        } else {

          total += property.pricePerNight;
        }
      }
      return total;
    }

    return nights * property.pricePerNight;
  };

  const nights = calculateNights();
  const subtotal = calculateSubtotal();
  const cleaningFee = Number(property?.cleaningFee || 0);
  const serviceFee = Math.round(subtotal * 0.12);

  const calculateUpsellTotal = () => {
    let upsellTotal = 0;
    if (property.upsells) {
      property.upsells.forEach(upsell => {
        if (selectedUpsells.has(upsell.id)) {
          upsellTotal += upsell.price;
        }
      });
    }
    return upsellTotal;
  };

  const upsellTotal = calculateUpsellTotal();
  const total = subtotal + cleaningFee + upsellTotal;

  const formatBeds24Date = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getUTCDay()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${dayName} ${day} ${monthName} ${year}`;
  };

  const toggleUpsell = (id: string) => {
    const newSelected = new Set(selectedUpsells);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    console.log(newSelected);
    setSelectedUpsells(newSelected);
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Please select dates",
        description: "Choose your check-in and check-out dates to continue.",
        variant: "destructive",
      });
      return;
    }

    if (nights <= 0) {
      toast({
        title: "Invalid dates",
        description: "Check-out date must be after check-in date.",
        variant: "destructive",
      });
      return;
    }


    if (bookingData) {
      const start = new Date(checkIn);
      for (let i = 0; i < nights; i++) {
        const current = new Date(start);
        current.setDate(current.getDate() + i);
        const dateKey = formatStringDateToYYYYMMDD(current.toISOString().split('T')[0]);
        const dayData = bookingData[dateKey];

        if (dayData) {
          if (dayData.i === 0) {
            toast({
              title: "Property unavailable",
              description: `Sorry, the property is not available on ${current.toLocaleDateString()}.`,
              variant: "destructive",
            });
            return;
          }

          const minStay = parseInt(dayData.m);
          if (nights < minStay) {
            toast({
              title: "Minimum stay required",
              description: `A minimum stay of ${minStay} nights is required for these dates.`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    } else if (nights < 2) {
      toast({
        title: "Minimum 2 nights required",
        description: "Please select at least 2 nights for your stay.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Redirecting to payment...",
      description: "Please wait while we transfer you to our secure booking engine.",
    });


    const beds24Url = new URL("https://www.beds24.com/booking2.php");
    beds24Url.searchParams.append("propid", property.id);
    if (property.roomId) {
      beds24Url.searchParams.append("roomid", property.roomId);
    }
    beds24Url.searchParams.append("width", "960");
    beds24Url.searchParams.append("page", "book3");
    beds24Url.searchParams.append("limitstart", "0");
    beds24Url.searchParams.append("checkin", formatBeds24Date(checkIn));
    beds24Url.searchParams.append("checkin_hide", checkIn);
    beds24Url.searchParams.append("checkout", formatBeds24Date(checkOut));
    beds24Url.searchParams.append("checkout_hide", checkOut);
    beds24Url.searchParams.append("numnight", nights.toString());
    beds24Url.searchParams.append("numadult", guests.toString());
    beds24Url.searchParams.append("numchild", "0");

    if (property.roomId) {
      beds24Url.searchParams.append(`br1-${property.roomId}`, "Book");
    }

    selectedUpsells.forEach(id => {
      beds24Url.searchParams.append(`upsell[${id}]`, "1");
    });


    setIframeUrl(beds24Url.toString());
    setIsIframeLoading(true);
    setShowIframe(true);
  };

  const displayPrice = () => {





    return property.pricePerNight;
  };

  return (
    <>
      {showIframe && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[90vh] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold font-display">Complete Your Booking</h3>
              <button
                onClick={() => setShowIframe(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
              >
                <span className="text-sm font-medium">Close</span>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-white relative">
              {isIframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-medium text-muted-foreground">Loading booking page...</p>
                  </div>
                </div>
              )}
              <iframe
                src={iframeUrl}
                className="w-full h-full border-0"
                title="Beds24 Booking"
                onLoad={() => setIsIframeLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated sticky top-24">
        { }
        {/* <div className="mb-6">
          <span className="font-display text-3xl font-semibold text-foreground">
            ${displayPrice()}
          </span>
          <span className="text-muted-foreground"> / night</span>
        </div> */}

        { }
        <div className="border border-border rounded-xl overflow-hidden mb-4">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-3">
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                CHECK-IN
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "w-full text-left text-sm font-medium focus:outline-none flex items-center gap-2",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Add date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="relative">
                    {isAvailabilityLoading && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                    )}
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={handleCheckInSelect}
                      disabled={isDayDisabled}
                      onMonthChange={handleMonthChange}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-3">
              <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                CHECK-OUT
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    disabled={!checkInDate}
                    className={cn(
                      "w-full text-left text-sm font-medium focus:outline-none flex items-center gap-2",
                      !checkOutDate && "text-muted-foreground",
                      !checkInDate && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <CalendarIcon className="w-4 h-4" />
                    {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Add date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="relative">
                    {isAvailabilityLoading && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      </div>
                    )}
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={handleCheckOutSelect}
                      disabled={(date) =>
                        isDayDisabled(date) || (checkInDate ? isBefore(date, checkInDate) || date.getTime() === checkInDate.getTime() : false)
                      }
                      onMonthChange={handleMonthChange}
                      initialFocus
                    />
                  </div>
                </PopoverContent>
              </Popover>
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

        {property.upsells && property.upsells.length > 0 && (
          <div className="mb-4 space-y-3">
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Extra Services
            </label>
            <div className="space-y-2">
              {property.upsells.map((upsell) => (
                <div
                  key={upsell.id}
                  className="flex items-center justify-between p-3 border border-border rounded-xl hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => toggleUpsell(upsell.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedUpsells.has(upsell.id)}
                      onCheckedChange={() => toggleUpsell(upsell.id)}
                      id={`upsell-${upsell.id}`}
                    />

                    <div className="grid gap-0.5">
                      <span className="text-sm font-medium leading-none">
                        {upsell.description?.EN || upsell.description?.VI || "Extra Service"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {upsell.unit === "1" ? "Per person" : upsell.unit === "2" ? "Per adult" : "One-time fee"}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">${upsell.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        { }
        { }

        { }
        { }

        { }
        <Button
          variant="accent"
          size="xl"
          className="w-full mb-4"
          onClick={handleBooking}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Updating...
            </span>
          ) : (
            "Reserve Now"
          )}
        </Button>

        { }

        { }
        {nights > 0 && (
          <div className="space-y-4 pt-4 border-t border-border">
            { }
            {bookingData && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Daily Rates & Availability
                </h4>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {Array.from({ length: nights }).map((_, i) => {
                    const current = new Date(checkIn);
                    current.setDate(current.getDate() + i);
                    const dateKey = formatStringDateToYYYYMMDD(current.toISOString().split('T')[0]);
                    const dayData = bookingData[dateKey];
                    const isAvailable = dayData?.i === 1;

                    return (
                      <div
                        key={dateKey}
                        className={cn(
                          "flex justify-between items-center p-2 rounded-lg text-sm border",
                          isAvailable
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-900"
                            : "bg-red-50/50 border-red-100 text-red-900"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {isAvailable ? (
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                          <span className="font-medium">
                            {current.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">${dayData?.p1 || property.pricePerNight}</span>
                          {!isAvailable && (
                            <span className="block text-[10px] text-red-600 font-bold uppercase">Sold Out</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted-foreground underline cursor-help">
                Total for {nights}
              </span>
              <span className="text-foreground">${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground underline cursor-help">
                Cleaning fee
              </span>
              <span className="text-foreground">${cleaningFee}</span>
            </div>

            {property.upsells && property.upsells.length > 0 && Array.from(selectedUpsells).map(id => {
              const upsell = property.upsells?.find(u => u.id === id);
              if (!upsell) return null;
              return (
                <div key={id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {upsell?.description?.EN || upsell.description?.VI}
                  </span>
                  <span className="text-foreground">${upsell.price}</span>
                </div>
              );
            })}
            { }
            { }
            <div className="flex justify-between font-semibold pt-3 border-t border-border">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
