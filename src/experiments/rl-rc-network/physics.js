export const defaults = { vrms: 230, freq: 50, R: 100, L: 0.1, C: 47 };

export const sliders = [
  { key: 'vrms', label: 'AC Supply', unit: 'V', min: 10, max: 400, step: 10, default: 230, decimals: 0 },
  { key: 'freq', label: 'Frequency', unit: 'Hz', min: 10, max: 100, step: 5, default: 50, decimals: 0 },
  { key: 'R', label: 'Resistance', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'L', label: 'Inductance', unit: 'H', min: 0.1, max: 1.0, step: 0.1, default: 0.1, decimals: 1 },
  { key: 'C', label: 'Capacitance', unit: 'µF', min: 10, max: 1000, step: 10, default: 47, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasAC = items.some(i => i.type === 'ac_supply');
  const hasR = items.some(i => i.type === 'resistor');
  const hasL = items.some(i => i.type === 'inductor');
  const hasC = items.some(i => i.type === 'capacitor');

  if (!hasAC) return { error: 'Add an AC Supply for this experiment.' };
  if (!hasR) return { error: 'Add a Resistor to form RL/RC circuit.' };
  if (!hasL && !hasC) return { error: 'Add EITHER an Inductor or a Capacitor to form the network.' };
  if (hasL && hasC) return { error: 'For RL/RC network basics, use only one reactive component at a time (use RLC experiment for both).' };

  const w = 2 * Math.PI * s.freq;
  let Z, pf, P;
  if (hasL) { // RL 
    const Xl = w * s.L;
    Z = Math.sqrt(s.R * s.R + Xl * Xl);
    pf = s.R / Z; // Lagging
  } else { // RC
    const Xc = 1 / (w * s.C * 1e-6);
    Z = Math.sqrt(s.R * s.R + Xc * Xc);
    pf = s.R / Z; // Leading
  }

  const Irms = s.vrms / Z;
  P = s.vrms * Irms * pf;

  return {
    message: `✅ Power measured. P = ${P.toFixed(2)} W, PF = ${pf.toFixed(3)} ${hasL ? '(Lag)' : '(Lead)'}`,
    readings: { current: parseFloat(Irms.toFixed(3)), voltage: s.vrms },
    graphPoint: { 'Impedance Z (Ω)': parseFloat(Z.toFixed(1)), 'Active Power (W)': parseFloat(P.toFixed(2)) },
  };
}
