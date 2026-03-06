import { Lightbulb, Rocket, Code, Briefcase } from "lucide-react";

export const TEXT_COLORS = [
  "#1A1A1B",
  "#1A365D",
  "#22543D",
  "#702459",
  "#742A2A",
  "#4A5568",
  "#166534",
  "#1E40AF",
  "#6B21A8",
  "#0F766E",
  "#F97316",
  "#3B82F6",
  "#EC4899",
];

export const HIGHLIGHT_COLORS = [
  "#FEF08A",
  "#91d7a9",
  "#87a4c9",
  "#FECACA",
  "#a884d0",
  "#ba9569",
  "#99F6E4",
  "#d0c191",
  "#F5F5F5",
];

export const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32"];
export const FONT_FAMILIES = [
  { label: "Default", value: "Inter" },
  { label: "Serif", value: "Georgia" },
  { label: "Mono", value: "Courier New" },
  { label: "Arial", value: "Arial" },
  { label: "Times", value: "Times New Roman" },
];

export const SLIDE_FONTS = [
  { label: "Inter (Modern)", value: "Inter, sans-serif" },
  { label: "Poppins (Creative)", value: "'Poppins', sans-serif" },
  { label: "Merriweather (Classic)", value: "'Merriweather', serif" },
  { label: "Space Grotesk (Tech)", value: "'Space Grotesk', sans-serif" },
];

export const LAYOUTS = [
  { id: "default", name: "Classic (Full Width)" },
  { id: "split_right", name: "Split (Text Left, Empty Right)" },
  { id: "split_left", name: "Split (Empty Left, Text Right)" },
  { id: "title_center", name: "Title Centered" },
];

export const SUGGESTIONS = [
  {
    icon: Rocket,
    title: "Startup Pitch Deck",
    sub: "Cover problem, solution, market size...",
  },
  {
    icon: Code,
    title: "Technical Workshop",
    sub: "Explain React Hooks to beginners",
  },
  {
    icon: Briefcase,
    title: "Quarterly Review",
    sub: "Q1 financial performance analysis",
  },
  {
    icon: Lightbulb,
    title: "Brainstorming Session",
    sub: "New marketing strategy ideas",
  },
];
