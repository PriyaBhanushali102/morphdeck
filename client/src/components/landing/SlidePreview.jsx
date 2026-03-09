import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SLIDES } from "@/config/editorConstants";

const SlideBody = ({ s }) => {
  if (s.type === "chart") return (
    <div className="flex items-end gap-1.5 h-[75px]">
      {s.bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t"
          style={{ height: `${h * 100}%`, background: i % 2 === 0 ? `linear-gradient(180deg,${s.accent},${s.accent}55)` : "rgba(255,255,255,.07)", animation: `barGrow .55s cubic-bezier(.22,1,.36,1) ${i * 75}ms both` }} />
      ))}
    </div>
  );

  if (s.type === "timeline") return (
    <div className="flex flex-col gap-2.5">
      {s.bars.map((w, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.accent, opacity: w }} />
          <div className="flex-1 h-1.5 rounded bg-white/[0.06]">
            <div className="h-full rounded" style={{ width: `${w * 100}%`, background: `${s.accent}55` }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {s.bars.map((v, i) => (
        <div key={i} className="rounded-xl p-2.5 flex items-center gap-2 border border-white/[0.06]" style={{ background: "rgba(255,255,255,.04)" }}>
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: `${s.accent}18` }} />
          <div className="flex-1">
            <div className="h-[5px] rounded mb-1 bg-white/[0.14]" style={{ width: `${v * 100}%` }} />
            <div className="h-1 rounded bg-white/[0.07] w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

const SlidePreview = ({ onCta }) => {
  const [cur, setCur] = useState(0);
  const [anim, setAnim] = useState(false);
  const [dir, setDir] = useState(1);

  const goTo = (i) => {
    if (i === cur) return;
    setDir(i > cur ? 1 : -1);
    setAnim(true);
    setTimeout(() => { setCur(i); setAnim(false); }, 380);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1); setAnim(true);
      setTimeout(() => { setCur(p => (p + 1) % SLIDES.length); setAnim(false); }, 380);
    }, 3400);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[cur];

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%,${s.accent}22,transparent 70%)`, filter: "blur(35px)", transform: "scale(1.3) translateY(10%)", transition: "background .8s" }} />

      <div className="relative rounded-2xl overflow-hidden border border-white/[0.09]" style={{ background: "#0b0b1a", boxShadow: "0 48px 120px rgba(0,0,0,.65)" }}>

        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,.025)" }}>
          <div className="flex gap-1.5">
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
          </div>
          <div className="flex-1 mx-5 flex justify-center">
            <div className="flex items-center px-3 rounded-lg border border-white/[0.06] max-w-[280px] h-6" style={{ background: "rgba(255,255,255,.04)" }}>
              <span className="text-[10px] text-white/20 font-mono">app.morphdeck.ai/homepresent/homexK9mZ</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCta} className="text-[11px] font-bold px-2.5 py-1 rounded-lg border"
            style={{ background: `${s.accent}18`, color: s.accent, borderColor: `${s.accent}35` }}>Share</Button>
        </div>

        <div className="flex h-[300px]">
          <div className="w-[72px] flex flex-col gap-2 p-2 border-r border-white/[0.05]" style={{ background: "rgba(0,0,0,.18)" }}>
            {SLIDES.map((sl, i) => (
              <button key={i} onClick={() => goTo(i)} className="h-[50px] rounded-lg overflow-hidden relative cursor-pointer transition-all duration-300"
                style={{ background: sl.gradient, border: `2px solid ${i === cur ? sl.accent : "rgba(255,255,255,.05)"}`, opacity: i === cur ? 1 : 0.4 }}>
                <div className="absolute inset-0 p-1.5">
                  <div className="h-[5px] rounded mb-1" style={{ width: "68%", background: sl.accent }} />
                  <div className="h-1 rounded mb-0.5 bg-white/20 w-[90%]" />
                  <div className="h-1 rounded bg-white/10 w-[60%]" />
                </div>
              </button>
            ))}
          </div>

          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 p-6 flex flex-col justify-between"
              style={{ background: s.gradient, opacity: anim ? 0 : 1, transform: anim ? `translateX(${dir * 24}px) scale(.98)` : "none", transition: "opacity .35s, transform .35s" }}>
              <div>
                <div className="flex justify-between mb-3.5">
                  <div className="h-0.5 w-9 rounded" style={{ background: s.accent }} />
                  <span className="text-[9px] font-mono" style={{ color: `${s.accent}70` }}>{String(cur + 1).padStart(2, "0")} /home {String(SLIDES.length).padStart(2, "0")}</span>
                </div>
                <h3 className="text-[18px] font-black leading-tight mb-1 text-white" style={{ fontFamily: "'Playfair Display',serif" }}>{s.title}</h3>
                <p className="text-[11px] text-white/40">{s.sub}</p>
              </div>
              <SlideBody s={s} />
              <div className="h-px rounded" style={{ background: `linear-gradient(90deg,${s.accent}50,transparent)` }} />
            </div>
          </div>

          <div className="w-10 flex flex-col items-center pt-3 gap-1.5 border-l border-white/[0.05]" style={{ background: "rgba(0,0,0,.18)" }}>
            {["✦","⊞","🎨","⤓"].map(ic => (
              <Button key={ic} variant="ghost" size="icon" onClick={onCta}
                className="w-7 h-7 rounded-md text-[11px] text-white/30"
                style={{ background: "rgba(255,255,255,.04)" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${s.accent}18`; e.currentTarget.style.color = s.accent; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.color = ""; }}>
                {ic}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/[0.05]" style={{ background: "rgba(0,0,0,.28)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 anim-pulse" />
            <span className="text-[10px] text-white/30">Auto-saved</span>
          </div>
          <div className="flex gap-1">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className="h-[5px] rounded transition-all duration-300 border-none cursor-pointer"
                style={{ width: i === cur ? 18 : 5, background: i === cur ? s.accent : "rgba(255,255,255,.14)" }} />
            ))}
          </div>
          <span className="text-[10px] text-white/20 font-mono">{cur + 1} /home {SLIDES.length}</span>
        </div>
      </div>

      <div className="absolute -top-4 -right-2 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-2xl anim-float" style={{ background: "rgba(11,11,26,.92)" }}>
        <span className="text-base">⚡</span>
        <div>
          <div className="text-[11px] font-bold text-white">Generated in 28s</div>
          <div className="text-[9px] text-white/30">8 slides · AI-powered</div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border border-white/10 backdrop-blur-2xl anim-float2" style={{ background: "rgba(11,11,26,.92)" }}>
        <div className="flex">
          {["#a78bfa","#38bdf8","#34d399"].map((c, i) => (
            <div key={c} className="w-5 h-5 rounded-full border-2" style={{ background: c, borderColor: "#0b0b1a", marginLeft: i > 0 ? -6 : 0 }} />
          ))}
        </div>
        <span className="text-[11px] text-white/60 font-semibold">4,800+ creators</span>
      </div>
    </div>
  );
};

export default SlidePreview;