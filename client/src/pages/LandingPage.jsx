// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Navbar,
//   Hero,
//   LogoStrip,
//   Stats,
//   Features,
//   HowItWorks,
//   Pricing,
//   CtaBanner,
//   Footer,
// } from "@/components/landing/Sections.jsx";
// import { PLACEHOLDERS } from "@/config/editorConstants";
// import GLOBAL_CSS from "@/globalcss";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   const go = () => navigate("/login");

//   const [scrolled, setScrolled] = useState(false);
//   const [inputText, setInputText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [phIdx, setPhIdx] = useState(0);
//   const [phText, setPhText] = useState("");

//   useEffect(() => {
//     document.title = "MorphDeck — AI Presentation Generator";
//   }, []);

//   useEffect(() => {
//     const fn = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", fn, { passive: true });
//     return () => window.removeEventListener("scroll", fn);
//   }, []);

//   useEffect(() => {
//     if (isTyping) return;
//     let i = 0, deleting = false;
//     const target = PLACEHOLDERS[phIdx];
//     const t = setInterval(() => {
//       if (!deleting) {
//         setPhText(target.slice(0, ++i));
//         if (i === target.length) setTimeout(() => { deleting = true; }, 1600);
//       } else {
//         setPhText(target.slice(0, --i));
//         if (i === 0) {
//           deleting = false;
//           setPhIdx(p => (p + 1) % PLACEHOLDERS.length);
//           clearInterval(t);
//         }
//       }
//     }, 55);
//     return () => clearInterval(t);
//   }, [phIdx, isTyping]);

//   return (
//     <div className="land-root">
//       <style>{GLOBAL_CSS}</style>

//       <Navbar scrolled={scrolled} onCta={go} />
//       <Hero
//         onCta={go}
//         inputText={inputText}
//         setInputText={setInputText}
//         isTyping={isTyping}
//         setIsTyping={setIsTyping}
//         phText={phText}
//         setPhIdx={setPhIdx}
//       />
//       <LogoStrip />
//       <Stats />
//       <Features />
//       <HowItWorks />
//       <Pricing onCta={go} />
//       <CtaBanner onCta={go} />
//       <Footer />
//     </div>
//   );
// };

// export default LandingPage;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  Pricing,
  CtaBanner,
  Footer,
} from "@/components/landing/Sections.jsx";

import { PLACEHOLDERS } from "@/config/editorConstants";
import GLOBAL_CSS from "@/globalcss";

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");

  const goToLogin = () => navigate("/login");

  useEffect(() => {
    document.title = "MorphDeck";
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isTyping || inputText) return;

    const text = PLACEHOLDERS[placeholderIndex] || "";
    let index = 0;

    const intervalId = setInterval(() => {
      index += 1;
      setPlaceholderText(text.slice(0, index));

      if (index === text.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setPlaceholderText("");
          setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }, 1200);
      }
    }, 45);

    return () => clearInterval(intervalId);
  }, [placeholderIndex, isTyping, inputText]);

  return (
    <main className="land-root">
      <style>{GLOBAL_CSS}</style>

      <Navbar scrolled={scrolled} onCta={goToLogin} />
      <Hero
        onCta={goToLogin}
        inputText={inputText}
        setInputText={setInputText}
        isTyping={isTyping}
        setIsTyping={setIsTyping}
        phText={placeholderText}
      />
      <Features />
      <HowItWorks />
      <Pricing onCta={goToLogin} />
      <CtaBanner onCta={goToLogin} />
      <Footer />
    </main>
  );
};

export default LandingPage;
