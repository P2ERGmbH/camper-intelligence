export interface JucyProduct {
  id: string; // Example: "fd59b647-ec88-e611-80e7-c4346bc5b2d4"
  code: string; // Example: "CHSR"
  name: string; // Example: "3 Berth Chaser"
  region: string; // Example: "nz"
  fleetType: string; // Example: "Campervan"
  fleetTypeId: string; // Example: "7d3dece7-ab86-e611-80e8-c4346bc5977c"
  fleetTypeSlug: string; // Example: "campervan"
  brand: string; // Example: "jucy"
  description: string; // Example: "<h1>3-Berth Campervan Hire</h1>..."
  shortDescription: string; // Example: "Three’s company in a JUCY Chaser!..."
  featuresDescription: string; // Example: "<p class=\"text-justify\">The JUCY Chaser has some fancy features..."
  excessReductionFeatures: ExcessReductionFeature[];
  excessReductionDescription: string; // Example: "<p style=\"text-align:right;\">..."
  specificationsDescription: string; // Example: "Three’s company in a JUCY Chaser!..."
  specifications: Record<string, string>; // Example: { "Vehicle": "Toyota Hiace", "Seats": "3 x seatbelts" }
  gallery: GalleryItem[];
  keyFeatures: KeyFeature[];
  includedWith: IncludedWithItem[];
  features: FeatureSection[];
  pages: PageLocale[];
  highlightedFeatures: string[]; // Example: ["3x seatbelts (no child seats allowed)", "Sleeps 3"]
  vehicleDescription: string; // Example: "Toyota Hiace"
  seatCount: number; // Example: 3
  sleepCount: number; // Example: 3
  sleepDescription: string; // Example: "3 (2 double beds)"
  transmission: string; // Example: "Automatic"
  engineSize: string; // Example: "2.0 litre"
  weight: string; // Example: "1.68m"
  length: string; // Example: "4.7m"
  width: string; // Example: "1.68m"
  luggageSmall: number; // Example: 4
  luggageLarge: number; // Example: 3
  scenicImage: string; // Example: "https://storage.googleapis.com/jucy-chilwa-prod-57ad03.appspot.com/Image/scenic.jpg"
  studioImage: string; // Example: "https://storage.googleapis.com/jucy-chilwa-prod-57ad03.appspot.com/Image/studio.jpg"
  emailImage: string; // Example: "https://storage.googleapis.com/jucy-chilwa-prod-57ad03.appspot.com/Image/email.jpg"
  floorPlans: FloorPlan[];
  maxOccupants: number; // Example: 3
  estimatedDailyRate: number; // Example: 500
}

export interface ExcessReductionFeature {
  name: string; // Example: "Cost per day"
  type: 'text' | 'boolean'; // Example: "text" or "boolean"
  basic: string | boolean; // Example: "$0" or true
  standard: string | boolean; // Example: "$40" or true
  full: string | boolean; // Example: "$55" or true
}

export interface GalleryItem {
  original: string; // Example: "https://storage.googleapis.com/jucy-chilwa-prod-57ad03.appspot.com/Image/kitchen_looking_out_boot_748c703f22/kitchen_looking_out_boot_748c703f22.jpg"
  thumbnail: string; // Example: "https://storage.googleapis.com/jucy-chilwa-prod-57ad03.appspot.com/Image/kitchen_looking_out_boot_748c703f22/thumbnail_kitchen_looking_out_boot_748c703f22.jpg"
  type: string; // Example: "Image"
  carousel: boolean; // Example: false
  originalAlt: string; // Example: ""
}

export interface KeyFeature {
  title: string; // Example: "3x seatbelts (no child seats allowed)"
  type: string; // Example: "icon"
  icon: string; // Example: "jucy-icon sleeps" or ""
}

export interface IncludedWithItem {
  title: string; // Example: "Cutlery and dinnerware"
  type: string; // Example: "icon"
  icon: string; // Example: "check"
}

export interface FeatureSection {
  title: string; // Example: "Features"
  items: string[]; // Example: ["2 burner gas cooker", "50 litre compressor fridge"]
  content: string; // Example: ""
}

export interface PageLocale {
  locale: string; // Example: "en"
  url: string; // Example: ""
  title: string; // Example: "3 Berth Chaser"
}

export interface FloorPlan {
  name: string; // Example: "NZ Chaser Day"
  url: string; // Example: "https://storage.googleapis.com/jucy-chilwa-prod-57ad03.appspot.com/Image/2023151_03_JUCY_NZ_Chaser_DAY_040aab3d88/2023151_03_JUCY_NZ_Chaser_DAY_040aab3d88.svg"
}

export interface JucyRentalCatalogResponse {
  error ?: string;
  status ?: number;
  products: JucyProduct[]; // Example: [{ id: "...", name: "3 Berth Chaser", ... }]
}

export interface JucySitesResponse {
  error ?: string;
  status ?: number;
  sites: JucySite[];
}

export interface JucySite {
  id: string; // Example: "ed5ebb4e-7aa8-11e9-8f9e-2a86e4085a59"
  name: string; // Example: "Adelaide Airport"
  siteCode: string; // Example: "ADL"
  geoLocation: GeoLocation;
  domesticPickUp: boolean; // Example: true
  internationalPickUp: boolean; // Example: true
  address1: Address;
  timeZone: string; // Example: "Australia/Adelaide"
  country: string; // Example: "Australia"
  countryCode: string; // Example: "au"
  minAges: string[]; // Example: ["18", "19", "20", "21"]
  siteSettings: SiteSetting[];
  holidays: Holiday[];
  defaultTimes: DefaultTimes;
  businessUnit: string; // Example: "e10d8f7c-67e4-4bff-b23f-e86183653aa5"
  directionsLink: string; // Example: "https://www.google.com/maps/dir//jucy+rentals+adelaide+airport/..."
  phone: string; // Example: "AU 1800 150 850"
  reservationsPhone: string; // Example: "1800 150 850"
}

export interface GeoLocation {
  lat: number; // Example: -34.95865149999999
  lng: number; // Example: 138.5426826
  zoom: number; // Example: 14
}

export interface Address {
  name: string; // Example: "Adelaide Airport"
  line1: string; // Example: "25-27 Kinkaid Avenue"
  city: string; // Example: "Adelaide"
  postCode: string; // Example: "5037"
  country: string; // Example: "Australia"
  latitude: number; // Example: -34.95865149999999
  longitude: number; // Example: 138.5426826
  state?: string; // Example: "South Australia"
}

export interface SiteSetting {
  fleetTypeId: string; // Example: "7d3dece7-ab86-e611-80e8-c4346bc5977c"
  fleetTypeName: string; // Example: "ADL Campervan"
  fleetTypeSlug: string; // Example: "campervan"
  serviceHours: ServiceHours;
  isAfterHoursPickUpAvailable: boolean; // Example: false
  isAfterHoursDropOffAvailable: boolean; // Example: false
}

export interface ServiceHours {
  sunday: DayHours;
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
}

export interface DayHours {
  open: string; // Example: "0800"
  close: string; // Example: "1655"
}

export interface Holiday {
  name: string; // Example: "Closed - Christmas Day"
  startDateTime: string; // Example: "2025-12-25T00:00:00"
  endDateTime: string; // Example: "2025-12-25T00:00:00"
  dow?: number; // Example: 7 (Day of week, optional)
}

export interface DefaultTimes {
  sunday: DayTimes;
  monday: DayTimes;
  tuesday: DayTimes;
  wednesday: DayTimes;
  thursday: DayTimes;
  friday: DayTimes;
  saturday: DayTimes;
}

export interface DayTimes {
  pickUp: string; // Example: "1000"
  dropOff: string; // Example: "1000"
}

export interface JucyTripAvailabilityResponse {
  error ?: string;
  status ?: number;
  availability?: JucyTripAvailability
}

export interface JucyTripAvailability {
  pickUpLocation: string; // Example: "ADL"
  dropOffLocation: string; // Example: "ADL"
  pickUpDate: string; // Example: "2025-11-01T10:00:00.000"
  dropOffDate: string; // Example: "2025-11-14T10:00:00.000"
  rentalDays: number; // Example: 14
  fleetCategories: FleetCategory[]; // Example: [{ name: "Crib", ... }]
}

export interface FleetCategory {
  name: string; // Example: "Crib"
  description: string; // Example: "JUCY Crib"
  code: string; // Example: "CRIB"
  categoryCode: string; // Example: "CRIB"
  id: string; // Example: "ee8a6517-ec88-e611-80e7-c4346bc5b2d4"
  type: string; // Example: "7d3dece7-ab86-e611-80e8-c4346bc5977c"
  rentalDays: number; // Example: 14
  fleetTypeCode: string; // Example: "campervan"
  availability: string; // Example: "FreeSell"
  availabilityMessage: string; // Example: "Available"
  dailyRate: RateDetail; // Example: { currencyCode: "AUD", value: 108.48 }
  total: RateDetail; // Example: { currencyCode: "AUD", value: 1518.72 }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mandatoryFees: any[]; // Example: []
  isAfterHourPickUp: boolean; // Example: false
}

export interface RateDetail {
  currencyCode: string; // Example: "AUD"
  value: number; // Example: 128.58
}
