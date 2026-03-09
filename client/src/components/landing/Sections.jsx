import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge, Counter, MagneticBtn } from "./ui";
import SlidePreview from "./SlidePreview";
import { FEATURES, STEPS, STATS, FREE_FEATURES, PRO_FEATURES } from "@/config/editorConstants"

const SERIF = "'Playfair Display',serif";
const PRI_BTN = { background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff", border: "none" };

export const Navbar = ({ scrolled, onCta }) => (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-white/[0.055]" : ""}`}
    style={{ background: scrolled ? "rgba(7,7,18,.88)" : "transparent", backdropFilter: scrolled ? "blur(28px)" : "none" }}>
    <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h16M4 10h10M4 15h13M4 20h8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-[17px] font-black tracking-tight">Morph<span className="text-violet-400">Deck</span></span>
      </div>
      <div className="hidden md:flex gap-8">
        {["Features","How it Works","Pricing"].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`}
            className="text-[13px] font-medium text-white/50 hover:text-white transition-colors no-underline">{item}</a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onCta} className="px-4 py-2 rounded-xl text-[13px] font-medium border border-white/10 text-white/60">Sign in</Button>
        <MagneticBtn onClick={onCta} style={{ ...PRI_BTN, padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>Try for free →</MagneticBtn>
      </div>
    </div>
  </nav>
);

export const Hero = ({ onCta, inputText, setInputText, isTyping, setIsTyping, phText, setPhIdx }) => (
  <section className="relative min-h-screen flex items-center justify-center px-6 pt-[100px] pb-20 grid-bg"
    style={{ background: "radial-gradient(ellipse 110% 75% at 15% 10%,rgba(124,58,237,.17),transparent 55%),radial-gradient(ellipse 75% 55% at 88% 78%,rgba(37,99,235,.13),transparent 55%)" }}>
    <div className="absolute top-[30%] left-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 pointer-events-none anim-orbit" style={{ boxShadow: "0 0 24px 8px #a78bfa55" }} />

    <div className="relative z-10 max-w-[1100px] w-full text-center">
      <div className="mb-9"><Badge>✦ AI Presentation Generator</Badge></div>

      <h1 className="font-black mb-7 leading-[1.15]" style={{ fontFamily: SERIF, fontSize: "clamp(48px,8.5vw,96px)" }}>
        <span className="wp wp1">Turn</span>{" "}<span className="wp wp2">any</span>{" "}<span className="wp wp3 shimmer">idea</span><br />
        <span className="wp wp4 text-white/90">into</span>{" "}<span className="wp wp5 text-white/80" style={{ fontStyle:"italic" }}>beautiful</span><br />
        <span className="wp wp6 gt-cool">slides</span>{" "}<span className="wp wp7 text-white/55" style={{ fontStyle:"italic" }}>in seconds.</span>
      </h1>

      <p className="fu fu1 text-white/40 max-w-[480px] mx-auto mb-11 leading-[1.85]" style={{ fontFamily:"'Lora',serif", fontStyle:"italic", fontSize:"clamp(15px,2vw,18px)" }}>
        MorphDeck uses AI to generate polished presentations from a single sentence — no design skills required.
      </p>

      <div style={{ display: "flex", gap: 10, alignItems: "stretch" }} className="fu fu2 max-w-[520px] mx-auto mb-10">
        <div style={{ flex: 1, minWidth: 0 }} className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 pointer-events-none">✦</span>
          <input value={inputText} onChange={e => setInputText(e.target.value)}
            onFocus={() => setIsTyping(true)}
            onBlur={() => { setIsTyping(false); if (!inputText) setPhIdx(p => (p + 1) % 4); }}
            placeholder={isTyping ? "" : (phText || "Describe your presentation...")}
            className="w-full pl-11 pr-4 py-4 rounded-2xl text-[15px] text-white outline-none border border-white/[0.09] focus:border-violet-400/45 placeholder:text-white/20"
            style={{ background: "rgba(255,255,255,.03)", fontFamily: "'Outfit',sans-serif" }} />
        </div>
        <MagneticBtn onClick={onCta} style={{ ...PRI_BTN, padding: "16px 28px", borderRadius: 16, fontSize: 15, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>Generate →</MagneticBtn>
      </div>

      <div className="fu fu3 flex items-center justify-center gap-3 mb-[76px]">
        <div className="flex">
          {["#a78bfa","#38bdf8","#34d399","#f472b6","#fb923c"].map((c, i) => (
            <div key={i} className="w-[30px] h-[30px] rounded-full border-[2.5px] border-[#070712] flex items-center justify-center text-[11px] font-black"
              style={{ background: c, color: "#070712", marginLeft: i > 0 ? -10 : 0 }}>
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <p className="text-[13px] text-white/40">Loved by <strong className="text-white">4,800+</strong> creators</p>
      </div>

      <div className="fu fu4 max-w-[760px] mx-auto px-4">
        <SlidePreview onCta={onCta} />
      </div>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
      <span className="text-[9px] text-white/20 tracking-[.15em] uppercase font-mono">Scroll</span>
      <div className="w-px h-7 anim-bounce" style={{ background: "linear-gradient(180deg,rgba(167,139,250,.4),transparent)" }} />
    </div>
  </section>
);

export const Stats = () => (
  <section className="py-[72px] px-6 border-t border-b border-white/[0.04]">
    <div className="max-w-[900px] mx-auto grid grid-cols-3 gap-8 text-center">
      {STATS.map(({ v, s, label, color }) => (
        <div key={label}>
          <div className="mb-2 font-black" style={{ fontFamily: SERIF, fontSize: "clamp(32px,5vw,52px)", background: `linear-gradient(135deg,${color},${color}88)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            <Counter end={v} suffix={s} />
          </div>
          <div className="text-[11px] text-white/30 tracking-[.08em] uppercase font-semibold">{label}</div>
        </div>
      ))}
    </div>
  </section>
);

export const Features = () => (
  <section id="features" className="py-[120px] px-6">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-[72px]">
        <div className="mb-6"><Badge>Features</Badge></div>
        <h2 className="font-black mb-4" style={{ fontFamily: SERIF, fontSize: "clamp(30px,5vw,54px)" }}>
          Everything to <span className="gt-warm" style={{ fontStyle:"italic" }}>present with confidence</span>
        </h2>
        <p className="text-white/40 text-[15px] max-w-[420px] mx-auto leading-[1.85]" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>
          From AI generation to PDF export — the full workflow, beautifully unified.
        </p>
      </div>
      <div className="grid gap-[18px]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))" }}>
        {FEATURES.map(({ icon, color, title, desc }) => {
          const ref = useRef(null);
          const [r, g, b] = [1,3,5].map(o => parseInt(color.slice(o, o+2), 16));
          return (
            <div key={title} ref={ref} className="rounded-[20px] p-7 transition-all duration-300"
              style={{ background: "rgba(255,255,255,.022)", border: "1px solid rgba(255,255,255,.065)" }}
              onMouseMove={e => {
                const rc = ref.current.getBoundingClientRect();
                const x = (e.clientX - rc.left) / rc.width - 0.5;
                const y = (e.clientY - rc.top) / rc.height - 0.5;
                ref.current.style.transform = `perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-6px)`;
                ref.current.style.background = `rgba(${r},${g},${b},.06)`;
                ref.current.style.borderColor = `${color}35`;
              }}
              onMouseLeave={() => { ref.current.style.transform = ""; ref.current.style.background = "rgba(255,255,255,.022)"; ref.current.style.borderColor = "rgba(255,255,255,.065)"; }}>
              <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] mb-5 border"
                style={{ background: `${color}14`, borderColor: `${color}22` }}>{icon}</div>
              <h3 className="text-[15px] font-bold text-white/90 mb-2.5">{title}</h3>
              <p className="text-[14px] text-white/40 leading-[1.7]" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>{desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export const HowItWorks = () => (
  <section id="how-it-works" className="py-[120px] px-6"
    style={{ background: "radial-gradient(ellipse 80% 55% at 50% 50%,rgba(124,58,237,.07),transparent 70%)" }}>
    <div className="max-w-[960px] mx-auto text-center">
      <div className="mb-6"><Badge>How it Works</Badge></div>
      <h2 className="font-black mb-[72px]" style={{ fontFamily: SERIF, fontSize: "clamp(30px,5vw,54px)" }}>
        Three steps to your <span className="gt-cool" style={{ fontStyle:"italic" }}>perfect deck</span>
      </h2>
      <div className="grid gap-10" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
        {STEPS.map(({ step, icon, title, desc, color }) => (
          <div key={step}
            onMouseEnter={e => { const el = e.currentTarget.querySelector(".si"); el.style.transform = "scale(1.1) translateY(-4px)"; el.style.boxShadow = `0 20px 50px ${color}22`; }}
            onMouseLeave={e => { const el = e.currentTarget.querySelector(".si"); el.style.transform = ""; el.style.boxShadow = ""; }}>
            <div className="si w-20 h-20 rounded-3xl mx-auto mb-7 flex items-center justify-center text-[30px] relative border transition-all duration-300"
              style={{ background: `linear-gradient(135deg,${color}16,${color}06)`, borderColor: `${color}25` }}>
              {icon}
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: color, color: "#070712" }}>{step.slice(1)}</span>
            </div>
            <h3 className="text-[16px] font-bold text-white/90 mb-3">{title}</h3>
            <p className="text-[14px] text-white/40 leading-[1.8] max-w-[240px] mx-auto" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Pricing = ({ onCta }) => (
  <section id="pricing" className="py-[120px] px-6">
    <div className="max-w-[840px] mx-auto text-center">
      <div className="mb-6"><Badge>Pricing</Badge></div>
      <h2 className="font-black mb-3.5" style={{ fontFamily: SERIF, fontSize: "clamp(30px,5vw,54px)" }}>
        Simple, <span className="gt-warm" style={{ fontStyle:"italic" }}>honest pricing</span>
      </h2>
      <p className="text-white/40 text-[15px] mb-[72px]" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>
        Start free. Upgrade when you need more power.
      </p>
      <div className="grid gap-6 text-left" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>

        <div className="rounded-3xl p-9 border border-white/[0.065] hover:-translate-y-1 transition-all duration-300" style={{ background: "rgba(255,255,255,.022)" }}>
          <h3 className="text-[18px] font-bold mb-1.5">Free</h3>
          <p className="text-[14px] text-white/40 mb-7" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>Perfect to get started</p>
          <div className="flex items-baseline gap-1 mb-9">
            <span className="font-black text-[58px]" style={{ fontFamily: SERIF }}>$0</span>
            <span className="text-[13px] text-white/30">/home forever</span>
          </div>
          <ul className="space-y-3.5 mb-9 list-none p-0">
            {FREE_FEATURES.map(f => <li key={f} className="text-[14px] text-white/55 flex items-center gap-2.5"><span className="text-emerald-400 font-bold">✓</span>{f}</li>)}
          </ul>
          <Button variant="ghost" onClick={onCta} className="w-full py-3.5 rounded-[14px] text-[15px] font-semibold border border-white/10 text-white/70">Get started free</Button>
        </div>

        <div className="rounded-3xl p-9 border border-violet-500/30 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg,rgba(124,58,237,.12),rgba(59,130,246,.08))" }}>
          <div className="absolute top-0 left-[20%] right-[20%] h-px" style={{ background: "linear-gradient(90deg,transparent,#a78bfa,#38bdf8,transparent)" }} />
          <div className="flex justify-between mb-7">
            <div>
              <h3 className="text-[18px] font-bold mb-1.5">Pro</h3>
              <p className="text-[14px] text-white/40" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>For power users</p>
            </div>
            <span className="self-start px-2.5 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>POPULAR</span>
          </div>
          <div className="flex items-baseline gap-1 mb-9">
            <span className="font-black text-[58px]" style={{ fontFamily: SERIF }}>$5</span>
            <span className="text-[13px] text-white/30">/home month</span>
          </div>
          <ul className="space-y-3.5 mb-9 list-none p-0">
            {PRO_FEATURES.map(f => <li key={f} className="text-[14px] text-white/65 flex items-center gap-2.5"><span className="text-violet-400 font-bold">✓</span>{f}</li>)}
          </ul>
          <MagneticBtn onClick={onCta} style={{ ...PRI_BTN, width: "100%", padding: "14px", borderRadius: 14, fontSize: 15, fontWeight: 700 }}>Start free trial →</MagneticBtn>
        </div>
      </div>
    </div>
  </section>
);

export const CtaBanner = ({ onCta }) => (
  <section className="py-[120px] px-6 text-center border-t border-white/[0.04]"
    style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%,rgba(124,58,237,.13),transparent 65%)" }}>
    <div className="mb-8"><Badge>Ready to start?</Badge></div>
    <h2 className="font-black mb-6 leading-[1.05]" style={{ fontFamily: SERIF, fontSize: "clamp(36px,6vw,72px)" }}>
      Your next deck is <span className="gt-elec" style={{ fontStyle:"italic" }}>30 seconds away</span>
    </h2>
    <p className="text-[17px] text-white/40 max-w-[380px] mx-auto mb-11 leading-[1.85]" style={{ fontFamily:"'Lora',serif", fontStyle:"italic" }}>
      Join 4,800+ creators who build better presentations with AI.
    </p>
    <MagneticBtn onClick={onCta} style={{ ...PRI_BTN, fontSize: 16, fontWeight: 700, padding: "18px 52px", borderRadius: 18 }}>
      Generate free →
    </MagneticBtn>
    <p className="mt-4 text-[12px] text-white/20">No credit card · Cancel anytime</p>
  </section>
);

export const Footer = () => (
  <footer className="py-8 px-6 border-t border-white/[0.04]">
    <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-4">
      <span className="text-[17px] font-black tracking-tight">Morph<span className="text-violet-400">Deck</span></span>
      <p className="text-[11px] text-white/20 font-mono">© 2025 MorphDeck · All rights reserved</p>
      <div className="flex gap-6">
        {["Privacy","Terms","Contact"].map(l => (
          <a key={l} href="#" className="text-[12px] text-white/30 hover:text-white no-underline transition-colors">{l}</a>
        ))}
      </div>
    </div>
  </footer>
);