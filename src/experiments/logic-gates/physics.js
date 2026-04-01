// Logic Gates Truth Table Engine
export const defaults = { gateType: 0, inputA: 0, inputB: 0 };

export const sliders = [
  { key: 'gateType', label: 'Gate', unit: '', min: 0, max: 4, step: 1, default: 0, decimals: 0 },
  { key: 'inputA', label: 'Input A', unit: '', min: 0, max: 1, step: 1, default: 0, decimals: 0 },
  { key: 'inputB', label: 'Input B', unit: '', min: 0, max: 1, step: 1, default: 0, decimals: 0 },
];

const GATES = ['NOT', 'AND', 'OR', 'NAND', 'NOR'];

export function run({ items, wires, sliders: s }) {
  const hasIC = items.some(i => i.type === 'ic_gate');
  const hasLED = items.some(i => i.type === 'led');

  if (!hasIC) return { error: '⚠️ Add an IC Gate from the apparatus panel.' };
  if (!hasLED) return { error: '⚠️ Add an LED indicator for output.' };
  if (wires.length < 2) return { error: '⚠️ Connect the gate inputs and output.' };

  const gateIdx = Math.round(s.gateType) % 5;
  const gate = GATES[gateIdx];
  const A = s.inputA >= 0.5 ? 1 : 0;
  const B = s.inputB >= 0.5 ? 1 : 0;

  let Y;
  switch (gate) {
    case 'NOT': Y = A === 0 ? 1 : 0; break;
    case 'AND': Y = A & B; break;
    case 'OR': Y = A | B; break;
    case 'NAND': Y = (A & B) === 1 ? 0 : 1; break;
    case 'NOR': Y = (A | B) === 1 ? 0 : 1; break;
    default: Y = 0;
  }

  return {
    message: `✅ ${gate} Gate: A=${A}  B=${B}  →  Y=${Y}`,
    readings: { voltage: Y * 5 },
    graphPoint: { 'A': A, 'Y': Y },
  };
}
