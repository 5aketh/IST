import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── Live counter hook ───────────────────────────────────────────────────────
function useCounter(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(id); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return value;
}

// ─── Floating particles ───────────────────────────────────────────────────────
interface Particle { id: number; x: number; y: number; size: number; speed: number; opacity: number; drift: number }

function ParticleField() {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      opacity: Math.random() * 0.5 + 0.1,
      drift: (Math.random() - 0.5) * 0.2,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(255, 107, 0, ${p.opacity})`,
            animation: `float-particle-${p.id % 6} ${8 / p.speed}s linear infinite`,
            boxShadow: `0 0 ${p.size * 3}px rgba(255,107,0,${p.opacity * 0.8})`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated stat bar ────────────────────────────────────────────────────────
function StatBar({ label, value, max, active }: { label: string; value: number; max: number; active: boolean }) {
  const pct = active ? (value / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1 font-mono text-xs">
        <span style={{ color: '#888' }}>{label}</span>
        <span style={{ color: '#ff9a40' }}>{value.toLocaleString()}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,107,0,0.1)' }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #cc5500, #ff9a40)',
            boxShadow: '0 0 8px rgba(255,107,0,0.6)',
            transition: 'width 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Live line chart ──────────────────────────────────────────────────────────
function LiveLineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<number[]>(Array.from({ length: 60 }, () => 0.3 + Math.random() * 0.4));
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let lastUpdate = performance.now();

    function draw(now: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx.clearRect(0, 0, w, h);

      if (now - lastUpdate > 140) {
        const last = dataRef.current[dataRef.current.length - 1];
        const next = Math.max(0.05, Math.min(0.95, last + (Math.random() - 0.5) * 0.04));
        dataRef.current.push(next);
        if (dataRef.current.length > 60) dataRef.current.shift();
        lastUpdate = now;
      }

      const data = dataRef.current;
      const stepX = w / (data.length - 1);

      // fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255,107,0,0.25)');
      grad.addColorStop(1, 'rgba(255,107,0,0)');
      ctx.beginPath();
      ctx.moveTo(0, h * (1 - data[0]));
      data.forEach((v, i) => ctx.lineTo(i * stepX, h * (1 - v)));
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // line
      ctx.beginPath();
      ctx.moveTo(0, h * (1 - data[0]));
      data.forEach((v, i) => ctx.lineTo(i * stepX, h * (1 - v)));
      ctx.strokeStyle = '#ff6b00';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(255,107,0,0.7)';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      frameRef.current = requestAnimationFrame(draw);
    }

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={80}
      className="w-full"
      style={{ display: 'block' }}
    />
  );
}

// ─── Rotating ring ────────────────────────────────────────────────────────────
function RotatingRing({ value, label }: { value: number; label: string }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setProgress(value), 400);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="108" height="108" viewBox="0 0 108 108">
        {/* bg ring */}
        <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,107,0,0.1)" strokeWidth="6" />
        {/* animated ring */}
        <circle
          cx="54"
          cy="54"
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          transform="rotate(-90 54 54)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)', filter: 'drop-shadow(0 0 6px rgba(255,107,0,0.6))' }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cc5500" />
            <stop offset="100%" stopColor="#ff9a40" />
          </linearGradient>
        </defs>
        <text x="54" y="49" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="14" fill="#ff9a40">
          {Math.round(progress * 100)}%
        </text>
        <text x="54" y="65" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#666">
          {label}
        </text>
      </svg>
    </div>
  );
}

// ─── Scrolling data ticker ────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'ACCURACY → 99.4%', 'SAMPLES → 2.4M', 'F1_SCORE → 0.981', 'PRECISION → 0.976',
  'RECALL → 0.987', 'AUC_ROC → 0.998', 'LOSS → 0.0082', 'EPOCHS → 240',
  'BATCH → 512', 'LR → 3e-4', 'PARAMS → 124M', 'INFERENCE → 12ms',
];

function DataTicker() {
  return (
    <div className="overflow-hidden whitespace-nowrap font-mono text-xs py-2" style={{ borderTop: '1px solid rgba(255,107,0,0.2)', borderBottom: '1px solid rgba(255,107,0,0.2)' }}>
      <div className="inline-block animate-ticker">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-6" style={{ color: i % 2 === 0 ? '#ff9a40' : '#888' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function scrollToNotebook() {
  document.getElementById('notebook')?.scrollIntoView({ behavior: 'smooth' });
}

// ─── Main landing page ────────────────────────────────────────────────────────
export function LandingPage() {
  const onEnter = scrollToNotebook;
  const [statsVisible, setStatsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setStatsVisible(true), 600);
    return () => clearTimeout(id);
  }, []);

  const popSize = useCounter(27_901, 2000, statsVisible);
  const sampSize = useCounter(2500, 1800, statsVisible);
  const samps = useCounter(4, 1600, statsVisible);
  const mods = useCounter(3, 2200, statsVisible);

  const handleOpenDataset = (event: React.MouseEvent<HTMLButtonElement>): void => {
    window.open("https://www.kaggle.com/datasets/hopesb/student-depression-dataset", "_blank", "noopener,noreferrer");
  };
  const handleOpenColab = (event: React.MouseEvent<HTMLButtonElement>): void => {
    window.open("https://colab.research.google.com/drive/1CUafdtw2H6ytSJ7tYaF1YxhXy2lGx3ji#scrollTo=gAi9Vt36_Sgu", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#080808', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Global keyframe injector */}
      <style>{`
        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-ticker { animation: ticker 28s linear infinite; }
        @keyframes scanline { 0% { top: -5% } 100% { top: 105% } }
        .scanline { animation: scanline 6s linear infinite; }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        .blink { animation: blink 1s step-end infinite; }
        @keyframes float-up { 0% { transform: translateY(0) } 100% { transform: translateY(-100vh) opacity(0) } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .fade-in-up-delay-1 { animation: fade-in-up 0.8s 0.15s ease-out both; }
        .fade-in-up-delay-2 { animation: fade-in-up 0.8s 0.3s ease-out both; }
        .fade-in-up-delay-3 { animation: fade-in-up 0.8s 0.45s ease-out both; }
        .fade-in-up-delay-4 { animation: fade-in-up 0.8s 0.6s ease-out both; }
        @keyframes grid-pulse { 0%,100% { opacity: 0.03 } 50% { opacity: 0.07 } }
        .grid-pulse { animation: grid-pulse 4s ease-in-out infinite; }
        @keyframes glow-ring { 0%,100% { box-shadow: 0 0 20px rgba(255,107,0,0.3) } 50% { box-shadow: 0 0 50px rgba(255,107,0,0.7) } }
        .glow-ring { animation: glow-ring 3s ease-in-out infinite; }
      `}</style>

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none grid-pulse"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,107,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Scanline */}
      <div
        className="scanline absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.3), transparent)', top: 0 }}
      />

      {/* Particles */}
      <ParticleField />

      {/* Gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 40%, rgba(8,8,8,0.85) 100%)' }}
      />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center" style={{ paddingTop: '80px', paddingBottom: '120px' }}>

        {/* Title */}
        <h1 className="fade-in-up-delay-1 font-mono mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', color: '#f0f0f0', lineHeight: 1.05, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
          Analysis of Kaggle's<br />
          <span style={{ color: '#ff6b00', textShadow: '0 0 40px rgba(255,107,0,0.5)' }}>
            Student Depression Dataset
          </span>
        </h1>

        {/* Subtitle */}
        <p className="fade-in-up-delay-2 font-mono mb-10 max-w-xl leading-relaxed" style={{ fontSize: '0.9rem', color: '#888' }}>
          Analyzing mental health trends and predictors among students.
        </p>

        {/* CTAs */}
        <div className="fade-in-up-delay-3 flex flex-wrap gap-4 justify-center mb-16">
          <button
            onClick={handleOpenDataset}
            className="font-mono px-8 py-3 rounded transition-all glow-ring"
            style={{
              background: 'linear-gradient(135deg, #cc5500, #ff6b00)',
              color: '#fff',
              border: 'none',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            VIEW DATASET
          </button>
          <button
            onClick={handleOpenColab}
            className="font-mono px-8 py-3 rounded transition-all"
            style={{
              background: 'transparent',
              color: '#d0d0d0',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,107,0,0.4)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
          >
            VIEW COLAB
          </button>
        </div>

        {/* Live chart strip */}
        <div className="fade-in-up-delay-4 w-full max-w-2xl rounded-lg overflow-hidden mb-10"
          style={{ background: 'rgba(20,18,16,0.7)', border: '1px solid rgba(255,107,0,0.2)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center justify-between px-4 py-2 font-mono text-xs" style={{ borderBottom: '1px solid rgba(255,107,0,0.15)', color: '#666' }}>
            <span>live_metrics.stream</span>
            <span className="blink" style={{ color: '#ff6b00' }}>● RECORDING</span>
          </div>
          <div className="px-4 py-3">
            <LiveLineChart />
          </div>
        </div>

        {/* Data ticker */}
        <div className="w-full max-w-2xl fade-in-up-delay-4">
          <DataTicker />
        </div>
      </div>

      {/* ── STATS SECTION ────────────────────────────────────────── */}
      <div className="relative z-10 px-6 pb-24">
        <div className="max-w-5xl mx-auto">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.4))' }} />
            <span className="font-mono text-xs px-4 py-1 rounded-full" style={{ color: '#ff9a40', border: '1px solid rgba(255,107,0,0.3)' }}>ALL YOU NEED TO KNOW</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.4), transparent)' }} />
          </div>

          {/* Counter cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'POPULATION SIZE', value: popSize, suffix: ' X 18' },
              { label: 'SAMPLE SIZE', value: sampSize, suffix: ' X 18' },
              { label: 'SAMPLINGS', value: samps, suffix: '' },
              { label: 'MODELS', value: mods, suffix: '' },
            ].map(({ label, value, suffix }, i) => (
              <div
                key={i}
                className="rounded-lg p-5 text-center"
                style={{ background: 'rgba(22,20,18,0.7)', border: '1px solid rgba(255,107,0,0.2)', backdropFilter: 'blur(8px)' }}
              >
                <div className="font-mono mb-1" style={{ fontSize: '1.8rem', color: '#ff6b00', textShadow: '0 0 20px rgba(255,107,0,0.4)', lineHeight: 1 }}>
                  {value.toLocaleString()}{suffix}
                </div>
                <div className="font-mono text-xs" style={{ color: '#666' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Ring metrics + bar stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rings */}
            <div className="rounded-lg p-6"
              style={{ background: 'rgba(22,20,18,0.7)', border: '1px solid rgba(255,107,0,0.2)', backdropFilter: 'blur(8px)' }}>
              <div className="font-mono text-xs mb-6" style={{ color: '#888' }}>DATA TYPES</div>
              {/* <div className="flex justify-around"> */}
              {/* <RotatingRing value={0.444} label="DECIMAL" />
                <RotatingRing value={0.333} label="STRING" />
                <RotatingRing value={0.111} label="BOOLEAN" />
                <RotatingRing value={0.111} label="OTHERS" /> */}
              {/* </div> */}
              <StatBar label="DECIMAL" value={8} max={18} active={statsVisible} />
              <StatBar label="STRING" value={6} max={18} active={statsVisible} />
              <StatBar label="BOOLEAN" value={2} max={18} active={statsVisible} />
              <StatBar label="OTHERS" value={2} max={18} active={statsVisible} />
            </div>

            {/* Stat bars */}
            <div className="rounded-lg p-6"
              style={{ background: 'rgba(22,20,18,0.7)', border: '1px solid rgba(255,107,0,0.2)', backdropFilter: 'blur(8px)' }}>
              <div className="font-mono text-xs mb-4" style={{ color: '#888' }}>ABOUT DATASET</div>
              {/* <StatBar label="training_set" value={1_680_000} max={2_800_000} active={statsVisible} />
              <StatBar label="validation_set" value={560_000} max={2_800_000} active={statsVisible} />
              <StatBar label="test_set" value={280_000} max={2_800_000} active={statsVisible} />
              <StatBar label="augmented" value={840_000} max={2_800_000} active={statsVisible} /> */}
              <p className="font-mono text-xs mb-6" style={{ fontSize: '10px' }}>
                A student depression dataset typically contains data aimed at analyzing, understanding, and predicting depression levels among students. It may include features such as demographic information (age, gender), academic performance (grades, attendance), lifestyle habits (sleep patterns, exercise, social activities), mental health history, and responses to standardized depression scales.<br></br><br></br>
                These datasets are valuable for research in psychology, data science, and education to identify factors contributing to student depression and to design early intervention strategies. Ethical considerations like privacy, informed consent, and anonymization of data are crucial in working with such sensitive information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURE CARDS ─────────────────────────────────────────── */}
      <div className="relative z-10 px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.4))' }} />
            <span className="font-mono text-xs px-4 py-1 rounded-full" style={{ color: '#ff9a40', border: '1px solid rgba(255,107,0,0.3)' }}>OBJECTIVE</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,107,0,0.4), transparent)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: '◇',
                title: 'CLEANING',
                desc: 'Handling missing values, encoding high-cardinality categorical features.',
              },
              {
                icon: '⟐',
                title: 'SAMPLING',
                desc: 'Generate 4 distinct sampling subsets of size n = 2500.',
              },
              {
                icon: '◈',
                title: 'MODEL FITTING',
                desc: 'Train 3 state-of-the-art tree models (Random Forest, LightGBM, and XGBoost)',
              },
              {
                icon: '◆',
                title: 'CONCLUSION',
                desc: 'Find the ultimate combination of sample and model'
              },
            ].map(({ icon, title, desc }, i) => (
              <div
                key={i}
                /* Changes made below: 
                  Added `md:col-start-2` specifically for the 4th item (index 3) 
                  so it starts in the middle column on medium screens and up.
                */
                className={`rounded-lg p-6 group transition-all duration-300 ${i === 3 ? 'md:col-start-2' : ''
                  }`}
                style={{ background: 'rgba(18,16,14,0.75)', border: '1px solid rgba(255,107,0,0.18)', cursor: 'default' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,107,0,0.45)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 30px rgba(255,107,0,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,107,0,0.18)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div className="font-mono mb-4" style={{ fontSize: '1.8rem', color: '#ff6b00' }}>{icon}</div>
                <div className="font-mono text-sm mb-2" style={{ color: '#f0f0f0' }}>{title}</div>
                <div className="font-mono text-xs leading-relaxed" style={{ color: '#666' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
