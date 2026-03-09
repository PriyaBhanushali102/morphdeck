import { useState, useEffect, useRef } from "react";

export const Badge = ({ children }) => (
  <span
    className="inline-block px-3.5 py-[5px] rounded-full text-[10px] font-bold tracking-widest uppercase border border-violet-400/20 text-violet-300"
    style={{ background: "rgba(167,139,250,.09)" }}
  >
    {children}
  </span>
);

export const Counter = ({ end, suffix = "" }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return;
      fired.current = true;
      let v = 0;
      const tick = setInterval(() => {
        v += (end / 1800) * 16;
        if (v >= end) { setN(end); clearInterval(tick); }
        else setN(Math.floor(v));
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);

  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
};

export const MagneticBtn = ({ children, style, onClick }) => {
  const ref = useRef(null);
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform .25s cubic-bezier(.22,1,.36,1)",
        ...style
      }}
      onMouseMove={e => {
        const b = ref.current.getBoundingClientRect();
        ref.current.style.transform =
          `translate(${(e.clientX - b.left - b.width / 2) * 0.22}px,${(e.clientY - b.top - b.height / 2) * 0.22}px)`;
      }}
      onMouseLeave={() => { ref.current.style.transform = ""; }}
    >
      {children}
    </button>
  );
};