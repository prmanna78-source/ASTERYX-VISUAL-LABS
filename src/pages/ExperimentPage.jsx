import { useParams, useNavigate } from 'react-router-dom';
import { Suspense } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import EXPERIMENTS from '../data/experiments';
import LabCanvas from '../components/LabCanvas';

// Lazy load physics engines
const physicsModules = {
  'ohms-law': () => import('../experiments/ohms-law/physics.js'),
  'wheatstone-bridge': () => import('../experiments/wheatstone-bridge/physics.js'),
  'potentiometer': () => import('../experiments/potentiometer/physics.js'),
  'meter-bridge': () => import('../experiments/meter-bridge/physics.js'),
  'rc-circuit': () => import('../experiments/rc-circuit/physics.js'),
  'pn-junction': () => import('../experiments/pn-junction/physics.js'),
  'zener-diode': () => import('../experiments/zener-diode/physics.js'),
  'logic-gates': () => import('../experiments/logic-gates/physics.js'),
  'kirchhoffs-laws': () => import('../experiments/kirchhoffs-laws/physics.js'),
  'colour-coding': () => import('../experiments/colour-coding/physics.js'),
  'rlc-circuit': () => import('../experiments/rlc-circuit/physics.js'),
  'superposition': () => import('../experiments/superposition/physics.js'),
  'thevenins': () => import('../experiments/thevenins/physics.js'),
  'max-power': () => import('../experiments/max-power/physics.js'),
  'rl-rc-network': () => import('../experiments/rl-rc-network/physics.js'),
  'half-wave': () => import('../experiments/half-wave/physics.js'),
  'bridge-rectifier': () => import('../experiments/bridge-rectifier/physics.js'),
};

import { useState, useEffect } from 'react';

function usePhysics(experimentId) {
  const [physics, setPhysics] = useState(null);
  useEffect(() => {
    const loader = physicsModules[experimentId];
    if (!loader) { setPhysics(null); return; }
    loader().then(mod => setPhysics(mod));
  }, [experimentId]);
  return physics;
}

export default function ExperimentPage() {
  const { experimentId } = useParams();
  const navigate = useNavigate();
  const experiment = EXPERIMENTS.find(e => e.id === experimentId);
  const physics = usePhysics(experimentId);

  if (!experiment) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-void)' }}>
        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🔌</div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Experiment Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>The experiment "{experimentId}" doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} /> Back to Lab
          </span>
        </button>
      </div>
    );
  }

  if (!physics) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-void)', gap: 20 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{ width: 50, height: 50 }}
        >
          <Zap size={50} color="var(--electric-blue)" />
        </motion.div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading physics engine…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* Back bar */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 200,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(8,15,30,0.9)', color: 'var(--text-muted)',
            border: '1px solid rgba(0,200,255,0.15)', borderRadius: 8,
            padding: '6px 14px', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-main)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--electric-blue)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={14} /> All Experiments
        </button>
      </div>

      <LabCanvas experiment={experiment} physics={physics} />
    </motion.div>
  );
}
