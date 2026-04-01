export const defaults = { v1: 12, v2: 6, r1: 100, r2: 200, r3: 150 };

export const sliders = [
  { key: 'v1', label: 'Battery 1 (V)', unit: 'V', min: 1, max: 24, step: 1, default: 12, decimals: 0 },
  { key: 'v2', label: 'Battery 2 (V)', unit: 'V', min: 1, max: 24, step: 1, default: 6, decimals: 0 },
  { key: 'r1', label: 'R1', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'r2', label: 'R2', unit: 'Ω', min: 10, max: 500, step: 10, default: 200, decimals: 0 },
  { key: 'r3', label: 'R3 (Load)', unit: 'Ω', min: 10, max: 500, step: 10, default: 150, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const batteries = items.filter(i => i.type === 'battery');
  const resistors = items.filter(i => i.type === 'resistor');
  if (batteries.length < 2) return { error: 'Add 2 Batteries to demonstrate superposition.' };
  if (resistors.length < 3) return { error: 'Add 3 Resistors for a standard T-network.' };
  if (wires.length < 5) return { error: 'Incomplete circuit wiring.' };

  const { v1, v2, r1, r2, r3 } = s;

  // Response due to V1 alone (V2 shorted)
  const req1 = r1 + (r2 * r3) / (r2 + r3);
  const I1_total = v1 / req1;
  const I3_from_V1 = I1_total * (r2 / (r2 + r3));

  // Response due to V2 alone (V1 shorted)
  const req2 = r2 + (r1 * r3) / (r1 + r3);
  const I2_total = v2 / req2;
  const I3_from_V2 = I2_total * (r1 / (r1 + r3));

  // Total response
  const I3_total = I3_from_V1 + I3_from_V2;

  return {
    message: `✅ Superposition Verified: I_load = ${(I3_from_V1*1000).toFixed(1)}mA (v1) + ${(I3_from_V2*1000).toFixed(1)}mA (v2) = ${(I3_total*1000).toFixed(1)}mA`,
    readings: { current: I3_total * 1000 },
    graphPoint: { 'I from V1 (mA)': parseFloat((I3_from_V1*1000).toFixed(2)), 'I from V2 (mA)': parseFloat((I3_from_V2*1000).toFixed(2)), 'Total I (mA)': parseFloat((I3_total*1000).toFixed(2)) },
  };
}
