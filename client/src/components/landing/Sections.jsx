import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Download,
  LayoutTemplate,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export const Navbar = ({ scrolled, onCta }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "l-nav-scrolled" : ""}`}>
    <div className="max-w-[1120px] mx-auto px-6 h-16 flex items-center justify-between">
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <img src="/logo.svg" alt="MorphDeck" className="w-10 h-10" />
        <span className="text-[17px] font-extrabold tracking-tight text-foreground">
          Morph<span className="text-primary">Deck</span>
        </span>
      </a>

      <div className="hidden md:flex gap-7">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors no-underline">
            {link.label}
          </a>
        ))}
      </div>

      <button onClick={onCta} className="l-btn-primary px-5 py-[9px] rounded-lg text-[13px] font-bold">
        Get started
      </button>
    </div>
  </nav>
);

export const Hero = ({ onCta, inputText, setInputText, isTyping, setIsTyping, phText }) => (
  <section className="relative min-h-screen flex items-center pt-[100px] pb-20 px-6 overflow-hidden bg-background">    <div className="max-w-[1120px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
    <div>
      <div className="l-pill l-fade-up ld1 mb-6 inline-flex">
        <Sparkles size={12} /> AI presentation builder
      </div>

      <h1 className="l-fade-up ld2 text-foreground font-black leading-[1.08] tracking-[-0.03em] mb-5" style={{ fontSize: "clamp(38px,5vw,62px)" }}>
        Turn rough ideas into clean slide decks.
      </h1>

      <p className="l-fade-up ld3 text-muted-foreground leading-[1.75] mb-8 max-w-[460px]" style={{ fontSize: 17 }}>
        Write a topic, get a simple first draft, then edit the slides your way. Useful for college projects, demos, reports, and quick presentations.
      </p>

      <div className="l-fade-up ld4 flex flex-col sm:flex-row gap-3 mb-4">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          placeholder={isTyping ? "" : phText || "Example: Explain MERN stack in 8 slides"}
          className="flex-1 px-4 py-3.5 rounded-xl text-sm text-foreground bg-card border border-border outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50"
        />
        <button onClick={onCta} className="l-btn-primary px-6 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center justify-center gap-1.5">
          Generate draft <ArrowRight size={14} />
        </button>
      </div>

      <p className="l-fade-up ld5 text-[13px] text-muted-foreground/70">
        Start with AI, finish with your own edits.
      </p>
    </div>

    <div className="l-fade-up ld4">
      <HeroPreview onCta={onCta} />
    </div>
  </div>
  </section>
);

const sampleSlides = [
  { title: "Project Overview", sub: "Problem, goal and audience", accent: "#10b981", bars: [0.7, 0.45, 0.85] },
  { title: "Key Points", sub: "Main ideas with simple structure", accent: "#3b82f6", bars: [0.45, 0.75, 0.6] },
  { title: "Next Steps", sub: "What to improve before presenting", accent: "#818cf8", bars: [0.8, 0.5, 0.65] },
];

const HeroPreview = ({ onCta }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sampleSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const slide = sampleSlides[current];

  return (
    <div className="l-mockup relative">
      <div className="l-mockup-bar">
        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/10" />
        <div className="flex-1" />
        <button onClick={onCta} className="text-[10px] font-bold px-2.5 py-0.5 rounded border border-border text-muted-foreground">
          Preview
        </button>
      </div>

      <div className="flex h-[280px]">
        <div className="w-16 p-2 border-r border-border/50 bg-muted/20 space-y-2">
          {sampleSlides.map((item, index) => (
            <button
              key={item.title}
              onClick={() => setCurrent(index)}
              className="w-full h-12 rounded-md bg-card border cursor-pointer p-1"
              style={{ borderColor: index === current ? item.accent : "transparent" }}
            >
              <div className="h-1 rounded mb-1" style={{ width: "70%", background: item.accent }} />
              <div className="h-1 rounded bg-muted-foreground/20 w-full mb-1" />
              <div className="h-1 rounded bg-muted-foreground/10 w-2/3" />
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="h-0.5 w-9 rounded mb-4" style={{ background: slide.accent }} />
            <h3 className="text-[20px] font-black text-foreground tracking-tight mb-1">{slide.title}</h3>
            <p className="text-[12px] text-muted-foreground">{slide.sub}</p>
          </div>

          <div className="space-y-3">
            {slide.bars.map((width, index) => (
              <div key={index} className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${width * 100}%`, background: slide.accent }} />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground">Draft saved</span>
            <span className="text-[10px] text-muted-foreground font-mono">{current + 1}/{sampleSlides.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Zap size={21} />,
    title: "Quick first draft",
    desc: "Generate a starting deck from one topic, then improve the content manually.",
  },
  {
    icon: <LayoutTemplate size={21} />,
    title: "Editable layouts",
    desc: "Change text, order, theme, and slide structure without fighting the tool.",
  },
  {
    icon: <Download size={21} />,
    title: "Export ready",
    desc: "Download your deck or share it when your final edits are done.",
  },
  {
    icon: <Share2 size={21} />,
    title: "Easy sharing",
    desc: "Send a presentation link for reviews, feedback, or quick demos.",
  },
];

export const Features = () => (
  <section id="features" className="py-24 px-6">
    <div className="max-w-[1120px] mx-auto">
      <div className="max-w-[560px] mb-12">
        <div className="l-pill inline-flex mb-4">Features</div>
        <h2 className="font-black text-foreground tracking-tight mb-4" style={{ fontSize: "clamp(28px,4vw,46px)" }}>
          A simple workflow for everyday presentations.
        </h2>
        <p className="text-muted-foreground text-[16px] leading-[1.7]">
          No fake productivity claims. Just a faster way to create a usable first version.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div key={feature.title} className="l-card rounded-2xl p-7">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 border border-border bg-muted/40 text-primary">
              {feature.icon}
            </div>
            <h3 className="text-[15px] font-bold text-foreground mb-2.5">{feature.title}</h3>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const steps = [
  ["01", "Describe your topic", "Add the topic, audience, and number of slides."],
  ["02", "Generate a draft", "Get a basic structure with editable slide content."],
  ["03", "Make it yours", "Fix wording, add examples, and adjust visuals."],
];

export const HowItWorks = () => (
  <section id="how-it-works" className="py-24 px-6 bg-muted/30 border-y border-border">
    <div className="max-w-[1120px] mx-auto">
      <div className="text-center mb-14">
        <div className="l-pill inline-flex mb-4">How it works</div>
        <h2 className="font-black text-foreground tracking-tight" style={{ fontSize: "clamp(28px,4vw,46px)" }}>
          From topic to draft in three steps.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map(([num, title, desc]) => (
          <div key={num} className="l-card rounded-2xl p-7">
            <span className="text-[12px] font-black text-primary">{num}</span>
            <h3 className="text-[17px] font-bold text-foreground mt-4 mb-2">{title}</h3>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const freeFeatures = [
  "Limited AI deck generation",
  "Basic themes",
  "PDF export",
  "Share link",
];

const proFeatures = [
  "More AI generations",
  "PPTX export",
  "Custom themes",
  "Priority generation",
];

const PlanCard = ({ name, price, note, features, highlighted, onCta }) => (
  <div className={`${highlighted ? "l-pricing-popular" : "l-card"} rounded-2xl p-8`}>
    <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">{name}</p>
    <div className="text-[48px] font-black text-foreground tracking-tight leading-none mb-2">{price}</div>
    <p className="text-[13px] text-muted-foreground mb-7">{note}</p>

    <ul className="space-y-3 mb-8 list-none p-0">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
          <Check size={13} strokeWidth={3} className="text-primary shrink-0" />
          {feature}
        </li>
      ))}
    </ul>

    <button onClick={onCta} className={`${highlighted ? "l-btn-primary" : "l-btn-ghost"} w-full py-3 rounded-xl text-[14px] font-bold`}>
      {highlighted ? "Upgrade" : "Start free"}
    </button>
  </div>
);

export const Pricing = ({ onCta }) => (
  <section id="pricing" className="py-24 px-6">
    <div className="max-w-[800px] mx-auto">
      <div className="text-center mb-14">
        <div className="l-pill inline-flex mb-4">Pricing</div>
        <h2 className="font-black text-foreground tracking-tight mb-3" style={{ fontSize: "clamp(28px,4vw,46px)" }}>
          Start free. Upgrade only if needed.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PlanCard name="Free" price="$0" note="For trying the product" features={freeFeatures} onCta={onCta} />
        <PlanCard name="Pro" price="$5" note="For regular use" features={proFeatures} highlighted onCta={onCta} />
      </div>
    </div>
  </section>
);

export const CtaBanner = ({ onCta }) => (
  <section className="py-24 px-6 text-center">
    <div className="max-w-[580px] mx-auto">
      <div className="l-pill inline-flex mb-6">Ready?</div>
      <h2 className="font-black text-foreground tracking-tight leading-[1.1] mb-5" style={{ fontSize: "clamp(32px,5vw,54px)" }}>
        Create your next presentation draft.
      </h2>
      <p className="text-muted-foreground text-[16px] mb-9 leading-[1.7]">
        Use AI for the starting point, then polish the deck with your own ideas.
      </p>
      <button onClick={onCta} className="l-btn-primary px-9 py-4 rounded-xl text-[15px] font-bold inline-flex items-center gap-2">
        Get started <ArrowRight size={15} />
      </button>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="py-8 px-6 border-t border-border">
    <div className="max-w-[1120px] mx-auto flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="MorphDeck" className="w-10 h-10" />
        <span className="text-[15px] font-extrabold tracking-tight text-foreground">
          Morph<span className="text-primary">Deck</span>
        </span>
      </div>
      <p className="text-[12px] text-muted-foreground/50">© 2025 MorphDeck</p>
    </div>
  </footer>
);
