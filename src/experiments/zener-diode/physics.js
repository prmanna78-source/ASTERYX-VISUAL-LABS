// Zener Diode Voltage Regulator Physics
export const defaults = { inputV: 10, seriesR: 470 };

export const sliders = [
  { key: 'inputV', label: 'Input Voltage', unit: 'V', min: 0, max: 20, step: 0.5, default: 10, decimals: 1 },
  { key: 'seriesR', label: 'Series Resistor', unit: 'Ω', min: 100, max: 2000, step: 50, default: 470, decimals: 0 },
];

const VZ = 5.1; // Zener breakdown voltage

export function run({ items, wires, sliders: s }) {
  const hasBattery = items.some(i => i.type === 'battery');
  const hasZener = items.some(i => i.type === 'zener');

  if (!hasBattery) return { error: '⚠️ Add a DC Supply.' };
  if (!hasZener) return { error: '⚠️ Add a Zener Diode.' };
  if (wires.length < 2) return { error: '⚠️ Connect the circuit.' };

  const { inputV: Vin, seriesR: Rs } = s;
  let Vout, Iz, msg;

  if (Vin <= VZ) {
    Vout = Vin;
    Iz = 0;
    msg = `⚠️ Vin (${Vin}V) < Vz (${VZ}V). No regulation.`;
  } else {
    Vout = VZ;
    Iz = (Vin - VZ) / Rs;
    msg = `✅ Regulated Vout = ${VZ}V | Iz = ${(Iz * 1000).toFixed(2)}mA`;
  }

  return {
    message: msg,
    readings: { voltage: parseFloat(Vout.toFixed(2)), current: parseFloat(Iz.toFixed(5)) },
    graphPoint: { 'Vin (V)': parseFloat(Vin.toFixed(1)), 'Vout (V)': parseFloat(Vout.toFixed(2)) },
  };
}
