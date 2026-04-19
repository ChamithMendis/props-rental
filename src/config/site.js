// ============================================================
// SITE CONFIGURATION — edit this file to update business info
// ============================================================

export const SITE_CONFIG = {
  businessName: "KARTZProps",
  tagline: "Premium Props for Every Scene",
  phone: "+94 77 089 0566",
  whatsapp: "94770890566",         // no + or spaces
  email: "kasunksn27@gmail.com",
  address: "Colombo, Sri Lanka",
  instagram: "@kasun_sanjana",
  adminPassword: "admin2024",      // Change before deploying!
};

export const CATEGORIES = [
  "All",
  "Furniture",
  "Lighting",
  "Textiles",
  "Decor",
  "Vintage",
  "Industrial",
  "Floral",
  "Electronics",
  "Outdoor",
  "Other",
];

// Image naming convention displayed in Admin UI
export const IMAGE_CONVENTION = {
  format: "[category]_[item-name]_[variant]_[YYYYMMDD].jpg",
  example: "furniture_vintage-sofa_main_20240418.jpg",
  resolution: "1200 × 900 px (4:3 landscape)",
  maxSize: "10 MB (Cloudinary free tier)",
  formats: "JPG, PNG, or WebP — auto-optimized on delivery",
};
