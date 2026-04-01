// Physics engine for Resistor Colour Coding
export const defaults = { resistance: 4700 };

export const sliders = [
  { key: 'resistance', label: 'True Resistance', unit: 'Ω', min: 10, max: 1000000, step: 10, default: 4700, decimals: 0 },
];

function getBands(R) {
  const colors = ['Black','Brown','Red','Orange','Yellow','Green','Blue','Violet','Grey','White'];
  const rStr = R.toString();
  // Simplified logic for 4-band
  let first = parseInt(rStr[0]);
  let second = parseInt(rStr[1] || '0');
  let mult = rStr.length - (rStr[1] ? 2 : 1);
  return `${colors[first]} - ${colors[second]} - ${colors[mult]} - Gold (5%)`;
}

export function run({ items, wires, sliders: s }) {
  const hasResistor = items.some(i => i.type === 'resistor');
  const hasMultimeter = items.some(i => i.type === 'multimeter');

  if (!hasResistor) return { error: 'Please place a Resistor on the board.' };
  if (!hasMultimeter) return { error: 'Please place a Multimeter to measure the resistance.' };
  if (wires.length < 2) return { error: 'Connect the Multimeter leads to both ends of the Resistor.' };

  const R = s.resistance;
  const tolerance = (Math.random() * 0.04) - 0.02; // Random error within 5%
  const measured = R * (1 + tolerance);

  return {
    message: `✅ Measured: ${measured.toFixed(1)}Ω. Expected Bands: ${getBands(R)}`,
    readings: { resistance: measured },
    graphPoint: { 'True R (Ω)': parseFloat(R.toFixed(1)), 'Measured R (Ω)': parseFloat(measured.toFixed(1)) },
  };
}
