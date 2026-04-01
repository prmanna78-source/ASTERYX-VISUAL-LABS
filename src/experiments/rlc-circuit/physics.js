// Physics engine for Series RLC Circuit
export const defaults = { vrms: 230, freq: 50, R: 100, L: 0.5, C: 10 };

export const sliders = [
  { key: 'vrms', label: 'AC Supply (Vrms)', unit: 'V', min: 10, max: 240, step: 10, default: 230, decimals: 0 },
  { key: 'freq', label: 'Frequency', unit: 'Hz', min: 10, max: 100, step: 5, default: 50, decimals: 0 },
  { key: 'R', label: 'Resistance', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'L', label: 'Inductance', unit: 'H', min: 0.1, max: 2.0, step: 0.1, default: 0.5, decimals: 1 },
  { key: 'C', label: 'Capacitance', unit: 'µF', min: 1, max: 100, step: 1, default: 10, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasAC = items.some(i => i.type === 'ac_supply');
  const hasR = items.some(i => i.type === 'resistor');
  const hasL = items.some(i => i.type === 'inductor');
  const hasC = items.some(i => i.type === 'capacitor');

  if (!hasAC) return { error: 'Add an AC Supply to power the circuit.' };
  if (!hasR || !hasL || !hasC) return { error: 'Ensure a Resistor, Inductor, and Capacitor are placed.' };
  if (wires.length < 4) return { error: 'Connect all components in a series loop.' };

  const w = 2 * Math.PI * s.freq;
  const Xl = w * s.L;
  const Xc = 1 / (w * (s.C * 1e-6));
  const Z = Math.sqrt(s.R * s.R + Math.pow(Xl - Xc, 2));
  
  const Irms = s.vrms / Z;
  const pf = s.R / Z; // power factor
  const angle = Math.acos(pf); // radians
  
  // Create a time-domain graph point for AC waveform visualization
  const t = Date.now() / 1000; 
  const vInst = s.vrms * Math.SQRT2 * Math.sin(w * t);
  const iInst = Irms * Math.SQRT2 * Math.sin(w * t - (Xl > Xc ? angle : -angle));

  return {
    message: `✅ Circuit running! Z = ${Z.toFixed(1)}Ω, PF = ${pf.toFixed(3)} ${Xl > Xc ? '(Lagging)' : '(Leading)'}`,
    readings: { current: parseFloat(Irms.toFixed(3)), voltage: s.vrms },
    graphPoint: { 'Voltage (V)': parseFloat(vInst.toFixed(1)), 'Current (A)': parseFloat(iInst.toFixed(2)) },
  };
}
