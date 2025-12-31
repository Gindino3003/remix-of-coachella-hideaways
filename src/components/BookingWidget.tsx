import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Users, ChevronDown, PawPrint, Loader2, X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/properties";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { fetchBookingData, formatStringDateToYYYYMMDD, BookingResponse, formatDateToYYYYMMDD } from "@/services/bookingApi";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addMonths, isBefore, startOfToday, startOfMonth, endOfMonth } from "date-fns";

interface BookingWidgetProps {
  property: Property;
}

export const BookingWidget = ({ property }: BookingWidgetProps) => {
  const { toast } = useToast();
  
  // --- STATE ---
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  
  const [bookingData, setBookingData] = useState<BookingResponse | null>(null);
  const [allAvailability, setAllAvailability] = useState<BookingResponse | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
  
  const [showIframe, setShowIframe] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [isIframeLoading, setIsIframeLoading] = useState(false);

  // --- TÌM PET FEE TỪ API ---
  const petUpsell = property.upsells?.find(u => 
    u.id === 'pet_fee' || u.description?.EN.toLowerCase().includes('pet')
  );

  // --- LOGIC LOAD DATA ---
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
      } finally {
        setIsLoading(false);
      }
    };
    loadBookingData();
  }, [checkIn, checkOut, property.propKey, property.roomId]);

  // --- LOGIC XỬ LÝ DATE ---
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

  // --- TÍNH TOÁN GIÁ ---
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
        total += dayData ? parseFloat(dayData.p1) : property.pricePerNight;
      }
      return total;
    }
    return nights * property.pricePerNight;
  };

  const nights = calculateNights();
  const subtotal = calculateSubtotal();
  const cleaningFee = property.cleaningFee ? parseFloat(property.cleaningFee) : 0;

  const calculateUpsellTotal = () => {
    let total = 0;
    if (petUpsell && selectedUpsells.has(petUpsell.id)) {
        const isDaily = petUpsell.period === "daily" || petUpsell.unit === "day";
        if (isDaily) {
            total += petUpsell.price * (nights > 0 ? nights : 1);
        } else {
            total += petUpsell.price;
        }
    }
    return total;
  };

  const upsellTotal = calculateUpsellTotal();
  const total = subtotal + cleaningFee + upsellTotal;

  const toggleUpsell = (id: string) => {
    const newSelected = new Set(selectedUpsells);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedUpsells(newSelected);
  };

  // --- LOGIC TĂNG GIẢM KHÁCH ---
  const updateGuests = (operation: 'inc' | 'dec') => {
    setGuests(prev => {
      if (operation === 'inc') return Math.min(prev + 1, property.maxGuests);
      if (operation === 'dec') return Math.max(prev - 1, 1);
      return prev;
    });
  };

  const formatBeds24Date = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getUTCDay()]} ${date.getUTCDate().toString().padStart(2, '0')} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
  };

  // --- ĐÃ SỬA: THÊM HÀNH ĐỘNG "Book" ---
  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({ title: "Please select dates", description: "Choose check-in/out dates.", variant: "destructive" });
      return;
    }
    if (nights < 2) {
        toast({ title: "Minimum stay", description: "Minimum 2 nights required.", variant: "destructive" });
        return;
    }

    toast({ title: "Redirecting...", description: "Transferring to payment gateway." });

    const beds24Url = new URL("https://www.beds24.com/booking2.php");
    beds24Url.searchParams.append("propid", property.id);
    
    // SỬA Ở ĐÂY: Thêm roomid và lệnh Book tương ứng
    if (property.roomId) {
        beds24Url.searchParams.append("roomid", property.roomId);
        // Quan trọng: Tên tham số là "br1-" + roomID, giá trị là "Book"
        beds24Url.searchParams.append(`br1-${property.roomId}`, "Book");
    }

    beds24Url.searchParams.append("checkin", formatBeds24Date(checkIn));
    beds24Url.searchParams.append("checkin_hide", checkIn);
    beds24Url.searchParams.append("checkout", formatBeds24Date(checkOut));
    beds24Url.searchParams.append("checkout_hide", checkOut);
    beds24Url.searchParams.append("numnight", nights.toString());
    beds24Url.searchParams.append("numadult", guests.toString());
    
    selectedUpsells.forEach(id => {
      beds24Url.searchParams.append(`upsell[${id}]`, "1");
    });

    setIframeUrl(beds24Url.toString());
    setIsIframeLoading(true);
    setShowIframe(true);
  };

  return (
    <>
      {showIframe && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[90vh] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="text-lg font-semibold font-display">Complete Your Booking</h3>
              <button onClick={() => setShowIframe(false)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 w-full bg-white relative">
              {isIframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
              )}
              <iframe src={iframeUrl} className="w-full h-full border-0" onLoad={() => setIsIframeLoading(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Widget Container với Scrollbar ẩn */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-elevated sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* HEADER PRICE */}
        <div className="mb-6 flex items-baseline justify-between">
           <div>
             <span className="font-display text-3xl font-semibold text-foreground">${property.pricePerNight}</span>
             <span className="text-muted-foreground text-sm"> / night</span>
           </div>
           <div className="text-xs text-muted-foreground">Min 2 nights</div>
        </div>

        {/* DATE & GUEST PICKER */}
        <div className="border border-border rounded-xl overflow-hidden mb-6">
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-3">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">CHECK-IN</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn("w-full text-left text-sm font-medium flex items-center gap-2", !checkInDate && "text-muted-foreground")}>
                    {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Add date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkInDate} onSelect={handleCheckInSelect} disabled={isDayDisabled} onMonthChange={handleMonthChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">CHECK-OUT</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button disabled={!checkInDate} className={cn("w-full text-left text-sm font-medium flex items-center gap-2", !checkOutDate && "text-muted-foreground")}>
                    {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Add date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkOutDate} onSelect={handleCheckOutSelect} disabled={(date) => isDayDisabled(date) || (checkInDate ? isBefore(date, checkInDate) : false)} onMonthChange={handleMonthChange} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* PHẦN GUESTS */}
          <div className="border-t border-border p-3">
            <label className="block text-[10px] font-bold text-muted-foreground mb-1 uppercase tracking-wider">GUESTS</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between text-sm font-medium focus:outline-none">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span className="text-foreground">
                      {guests} guest{guests > 1 ? 's' : ''}
                    </span>
                  </div>
                  <ChevronDown size={16} className="text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-[280px] p-4 bg-card border-border shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm text-foreground">Guests</h4>
                    <p className="text-xs text-muted-foreground">Max {property.maxGuests} people</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-border hover:bg-muted"
                      onClick={() => updateGuests('dec')}
                      disabled={guests <= 1}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-4 text-center text-sm font-medium">{guests}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full border-border hover:bg-muted"
                      onClick={() => updateGuests('inc')}
                      disabled={guests >= property.maxGuests}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* --- PET OPTION --- */}
        {petUpsell && (
          <div className="mb-4 p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="flex items-start gap-3">
              <Checkbox
                id="hasPet"
                checked={selectedUpsells.has(petUpsell.id)}
                onCheckedChange={() => toggleUpsell(petUpsell.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <label
                  htmlFor="hasPet"
                  className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer"
                >
                  <PawPrint size={16} className="text-primary" />
                  Bringing a pet?
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  Pet fee: ${petUpsell.price} ({
                    (petUpsell.unit === "stay" || petUpsell.period === "once") 
                    ? "one-time fee" 
                    : "per night"
                  }, requires prior approval)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON */}
        <Button variant="accent" size="xl" className="w-full mb-4 font-semibold text-base shadow-lg hover:shadow-xl transition-all" onClick={handleBooking} disabled={isLoading}>
          {isLoading ? <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Updating...</span> : "Reserve Now"}
        </Button>

        <p className="text-center text-sm text-muted-foreground mb-6">
          You won't be charged yet
        </p>

        {/* PRICE BREAKDOWN */}
        {nights > 0 && (
          <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
            
            {/* DAILY RATES */}
            {bookingData && (
              <div className="space-y-2 mb-4">
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

            {/* SUMMARY */}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground underline decoration-dotted">Room charge ({nights} nights)</span>
              <span>${subtotal}</span>
            </div>
            
            {cleaningFee > 0 && (
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground underline decoration-dotted">Cleaning fee</span>
                <span>${cleaningFee}</span>
                </div>
            )}

            {/* Pet Fee */}
            {petUpsell && selectedUpsells.has(petUpsell.id) && (
               <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline decoration-dotted flex items-center gap-1">
                    <PawPrint size={12} />
                    Pet fee
                  </span>
                  <span>${petUpsell.price}</span>
               </div>
            )}

            <div className="flex justify-between font-bold text-lg pt-3 border-t border-border mt-2">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};