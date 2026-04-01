import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Info, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import ApparatusPanel from './ApparatusPanel';
import CircuitBoard3D from './CircuitBoard3D';
import MeterPanel from './MeterPanel';
import InstructionPanel from './InstructionPanel';

export default function LabCanvas({ experiment, physics }) {
  const [placedItems, setPlacedItems] = useState([]);
  const [wires, setWires] = useState([]);
  const [wireStart, setWireStart] = useState(null); // { itemId, terminal, x, y }
  const [running, setRunning] = useState(false);
  const [readings, setReadings] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | ok | error
  const [statusMsg, setStatusMsg] = useState('');
  const [sliderValues, setSliderValues] = useState(physics?.defaults || {});
  const [showInstructions, setShowInstructions] = useState(true);
  const [highlightApparatus, setHighlightApparatus] = useState(null);
  const [errorPopup, setErrorPopup] = useState(null);
  const nextId = useRef(1);

  // Called by CircuitBoard3D when user drops from apparatus panel
  const handleAddItem = useCallback((type, worldX, worldZ) => {
    const id = `item-${nextId.current++}`;
    setPlacedItems(prev => [...prev, { id, type, x: worldX, y: worldZ }]);
  }, []);

  // Move a placed item
  const handleMoveItem = useCallback((id, x, y) => {
    setPlacedItems(prev => prev.map(it => it.id === id ? { ...it, x, y } : it));
    // Update wire positions
    setWires(prev => prev.map(w => {
      if (w.fromItem === id || w.toItem === id) return { ...w, needsUpdate: true };
      return w;
    }));
  }, []);

  // Remove item
  const handleRemoveItem = useCallback((id) => {
    setPlacedItems(prev => prev.filter(it => it.id !== id));
    setWires(prev => prev.filter(w => w.fromItem !== id && w.toItem !== id));
  }, []);

  // Terminal clicked → start or complete a wire
  const handleTerminalClick = useCallback((itemId, terminal, x, y) => {
    if (!wireStart) {
      setWireStart({ itemId, terminal, x, y });
    } else {
      if (wireStart.itemId === itemId && wireStart.terminal === terminal) {
        setWireStart(null);
        return;
      }
      const wire = {
        id: `wire-${nextId.current++}`,
        fromItem: wireStart.itemId, fromTerminal: wireStart.terminal,
        fromX: wireStart.x, fromY: wireStart.y,
        toItem: itemId, toTerminal: terminal,
        toX: x, toY: y,
      };
      setWires(prev => [...prev, wire]);
      setWireStart(null);
    }
  }, [wireStart]);

  // Run experiment
  const handleRun = useCallback(() => {
    if (!physics) return;
    const result = physics.run({ items: placedItems, wires, sliders: sliderValues });
    if (result.error) {
      setStatus('error');
      setStatusMsg(result.error);
      setErrorPopup(result.error);
      setRunning(false);
      setReadings({});
      return;
    }
    setStatus('ok');
    setStatusMsg(result.message || 'Circuit running');
    setRunning(true);
    setReadings(result.readings || {});
    setGraphData(prev => {
      const newPt = result.graphPoint;
      if (!newPt) return prev;
      return [...prev.slice(-49), newPt];
    });
  }, [physics, placedItems, wires, sliderValues]);

  // Reset
  const handleReset = useCallback(() => {
    setRunning(false);
    setReadings({});
    setStatus('idle');
    setStatusMsg('');
    setWires([]);
    setPlacedItems([]);
    setWireStart(null);
    setSliderValues(physics?.defaults || {});
    setGraphData([]);
  }, [physics]);

  // Live update readings when sliders change while running
  useEffect(() => {
    if (running && physics) {
      const result = physics.run({ items: placedItems, wires, sliders: sliderValues });
      if (!result.error) {
        setReadings(result.readings || {});
        if (result.graphPoint) {
          setGraphData(prev => [...prev.slice(-49), result.graphPoint]);
        }
      }
    }
  }, [sliderValues, running]);

  // Export readings
  const handleExport = useCallback(() => {
    if (!graphData.length) return;
    const headers = Object.keys(graphData[0]).join(',');
    const rows = graphData.map(r => Object.values(r).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${experiment.id}_readings.csv`;
    a.click();
  }, [graphData, experiment.id]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: 'var(--bg-void)', overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(8,15,30,0.98)',
        borderBottom: '1px solid rgba(0,200,255,0.1)',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        zIndex: 100,
      }}>
        {/* Experiment name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto', minWidth: 0 }}>
          <span style={{ fontSize: '1.4rem' }}>{experiment.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {experiment.title}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{experiment.subtitle}</div>
          </div>
        </div>

        {/* Sliders */}
        {physics?.sliders?.map(slider => (
          <div key={slider.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {slider.label}:
              <span style={{ color: 'var(--electric-blue)', fontWeight: 700, marginLeft: 4 }}>
                {Number(sliderValues[slider.key] ?? slider.default).toFixed(slider.decimals ?? 1)} {slider.unit}
              </span>
            </label>
            <input
              type="range"
              min={slider.min} max={slider.max} step={slider.step}
              value={sliderValues[slider.key] ?? slider.default}
              onChange={e => setSliderValues(prev => ({ ...prev, [slider.key]: parseFloat(e.target.value) }))}
              style={{ width: 100, accentColor: 'var(--electric-blue)' }}
            />
          </div>
        ))}

        {/* Buttons */}
        <button onClick={handleRun} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px',
          background: running ? 'rgba(0,255,136,0.15)' : 'linear-gradient(135deg,#00c8ff,#7b2ff7)',
          color: running ? '#00ff88' : '#fff', border: running ? '1px solid #00ff88' : 'none',
          borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          fontFamily: 'var(--font-main)',
        }}>
          <Play size={15} fill={running ? '#00ff88' : '#fff'} />
          {running ? 'Running' : 'Run'}
        </button>
        <button onClick={handleReset} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: 'rgba(255,51,102,0.1)', color: '#ff3366', border: '1px solid rgba(255,51,102,0.3)',
          borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          fontFamily: 'var(--font-main)',
        }}>
          <RotateCcw size={14} />
          Reset
        </button>
        <button onClick={handleExport} title="Export CSV" style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: 'rgba(0,200,255,0.08)', color: 'var(--electric-blue)',
          border: '1px solid rgba(0,200,255,0.2)', borderRadius: 8, fontWeight: 600,
          fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'var(--font-main)',
        }}>
          <Download size={14} />
          Export
        </button>
        <button onClick={() => setShowInstructions(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
          background: showInstructions ? 'rgba(123,47,247,0.15)' : 'rgba(0,200,255,0.06)',
          color: showInstructions ? '#a855f7' : 'var(--text-muted)',
          border: `1px solid ${showInstructions ? 'rgba(123,47,247,0.3)' : 'rgba(0,200,255,0.1)'}`,
          borderRadius: 8, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
          fontFamily: 'var(--font-main)',
        }}>
          <Info size={14} />
        </button>
      </div>

      {/* Status Bar */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: status === 'ok' ? 'rgba(0,255,136,0.08)' : 'rgba(255,51,102,0.08)',
              borderBottom: `1px solid ${status === 'ok' ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,102,0.2)'}`,
              padding: '8px 20px', display: 'flex', alignItems: 'center', gap: 8,
              fontSize: '0.85rem', color: status === 'ok' ? '#00ff88' : '#ff3366',
            }}
          >
            {status === 'ok' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Apparatus Panel */}
        <ApparatusPanel
          experiment={experiment}
          highlight={highlightApparatus}
        />

        {/* Center: 3D Circuit Board */}
        <CircuitBoard3D
          items={placedItems}
          wires={wires}
          wireStart={wireStart}
          running={running}
          onAddItem={handleAddItem}
          onMoveItem={handleMoveItem}
          onRemoveItem={handleRemoveItem}
          onTerminalClick={handleTerminalClick}
        />

        {/* Right: Meters + Instructions */}
        <div style={{ width: 300, display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(0,200,255,0.08)', overflow: 'hidden' }}>
          <MeterPanel readings={readings} running={running} graphData={graphData} experiment={experiment} />
          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                style={{ overflow: 'hidden', borderTop: '1px solid rgba(0,200,255,0.08)', flexShrink: 0 }}
              >
                <InstructionPanel
                  experiment={experiment}
                  onHighlight={setHighlightApparatus}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Escape to cancel wire */}
      <EscapeListener onEscape={() => setWireStart(null)} />

      {/* Error Popup Modal */}
      <AnimatePresence>
        {errorPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', inset: 0, zIndex: 1000, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              background: 'rgba(2, 4, 8, 0.85)', backdropFilter: 'blur(6px)'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              style={{
                background: 'rgba(15, 25, 45, 0.95)', padding: 32, borderRadius: 16, 
                border: '1px solid #ff3366', maxWidth: 420, textAlign: 'center', 
                boxShadow: '0 20px 50px rgba(255, 51, 102, 0.25)'
              }}
            >
              <div style={{
                background: 'rgba(255,51,102,0.15)', width: 72, height: 72, 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 24px', color: '#ff3366'
              }}>
                <X size={36} strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize: '1.6rem', color: '#ff3366', marginBottom: 16, fontWeight: 700, fontFamily: 'var(--font-main)' }}>
                Wrong Connection
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1.05rem', lineHeight: 1.5, fontFamily: 'var(--font-main)' }}>
                {errorPopup}
              </p>
              <button 
                onClick={() => setErrorPopup(null)}
                style={{
                  background: 'linear-gradient(135deg, #ff3366, #ff0044)', color: '#fff', 
                  border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: '1rem', 
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-main)',
                  boxShadow: '0 4px 15px rgba(255, 51, 102, 0.4)'
                }}
              >
                Check Circuit & Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EscapeListener({ onEscape }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onEscape(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape]);
  return null;
}
