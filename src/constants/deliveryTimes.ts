export interface DeliveryTimeSlot {
  id: string;
  date: string;
  dayOfWeek: string;
  timeRange: string;
  label: string;
  district: string;
  neighborhood: string;
  isAvailable: boolean;
}

// Generate delivery time slots for different districts and neighborhoods
const generateDeliverySlots = (): DeliveryTimeSlot[] => {
  const slots: DeliveryTimeSlot[] = [];
  const today = new Date();
  
  // Generate slots for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dateStr = date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const dayOfWeek = date.toLocaleDateString('tr-TR', { weekday: 'long' });
    
    // Different time slots for different districts/neighborhoods
    const districts = [
      { district: 'Beylikdüzü', neighborhoods: ['Kavaklı', 'Büyükşehir'] },
      { district: 'Başakşehir', neighborhoods: ['Kayabaşı', 'Bahçeşehir'] }
    ];
    
    districts.forEach(({ district, neighborhoods }) => {
      neighborhoods.forEach(neighborhood => {
        // Different time slots based on district
        const timeSlots = district === 'Beylikdüzü' 
          ? [
              { start: '10:00', end: '12:00', label: 'Sabah' },
              { start: '14:00', end: '16:00', label: 'Öğleden Sonra' },
              { start: '18:00', end: '20:00', label: 'Akşam' }
            ]
          : [
              { start: '09:00', end: '11:00', label: 'Sabah' },
              { start: '13:00', end: '15:00', label: 'Öğleden Sonra' },
              { start: '17:00', end: '19:00', label: 'Akşam' },
              { start: '19:00', end: '21:00', label: 'Gece' }
            ];
        
        timeSlots.forEach((slot, index) => {
          slots.push({
            id: `${district}-${neighborhood}-${dateStr}-${index}`,
            date: dateStr,
            dayOfWeek,
            timeRange: `${slot.start}–${slot.end}`,
            label: slot.label,
            district,
            neighborhood,
            isAvailable: Math.random() > 0.2 // 80% availability
          });
        });
      });
    });
  }
  
  return slots;
};

export const deliveryTimeSlots = generateDeliverySlots();

// Utility functions
export const getDeliverySlotsByLocation = (district: string, neighborhood: string) => {
  return deliveryTimeSlots.filter(slot => 
    slot.district === district && 
    slot.neighborhood === neighborhood &&
    slot.isAvailable
  );
};

export const getAvailableDeliverySlots = (district?: string, neighborhood?: string) => {
  if (district && neighborhood) {
    return getDeliverySlotsByLocation(district, neighborhood);
  }
  
  // Return all available slots if no location specified
  return deliveryTimeSlots.filter(slot => slot.isAvailable);
};

export const formatDeliveryDate = (dateStr: string, dayOfWeek: string) => {
  return `${dateStr} – ${dayOfWeek}`;
};
