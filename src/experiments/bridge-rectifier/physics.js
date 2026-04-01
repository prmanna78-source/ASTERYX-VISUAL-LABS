export const defaults = { vac: 12, freq: 50, rl: 1000, cf: 47 };

export const sliders = [
  { key: 'vac', label: 'AC Supply (Vrms)', unit: 'V', min: 2, max: 24, step: 1, default: 12, decimals: 0 },
  { key: 'freq', label: 'Frequency', unit: 'Hz', min: 10, max: 100, step: 10, default: 50, decimals: 0 },
  { key: 'rl', label: 'Load R', unit: 'Ω', min: 100, max: 5000, step: 100, default: 1000, decimals: 0 },
  { key: 'cf', label: 'Filter Cap', unit: 'µF', min: 0, max: 2000, step: 10, default: 47, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasAC = items.some(i => i.type === 'ac_supply');
  const d = items.filter(i => i.type === 'diode');
  const r = items.filter(i => i.type === 'resistor');
  const c = items.some(i => i.type === 'capacitor');

  if (!hasAC) return { error: 'Add an AC Supply (simulating the secondary of a transformer).' };
  if (d.length !== 4) return { error: 'A Bridge Rectifier strictly requires FOUR Diodes arranged in a bridge.' };
  if (r.length === 0) return { error: 'Add a Resistor to act as your Load.' };

  const { vac, freq, rl, cf } = s;
  
  const t = Date.now() / 1000;
  const w = 2 * Math.PI * freq;
  const vPeak = vac * Math.SQRT2;
  const inputV = vPeak * Math.sin(w * t);

  // Full wave ideal response: 2 diode drops (1.4V)
  const fullWaveIdeal = Math.abs(inputV) > 1.4 ? Math.abs(inputV) - 1.4 : 0;
  const Vdc_unfiltered = (2 * (vPeak - 1.4)) / Math.PI;
  
  // Simplified capacitor smoothing (ripple voltage based on purely DC load approx)
  // Vr = Iload / (f * C) -> wait, for full wave it's f_ripple = 2 * f
  let Vdc = Vdc_unfiltered;
  let Vr = 0;
  let outputV = fullWaveIdeal;

  if (c && cf > 0) {
    const Iload = Vdc_unfiltered / rl;
    Vr = Iload / (2 * freq * (cf * 1e-6));
    if (Vr > Vdc_unfiltered) Vr = Vdc_unfiltered; // Caps max ripple
    Vdc = (vPeak - 1.4) - (Vr / 2); // DC voltage jumps up drastically!
    
    // Quick procedural simulation of sawtooth smoothing
    // We assume cap charges to peak instantly, then falls exponentially.
    // For graphing real time without history state, this is hard, but we fake it by mixing the wave
    outputV = Vdc + (Vr / 2) * Math.cos(2 * w * t); // Pseudo-ripple
  }

  const Irms = Vdc / rl;

  return {
    message: `✅ Full-Wave Rectifying. Vdc = ${Vdc.toFixed(2)}V. ${c ? 'Filter active (Ripple ≈ ' + Vr.toFixed(2) + 'V).' : 'No filter.'}`,
    readings: { voltage: Vdc, current: Irms * 1000 },
    graphPoint: { 'Input AC (V)': parseFloat(inputV.toFixed(1)), 'Output DC V': parseFloat(outputV.toFixed(1)) },
  };
}
