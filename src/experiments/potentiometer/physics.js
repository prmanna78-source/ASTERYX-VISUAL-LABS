// Potentiometer EMF Comparison
export const defaults = { emf1: 1.5, emf2: 1.08, balancingLength: 60 };

export const sliders = [
  { key: 'emf1', label: 'E1 (Standard)', unit: 'V', min: 0.5, max: 3, step: 0.05, default: 1.5, decimals: 2 },
  { key: 'emf2', label: 'E2 (Unknown)', unit: 'V', min: 0.5, max: 3, step: 0.05, default: 1.08, decimals: 2 },
  { key: 'balancingLength', label: 'Length l₁', unit: 'cm', min: 1, max: 100, step: 1, default: 60, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasGalvanometer = items.some(i => i.type === 'galvanometer');

  if (!hasBattery) return { error: '⚠️ Add a Primary Battery.' };
  if (!hasGalvanometer) return { error: '⚠️ Add a Galvanometer for null deflection.' };
  if (wires.length < 2) return { error: '⚠️ Connect the circuit.' };

  const { emf1, emf2, balancingLength: l1 } = s;
  const l2 = (emf2 / emf1) * l1;
  const galvDeflection = (l1 - (emf1 / emf2) * l1) * 0.5;

  return {
    message: `✅ L1=${l1}cm → L2=${l2.toFixed(1)}cm | E2/E1 = ${(emf2 / emf1).toFixed(3)}`,
    readings: { galvanometer: parseFloat(galvDeflection.toFixed(3)) },
    graphPoint: { 'l₁ (cm)': l1, 'l₂ (cm)': parseFloat(l2.toFixed(2)) },
  };
}
