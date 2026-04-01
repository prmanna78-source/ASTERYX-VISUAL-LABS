import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ExperimentCard from '../components/ExperimentCard';
import EXPERIMENTS from '../data/experiments';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, BarChart3, Shield, Layers, Globe } from 'lucide-react';

const CATEGORIES = ['All', 'Basic', 'Intermediate', 'Advanced', 'Digital'];

const FEATURES = [
  {
    icon: <Zap size={28} />, color: '#00c8ff',
    title: 'Real Physics Engine',
    desc: "Every simulation uses actual formulas — Ohm's Law, Shockley equations, Kirchhoff's Laws. No shortcuts.",
  },
  {
    icon: <Eye size={28} />, color: '#7b2ff7',
    title: 'Drag & Drop Wiring',
    desc: 'Pick real apparatus from the panel, place them on the circuit board, and click terminals to draw wires.',
  },
  {
    icon: <BarChart3 size={28} />, color: '#00ff88',
    title: 'Live Graphs & Meters',
    desc: 'Watch meter needles swing and graphs update in real-time as you change voltages and resistances.',
  },
  {
    icon: <Layers size={28} />, color: '#ff7b00',
    title: '8+ Experiments',
    desc: 'From basic Ohm\'s Law to advanced PN junction characteristics — all Physics Lab syllabus covered.',
  },
  {
    icon: <Shield size={28} />, color: '#ffe600',
    title: 'Circuit Validation',
    desc: 'Detects short circuits, missing connections, and wrong polarities — just like real lab safety checks.',
  },
  {
    icon: <Globe size={28} />, color: '#ff3366',
    title: 'Works Anywhere',
    desc: 'No installation, no hardware needed. Runs entirely in your browser — try it on any device.',
  },
];

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? EXPERIMENTS
    : EXPERIMENTS.filter(e => e.category === activeCategory);

  return (
    <div style={{ background: 'var(--bg-void)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* ---- Experiments Section ---- */}
      <section id="experiments" style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, var(--bg-void) 0%, var(--bg-deep) 50%, var(--bg-void) 100%)',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 60 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(123,47,247,0.1)', border: '1px solid rgba(123,47,247,0.3)',
              borderRadius: 50, padding: '5px 16px', fontSize: '0.8rem',
              color: 'var(--electric-violet)', fontWeight: 600, marginBottom: 20,
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              🧪 Virtual Experiments
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, marginBottom: 16 }}>
              Choose Your <span className="gradient-text">Experiment</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 540, margin: '0 auto' }}>
              Select an experiment to open the interactive lab. Build your circuit, adjust parameters, and observe results in real time.
            </p>
          </motion.div>

          {/* Category Filters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 50, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 22px', borderRadius: 50, fontFamily: 'var(--font-main)',
                  fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: activeCategory === cat
                    ? 'linear-gradient(135deg, var(--electric-blue), var(--electric-purple))'
                    : 'rgba(0,200,255,0.06)',
                  color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(0,200,255,0.15)',
                  boxShadow: activeCategory === cat ? 'var(--glow-blue)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Experiment Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24,
          }}>
            {filtered.map((exp, i) => (
              <ExperimentCard key={exp.id} experiment={exp} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- Features Section ---- */}
      <section id="features" style={{ padding: '100px 0', background: 'var(--bg-deep)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 70 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
              Why <span className="gradient-text">Astryx Labs?</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 500, margin: '0 auto' }}>
              Built for students, designed to match real lab experiments with maximum accuracy and interactivity.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}>
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{
                  background: 'rgba(13,24,41,0.5)', backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,200,255,0.08)',
                  borderRadius: 20, padding: '32px',
                  transition: 'border-color 0.3s ease',
                }}
                whileHover={{ scale: 1.02, borderColor: `${feat.color}40` }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: `${feat.color}15`, border: `1px solid ${feat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: feat.color, marginBottom: 20,
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section id="about" style={{ padding: '100px 0', background: 'var(--bg-void)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 70 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 16 }}>
              How It <span className="gradient-text">Works</span>
            </h2>
          </motion.div>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { step: '01', title: 'Pick an Experiment', desc: 'Browse the experiment catalog and select your topic.' },
              { step: '02', title: 'Setup Apparatus', desc: 'Drag battery, resistors, meters from the apparatus panel to the circuit board.' },
              { step: '03', title: 'Connect the Circuit', desc: 'Click on component terminals to draw wires and complete the circuit.' },
              { step: '04', title: 'Run & Observe', desc: 'Hit Run — watch meters swing, graphs plot, and current flow animates.' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', maxWidth: 220 }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                  background: 'rgba(0,200,255,0.08)', border: '2px solid rgba(0,200,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 900, color: 'var(--electric-blue)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer style={{
        borderTop: '1px solid rgba(0,200,255,0.08)',
        padding: '32px 0', textAlign: 'center',
        background: 'var(--bg-deep)',
      }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>
            ⚡ <strong style={{ color: 'var(--electric-blue)' }}>ASTRYX LABS</strong> — Virtual Physics Laboratory · Built for students
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', opacity: 0.8 }}>
            ALL RIGHTS RESERVED BY ASTRYX FOUNDED BY UJJWAL MANNA ©
          </p>
        </div>
      </footer>
    </div>
  );
}
