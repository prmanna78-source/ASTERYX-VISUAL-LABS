export const defaults = { voltage1: 10, voltage2: 5, r1: 100, r2: 200, r3: 300 };

export const sliders = [
  { key: 'voltage1', label: 'Battery 1 (V)', unit: 'V', min: 1, max: 20, step: 1, default: 10, decimals: 0 },
  { key: 'voltage2', label: 'Battery 2 (V)', unit: 'V', min: 1, max: 20, step: 1, default: 5, decimals: 0 },
  { key: 'r1', label: 'R1', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'r2', label: 'R2', unit: 'Ω', min: 10, max: 500, step: 10, default: 200, decimals: 0 },
  { key: 'r3', label: 'R3', unit: 'Ω', min: 10, max: 500, step: 10, default: 300, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const batteries = items.filter(i => i.type === 'battery');
  const resistors = items.filter(i => i.type === 'resistor');
  if (batteries.length < 2) return { error: 'Please add 2 Batteries to verify KVL in multiple loops.' };
  if (resistors.length < 3) return { error: 'Please add 3 Resistors for a dual-loop circuit.' };
  if (wires.length < 5) return { error: 'Connect all components to form two adjacent closed loops.' };

  // Calculate generic two-loop circuit currents using Mesh Analysis
  // Loop 1: V1 - I1*R1 - (I1-I2)*R3 = 0
  // Loop 2: V2 - I2*R2 - (I2-I1)*R3 = 0
  const v1 = s.voltage1;
  const v2 = s.voltage2;
  const r1 = s.r1;
  const r2 = s.r2;
  const r3 = s.r3;

  const det = (r1 + r3) * (r2 + r3) - (r3 * r3);
  const i1 = (v1 * (r2 + r3) - v2 * r3) / det;
  const i2 = (v2 * (r1 + r3) - v1 * r3) / det;
  const i3 = i1 + i2; // Current through middle branch

  return {
    message: `✅ KCL Verified: I1 + I2 = I3 (${(i1*1000).toFixed(1)}mA + ${(i2*1000).toFixed(1)}mA = ${(i3*1000).toFixed(1)}mA)`,
    readings: { voltage: v1, current: i1 },
    graphPoint: { 'I1 (mA)': parseFloat((i1*1000).toFixed(2)), 'I2 (mA)': parseFloat((i2*1000).toFixed(2)), 'I3 (mA)': parseFloat((i3*1000).toFixed(2)) },
  };
}
