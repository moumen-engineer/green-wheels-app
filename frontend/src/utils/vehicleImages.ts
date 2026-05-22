// Import your existing images
import vehicleBikeImg from "@/assets/vehicle-bike.jpg";
import vehicleEbikeImg from "@/assets/vehicle-ebike.jpg";
import vehicleScooterImg from "@/assets/vehicle-scooter.jpg";

// Vehicle type to image mapping
const vehicleImages: Record<string, string> = {
  "Vélo classique": vehicleBikeImg,
  "Vélo électrique": vehicleEbikeImg,
  "Scooter électrique": vehicleScooterImg,
  // Fallback
  "default": vehicleBikeImg
};

export const getVehicleImage = (type: string): string => {
  // Normalize and clean the type string
  const normalizedType = type?.trim() || "default";
  
  // Exact match
  if (vehicleImages[normalizedType]) {
    return vehicleImages[normalizedType];
  }
  
  // Fuzzy matching for flexibility
  if (normalizedType.toLowerCase().includes("électrique") || 
      normalizedType.toLowerCase().includes("electrique")) {
    return vehicleImages["Vélo électrique"];
  }
  
  if (normalizedType.toLowerCase().includes("scooter")) {
    return vehicleImages["Scooter électrique"];
  }
  
  if (normalizedType.toLowerCase().includes("classique") || 
      normalizedType.toLowerCase().includes("vélo")) {
    return vehicleImages["Vélo classique"];
  }
  
  // Return default fallback
  return vehicleImages["default"];
};

export const getVehicleIcon = (type: string): string => {
  if (type.includes("électrique")) return "⚡";
  if (type.includes("Scooter")) return "🛵";
  return "🚲";
};

// Get battery color based on percentage
export const getBatteryColor = (batteryLevel: number): string => {
  if (batteryLevel >= 70) return "text-green-500";
  if (batteryLevel >= 30) return "text-yellow-500";
  return "text-red-500";
};