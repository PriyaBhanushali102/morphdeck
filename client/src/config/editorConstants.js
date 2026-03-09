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

export const SLIDES = [
  {
    gradient: "linear-gradient(135deg,#1a0533,#0f1a3d)",
    accent: "#a78bfa",
    title: "Q4 Growth Strategy",
    sub: "Revenue · Retention · Roadmap",
    bars: [0.85, 0.6, 0.9, 0.45, 0.75],
    type: "chart",
  },
  {
    gradient: "linear-gradient(135deg,#001a1a,#0a1628)",
    accent: "#34d399",
    title: "Market Opportunity",
    sub: "$2.4B Total Addressable Market",
    bars: [0.3, 0.55, 0.8, 0.95, 1],
    type: "chart",
  },
  {
    gradient: "linear-gradient(135deg,#1a0800,#1a1a2e)",
    accent: "#fb923c",
    title: "Product Roadmap",
    sub: "2024 — 2025 Milestones",
    bars: [1, 0.75, 0.5, 0.25],
    type: "timeline",
  },
  {
    gradient: "linear-gradient(135deg,#0a001a,#0f0a2e)",
    accent: "#38bdf8",
    title: "Team & Culture",
    sub: "Building the future together",
    bars: [0.7, 0.85, 0.6, 0.9],
    type: "grid",
  },
];

export const FEATURES = [
  {
    icon: "⚡",
    color: "#a78bfa",
    title: "AI Generation",
    desc: "Type your topic and get a complete presentation in under 30 seconds.",
  },
  {
    icon: "🎨",
    color: "#38bdf8",
    title: "Beautiful Themes",
    desc: "Professionally designed themes, or build your own with the custom editor.",
  },
  {
    icon: "✏️",
    color: "#34d399",
    title: "Rich Text Editor",
    desc: "Full editor. Bold, italic, colors, font sizes — edit every word.",
  },
  {
    icon: "🖼️",
    color: "#f472b6",
    title: "AI Images",
    desc: "Add stunning visuals to any slide. AI generates contextual images in one click.",
  },
  {
    icon: "⤓",
    color: "#fb923c",
    title: "Export Anywhere",
    desc: "Download as PowerPoint or high-res PDF. Share a live link with anyone.",
  },
  {
    icon: "⟲",
    color: "#818cf8",
    title: "Full History",
    desc: "Never lose work. Unlimited undo with Ctrl+Z / Ctrl+Y.",
  },
];

export const STEPS = [
  {
    step: "01",
    icon: "💬",
    title: "Describe your topic",
    desc: "Type what you need — a pitch deck, quarterly review, or anything else.",
    color: "#a78bfa",
  },
  {
    step: "02",
    icon: "⚡",
    title: "AI builds your deck",
    desc: "MorphDeck generates structured slides with content and a matching theme.",
    color: "#38bdf8",
  },
  {
    step: "03",
    icon: "⤓",
    title: "Edit and export",
    desc: "Customize in the editor, then export as PPTX or PDF.",
    color: "#34d399",
  },
];

export const PLACEHOLDERS = [
  "Q4 investor pitch deck...",
  "Product launch presentation...",
  "Team retrospective...",
  "Marketing campaign overview...",
];

export const STATS = [
  { v: 12000, s: "+", label: "Presentations created", color: "#a78bfa" },
  { v: 4800, s: "+", label: "Happy creators", color: "#38bdf8" },
  { v: 30, s: "s", label: "Avg. generation time", color: "#34d399" },
];

export const FREE_FEATURES = [
  "5 AI presentations / month",
  "All themes included",
  "PDF & PPTX export",
  "Live share links",
];
export const PRO_FEATURES = [
  "Unlimited AI presentations",
  "Priority AI generation",
  "Custom branding & fonts",
  "Team collaboration (5 seats)",
  "Advanced analytics",
];
