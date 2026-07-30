export interface SegmentRelation {
  segment: string;
  subSegments: string[];
}

export const mockSegments: SegmentRelation[] = [
  {
    segment: "Automotive Lubricants",
    subSegments: ["Logistics & Fleet", "Passenger Car Workshops", "Two-Wheeler Dealers", "Commercial Fleet Operations"]
  },
  {
    segment: "Industrial Oils",
    subSegments: ["Metalworking Fluids", "Hydraulic Systems", "Gear & Bearing Lubrication", "Turbine & Compressor Oils"]
  },
  {
    segment: "Marine & Energy",
    subSegments: ["Coastal Shipping", "Offshore Power Generation", "Deep-Sea Vessel Maintenance"]
  },
  {
    segment: "Specialty Lubricants",
    subSegments: ["High-Temperature Grease", "Food-Grade Lubricants", "Biodegradable Lubricants"]
  }
];
