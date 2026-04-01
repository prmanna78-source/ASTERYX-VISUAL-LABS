import { useState, useRef, useCallback, useEffect } from 'react';
import { getVisual } from './ApparatusPanel';
import { X } from 'lucide-react';

// Draw component on SVG
function ApparatusComponent({ item, running, selected, onMouseDown, onTerminalClick, onRemove }) {
  const v = getVisual(item.type);
  const { x, y, id, type } = item;
  const w = v.w, h = v.h;

  // Terminal positions (relative to item top-left)
  const terminals = v.terminalLabels.map((label, i) => {
    const count = v.terminalLabels.length;
    if (count === 1) return { label, tx: w / 2, ty: h };
    if (count === 2) return { label, tx: i === 0 ? 0 : w, ty: h / 2 };
    // 3 terminals: left, bottom, right
    const positions = [
      { tx: 0, ty: h / 2 },
      { tx: w / 2, ty: h },
      { tx: w, ty: h / 2 },
    ];
    return { label, ...positions[i] };
  });

  // Build a readable SVG symbol for the component
  const getSymbol = () => {
    switch (type) {
      case 'battery':
        return (
          <g>
            <rect width={w} height={h} rx={6} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            {/* Battery cells */}
            <line x1={w * 0.35} y1={8} x2={w * 0.35} y2={h - 8} stroke={v.color} strokeWidth={3} />
            <line x1={w * 0.5} y1={12} x2={w * 0.5} y2={h - 12} stroke={v.color} strokeWidth={1.5} />
            <line x1={w * 0.65} y1={8} x2={w * 0.65} y2={h - 8} stroke={v.color} strokeWidth={3} />
            <text x={8} y={h - 6} fill={v.color} fontSize={9} fontWeight="bold">+</text>
            <text x={w - 14} y={h - 6} fill={v.color} fontSize={9} fontWeight="bold">−</text>
            <text x={w / 2} y={h / 2 + 3} fill="var(--text-secondary)" fontSize={8} textAnchor="middle">CELL</text>
          </g>
        );
      case 'ammeter':
        return (
          <g>
            <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - 2} fill={`${v.color}15`} stroke={v.color} strokeWidth={1.5} />
            <text x={w / 2} y={h / 2 + 5} fill={v.color} fontSize={14} fontWeight="bold" textAnchor="middle">A</text>
          </g>
        );
      case 'voltmeter':
        return (
          <g>
            <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - 2} fill={`${v.color}15`} stroke={v.color} strokeWidth={1.5} />
            <text x={w / 2} y={h / 2 + 5} fill={v.color} fontSize={14} fontWeight="bold" textAnchor="middle">V</text>
          </g>
        );
      case 'galvanometer':
        return (
          <g>
            <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - 2} fill={`${v.color}15`} stroke={v.color} strokeWidth={1.5} />
            <text x={w / 2} y={h / 2 + 5} fill={v.color} fontSize={14} fontWeight="bold" textAnchor="middle">G</text>
          </g>
        );
      case 'resistor':
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <path d={`M ${w * 0.15} ${h / 2} l 6 -8 l 7 16 l 7 -16 l 7 16 l 6 -8`} fill="none" stroke={v.color} strokeWidth={1.5} strokeLinecap="round" />
            <text x={w / 2} y={h - 6} fill="var(--text-muted)" fontSize={7} textAnchor="middle">Ω</text>
          </g>
        );
      case 'rheostat':
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <path d={`M ${w * 0.1} ${h / 2} l 5 -8 l 7 16 l 7 -16 l 7 16 l 5 -8`} fill="none" stroke={v.color} strokeWidth={1.5} />
            <path d={`M ${w * 0.55} ${h * 0.2} l 0 ${h * 0.4} l -6 -6`} fill="none" stroke={v.color} strokeWidth={1.2} markerEnd="url(#arrow)" />
            <text x={w - 6} y={h - 6} fill="var(--text-muted)" fontSize={7} textAnchor="end">RH</text>
          </g>
        );
      case 'switch':
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <circle cx={10} cy={h / 2} r={4} fill={v.color} />
            <circle cx={w - 10} cy={h / 2} r={4} fill={v.color} />
            <line x1={10} y1={h / 2} x2={w - 14} y2={h / 2 - 10} stroke={v.color} strokeWidth={2} />
            <text x={w / 2} y={h - 4} fill="var(--text-muted)" fontSize={7} textAnchor="middle">SW</text>
          </g>
        );
      case 'capacitor':
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <line x1={w / 2 - 8} y1={8} x2={w / 2 - 8} y2={h - 8} stroke={v.color} strokeWidth={3} />
            <line x1={w / 2 + 8} y1={8} x2={w / 2 + 8} y2={h - 8} stroke={v.color} strokeWidth={3} />
            <text x={6} y={h - 4} fill={v.color} fontSize={8} fontWeight="bold">+</text>
          </g>
        );
      case 'diode':
      case 'zener':
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <polygon points={`${w * 0.3},${h * 0.2} ${w * 0.3},${h * 0.8} ${w * 0.65},${h * 0.5}`} fill={v.color} opacity={0.7} />
            <line x1={w * 0.65} y1={h * 0.2} x2={w * 0.65} y2={h * 0.8} stroke={v.color} strokeWidth={2.5} />
            {type === 'zener' && (
              <>
                <line x1={w * 0.65} y1={h * 0.2} x2={w * 0.65 + 5} y2={h * 0.2 - 5} stroke={v.color} strokeWidth={2} />
                <line x1={w * 0.65} y1={h * 0.8} x2={w * 0.65 - 5} y2={h * 0.8 + 5} stroke={v.color} strokeWidth={2} />
              </>
            )}
          </g>
        );
      case 'led':
        return (
          <g>
            <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - 2}
              fill={running ? `${v.color}80` : `${v.color}15`}
              stroke={v.color} strokeWidth={1.5}
            />
            {running && <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 + 4} fill="none" stroke={v.color} strokeWidth={1} opacity={0.4} />}
            <text x={w / 2} y={h / 2 + 4} fill={v.color} fontSize={10} textAnchor="middle">💡</text>
          </g>
        );
      case 'ic_gate':
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <text x={w / 2} y={h / 2 + 4} fill={v.color} fontSize={9} fontWeight="bold" textAnchor="middle">IC</text>
          </g>
        );
      case 'potentiometer_wire':
        return (
          <g>
            <rect width={w} height={h} rx={3} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <line x1={10} y1={h / 2} x2={w - 10} y2={h / 2} stroke={v.color} strokeWidth={2} />
            {Array.from({ length: 9 }, (_, i) => (
              <line key={i} x1={10 + (i + 1) * (w - 20) / 10} y1={h / 2 - 5} x2={10 + (i + 1) * (w - 20) / 10} y2={h / 2 + 5} stroke={v.color} strokeWidth={1} opacity={0.5} />
            ))}
            <text x={w / 2} y={h - 3} fill="var(--text-muted)" fontSize={6} textAnchor="middle">1000mm Wire</text>
          </g>
        );
      default:
        return (
          <g>
            <rect width={w} height={h} rx={4} fill={`${v.color}18`} stroke={v.color} strokeWidth={1.5} />
            <text x={w / 2} y={h / 2 + 4} fill={v.color} fontSize={9} textAnchor="middle">{v.label.slice(0, 6)}</text>
          </g>
        );
    }
  };

  return (
    <g transform={`translate(${x},${y})`} style={{ cursor: 'move' }}>
      {/* Shadow */}
      {selected && <rect x={-3} y={-3} width={w + 6} height={h + 6} rx={8} fill="none" stroke={v.color} strokeWidth={1.5} strokeDasharray="4 2" opacity={0.6} />}

      {/* Body */}
      <g onMouseDown={onMouseDown}>
        {getSymbol()}
      </g>

      {/* Current flow animation */}
      {running && (
        <rect width={w} height={h} rx={4} fill="none" stroke={v.color} strokeWidth={1} opacity={0.4}
          style={{ animation: 'pulse-ring 1.5s ease infinite' }} />
      )}

      {/* Terminals */}
      {terminals.map(({ label, tx, ty }) => (
        <g key={label} onClick={(e) => { e.stopPropagation(); onTerminalClick(id, label, x + tx, y + ty); }} style={{ cursor: 'crosshair' }}>
          <circle cx={tx} cy={ty} r={7} fill={v.color} opacity={0.15} />
          <circle cx={tx} cy={ty} r={4} fill="var(--bg-dark)" stroke={v.color} strokeWidth={1.5} />
          <text x={tx} y={ty - 8} fill={v.color} fontSize={7} textAnchor="middle" fontWeight="bold">{label}</text>
        </g>
      ))}

      {/* Remove button */}
      <g onClick={(e) => { e.stopPropagation(); onRemove(id); }} style={{ cursor: 'pointer' }}>
        <circle cx={w} cy={0} r={8} fill="rgba(255,51,102,0.15)" stroke="rgba(255,51,102,0.4)" strokeWidth={1} />
        <text x={w} y={4} fill="#ff3366" fontSize={9} textAnchor="middle">×</text>
      </g>
    </g>
  );
}

function WirePath({ wire, running }) {
  const dx = wire.toX - wire.fromX;
  const d = `M ${wire.fromX} ${wire.fromY} C ${wire.fromX + dx * 0.5} ${wire.fromY}, ${wire.toX - dx * 0.5} ${wire.toY}, ${wire.toX} ${wire.toY}`;

  return (
    <g>
      {/* Base wire */}
      <path d={d} fill="none" stroke="rgba(0,200,255,0.25)" strokeWidth={2.5} strokeLinecap="round" />
      {/* Animated current flow */}
      {running && (
        <path d={d} fill="none" stroke="#00c8ff" strokeWidth={2} strokeLinecap="round"
          strokeDasharray="10 15"
          style={{ animation: 'current-flow 1.2s linear infinite' }}
        />
      )}
    </g>
  );
}

export default function CircuitBoard({ items, wires, wireStart, running, onMoveItem, onRemoveItem, onTerminalClick, boardRef }) {
  const [dragging, setDragging] = useState(null); // { id, offsetX, offsetY }
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);

  const handleItemMouseDown = useCallback((e, id) => {
    if (e.button !== 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    setDragging({ id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
    setSelected(id);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const item = items.find(it => it.id === dragging.id);
    if (!item) return;
    const v = getVisual(item.type);
    const nx = Math.max(0, Math.min(rect.width - v.w, mx - (dragging.offsetX - item.x)));
    const ny = Math.max(0, Math.min(rect.height - v.h, my - (dragging.offsetY - item.y)));
    onMoveItem(dragging.id, nx, ny);
  }, [dragging, items, onMoveItem]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  return (
    <svg
      ref={svgRef}
      width="100%" height="100%"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => setSelected(null)}
      style={{
        background: `
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,200,255,0.03) 0%, transparent 70%),
          var(--bg-dark)
        `,
        backgroundImage: `
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,200,255,0.03) 0%, transparent 70%),
          linear-gradient(rgba(0,200,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,200,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      }}
    >
      <defs>
        <style>{`
          @keyframes current-flow { 0% { stroke-dashoffset: 25; } 100% { stroke-dashoffset: 0; } }
          @keyframes pulse-ring { 0%,100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.02); } }
        `}</style>
      </defs>

      {/* Wires */}
      {wires.map(wire => <WirePath key={wire.id} wire={wire} running={running} />)}

      {/* Preview wire from wireStart to cursor */}
      {wireStart && <PreviewWire wireStart={wireStart} svgRef={svgRef} />}

      {/* Components */}
      {items.map(item => (
        <ApparatusComponent
          key={item.id}
          item={item}
          running={running}
          selected={selected === item.id}
          onMouseDown={(e) => handleItemMouseDown(e, item.id)}
          onTerminalClick={onTerminalClick}
          onRemove={onRemoveItem}
        />
      ))}
    </svg>
  );
}

function PreviewWire({ wireStart, svgRef }) {
  const [pos, setPos] = useState({ x: wireStart.x, y: wireStart.y });
  useEffect(() => {
    const handler = (e) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [svgRef]);

  const dx = pos.x - wireStart.x;
  const d = `M ${wireStart.x} ${wireStart.y} C ${wireStart.x + dx * 0.5} ${wireStart.y}, ${pos.x - dx * 0.5} ${pos.y}, ${pos.x} ${pos.y}`;
  return (
    <path d={d} fill="none" stroke="rgba(0,200,255,0.5)" strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round" />
  );
}
