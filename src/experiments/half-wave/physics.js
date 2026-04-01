export const defaults = { vac: 12, freq: 50, rl: 1000 };

export const sliders = [
  { key: 'vac', label: 'AC Supply (Vrms)', unit: 'V', min: 2, max: 24, step: 1, default: 12, decimals: 0 },
  { key: 'freq', label: 'Frequency', unit: 'Hz', min: 10, max: 100, step: 10, default: 50, decimals: 0 },
  { key: 'rl', label: 'Load R', unit: 'Ω', min: 100, max: 5000, step: 100, default: 1000, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasAC = items.some(i => i.type === 'ac_supply');
  const d = items.filter(i => i.type === 'diode');
  const r = items.filter(i => i.type === 'resistor');

  if (!hasAC) return { error: 'Add an AC Supply/Transformer for the rectifier input.' };
  if (d.length !== 1) return { error: 'A Half-Wave Rectifier strictly requires exactly ONE Diode.' };
  if (r.length === 0) return { error: 'Add a Resistor to act as your Load.' };

  const { vac, freq, rl } = s;
  
  // Real time waveform simulation
  const t = Date.now() / 1000;
  const w = 2 * Math.PI * freq;
  const vPeak = vac * Math.SQRT2;
  const inputV = vPeak * Math.sin(w * t);

  // Ideal diode model with 0.7V forward drop
  const outputV = inputV > 0.7 ? inputV - 0.7 : 0;
  
  const Vdc = (vPeak - 0.7) / Math.PI; // Ideal DC average
  const Irms = Vdc / rl;

  return {
    message: `✅ Rectifying ${vac}Vrms AC to pulsating DC. Average Vdc = ${Vdc.toFixed(2)}V`,
    readings: { voltage: outputV, current: Irms * 1000 },
    graphPoint: { 'Input AC (V)': parseFloat(inputV.toFixed(1)), 'Output DC (V)': parseFloat(outputV.toFixed(1)) },
  };
}
