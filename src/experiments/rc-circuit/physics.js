// RC Circuit Physics Engine — Charging/Discharging
export const defaults = { voltage: 9, resistance: 10000, capacitance: 100, time: 0 };

export const sliders = [
  { key: 'voltage', label: 'Battery V', unit: 'V', min: 1, max: 15, step: 0.5, default: 9, decimals: 1 },
  { key: 'resistance', label: 'R', unit: 'kΩ', min: 1, max: 100, step: 1, default: 10, decimals: 0 },
  { key: 'capacitance', label: 'C', unit: 'µF', min: 10, max: 1000, step: 10, default: 100, decimals: 0 },
  { key: 'time', label: 'Time t', unit: 's', min: 0, max: 10, step: 0.1, default: 0, decimals: 1 },
];

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasCapacitor = items.some(i => i.type === 'capacitor');
  const hasResistor = items.some(i => i.type === 'resistor');
  const hasVoltmeter = items.some(i => i.type === 'voltmeter');

  if (!hasBattery) return { error: '⚠️ Add a Battery.' };
  if (!hasCapacitor) return { error: '⚠️ Add a Capacitor.' };
  if (!hasResistor) return { error: '⚠️ Add a Resistor.' };
  if (!hasVoltmeter) return { error: '⚠️ Add a Voltmeter across the capacitor.' };
  if (wires.length < 3) return { error: '⚠️ Connect circuit with wires.' };

  const V0 = s.voltage;
  const R = s.resistance * 1000;   // kΩ → Ω
  const C = s.capacitance * 1e-6;  // µF → F
  const t = s.time;
  const tau = R * C;

  const Vc = V0 * (1 - Math.exp(-t / tau));  // capacitor voltage
  const I = (V0 / R) * Math.exp(-t / tau);  // charging current

  return {
    message: `✅ τ = ${tau.toFixed(2)}s | Vc=${Vc.toFixed(3)}V | I=${(I * 1000).toFixed(3)}mA`,
    readings: { voltage: parseFloat(V0.toFixed(2)), capacitorV: parseFloat(Vc.toFixed(3)), current: parseFloat(I.toFixed(6)) },
    graphPoint: { 't (s)': parseFloat(t.toFixed(1)), 'Vc (V)': parseFloat(Vc.toFixed(3)) },
  };
}
