export const THEMES = [
  {
    id: "modern_blue",
    name: "Modern Blue",
    colors: {
      background: "#ffffff",
      text: "#1e293b",
      accent: "#3b82f6",
      secondary: "#64748b",
      border: "#e2e8f0",
    },
    font: "Inter, sans-serif",
  },
  {
    id: "minimalist_dark",
    name: "Midnight Dark",
    colors: {
      background: "#0f172a",
      text: "#f8fafc",
      accent: "#818cf8",
      secondary: "#94a3b8",
      border: "#334155",
    },
    font: "Inter, sans-serif",
  },
  {
    id: "creative_gradient",
    name: "Sunset Vibes",
    colors: {
      background: "#fff7ed",
      text: "#431407",
      accent: "#ea580c",
      secondary: "#9a3412",
      border: "#fed7aa",
    },
    font: "'Poppins', sans-serif",
  },
  {
    id: "college_classic",
    name: "College Classic",
    colors: {
      background: "#fdfbf7",
      text: "#27272a",
      accent: "#d97706",
      secondary: "#57534e",
      border: "#e7e5e4",
    },
    font: "'Merriweather', serif",
  },
  {
    id: "emerald_forest",
    name: "Emerald Forest",
    colors: {
      background: "#f0fdf4",
      text: "#064e3b",
      accent: "#10b981",
      secondary: "#065f46",
      border: "#dcfce7",
    },
    font: "'DM Sans', sans-serif",
  },
  {
    id: "neon_cyber",
    name: "Neon Cyber",
    colors: {
      background: "#000000",
      text: "#ffffff",
      accent: "#00ffcc",
      secondary: "#94a3b8",
      border: "#333333",
    },
    font: "'Space Grotesk', sans-serif",
  },
  {
    id: "royal_elegance",
    name: "Royal Elegance",
    colors: {
      background: "#2d1b4e",
      text: "#ffffff",
      accent: "#fbbf24",
      secondary: "#e9d5ff",
      border: "#4c1d95",
    },
    font: "'Playfair Display', serif",
  },
];

export const getThemeById = (id) =>
  THEMES.find((t) => t.id === id) || THEMES[0];
