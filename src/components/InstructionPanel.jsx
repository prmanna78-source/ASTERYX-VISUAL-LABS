import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

const PROCEDURES = {
  'ohms-law': [
    { step: 'Setup Battery', desc: 'Drag the Battery to the board.', apparatus: 'battery' },
    { step: 'Add Rheostat', desc: 'Add a Rheostat (variable resistor) in series with the battery.', apparatus: 'rheostat' },
    { step: 'Add Resistor', desc: 'Connect the test Resistor in the circuit.', apparatus: 'resistor' },
    { step: 'Connect Ammeter', desc: 'Place Ammeter in series to measure current.', apparatus: 'ammeter' },
    { step: 'Connect Voltmeter', desc: 'Connect Voltmeter in parallel across the resistor.', apparatus: 'voltmeter' },
    { step: 'Add Switch', desc: 'Add a Switch to control the circuit.', apparatus: 'switch' },
    { step: 'Close Circuit', desc: 'Connect all terminals with wires to complete the circuit.', apparatus: null },
    { step: 'Run', desc: 'Vary the rheostat slider and observe V and I. Verify V ∝ I.', apparatus: null },
  ],
  'wheatstone-bridge': [
    { step: 'Add Battery', desc: 'Place the battery as the EMF source.', apparatus: 'battery' },
    { step: 'Place 3 Known Resistors', desc: 'Set up P, Q, and S resistors forming the bridge.', apparatus: 'resistor' },
    { step: 'Place Unknown Resistor', desc: 'Connect the unknown resistor X as the 4th arm.', apparatus: 'resistor' },
    { step: 'Connect Galvanometer', desc: 'Connect galvanometer between the midpoints.', apparatus: 'galvanometer' },
    { step: 'Add Switch', desc: 'Add switch in series with battery.', apparatus: 'switch' },
    { step: 'Balance Bridge', desc: 'Adjust the R slider until galvanometer reads 0. X = (P/Q) × S.', apparatus: null },
  ],
  'pn-junction': [
    { step: 'Add DC Supply', desc: 'Place the battery as DC source.', apparatus: 'battery' },
    { step: 'Add Diode', desc: 'Connect the PN Junction Diode (A = anode, K = cathode).', apparatus: 'diode' },
    { step: 'Connect Ammeter', desc: 'Place ammeter in series.', apparatus: 'ammeter' },
    { step: 'Connect Voltmeter', desc: 'Connect voltmeter across the diode.', apparatus: 'voltmeter' },
    { step: 'Add Rheostat', desc: 'Add rheostat to vary forward voltage.', apparatus: 'rheostat' },
    { step: 'Run', desc: 'Increase voltage from 0V. Observe current rise sharply after ~0.6V (forward bias).', apparatus: null },
  ],
  'rc-circuit': [
    { step: 'Add Battery', desc: 'Place the battery.', apparatus: 'battery' },
    { step: 'Add Capacitor', desc: 'Connect capacitor in series.', apparatus: 'capacitor' },
    { step: 'Add Resistor', desc: 'Connect resistor in series.', apparatus: 'resistor' },
    { step: 'Add Voltmeter', desc: 'Connect voltmeter across capacitor.', apparatus: 'voltmeter' },
    { step: 'Add Switch', desc: 'Add switching element.', apparatus: 'switch' },
    { step: 'Run', desc: 'Observe exponential charging curve. τ = RC. Change R or C sliders to see effect.', apparatus: null },
  ],
};

function getDefaultProcedure(experiment) {
  return PROCEDURES[experiment.id] || experiment.apparatus.map((a, i) => ({
    step: `Step ${i + 1}: Add ${a}`,
    desc: `Drag the ${a} from the apparatus panel and connect it appropriately.`,
    apparatus: null,
  }));
}

export default function InstructionPanel({ experiment, onHighlight }) {
  const [activeStep, setActiveStep] = useState(0);
  const [theoryOpen, setTheoryOpen] = useState(false);
  const procedure = getDefaultProcedure(experiment);

  return (
    <div style={{ background: 'rgba(5,13,26,0.95)', maxHeight: 380, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid rgba(0,200,255,0.08)',
        fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '1px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <BookOpen size={12} />
        Procedure
      </div>

      <div style={{ overflow: 'auto', padding: '10px 10px' }}>
        {/* Theory accordion */}
        <div
          onClick={() => setTheoryOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 10px', borderRadius: 8, marginBottom: 8, cursor: 'pointer',
            background: 'rgba(123,47,247,0.08)', border: '1px solid rgba(123,47,247,0.2)',
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--electric-violet)' }}>📖 Theory</span>
          {theoryOpen ? <ChevronDown size={12} color="#a855f7" /> : <ChevronRight size={12} color="#a855f7" />}
        </div>
        {theoryOpen && (
          <div style={{
            fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.65,
            marginBottom: 10, padding: '8px 10px',
            background: 'rgba(123,47,247,0.05)', borderRadius: 8,
            border: '1px solid rgba(123,47,247,0.12)',
          }}>
            {experiment.theory}
          </div>
        )}

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {procedure.map((step, i) => (
            <div
              key={i}
              onClick={() => {
                setActiveStep(i);
                if (step.apparatus) onHighlight(step.apparatus);
                else onHighlight(null);
              }}
              style={{
                padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                background: activeStep === i ? 'rgba(0,200,255,0.1)' : 'rgba(13,24,41,0.4)',
                border: `1px solid ${activeStep === i ? 'rgba(0,200,255,0.3)' : 'rgba(0,200,255,0.06)'}`,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: activeStep === i ? 'var(--electric-blue)' : 'rgba(0,200,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800,
                  color: activeStep === i ? '#000' : 'var(--text-muted)',
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: activeStep === i ? 'var(--electric-blue)' : 'var(--text-primary)' }}>
                  {step.step}
                </span>
              </div>
              {activeStep === i && (
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginLeft: 26, lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
