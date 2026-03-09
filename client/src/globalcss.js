const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Lora:ital,wght@0,400;1,400&family=Syne+Mono&display=swap');

  .gt-cool  { background:linear-gradient(118deg,#c084fc,#818cf8,#38bdf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .gt-warm  { background:linear-gradient(118deg,#fbbf24,#f472b6,#a78bfa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .gt-elec  { background:linear-gradient(90deg,#a78bfa,#38bdf8,#34d399,#a78bfa); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:gFlow 4s linear infinite; }
  .shimmer  { background:linear-gradient(110deg,#fff 25%,#c084fc 42%,#818cf8 52%,#38bdf8 62%,#fff 78%); background-size:280% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 3.5s linear infinite; }

  @keyframes gFlow      { to { background-position:300% center; } }
  @keyframes shimmer    { 0%{background-position:250% center;} 100%{background-position:-100% center;} }
  @keyframes wordPop    { 0%{opacity:0;transform:translateY(24px) skewY(3deg);filter:blur(8px);} 100%{opacity:1;transform:none;filter:none;} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:none;} }
  @keyframes floatBadge { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-9px);} }
  @keyframes barGrow    { from{transform:scaleY(0);opacity:0;} to{transform:scaleY(1);opacity:1;} }
  @keyframes pulse      { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.45;transform:scale(.75);} }
  @keyframes orbit      { from{transform:translateX(-50%) rotate(0deg) translateX(160px) rotate(0deg);} to{transform:translateX(-50%) rotate(360deg) translateX(160px) rotate(-360deg);} }
  @keyframes bounce     { 0%,100%{transform:translateY(0);opacity:1;} 50%{transform:translateY(6px);opacity:.4;} }

  .wp { display:inline-block; margin-right:0.22em; animation:wordPop .7s cubic-bezier(.22,1,.36,1) both; }
  .wp1{animation-delay:.00s;} .wp2{animation-delay:.11s;} .wp3{animation-delay:.22s;}
  .wp4{animation-delay:.33s;} .wp5{animation-delay:.44s;} .wp6{animation-delay:.56s;} .wp7{animation-delay:.68s;}

  .fu{animation:fadeUp .9s cubic-bezier(.22,1,.36,1) both;}
  .fu1{animation-delay:.75s;} .fu2{animation-delay:.9s;} .fu3{animation-delay:1.05s;} .fu4{animation-delay:1.2s;}

  .anim-float  { animation:floatBadge 4s ease-in-out infinite; }
  .anim-float2 { animation:floatBadge 4s ease-in-out infinite; animation-delay:2s; }
  .anim-pulse  { animation:pulse 2s ease infinite; }
  .anim-bounce { animation:bounce 2s ease-in-out infinite; }
  .anim-orbit  { animation:orbit 14s linear infinite; }

  .grid-bg {
    background-image: linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);
    background-size: 72px 72px;
  }

  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#070712;}
  ::-webkit-scrollbar-thumb{background:rgba(124,58,237,.35);border-radius:2px;}
`;

export default GLOBAL_CSS;
