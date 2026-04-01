// Wheatstone Bridge Physics Engine
export const defaults = { P: 100, Q: 100, S: 250 };

export const sliders = [
  { key: 'P', label: 'P', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'Q', label: 'Q', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
  { key: 'S', label: 'S (known)', unit: 'Ω', min: 10, max: 1000, step: 10, default: 250, decimals: 0 },
];

const X_UNKNOWN = 250; // fixed unknown for demo

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasGalvanometer = items.some(i => i.type === 'galvanometer');
  const resistors = items.filter(i => i.type === 'resistor');

  if (!hasBattery) return { error: '⚠️ Add a Battery.' };
  if (!hasGalvanometer) return { error: '⚠️ Add a Galvanometer.' };
  if (resistors.length < 3) return { error: '⚠️ Add at least 3 resistors (P, Q, S).' };
  if (wires.length < 4) return { error: '⚠️ Connect the bridge circuit with wires.' };

  const { P, Q, S } = s;
  const X_calc = (P / Q) * S;
  const galvCurrent = (X_calc - X_UNKNOWN) * 0.1; // deflection ∝ imbalance

  return {
    message: `✅ Bridge active. X_calc=${X_calc.toFixed(1)}Ω, True X=${X_UNKNOWN}Ω`,
    readings: { galvanometer: parseFloat(galvCurrent.toFixed(3)), resistance: X_calc },
    graphPoint: { 'S (Ω)': S, 'X_calc (Ω)': parseFloat(X_calc.toFixed(2)) },
  };
}
