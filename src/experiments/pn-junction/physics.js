// PN Junction Diode Physics Engine — Shockley Equation
export const defaults = { voltage: 0 };

export const sliders = [
  { key: 'voltage', label: 'Applied Voltage', unit: 'V', min: -15, max: 1.2, step: 0.05, default: 0, decimals: 2 },
];

const I0 = 1e-10;     // Reverse saturation current (A)
const n = 1.5;         // Ideality factor
const VT = 0.02585;   // Thermal voltage at 25°C (V)

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasDiode = items.some(i => i.type === 'diode');
  const hasAmmeter = items.some(i => i.type === 'ammeter');
  const hasVoltmeter = items.some(i => i.type === 'voltmeter');

  if (!hasBattery) return { error: '⚠️ Add a DC Supply / Battery.' };
  if (!hasDiode) return { error: '⚠️ Add a PN Junction Diode.' };
  if (!hasAmmeter) return { error: '⚠️ Add an Ammeter in series.' };
  if (!hasVoltmeter) return { error: '⚠️ Add a Voltmeter across the diode.' };
  if (wires.length < 3) return { error: '⚠️ Connect all components with wires.' };

  const V = s.voltage;
  // Shockley Diode Equation
  const I = I0 * (Math.exp(V / (n * VT)) - 1);
  const Iclamped = Math.max(-I0 * 1.1, Math.min(2, I));
  const ImA = Iclamped * 1000; // convert to mA

  const bias = V >= 0 ? 'Forward Bias' : 'Reverse Bias';

  return {
    message: `✅ ${bias}: V=${V.toFixed(2)}V → I=${ImA.toFixed(3)}mA`,
    readings: { voltage: V, current: Iclamped },
    graphPoint: { 'V (Volts)': parseFloat(V.toFixed(2)), 'I (mA)': parseFloat(ImA.toFixed(4)) },
  };
}
