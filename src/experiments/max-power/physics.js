export const defaults = { vth: 12, rth: 50, rl: 10 };

export const sliders = [
  { key: 'vth', label: 'Thevenin V (V)', unit: 'V', min: 1, max: 24, step: 1, default: 12, decimals: 0 },
  { key: 'rth', label: 'Source R', unit: 'Ω', min: 10, max: 100, step: 10, default: 50, decimals: 0 },
  { key: 'rl', label: 'Load Rheostat', unit: 'Ω', min: 10, max: 200, step: 10, default: 10, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const batteries = items.filter(i => i.type === 'battery');
  const resistors = items.filter(i => i.type === 'resistor' || i.type === 'rheostat');
  
  if (batteries.length === 0) return { error: 'Add a Battery as your Thevenin Source.' };
  if (resistors.length < 2) return { error: 'Add an internal Source Resistor and a Load Rheostat.' };
  if (wires.length < 3) return { error: 'Connect the load to the source.' };

  const { vth, rth, rl } = s;
  
  const i = vth / (rth + rl);
  const power = i * i * rl;

  // Is it peak?
  const isMatch = rl === rth;
  const msg = isMatch 
    ? `🏆 MAXIMUM POWER! Rl equals Rth (${rth}Ω). Power = ${(power*1000).toFixed(0)} mW.`
    : `Power = ${(power*1000).toFixed(1)} mW. (Adjust Rl closer to Rth = ${rth}Ω).`;

  return {
    message: msg,
    readings: { current: i * 1000, voltage: i * rl },
    graphPoint: { 'Load R (Ω)': rl, 'Power (mW)': parseFloat((power*1000).toFixed(1)) },
  };
}
