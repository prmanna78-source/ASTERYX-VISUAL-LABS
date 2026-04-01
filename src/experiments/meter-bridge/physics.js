// Meter Bridge — Unknown Resistance
export const defaults = { knownR: 100, balanceLength: 60 };

export const sliders = [
  { key: 'knownR', label: 'R (known)', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'balanceLength', label: 'Balance pt (l)', unit: 'cm', min: 1, max: 99, step: 1, default: 60, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasGalvanometer = items.some(i => i.type === 'galvanometer');
  const hasResistor = items.some(i => i.type === 'resistor');

  if (!hasBattery) return { error: '⚠️ Add a Battery.' };
  if (!hasGalvanometer) return { error: '⚠️ Add a Galvanometer.' };
  if (!hasResistor) return { error: '⚠️ Add the known resistance R.' };
  if (wires.length < 3) return { error: '⚠️ Connect the bridge circuit.' };

  const { knownR: R, balanceLength: l } = s;
  const X = R * (100 - l) / l;
  const galvDeflect = 0; // balanced at given l

  return {
    message: `✅ X = R × (100-l)/l = ${X.toFixed(2)} Ω`,
    readings: { resistance: parseFloat(X.toFixed(2)), galvanometer: 0 },
    graphPoint: { 'l (cm)': l, 'X (Ω)': parseFloat(X.toFixed(2)) },
  };
}
