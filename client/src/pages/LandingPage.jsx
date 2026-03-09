import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Hero, Stats, Features, HowItWorks, Pricing, CtaBanner, Footer } from "@/components/landing/Sections.jsx";
import { PLACEHOLDERS } from "@/config/editorConstants"
import GLOBAL_CSS from "@/globalcss";

const LandingPage = () => {
  const navigate = useNavigate();
  const go = () => navigate("/login");

  const [scrolled, setScrolled]   = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping]   = useState(false);
  const [phIdx, setPhIdx]         = useState(0);
  const [phText, setPhText]       = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (isTyping) return;
    let i = 0, deleting = false;
    const target = PLACEHOLDERS[phIdx];
    const t = setInterval(() => {
      if (!deleting) {
        setPhText(target.slice(0, ++i));
        if (i === target.length) setTimeout(() => { deleting = true; }, 1600);
      } else {
        setPhText(target.slice(0, --i));
        if (i === 0) { deleting = false; setPhIdx(p => (p + 1) % PLACEHOLDERS.length); clearInterval(t); }
      }
    }, 55);
    return () => clearInterval(t);
  }, [phIdx, isTyping]);

  return (
    <div className="bg-[#070712] text-white overflow-x-hidden" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      <Navbar scrolled={scrolled} onCta={go} />
      <Hero onCta={go} inputText={inputText} setInputText={setInputText}
        isTyping={isTyping} setIsTyping={setIsTyping} phText={phText} setPhIdx={setPhIdx} />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing onCta={go} />
      <CtaBanner onCta={go} />
      <Footer />
    </div>
  );
};

export default LandingPage;