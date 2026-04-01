// Physics engine for Ohm's Law experiment
export const defaults = { voltage: 6, resistance: 100 };

export const sliders = [
  { key: 'voltage', label: 'Battery EMF', unit: 'V', min: 1, max: 12, step: 0.5, default: 6, decimals: 1 },
  { key: 'resistance', label: 'Resistance', unit: 'Ω', min: 10, max: 500, step: 10, default: 100, decimals: 0 },
];

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasResistor = items.some(i => i.type === 'resistor');
  const hasAmmeter = items.some(i => i.type === 'ammeter');
  const hasVoltmeter = items.some(i => i.type === 'voltmeter');

  if (!hasBattery) return { error: '⚠️ Add a Battery to the circuit.' };
  if (!hasResistor) return { error: '⚠️ Add a Resistor to the circuit.' };
  if (!hasAmmeter) return { error: '⚠️ Add an Ammeter in series.' };
  if (!hasVoltmeter) return { error: '⚠️ Add a Voltmeter in parallel.' };
  if (wires.length < 3) return { error: '⚠️ Connect the components with wires.' };

  const V = s.voltage;
  const R = s.resistance;
  const I = V / R;

  return {
    message: `✅ Circuit complete! V=${V}V, R=${R}Ω, I=${I.toFixed(4)}A`,
    readings: { voltage: V, current: I },
    graphPoint: { 'V (Volts)': V, 'I (Amps)': parseFloat(I.toFixed(5)) },
  };
}
