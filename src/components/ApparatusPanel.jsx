import { useState, useRef, useCallback } from 'react';

// Maps apparatus type to its visual config
const APPARATUS_VISUALS = {
  battery: { label: 'Battery', emoji: '🔋', color: '#ffe600', terminalLabels: ['+', '−'], w: 80, h: 50 },
  ammeter: { label: 'Ammeter', emoji: '🔵', color: '#00c8ff', terminalLabels: ['A', 'B'], w: 70, h: 50 },
  voltmeter: { label: 'Voltmeter', emoji: '🟣', color: '#7b2ff7', terminalLabels: ['A', 'B'], w: 70, h: 50 },
  resistor: { label: 'Resistor', emoji: '⬛', color: '#ff7b00', terminalLabels: ['A', 'B'], w: 80, h: 40 },
  rheostat: { label: 'Rheostat', emoji: '🎚', color: '#ff7b00', terminalLabels: ['A', 'B', 'C'], w: 90, h: 50 },
  switch: { label: 'Switch', emoji: '🔘', color: '#00ff88', terminalLabels: ['A', 'B'], w: 60, h: 40 },
  galvanometer: { label: 'Galvanometer', emoji: '🟡', color: '#ffe600', terminalLabels: ['A', 'B'], w: 70, h: 50 },
  capacitor: { label: 'Capacitor', emoji: '⚡', color: '#ff3366', terminalLabels: ['+', '−'], w: 60, h: 50 },
  diode: { label: 'Diode', emoji: '🔴', color: '#ff3366', terminalLabels: ['A(+)', 'K(−)'], w: 80, h: 40 },
  zener: { label: 'Zener Diode', emoji: '🔵', color: '#a855f7', terminalLabels: ['A', 'K'], w: 80, h: 40 },
  led: { label: 'LED', emoji: '💡', color: '#00ffea', terminalLabels: ['+', '−'], w: 50, h: 50 },
  ic_gate: { label: 'IC Gate', emoji: '🔀', color: '#00ffea', terminalLabels: ['A', 'B', 'Y'], w: 80, h: 60 },
  wire: { label: 'Wire', emoji: '〰', color: '#8faac8', terminalLabels: ['A', 'B'], w: 70, h: 30 },
  jockey: { label: 'Jockey', emoji: '🖊', color: '#8faac8', terminalLabels: ['T'], w: 40, h: 60 },
  potentiometer_wire: { label: 'Pot. Wire (1m)', emoji: '📏', color: '#ffe600', terminalLabels: ['A', 'B'], w: 160, h: 30 },
  cell: { label: 'Cell', emoji: '🔋', color: '#00ff88', terminalLabels: ['+', '−'], w: 60, h: 40 },
  ac_supply: { label: 'AC Supply', emoji: '🔌', color: '#ff3366', terminalLabels: ['~', '~'], w: 80, h: 50 },
  inductor: { label: 'Inductor', emoji: '🌀', color: '#00ffea', terminalLabels: ['A', 'B'], w: 80, h: 40 },
  multimeter: { label: 'Multimeter', emoji: '🎛', color: '#ffe600', terminalLabels: ['V/Ω', 'COM', 'A'], w: 80, h: 60 },
};

export function getVisual(type) {
  return APPARATUS_VISUALS[type] || { label: type, emoji: '🔲', color: '#8faac8', terminalLabels: ['A', 'B'], w: 70, h: 50 };
}

// Sidebar panel — all draggable items for the experiment
export default function ApparatusPanel({ experiment, highlight }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('apparatus-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Map experiment apparatus labels to our type keys
  const apparatusTypeMap = {
    'Battery': 'battery',
    'Ammeter': 'ammeter',
    'Voltmeter': 'voltmeter',
    'Resistor': 'resistor',
    'Rheostat': 'rheostat',
    'Switch': 'switch',
    'Galvanometer': 'galvanometer',
    'Capacitor': 'capacitor',
    'Diode': 'diode',
    'PN Junction Diode': 'diode',
    'Zener Diode': 'zener',
    'LED': 'led',
    'LED Indicators': 'led',
    'IC Gates': 'ic_gate',
    'Connecting Wires': 'wire',
    'Jockey': 'jockey',
    'Potentiometer Wire': 'potentiometer_wire',
    'Primary Cell': 'cell',
    'Secondary Cell': 'cell',
    'DC Supply': 'battery',
    'Known Resistance': 'resistor',
    'Unknown Wire': 'wire',
    'Unknown Resistor': 'resistor',
    'Standard Cell': 'cell',
    'Known Resistors (×3)': 'resistor',
    'Series Resistor': 'resistor',
    'Resistors': 'resistor',
    'Logic Probes': 'wire',
    '5V Supply': 'battery',
    'Breadboard': 'wire',
    'Voltmeter (×2)': 'voltmeter',
    'AC Supply': 'ac_supply',
    'Inductor': 'inductor',
    'Multimeter': 'multimeter',
  };

  const types = [...new Set(experiment.apparatus.map(a => apparatusTypeMap[a] || 'resistor'))];

  return (
    <div style={{
      width: collapsed ? 48 : 200,
      minWidth: collapsed ? 48 : 200,
      background: 'rgba(8,15,30,0.98)',
      borderRight: '1px solid rgba(0,200,255,0.08)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s ease, min-width 0.3s ease',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px', borderBottom: '1px solid rgba(0,200,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        {!collapsed && <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Apparatus</span>}
        <button
          onClick={() => setCollapsed(v => !v)}
          style={{ background: 'none', color: 'var(--text-muted)', padding: 4, borderRadius: 4, fontSize: '1rem' }}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Items */}
      {!collapsed && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 10px' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10, paddingLeft: 2 }}>
            Drag items to the board
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {types.map(type => {
              const v = getVisual(type);
              return (
                <div
                  key={type}
                  draggable
                  onDragStart={e => handleDragStart(e, type)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 10, cursor: 'grab',
                    background: highlight === type
                      ? `${v.color}20`
                      : 'rgba(13,24,41,0.6)',
                    border: `1px solid ${highlight === type ? v.color + '50' : 'rgba(0,200,255,0.08)'}`,
                    transition: 'all 0.2s ease',
                    boxShadow: highlight === type ? `0 0 12px ${v.color}30` : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${v.color}40`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = highlight === type ? `${v.color}50` : 'rgba(0,200,255,0.08)'}
                >
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{v.emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{v.label}</div>
                    <div style={{ fontSize: '0.65rem', color: v.color, fontFamily: 'var(--font-mono)' }}>
                      {v.terminalLabels.join(' · ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
