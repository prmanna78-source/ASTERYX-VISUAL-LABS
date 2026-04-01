export const defaults = { vs: 20, rs: 100, rl: 250 };

export const sliders = [
  { key: 'vs', label: 'Source (V)', unit: 'V', min: 5, max: 50, step: 1, default: 20, decimals: 0 },
  { key: 'rs', label: 'Source R', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'rl', label: 'Load R', unit: 'Ω', min: 10, max: 1000, step: 10, default: 250, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const batteries = items.filter(i => i.type === 'battery');
  const resistors = items.filter(i => i.type === 'resistor' || i.type === 'rheostat');
  
  if (batteries.length === 0) return { error: 'Add a Battery.' };
  if (resistors.length < 2) return { error: 'Add Source Resistance and Load Resistance.' };
  if (wires.length < 3) return { error: 'Connect components in the Thevenin equivalent loop.' };

  const { vs, rs, rl } = s;
  
  // Vth here is assumed simply as Vs if considering the simplest equivalent, 
  // or a voltage divider if analyzing a 2-resistor network. 
  // For standard simplest lab: Vth = Vs_measured_open, Rth = Rs_measured_short.
  const I_load = vs / (rs + rl);
  const V_load = I_load * rl;

  return {
    message: `✅ Vth = ${vs}V, Rth = ${rs}Ω. I_load = ${(I_load * 1000).toFixed(1)} mA.`,
    readings: { voltage: V_load, current: I_load * 1000 },
    graphPoint: { 'Vload (V)': parseFloat(V_load.toFixed(2)), 'Iload (mA)': parseFloat((I_load*1000).toFixed(2)) },
  };
}
