import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, FlaskConical } from 'lucide-react';

const CircuitCanvas3D = lazy(() => import('./CircuitCanvas3D'));

export default function HeroSection() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,200,255,0.12) 0%, transparent 70%), var(--bg-void)',
    }}>
      {/* 3D Canvas Background */}
      <Suspense fallback={null}>
        <CircuitCanvas3D />
      </Suspense>

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
      }} />

      {/* Scanline effect */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.3), transparent)',
          animation: 'scanline 6s linear infinite',
        }} />
      </div>

      {/* Gradient vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 30%, rgba(2,4,8,0.8) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        maxWidth: 780, padding: '0 24px',
        animation: 'fade-in-up 1s ease forwards',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'rgba(0,200,255,0.1)', border: '1px solid rgba(0,200,255,0.3)',
          borderRadius: 50, padding: '6px 18px', fontSize: '0.82rem',
          color: 'var(--electric-blue)', fontWeight: 600, letterSpacing: '0.5px',
          marginBottom: 32, textTransform: 'uppercase',
        }}>
          <Zap size={14} fill="currentColor" style={{ marginTop: '-1px' }} />
          <span style={{ lineHeight: 1 }}>Virtual Physics Laboratory</span>
          <span style={{
            background: 'linear-gradient(135deg, #00c8ff, #7b2ff7)',
            borderRadius: 50, padding: '4px 10px', color: '#fff', fontSize: '0.75rem',
            lineHeight: 1, display: 'inline-block'
          }}>v1.0</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
          <span className="gradient-text">Electrify</span> Your Learning
          <br />
          <span style={{ color: 'var(--text-primary)' }}>with 3D Circuit</span>
          <br />
          <span style={{ color: 'var(--electric-cyan)', filter: 'drop-shadow(0 0 20px #00ffea)' }}>Simulations</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: 'var(--text-secondary)',
          maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7,
        }}>
          Build real circuits, connect apparatus, run experiments — all in an interactive
          3D virtual lab without any physical equipment.
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '40px',
          marginBottom: 48, flexWrap: 'wrap',
        }}>
          {[
            { label: 'Experiments', value: '8+' },
            { label: 'Circuit Components', value: '30+' },
            { label: 'Physics Models', value: '100%' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--electric-blue)' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#experiments" className="btn-primary">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlaskConical size={18} />
              Start Experimenting
              <ArrowRight size={16} />
            </span>
          </a>
          <a href="#features" className="btn-ghost">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              How it Works
            </span>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, zIndex: 5,
        background: 'linear-gradient(to top, var(--bg-void), transparent)',
      }} />

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase',
      }}>
        <span>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, rgba(0,200,255,0.6), transparent)',
          animation: 'float 2s ease-in-out infinite',
        }} />
      </div>
    </section>
  );
}
