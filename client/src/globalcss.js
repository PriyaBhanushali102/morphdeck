const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap');
.land-root {
  font-family: 'Inter', sans-serif;
  color: hsl(var(--foreground));
}

.land-root h1,
.land-root h2,
.land-root h3,
.land-root .logo-text {
  font-family: 'Sora', sans-serif;
  letter-spacing: -0.02em;
}

  /* ── Animations ── */
  @keyframes l-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
  @keyframes l-pulseEm { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4)} 70%{box-shadow:0 0 0 8px rgba(16,185,129,0)} }

  .l-fade-up { animation:l-fadeUp .65s cubic-bezier(.22,1,.36,1) both; }
  .l-pulse-em{ animation:l-pulseEm 2s ease infinite; }

  .ld1{animation-delay:.05s} .ld2{animation-delay:.15s} .ld3{animation-delay:.25s}
  .ld4{animation-delay:.35s} .ld5{animation-delay:.45s} .ld6{animation-delay:.55s}

  /* ── Primary CTA button (blue shimmer) ── */
  .l-btn-primary {
    position:relative; overflow:hidden;
    background:linear-gradient(135deg,#3b82f6,#2563eb);
    color:#fff; border:none; cursor:pointer;
    transition:transform .2s,box-shadow .2s;
    font-family:inherit;
  }

  .l-btn-primary:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(59,130,246,.35); }
  .l-btn-primary:active{ transform:translateY(0); }

  /* ── Ghost button — uses theme tokens ── */
  .l-btn-ghost {
    background:transparent;
    border:1px solid hsl(var(--border));
    color:hsl(var(--muted-foreground));
    cursor:pointer;
    transition:border-color .2s,color .2s,background .2s;
    font-family:inherit;
  }
  .l-btn-ghost:hover {
    border-color:rgba(59,130,246,.5);
    color:#3b82f6;
    background:rgba(59,130,246,.06);
  }

  /* ── Feature / testimonial card — uses theme card bg ── */
  .l-card {
    background:hsl(var(--card));
    border:1px solid hsl(var(--border));
    transition:border-color .3s,transform .3s,box-shadow .3s;
  }
  .l-card:hover {
    border-color:rgba(59,130,246,.3);
    transform:none;
    box-shadow:none;
  }

  /* ── Pill badge ── */
  .l-pill {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 12px; border-radius:999px;
    font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
    background:rgba(59,130,246,.1);
    border:1px solid rgba(59,130,246,.25);
    color:#3b82f6;
  }

  /* ── Navbar blur — uses theme background ── */
  .l-nav-scrolled {
    background:hsl(var(--background) / .88);
    backdrop-filter:blur(20px);
    border-bottom:1px solid hsl(var(--border));
  }

  /* ── Mockup window — uses theme card ── */
  .l-mockup {
    background:hsl(var(--card));
    border:1px solid hsl(var(--border));
    border-radius:16px; overflow:hidden;
    box-shadow:0 32px 80px rgba(0,0,0,.2),0 0 0 1px rgba(59,130,246,.05);
  }
  .l-mockup-bar {
    background:hsl(var(--muted));
    border-bottom:1px solid hsl(var(--border));
    padding:10px 16px;
    display:flex; align-items:center; gap:8px;
  }

  /* ── Pricing popular card ── */
  .l-pricing-popular {
    background:linear-gradient(145deg,rgba(59,130,246,.08),rgba(129,140,248,.04));
    border:1px solid rgba(59,130,246,.28);
    position:relative;
  }
  .l-pricing-popular::before {
    content:''; position:absolute; top:0; left:10%; right:10%; height:1px;
    background:linear-gradient(90deg,transparent,#3b82f6,#818cf8,transparent);
  }
`;


export default GLOBAL_CSS;
