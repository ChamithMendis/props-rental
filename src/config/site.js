// ============================================================
// SITE CONFIGURATION — edit this file to update business info
// ============================================================

export const SITE_CONFIG = {
  businessName: "StageProps",
  tagline: "Premium Props for Every Scene",
  phone: "+94 77 123 4567",
  whatsapp: "94771234567",         // no + or spaces
  email: "hello@stageprops.lk",
  address: "Colombo, Sri Lanka",
  instagram: "@stageprops.lk",
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
